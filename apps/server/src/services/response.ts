import { env } from "cloudflare:workers";
import { countDistinct, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "../db/config.js";
import { formField as formFieldTable } from "../db/schema/form.fields.js";
import { integration as integrationTable } from "../db/schema/integration.js";
import { response as responsesTable } from "../db/schema/response.js";
import { commonCatch } from "../utils/error.js";
import { IntegrationQueueMesssage } from "../queues/integration-queue.js";

export const createResponseService = async (
  responseValues: typeof responsesTable.$inferInsert,
) => {
  try {
    const db = await getDb();
    const response = await db
      .insert(responsesTable)
      .values(responseValues)
      .returning();
    return response[0];
  } catch (error) {
    commonCatch(error);
  }
};

export const getFormResponsesService = async (
  formId: typeof responsesTable.$inferInsert.form,
  pageIndex: number,
  pageSize: number,
) => {
  try {
    const db = await getDb();

    const respondents = await db
      .select({
        respondent: responsesTable.respondent,
      })
      .from(responsesTable)
      .where(eq(responsesTable.form, formId))
      .groupBy(responsesTable.respondent, responsesTable.createdAt)
      .orderBy(desc(responsesTable.createdAt))
      .limit(pageSize)
      .offset(pageIndex * pageSize);

    const respondentIds = respondents?.map((r) => r?.respondent);

    // respondents which have responses.
    const [respondentCount] = await db
      .select({
        count: countDistinct(responsesTable.respondent),
      })
      .from(responsesTable)
      .where(eq(responsesTable.form, formId));

    const totalPages = Math.ceil(respondentCount?.count / pageSize);

    // headers of data-table  , basically they are columns of table ,
    // we will show in ui
    //
    const headers = await db
      .select({
        id: formFieldTable.id,
        label: formFieldTable.label,
      })
      .from(formFieldTable)
      .where(eq(formFieldTable.form, formId))
      .orderBy(formFieldTable.updatedAt);

    headers.unshift({ label: "createdAt", id: "createdAt" });

    const responses = await db
      .select({
        id: responsesTable.id,
        value: responsesTable.value,
        field: responsesTable.form_field,
        respondent: responsesTable.respondent,
        form: responsesTable.form,
        createdAt: responsesTable.createdAt,
        label: formFieldTable.label,
      })
      .from(responsesTable)
      .leftJoin(
        formFieldTable,
        eq(responsesTable.form_field, formFieldTable.id),
      )
      .where(inArray(responsesTable.respondent, respondentIds))
      .orderBy(responsesTable.createdAt);

    const rows = responses.reduce(
      (acc, currItem) => {
        const { label, respondent, value, field, createdAt } = currItem;

        if (!acc[respondent]) {
          acc[respondent] = {
            id: respondent,
            createdAt: { id: "createdAt", value: createdAt.toISOString() },
            [field as string]: {
              id: field as string,
              value: value as string,
            },
          };
        } else {
          acc[respondent][field as string] = {
            id: field as string,
            value: value as string,
          };
        }

        return acc;
      },
      {} as Record<
        string,
        {
          id: string;
          [key: string]: { id: string; value: string } | string;
        }
      >,
    );

    return {
      rows: Object.values(rows),
      headers,
      pageIndex,
      pageSize,
      totalPages,
      totalCount: respondentCount,
    };
  } catch (error) {
    commonCatch(error);
  }
};

export const createMultipleResponsesService = async (
  responses: (typeof responsesTable.$inferInsert)[],
  userId: string,
) => {
  try {
    const db = await getDb();
    const [result] = await db
      .insert(responsesTable)
      .values(responses)
      .returning();

    const formId = result?.form;
    const respondentId = result?.respondent;

    // form-integrations
    const integrations = await db
      .select({
        integrationId: integrationTable.id,
        metaData: integrationTable.metaData,
        type: integrationTable.type,
      })
      .from(integrationTable)
      .where(eq(integrationTable.formId, formId));

    //  point to discuss
    //  whether to send it in ctx.waituntil
    //  by that way , it is processed in background ,
    //  user do not have to wait for this , step , to
    //  get success response.

    if (integrations.length > 0) {
      const integrationQueueBatch = integrations.map((integration) => {
        const { integrationId, metaData, type } = integration;
        return {
          body: {
            formId,
            respondentId,
            integrationId,
            metaData,
            type,
            userId,
            values: responses,
          },
        };
      });
      await env.planetform_integrations_queue.sendBatch(integrationQueueBatch);
    }

    return result;
  } catch (error) {
    commonCatch(error);
  }
};

export const editResponseService = async (
  responseId: string,
  values: typeof responsesTable.$inferInsert,
) => {
  try {
    const db = await getDb();
    await db
      .update(responsesTable)
      .set(values)
      .where(eq(responsesTable.id, responseId));

    return true;
  } catch (e) {
    commonCatch(e);
  }
};
