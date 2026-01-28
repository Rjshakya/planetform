import { env } from "cloudflare:workers";
import { Result } from "better-result";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb } from "../db/config.js";
import type { user } from "../db/schema/auth.js";
import { form as formTable } from "../db/schema/form.js";
import { formField as formFieldTable } from "../db/schema/form.fields.js";
import { formSetting as formSettingTable } from "../db/schema/form.settings.js";
import { integration as integrationTable } from "../db/schema/integration.js";
import { workspace as workspaceTable } from "../db/schema/workspace.js";
import { DatabaseError, ParseError, UnhandledException } from "../errors.js";
import { getRedis } from "../utils/redis.js";
import { getSubmissionService } from "./form.analytics.js";
import z from "zod";

export const createFormService = async ({
  formValues,
  formCustomisation,
}: {
  formValues: typeof formTable.$inferInsert;
  formCustomisation: typeof formSettingTable.$inferInsert.customisation;
}): Promise<Result<typeof formTable.$inferSelect, DatabaseError>> => {
  return Result.tryPromise({
    try: async () => {
      const db = await getDb();

      const form = await db.transaction(async (tx) => {
        const [createdForm] = await tx
          .insert(formTable)
          .values({ ...formValues, shortId: nanoid(13) })
          .returning();

        await tx.insert(formSettingTable).values({
          formId: createdForm.shortId!,
          customerId: createdForm?.creator,
          customisation: formCustomisation,
        });

        return createdForm;
      });

      return form;
    },
    catch: (e) => new DatabaseError({ operation: "createForm", cause: e }),
  });
};

export const getWorkspaceFormService = async (
  workspace: typeof formTable.$inferInsert.workspace,
) => {
  return Result.tryPromise({
    try: async () => {
      const db = await getDb();
      const workspaces = await db.query.workspace.findMany({
        where: eq(workspaceTable?.id, workspace),
        columns: {
          id: true,
          name: true,
          createdAt: true,
          owner: true,
        },
        with: {
          forms: {
            columns: {
              shortId: true,
              name: true,
            },
          },
        },
      });

      return workspaces[0];
    },
    catch: (e) =>
      new DatabaseError({ operation: "getWorkspaceForms", cause: e }),
  });
};

export const getUserFormsService = async (
  userId: typeof user.$inferInsert.id,
) => {
  return Result.tryPromise({
    try: async () => {
      const redis = getRedis();
      const key = `getUserForms-${userId}`;
      const cached = await redis.get<any>(key);

      if (cached) {
        return cached;
      }
      const db = await getDb();
      const forms = await db
        .select({
          id: formTable.id,
          name: formTable.name,
        })
        .from(formTable)
        .where(eq(formTable.creator, userId!));

      await redis.set(key, forms, { ex: 60 });

      return forms;
    },
    catch: (e) => new DatabaseError({ operation: "getUserForms", cause: e }),
  });
};

export const deleteFormService = async (
  formId: typeof formTable.$inferInsert.shortId,
) => {
  return Result.tryPromise({
    try: async () => {
      const db = await getDb();
      const form = await db
        .delete(formTable)
        .where(eq(formTable?.shortId, formId!))
        .returning({
          id: formTable?.id,
        });

      return form[0];
    },
    catch: (e) => new DatabaseError({ operation: "deleteForm", cause: e }),
  });
};

export const updateFormIdService = async (formUpdateValues: {
  formId: typeof formTable.$inferInsert.shortId;
  formName: typeof formTable.$inferInsert.name;
  form_schema: typeof formTable.$inferInsert.form_schema;
}) => {
  return Result.tryPromise({
    try: async () => {
      const db = await getDb();
      const updateForm = await db
        .update(formTable)
        .set({
          name: formUpdateValues?.formName,
          form_schema: formUpdateValues.form_schema,
          updatedAt: new Date(),
        })
        .where(eq(formTable.shortId, formUpdateValues.formId!))
        .returning({ formId: formTable.shortId });

      return updateForm[0];
    },
    catch: (e) => new DatabaseError({ operation: "updateFormId", cause: e }),
  });
};

export const getFormWithFormFieldsService = async (
  formId: typeof formTable.$inferInsert.id,
) => {
  return Result.tryPromise({
    try: async () => {
      const redis = getRedis();
      const key = ` getFormWithFormFields-${formId}`;
      const cached = await redis.get<any>(key);

      if (cached) {
        return cached;
      }

      const db = await getDb();
      const rows = await db
        .select()
        .from(formTable)
        .where(eq(formTable.shortId, formId!))
        .leftJoin(formFieldTable, eq(formTable.shortId, formFieldTable.form))
        .orderBy(asc(formFieldTable.order));

      await redis.set(key, rows, { ex: 60 });

      return rows;
    },
    catch: (e) =>
      new DatabaseError({ operation: "getFormWithFormFields", cause: e }),
  });
};

interface IFormCustomization {
  formBackgroundColor: string | null;
  formFontFamily: string | null;
  formFontSize: string | null;
  actionBtnSize: string | null;
  actionBtnColor: string | null;
  formTextColor: string | null;
  actionBtnTextColor: string | null;
  inputBackgroundColor: string | null;
  inputBorderColor: string | null;
  actionBtnBorderColor: string | null;
  formColorScheme: string | null;
  customThankyouMessage: string | null;
}

interface IgetFormService {
  id: string | null;
  name: string;
  form_schema: any;
  creator: string;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
  customisation: IFormCustomization;
  closed: boolean | null;
  closedMessage: string | null;
}

export const formCustomizationSchema = z.object({
  actionBtnBorderColor: z.string().nullable(),
  actionBtnColor: z.string().nullable(),
  actionBtnSize: z.string().nullable(),
  actionBtnTextColor: z.string().nullable(),
  customThankyouMessage: z.string().nullable(),
  formBackgroundColor: z.string().nullable(),
  formColorScheme: z.string().nullable(),
  formFontFamily: z.string().nullable(),
  formFontSize: z.string().nullable(),
  formTextColor: z.string().nullable(),
  inputBackgroundColor: z.string().nullable(),
  inputBorderColor: z.string().nullable(),
});

export const getFormService = async (
  formId: typeof formTable.$inferInsert.shortId,
) => {
  return Result.tryPromise({
    try: async () => {
      const kv = env.planetform_kv;
      const key = `getForm-${formId}`;
      const cached = await kv.get(key);

      if (cached) {
        return Result.try({
          try: () => JSON.parse(cached) as IgetFormService,
          catch: (e) => new ParseError({ data: cached, cause: e }),
        }).unwrap();
      }

      const db = await getDb();
      const [form] = await db
        .select({
          id: formTable.shortId,
          name: formTable.name,
          form_schema: formTable.form_schema,
          creator: formTable.creator,
          createdAt: formTable.createdAt,
          updatedAt: formTable.updatedAt,
          customerId: formTable.creator,
        })
        .from(formTable)
        .where(eq(formTable.shortId, formId!));

      const [settings] = await db
        .select({
          customisation: formSettingTable.customisation,
          isClosed: formSettingTable.closed,
          closedAfterSubmission: formSettingTable.closeAfterSubmissions,
          closingTime: formSettingTable.closingTime,
          closedMessage: formSettingTable.closedMessage,
        })
        .from(formSettingTable)
        .where(eq(formSettingTable.formId, formId!));

      const {
        isClosed,
        closingTime,
        customisation,
        closedAfterSubmission,
        closedMessage,
      } = settings;

      const success = await formClosingService({
        closedAfterSubmission,
        closingTime,
        isClosed,
        formId: formId!,
      });

      // giving the parsed schema , rather just a string
      // to frontend , so that it can directly load form.
      const parsedSchema = form?.form_schema
        ? Result.try({
            try: () => JSON.parse(form.form_schema),
            catch: (e) => new ParseError({ data: form.form_schema, cause: e }),
          }).unwrap()
        : {};

      await kv.put(
        key,
        JSON.stringify({
          ...form,
          form_schema: parsedSchema,
          customisation,
          closed: success ? success?.closed : false,
          closedMessage,
        }),
        {
          expirationTtl: 60,
        },
      );

      return {
        ...form,
        form_schema: parsedSchema,
        customisation,
        closed: success ? success?.closed : false,
        closedMessage,
      } as IgetFormService;
    },
    catch: (e) => {
      if (e instanceof ParseError || e instanceof DatabaseError) return e;
      return new UnhandledException({ cause: e });
    },
  });
};

export const getFormWithMetaDataService = async (formId: string) => {
  return Result.tryPromise({
    try: async () => {
      const db = await getDb();
      const res = await db.query.form.findFirst({
        where: eq(formTable.shortId, formId),
        columns: {
          name: true,
          shortId: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          integrations: {
            columns: {
              id: true,
              metaData: true,
              type: true,
            },
          },
        },
      });

      return res;
    },
    catch: (e) =>
      new DatabaseError({ operation: "getFormWithMetaData", cause: e }),
  });
};

export const updateFormAndFormfieldsService = async (updateValues: {
  formId: typeof formTable.$inferInsert.shortId;
  formName: typeof formTable.$inferInsert.name;
  form_schema: typeof formTable.$inferInsert.form_schema;
  fields: (typeof formFieldTable.$inferInsert)[];
  formCustomisation: typeof formSettingTable.$inferInsert.customisation;
  userId: string;
}) => {
  return Result.tryPromise({
    try: async () => {
      const {
        formId,
        fields,
        formName,
        form_schema,
        formCustomisation,
        userId,
      } = updateValues;

      const db = await getDb();
      const incomingFieldIds = fields?.map((f) => f?.id);
      const updateAndGetIntegrations = await db.transaction(async (tx) => {
        // update form schema
        const [form] = await tx
          .update(formTable)
          .set({
            name: formName,
            form_schema: form_schema,
            updatedAt: new Date(),
          })
          .where(eq(formTable.shortId, formId!))
          .returning({
            formId: formTable.shortId,
            customerId: formTable.creator,
          });

        // update form - fields

        const fieldsInDB = await tx
          .select({ id: formFieldTable.id })
          .from(formFieldTable)
          .where(eq(formFieldTable.form, formId!));

        const fieldsInDBSet = new Set(fieldsInDB?.map((f) => f?.id));

        // extracting existing fields
        // all the fields that are in incomingFields
        // and exist in db
        // these fields will be updated
        const existingIncomingFields = fields?.filter(
          (f) => f?.id && fieldsInDBSet.has(f?.id),
        );

        // extracting fields that are to be insert ,
        // all the fields that are in incomingFields and does't exist in db .
        // it means they have to be inserted
        const fieldsToInsert = fields?.filter((f) => !fieldsInDBSet.has(f.id!));

        // extracting all  the fields that have to be deleted
        // all the fields that does not exist in incoming field but
        // exist in db , have to deleted
        const fieldToDelete = fieldsInDB
          ?.map((f) => f?.id)
          ?.filter((id) => !incomingFieldIds?.includes(id));

        // fields updating
        for (const field of existingIncomingFields) {
          await tx
            .update(formFieldTable)
            .set(field)
            .where(eq(formFieldTable.id, field.id!));
        }

        // if we have fields to insert , then insert them
        if (fieldsToInsert.length) {
          await tx.insert(formFieldTable).values(fieldsToInsert);
        }

        // if we have fields to delete , then delete them
        if (fieldToDelete.length) {
          await tx
            .delete(formFieldTable)
            .where(inArray(formFieldTable.id, fieldToDelete));
        }

        // update form - customization
        // if we have already customization then update it
        const [update] = await tx
          .update(formSettingTable)
          .set({ customisation: formCustomisation })
          .where(eq(formSettingTable.formId, formId!))
          .returning();

        // other wise insert it
        if (!update?.id) {
          await tx.insert(formSettingTable).values({
            formId: form.formId!,
            customerId: form?.customerId,
            customisation: formCustomisation,
          });
        }

        // at the end return  the form - notion integrations
        return await tx
          .select()
          .from(integrationTable)
          .where(
            and(
              eq(integrationTable.formId, formId!),
              eq(integrationTable.type, "notion"),
            ),
          );
      });

      // after updating form , and getting notion integration;
      // we are creating new notion page/db after each form update
      // because notion doesn't allow to delete field in db through api.
      // so to keep them sync we are creating new notion page/db ,
      // and if form has notion integrations then now it goes to new page/db.
      if (updateAndGetIntegrations?.length) {
        const notionIntegrtns = updateAndGetIntegrations.map((I) => ({
          id: `${Date.now()}-Planetform${I?.id}`,
          params: {
            formId: I.formId!,
            integrationId: I.id,
            customerId: I.customerId!,
            metaData: I.metaData!,
            userId: userId,
          },
        }));
      }

      return true;
    },
    catch: (e) => {
      if (e instanceof DatabaseError) return e;
      return new UnhandledException({ cause: e });
    },
  });
};

export const formClosingService = async (formSettings: {
  isClosed: boolean | null;
  closedAfterSubmission: number | null;
  closingTime: Date | null;
  formId: string;
}) => {
  const { isClosed, closingTime, closedAfterSubmission, formId } = formSettings;

  const db = await getDb();
  if (isClosed) {
    return {
      closed: true,
    };
  }

  if (closingTime) {
    const now = new Date();
    if (closingTime <= now) {
      const [closed] = await db
        .update(formSettingTable)
        .set({ closed: true })
        .where(eq(formSettingTable.formId, formId))
        .returning({ isClosed: formSettingTable.closed });
      return {
        closed: closed?.isClosed,
      };
    }
  }

  if (closedAfterSubmission) {
    const submissions = await getSubmissionService(formId);

    if (submissions && submissions >= closedAfterSubmission) {
      const [closed] = await db
        .update(formSettingTable)
        .set({ closed: true })
        .where(eq(formSettingTable.formId, formId))
        .returning({ isClosed: formSettingTable.closed });

      return {
        closed: closed?.isClosed,
      };
    }
  }
};
