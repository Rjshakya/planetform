import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
import { Result } from "better-result";
import type { response as responsesTable } from "../db/schema/response";
import { GmailIntegrationService } from "../services/google/gmail";
import { getUserCredentials } from "../utils/auth";

type GmailMetaData = {
  from: string;
  to: string;
  subject: string;
  body: string;
  isDynamicBody: boolean;
};

export interface IGmailIntegrationWorkflow {
  formId: string;
  userId: string;
  integrationId: string;
  metaData: GmailMetaData;
  values: (typeof responsesTable.$inferInsert)[];
}

export class GmailIntegrationWorkflow extends WorkflowEntrypoint {
  async run(
    event: Readonly<WorkflowEvent<IGmailIntegrationWorkflow>>,
    step: WorkflowStep,
  ) {
    const {
      formId,
      integrationId,
      metaData: mail,
      userId,
      values,
    } = event.payload;

    if (!formId || !integrationId || !mail || !userId || !values) {
      console.error("payload is missing , returning from gmail workflow");
      return;
    }

    const userCredentials = await step.do("get-user-credentials", async () => {
      const credentialsResult = await getUserCredentials(userId, "google");
      if (Result.isOk(credentialsResult)) {
        return credentialsResult.value;
      } else {
        throw new Error("failed to get users's credentials");
      }
    });

    await step.do("send-gmail", async () => {
      const gmail = new GmailIntegrationService({
        accessToken: userCredentials.accessToken,
        refreshToken: userCredentials?.refreshToken as string,
      });
      await gmail.send({
        sender: mail.from,
        recipient: mail.to,
        subject: mail.subject,
        text: mail.body,
      });
    });
  }
}
