import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
import type { response as responsesTable } from "../db/schema/response";
import { sendZeptoMail } from "../services/zepto-mail/mail";
import { getSubmissionRecord, handleMailBody } from "./helpers";
import z from "zod";
import { NonRetryableError } from "cloudflare:workflows";

type EmailMetaData = {
  from: string;
  subject: string;
  body: string;
  emailFormFieldId: string;
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

    const submissionsRecord = await step.do(
      "get-submission-record",
      async () => {
        const { submission } = await getSubmissionRecord({
          formId,
          values,
          useFieldLabelAsKey: false,
        });

        return submission;
      },
    );

    const to = await step.do("get-recipient-email", async () => {
      const emailId = submissionsRecord[mail.emailFormFieldId];
      const schema = z.email();
      const { success } = schema.safeParse(emailId);
      if (!success) {
        throw new NonRetryableError("Not valid email , cancel further process");
      }
      return emailId;
    });

    const body = await step.do("handle-mail-body", async () => {
      return await handleMailBody({
        body: mail.body,
        submissions: submissionsRecord,
      });
    });

    await step.do("send-zepto-mail", async () => {
      const { from, subject } = mail;

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
