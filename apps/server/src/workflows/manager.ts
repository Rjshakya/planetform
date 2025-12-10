import {
  env,
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from "cloudflare:workers";
import { NonRetryableError } from "cloudflare:workflows";
import { getDb } from "../db/config";
import { integration as integrationTable } from "../db/schema/integration";
import { eq } from "drizzle-orm";
import { response as responsesTable } from "../db/schema/response";
import { IWebHookFlowParams } from "./webhook";
import { IgoogleSheetWorkflowParams } from "./googleSheet";
import { INotionSubmissionWorkflowParams } from "./notion";
import {
  IGmailSendWorkflowParams,
  IPersonalGmailNotifyWorkflowParams,
} from "./gmail";

interface IManagerWorkflowParams {
  formId: string;
  respondentId: string;
  userId: string;
  values: (typeof responsesTable.$inferInsert)[];
}

export interface IgoogleSheetIntegrations {
  id: string;
  params: IgoogleSheetWorkflowParams;
}

export interface InotionIntegrations {
  id: string;
  params: INotionSubmissionWorkflowParams;
}

export interface IwebHookIntegrations {
  id: string;
  params: IWebHookFlowParams;
}

export interface IgmailNotificationIntegrations {
  id: string;
  params: IPersonalGmailNotifyWorkflowParams;
}

export interface IgmailIntegrations {
  id: string;
  params: IGmailSendWorkflowParams;
}

export class ManagerWorkflow extends WorkflowEntrypoint {
  async run(
    event: Readonly<WorkflowEvent<IManagerWorkflowParams>>,
    step: WorkflowStep
  ) {
    const { formId, respondentId, userId, values } = event.payload;
    if (!formId || !respondentId) {
      throw new NonRetryableError("formId or userId doesn't exist");
    }

    const integrations = await step.do("get-all-integrations", async () => {
      try {
        const db = await getDb();
        return await db
          .select()
          .from(integrationTable)
          .where(eq(integrationTable.formId, formId));
      } catch (e) {
        throw new Error("failed to get-all-integrations");
      }
    });

    const batchIntegrations = await step.do(
      "call-other-workflows-by-batch",
      async () => {
        try {
          const googleSheetIntegrations = [] as IgoogleSheetIntegrations[];
          const notionIntegrations = [] as InotionIntegrations[];
          const webHookIntegrations = [] as IwebHookIntegrations[];
          const gmailNotificationIntegrations =
            [] as IgmailNotificationIntegrations[];
          const gmailIntegrations = [] as IgmailIntegrations[];

          // batching integrations , if form has integrations of one-type more than one
          // e.g one form can have many google sheets integrations
          // so that's y we are sending batch request.
          for (const integration of integrations) {
            // here google is used for google-sheets flow
            if (integration.type === "google") {
              const metaData = await JSON.parse(integration.metaData || "");
              const spreadSheetId = metaData?.id?.trim();
              if (!spreadSheetId) continue;
              const payload = {
                id: `${respondentId}-integrate-to-${integration.id}-google`,
                params: {
                  userId,
                  formId,
                  values,
                  spreadSheetId,
                  integrationId: integration.id,
                },
              };
              googleSheetIntegrations.push(payload);
            }

            if (integration.type === "notion") {
              const metaData = JSON.parse(integration?.metaData || "");
              const pageId = metaData?.page_id;
              if (!pageId) continue;
              const payload = {
                id: `${respondentId}-integrate-to-${integration.id}-notion`,
                params: {
                  userId,
                  formId,
                  values,
                  pageId,
                  respondentId: respondentId,
                  integrationId: integration.id,
                },
              };
              notionIntegrations.push(payload);
            }

            if (integration.type === "webhook") {
              const metaData = await JSON.parse(integration?.metaData || "");
              if (!metaData?.url) continue;

              const payload = {
                id: `${respondentId}-integrate-to-${integration.id}-webhook`,
                params: {
                  formId,
                  respondentId,
                  url: metaData?.url,
                  values,
                  integrationId: integration.id,
                } satisfies IWebHookFlowParams,
              };
              webHookIntegrations.push(payload);
            }

            if (integration.type === "gmail-notify") {
              const metaData = await JSON.parse(integration?.metaData || "");
              const payload = {
                id: `${respondentId}-notify-gmail`,
                params: {
                  userId,
                  formId,
                  integrationId: integration.id,
                  values,
                  emailData: metaData,
                },
              };

              gmailNotificationIntegrations.push(payload);
            }

            if (integration.type === "gmail") {
              const metaData = await JSON.parse(integration?.metaData || "");
              const payload = {
                id: `${respondentId}-gmail`,
                params: {
                  userId,
                  formId,
                  integrationId: integration.id,
                  values,
                  emailData: metaData,
                },
              };

              gmailIntegrations.push(payload);
            }
          }

          return {
            googleSheetIntegrations,
            notionIntegrations,
            webHookIntegrations,
            gmailNotificationIntegrations,
            gmailIntegrations,
          };
        } catch (e) {
          console.error(e);
          throw new Error("failed to call-other-workflows-by-batch");
        }
      }
    );

    await Promise.all([
      await step.do("create-googleSheetIntegrations-batch", async () => {
        if (!batchIntegrations.googleSheetIntegrations.length) return;
        await env.GOOGLE_SHEET_FLOW.createBatch(
          batchIntegrations.googleSheetIntegrations
        );
      }),
      await step.do("create-notionIntegrations-batch", async () => {
        if (!batchIntegrations.notionIntegrations.length) return;
        await env.NOTION_SUBMISSION_WORK_FLOW.createBatch(
          batchIntegrations.notionIntegrations
        );
      }),
      await step.do("create-webHookIntegrations-batch", async () => {
        if (!batchIntegrations.webHookIntegrations.length) return;
        await env.WEBHOOK_WORK_FLOW.createBatch(
          batchIntegrations.webHookIntegrations
        );
      }),
      await step.do("create-gmailNotificationIntegrations-batch", async () => {
        if (!batchIntegrations.gmailNotificationIntegrations.length) return;
        await env.GMAIL_NOTIFY_WORK_FLOW.createBatch(
          batchIntegrations.gmailNotificationIntegrations
        );
      }),
      await step.do("create-gmailIntegrations-batch", async () => {
        if (!batchIntegrations.gmailIntegrations.length) return;
        await env.GMAIL_WORK_FLOW.createBatch(
          batchIntegrations.gmailIntegrations
        );
      }),
    ]);
  }
}
