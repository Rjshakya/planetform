import { env } from "cloudflare:workers";
import z from "zod";
import type { response } from "../db/schema/response";
import {
  CreateEmailToRespondentIntegrationSchema,
  EMAIL_TO_RESPONDENT_INTEGRATION_TYPE,
  GMAIL_INTEGRATION_TYPE,
  NOTION_INTEGRATION_TYPE,
  SHEET_INTEGRATION_TYPE,
  SLACK_INTEGRATION_TYPE,
  WEBHOOK_INTEGRATION_TYPE,
} from "../services/integration";
import { NOTIFICATION_EMAIL } from "../utils/mail";

export type IntegrationQueueMesssage = {
  formId: string;
  values: (typeof response.$inferInsert)[];
  userId: string;
  respondentId: string;
  integrationId: string;
  metaData: string | null;
  type: string;
};

export const webhookMetaDataSchema = z.object({
  url: z.url(),
  headers: z.object().optional(),
});

export const gmailMetaDataSchema = z.object({
  from: z.string(),
  to: z.string(),
  subject: z.string(),
  body: z.string(),
  isDynamicBody: z.boolean(),
});

export const emailMetaDataSchema = z.object({
  emailFormFieldId: z.string(),
  from: z.string(),
  subject: z.string(),
  body: z.string(),
});

export const handleIntegrationQueue = async (
  messages: readonly Message<IntegrationQueueMesssage>[],
) => {
  for (const message of messages) {
    const {
      formId,
      values,
      userId,
      respondentId,
      integrationId,
      metaData,
      type,
    } = message.body;

    const parsedMetaData = JSON.parse(metaData || "{}");
    const idFromMetaData = parsedMetaData?.id?.trim();

    if (type === SHEET_INTEGRATION_TYPE) {
      if (!idFromMetaData) continue;
      // we will google sheet workflow
      await env.GOOGLE_SHEET_INTEGRATION_WORKFLOW.create({
        id: `${respondentId}-sheet-${integrationId}`,
        params: {
          formId,
          integrationId,
          userId,
          values,
          spreadSheetId: idFromMetaData,
        },
      });
    }

    if (type === NOTION_INTEGRATION_TYPE) {
      if (!idFromMetaData) continue;
      // we will notion workflow
      await env.NOTION_INTEGRATION_WORKFLOW.create({
        id: `${respondentId}-notion-${integrationId}`,
        params: {
          formId,
          integrationId,
          respondentId,
          values,
          userId,
          pageId: idFromMetaData,
        },
      });
    }

    if (type === WEBHOOK_INTEGRATION_TYPE) {
      // we will webhook workflow

      const { success, data } = webhookMetaDataSchema.safeParse(parsedMetaData);

      if (!success) continue;

      await env.WEBHOOK_INTEGRATION_WORKFLOW.create({
        id: `${respondentId}-webhook-${integrationId}`,
        params: {
          formId,
          integrationId,
          respondentId,
          values,
          ...data,
        },
      });
    }

    if (type === GMAIL_INTEGRATION_TYPE) {
      const { success, data } = gmailMetaDataSchema.safeParse(parsedMetaData);
      if (!success) continue;

      await env.GMAIL_INTEGRATION_WORKFLOW.create({
        id: `${respondentId}-gmail-${integrationId}`,
        params: {
          formId,
          integrationId,
          userId,
          values,
          metaData: data,
        },
      });
    }

    if (type === SLACK_INTEGRATION_TYPE) {
      if (!parsedMetaData?.id || !Array.isArray(parsedMetaData?.fields))
        continue;
      await env.SLACK_INTEGRATION_WORKFLOW.create({
        id: `${respondentId}-slack-${integrationId}`,
        params: {
          formId,
          userId,
          values,
          integrationId,
          metaData: parsedMetaData,
        },
      });
    }

    if (type === EMAIL_TO_RESPONDENT_INTEGRATION_TYPE) {
      const { success, data } = emailMetaDataSchema.safeParse(parsedMetaData);
      if (!success) continue;

      await env.EMAIL_INTEGRATION_WORKFLOW.create({
        id: `${respondentId}-email-${integrationId}`,
        params: {
          formId,
          userId,
          values,
          integrationId,
          metaData: {
            body: data.body,
            emailFormFieldId: data.emailFormFieldId,
            subject: data.subject,
            from: NOTIFICATION_EMAIL,
          },
        },
      });
    }
  }

  return true;
};
