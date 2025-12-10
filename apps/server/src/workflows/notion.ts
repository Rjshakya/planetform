import {
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from "cloudflare:workers";
import { NonRetryableError } from "cloudflare:workflows";
import { getDb } from "../db/config";
import { integration as integrationTable } from "../db/schema/integration";
import { and, eq } from "drizzle-orm";
import { formField as formFieldTable } from "../db/schema/form.fields";
import { response as responsesTable } from "../db/schema/response";
import { account } from "../db/schema/auth";
import { breakIntegration } from "../utils/breakIntegration";

export interface INotionPageCreateWorkflowParams {
  formId: string;
  integrationId: string | null;
  userId: string;
  metaData: any;
  customerId: string;
}

export interface INotionSubmissionWorkflowParams {
  userId: string;
  formId: string;
  values: (typeof responsesTable.$inferInsert)[];
  pageId: string;
  respondentId: string;
  integrationId: string;
}

export class NotionPageCreateWorkflow extends WorkflowEntrypoint {
  async run(
    event: Readonly<WorkflowEvent<INotionPageCreateWorkflowParams>>,
    step: WorkflowStep
  ) {
    const { formId, userId, metaData, customerId, integrationId } =
      event.payload;

    if (!formId) {
      throw new NonRetryableError(
        "userId or accessToken or refreshToken missing"
      );
    }

    const tokens = await step.do("get-access-tokens", async () => {
      const db = await getDb();
      const [acc] = await db
        .select({
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
        })
        .from(account)
        .where(
          and(eq(account.userId, userId), eq(account.providerId, "notion"))
        );

      if (!acc?.accessToken) {
        throw new NonRetryableError("No access token found for Notion");
      }

      return acc;
    });

    const headers = await step.do("get-header", async () => {
      return {
        "Content-Type": "application/json",
        Authorization: tokens?.accessToken!,
        "Notion-Version": "2022-02-22",
      };
    });

    const parentPageInfo = await step.do(
      "get-access-granted-page",
      async () => {
        try {
          const body = {
            query: "",
            filter: {
              value: "page",
              property: "object",
            },
          };

          const searchRes = await fetch("https://api.notion.com/v1/search", {
            body: JSON.stringify(body),
            method: "POST",
            headers: headers,
          });

          if (!searchRes.ok) {
            throw new Error(`Notion API error: ${searchRes.statusText}`);
          }

          const pages = (await searchRes.json()) as any;
          const page = pages?.results?.find(
            (page: any) => page?.parent?.workspace && page
          );

          return { page_id: page?.id };
        } catch (e) {
          throw new Error(`failed to create-notion-page`);
        }
      }
    );

    const formFields = await step.do("get-form-fields", async () => {
      try {
        const fieldsProperties = {} as Record<any, any>;
        const db = await getDb();
        const fields = await db
          .select({ label: formFieldTable.label, index: formFieldTable.order })
          .from(formFieldTable)
          .where(eq(formFieldTable.form, formId));

        for (const field of fields) {
          const key = `${field.index}_${field.label.trim()}`;
          fieldsProperties[key] = { rich_text: {} };
        }

        return fieldsProperties;
      } catch (e) {
        throw new Error(`failed to get-form-fields`);
      }
    });

    await step.do("create-notion-page", async () => {
      try {
        if (!parentPageInfo?.page_id) {
          throw new Error("No parent-page_id found");
        }

        const meta = await JSON.parse(metaData || "");

        const body = {
          parent: {
            type: "page_id",
            page_id: parentPageInfo?.page_id,
          },
          title: [
            {
              type: "text",
              text: {
                content: meta?.title || `Planetform-${formId}`,
              },
            },
          ],
          properties: {
            "res-id": {
              title: {},
            },
            ...formFields,
          },
        };

        const res = await fetch(`https://api.notion.com/v1/databases`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: headers,
        });

        if (!res.ok) {
          throw new Error(`Notion API error: ${res.statusText}`);
        }

        const page = (await res.json()) as any;
        const db = await getDb();

        if (integrationId) {
          await db
            .update(integrationTable)
            .set({
              metaData: JSON.stringify({
                page_id: page?.id,
                url: page?.url,
                title: meta?.title || `Planetform-${formId}`,
              }),
            })
            .where(eq(integrationTable.id, integrationId));

          return;
        } else {
          await db.insert(integrationTable).values({
            type: "notion",
            customerId,
            formId,
            metaData: JSON.stringify({
              page_id: page?.id,
              url: page?.url,
              title: meta?.title || `Planetform-${formId}`,
            }),
          });
        }

        return true;
      } catch (e) {
        console.log(e);

        throw new Error(`failed to create-notion-page`);
      }
    });
  }
}

export class NotionSubmissionWorkflow extends WorkflowEntrypoint {
  async run(
    event: Readonly<WorkflowEvent<INotionSubmissionWorkflowParams>>,
    step: WorkflowStep
  ) {
    const { formId, pageId, userId, values, respondentId, integrationId } =
      event.payload;

    if (!formId || !userId || !values || !pageId || !respondentId) {
      throw new NonRetryableError("formId or userId doesn't exist");
    }

    const { accessToken } = await step.do(`get-access-token`, async () => {
      try {
        const db = await getDb();
        const [tokens] = await db
          .select({
            accessToken: account.accessToken,
            refreshToken: account.refreshToken,
          })
          .from(account)
          .where(
            and(eq(account.userId, userId), eq(account.providerId, "notion"))
          );

        if (!tokens.accessToken) {
          throw new NonRetryableError("No access token found");
        }

        return tokens;
      } catch (e) {
        await breakIntegration({ integrationId });
        throw new Error("failed to get-access-token");
      }
    });

    const headers = await step.do("get-req-headers", async () => {
      return {
        "Content-Type": "application/json",
        Authorization: accessToken?.trim()!,
        "Notion-Version": "2025-09-03",
      };
    });

    const formData = await step.do("get-form-fields", async () => {
      try {
        const fieldsProperties = {} as Record<any, any>;
        const db = await getDb();
        const fields = await db
          .select({
            label: formFieldTable.label,
            index: formFieldTable.order,
            id: formFieldTable.id,
          })
          .from(formFieldTable)
          .where(eq(formFieldTable.form, formId));

        for (const field of fields) {
          const key = `${field.index}_${field.label.trim()}`;
          fieldsProperties[key] = { rich_text: {} };
        }

        return {
          formFields: fieldsProperties,
          fields,
        };
      } catch (e) {
        throw new Error(`failed to get-form-fields`);
      }
    });

    const properties = await step.do("process-the-values", async () => {
      try {
        const { fields: formFields } = formData;
        const props = {} as Record<any, any>;

        props["res-id"] = {
          title: [
            {
              text: {
                content: values[0]?.respondent,
              },
            },
          ],
        };

        for (const val of values) {
          const field = formFields?.find((f) => f.id === val.form_field);
          const index = field?.index?.toString() || "";
          // ${field.index}_${field.label.trim()}
          const label = `${index}_${field?.label?.trim()}` || "label not found";
          props[label] = {
            rich_text: [
              {
                text: {
                  content: val?.value?.trim() || "no value",
                },
              },
            ],
          };
        }

        return props;
      } catch (e) {
        throw new Error("failed to process-the-values");
      }
    });

    await step.do("send-post-req-to-notion", async () => {
      try {
        const body = {
          parent: { database_id: pageId?.trim() },
          properties: properties,
        };

        const res = await fetch(`https://api.notion.com/v1/pages`, {
          method: "POST",
          body: JSON.stringify(body),
          headers,
        });

        if (res.ok) {
          console.log('success-send-post-req-to-notion' , res.status);
          return true;
        }
      } catch (e) {
        console.log(e);
        await breakIntegration({ integrationId });
        throw new Error("failed to send-post-req-to-notion" + `${e}`);
      }
    });
  }
}
