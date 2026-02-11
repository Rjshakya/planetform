import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
import type { response as responsesTable } from "../db/schema/response";
import { sendZeptoMail } from "../services/zepto-mail/mail";

type EmailMetaData = {
  from: string;
  to: string;
  subject: string;
  body: string;
  isDynamicBody: boolean;
};

export interface IEmailIntegrationWorkflow {
  formId: string;
  userId: string;
  integrationId: string;
  metaData: EmailMetaData;
  values: (typeof responsesTable.$inferInsert)[];
}

export class EmailIntegrationWorkflow extends WorkflowEntrypoint {
  async run(
    event: Readonly<WorkflowEvent<IEmailIntegrationWorkflow>>,
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
      console.error("payload is missing , returning from email workflow");
      return;
    }

    await step.do("send-zepto-mail", async () => {
      const { body, from, subject, to } = mail;

      await sendZeptoMail({
        emailParams: {
          from: { address: from, name: from.split("@")[0] },
          to: [{ email_address: { address: to, name: to.split("@")[0] } }],
          subject,
          textbody: body,
        },
        isNotification: true,
      });
    });
  }
}
