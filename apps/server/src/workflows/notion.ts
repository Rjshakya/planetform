import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
import type { response as responsesTable } from "../db/schema/response";
import { NotionIntegrationService } from "../services/notion/notion";
import { getUserCredentials } from "../utils/auth";
// import { breakIntegration } from "../utils/breakIntegration";
import { getNotionPropertiesFromSubmission } from "./helpers";

export interface INotionIntegrationWorkflowParams {
  userId: string;
  formId: string;
  values: (typeof responsesTable.$inferInsert)[];
  pageId: string;
  respondentId: string;
  integrationId: string;
}

export class NotionIntegrationWorkflow extends WorkflowEntrypoint {
  async run(
    event: Readonly<WorkflowEvent<INotionIntegrationWorkflowParams>>,
    step: WorkflowStep,
  ) {
    const { formId, integrationId, pageId, respondentId, userId, values } =
      event.payload;
    if (
      !formId ||
      !integrationId ||
      !pageId ||
      !respondentId ||
      !userId ||
      !values
    ) {
      console.error("payload value is missing , returning;");
      return;
    }

    const credentials = await step.do("get-user-credentials", async () => {
      const credentialsResult = await getUserCredentials(userId, "notion");
      return credentialsResult.match({
        ok: (credentials) => credentials,
        err: (error) => {
          console.error({
            message: "Failed to get user credentials",
            error,
            userId,
            integrationId,
          });
          throw new Error(
            `Failed to get user credentials for notion integration`,
          );
        },
      });
    });

    await step.do("set-value-to-notion-database", async () => {
      const notion = new NotionIntegrationService({
        token: credentials.accessToken,
      });
      const properties = await getNotionPropertiesFromSubmission({
        formId,
        respondentId,
        values,
      });
      await notion.insertInDatabase(pageId.trim(), properties);
    });
  }
}
