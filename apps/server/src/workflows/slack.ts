import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
import { Result } from "better-result";
import { eq } from "drizzle-orm";
import { getDb } from "../db/config";
import { form as formTable } from "../db/schema/form";
import type { response as responsesTable } from "../db/schema/response";
import type { SlackIntegrationMetaData } from "../services/slack/index";
import { SlackIntegrationService } from "../services/slack/slack";
import { getUserCredentials } from "../utils/auth";
import { getFormFields, getSubmissionsForSlack } from "./helpers";
import { NonRetryableError } from "cloudflare:workflows";

export interface ISlackIntegrationWorkflowParams {
  userId: string;
  formId: string;
  values: (typeof responsesTable.$inferInsert)[];
  integrationId: string;
  metaData: SlackIntegrationMetaData;
}

export class SlackIntegrationWorkflow extends WorkflowEntrypoint<ISlackIntegrationWorkflowParams> {
  async run(
    event: Readonly<WorkflowEvent<ISlackIntegrationWorkflowParams>>,
    step: WorkflowStep,
  ) {
    const { formId, userId, values, integrationId, metaData } = event.payload;

    if (!formId || !userId || !values || !integrationId || !metaData) {
      console.error("payload is missing, returning from slack workflow");
      return;
    }

    // Step 1: Get user credentials
    const userCredentials = await step.do("get-user-credentials", async () => {
      const credentialsResult = await getUserCredentials(userId, "slack");
      if (Result.isOk(credentialsResult)) {
        return credentialsResult.value;
      }
      throw new NonRetryableError("failed to get user credentials");
    });

    // Step 2: Fetch form name and transform data
    const { formName, transformedData } = await step.do(
      "fetch-form-and-transform-data",
      async () => {
        // Fetch form name from DB
        const db = await getDb();
        const [form] = await db
          .select({ name: formTable.name })
          .from(formTable)
          .where(eq(formTable.shortId, formId));

        const formName = form?.name || "Form Submission";

        const transformedData = await getSubmissionsForSlack({
          values,
          formId,
          fields: metaData.fields,
        });

        return { formName, transformedData };
      },
    );

    // Step 3: Post message to Slack
    await step.do("post-slack-message", async () => {
      const slackService = new SlackIntegrationService({
        accessToken: userCredentials.accessToken,
      });

      // Format as bullet points
      const message = Object.entries(transformedData)
        .map(([label, value]) => `• ${label}: ${value}`)
        .join("\n");

      await slackService.postMessage({
        channelId: metaData.id,
        formId,
        formName,
        message: metaData.message || "",
        submissions: message,
      });
    });
  }
}
