import {
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from "cloudflare:workers";
import { response as responsesTable } from "../db/schema/response";
import { getDb } from "../db/config";
import { account, user } from "../db/schema/auth";
import { and, eq } from "drizzle-orm";
import { NonRetryableError } from "cloudflare:workflows";
import { OAuth2Client } from "google-auth-library";
import { gmail } from "@googleapis/gmail";
import { createMimeMessage } from "mimetext";
import { getPersonalHtmlEmailStr } from "../utils/getHtmlEmail";
import { formField as formFieldTable } from "../db/schema/form.fields";
import { form as formTable } from "../db/schema/form";
import z from "zod";
import { breakIntegration } from "../utils/breakIntegration";


export interface IPersonalGmailNotifyWorkflowParams {
  userId: string;
  emailData: {
    subject: string;
    body?: string;
  };
  integrationId: string;
  formId: string;
  values: (typeof responsesTable.$inferInsert)[];
}

export interface IGmailSendWorkflowParams {
  userId: string;
  emailData: {
    to: string; // emailField id
    subject: string;
    body?: string;
  };
  integrationId: string;
  formId: string;
  values: (typeof responsesTable.$inferInsert)[];
}

export class PersonalGmailNotifyFlow extends WorkflowEntrypoint {
  async run(
    event: Readonly<WorkflowEvent<IPersonalGmailNotifyWorkflowParams>>,
    step: WorkflowStep
  ) {
    const { emailData, formId, integrationId, userId, values } = event.payload;

    if (!userId || !formId || !integrationId || !values || !emailData) {
      throw new NonRetryableError("formId or user Id doesn't exist");
    }

    const transformedValues = await step.do(
      "process-and-transform-submissions-values",
      async () => {
        try {
          const db = await getDb();
          const formFields = await db
            .select({
              id: formFieldTable.id,
              label: formFieldTable.label,
              index: formFieldTable.order,
              formName: formTable.name,
              workspace: formTable.workspace,
            })
            .from(formFieldTable)
            .innerJoin(formTable, eq(formTable.shortId, formId))
            .where(eq(formFieldTable.form, formId));
          const valuesObj = {} as Record<string, string>;
          const form = formFields[0];

          for (const item of values) {
            const formField = formFields?.find(
              (f) => f?.id === item?.form_field
            );

            if (valuesObj[formField?.label as string]) {
              const key = `${formField?.index}` + `${formField?.label}`;
              valuesObj[key] = item?.value || ("no value" as string);
              continue;
            }

            valuesObj[formField?.label as string] = item?.value || "no value";
          }

          return {
            valuesObj,
            formName: form?.formName,
            workspace: form?.workspace,
          };
        } catch (e) {
          console.error(e);
          throw new Error("failed to process submission values");
        }
      }
    );

    const refreshedAccessToken = await step.do(
      "refresh-access-token",
      async () => {
        try {
          const db = await getDb();
          const [existingToken] = await db
            .select()
            .from(account)
            .where(
              and(eq(account.userId, userId), eq(account.providerId, "google"))
            );

          if (!existingToken?.refreshToken) {
            throw new NonRetryableError("no refresh token found - gmail");
          }

          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID,
              client_secret: process.env.GOOGLE_CLIENT_SECRET,
              refresh_token: existingToken?.refreshToken!,
              grant_type: "refresh_token",
            }),
          });

          if (response.ok) {
            const data = (await response.json()) as any;
            return {
              accessToken: data?.access_token as string,
              refreshToken: existingToken?.refreshToken,
            };
          }

          return {
            accessToken: existingToken?.accessToken,
            refreshToken: existingToken?.refreshToken,
          };
        } catch (e) {
          console.error(e);
          await breakIntegration({ integrationId });
          throw new Error("failed to refresh access token");
        }
      }
    );

    await step.do(
      "send-email",
      {
        retries: { delay: 20000, limit: 4, backoff: "exponential" },
        timeout: "20 minutes",
      },
      async () => {
        try {
          const db = await getDb();
          const [userDetails] = await db
            .select({ name: user.name, email: user.email })
            .from(user)
            .where(eq(user.id, userId));

          const html = getPersonalHtmlEmailStr({
            name: userDetails.name,
            formName: transformedValues.formName,
            formId: formId,
            workspace: transformedValues.workspace,
            values: transformedValues?.valuesObj,
            body: emailData?.body,
          });

          const msg = createMimeMessage();
          msg.setSender({ addr: userDetails.email, name: userDetails.name });
          msg.setRecipient({ addr: userDetails.email });

          msg.setSubject(
            emailData?.subject ||
              `${transformedValues.formName} got new submissions`
          );
          msg.addMessage({
            contentType: "text/html",
            data:
              html ||
              `<div>You have new form submissions for form ${transformedValues.formName}</div>`,
          });

          const auth = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          });

          auth.credentials.access_token = refreshedAccessToken?.accessToken;
          auth.credentials.refresh_token = refreshedAccessToken?.refreshToken;

          const emailStr = msg.asEncoded();
          const gmailClient = gmail({ version: "v1", auth });
          const res = await gmailClient.users.messages.send({
            userId: "me",
            requestBody: { raw: emailStr },
          });

          if (res.ok) {
            console.log("Gmail notification sent successfully");
          }
        } catch (e) {
          console.error(e);
          await breakIntegration({ integrationId });
          throw new Error("failed to send gmail notification");
        }
      }
    );
  }
}

export class GmailWorkflow extends WorkflowEntrypoint {
  async run(
    event: Readonly<WorkflowEvent<IGmailSendWorkflowParams>>,
    step: WorkflowStep
  ) {
    const { emailData, formId, integrationId, userId, values } = event.payload;

    if (!userId || !formId || !integrationId || !values || !emailData) {
      throw new NonRetryableError("formId or user Id doesn't exist");
    }

    console.log("initialising gmail workflow", integrationId);

    const transformedValues = await step.do(
      "process-and-transform-submissions-values",
      async () => {
        try {
          const db = await getDb();
          const formFields = await db
            .select({
              id: formFieldTable.id,
              label: formFieldTable.label,
              index: formFieldTable.order,
              formName: formTable.name,
              workspace: formTable.workspace,
            })
            .from(formFieldTable)
            .innerJoin(formTable, eq(formTable.shortId, formId))
            .where(eq(formFieldTable.form, formId));
          const valuesObj = {} as Record<string, string>;
          const form = formFields[0];

          for (const item of values) {
            const formField = formFields?.find(
              (f) => f?.id === item?.form_field
            );

            if (valuesObj[formField?.label as string]) {
              const key = `${formField?.index}` + `${formField?.label}`;
              valuesObj[key] = item?.value || ("no value" as string);
              continue;
            }

            valuesObj[formField?.label as string] = item?.value || "no value";
          }

          return {
            valuesObj,
            formName: form?.formName,
            workspace: form?.workspace,
          };
        } catch (e) {
          console.error(e);
          throw new Error("failed to process submission values");
        }
      }
    );

    const refreshedAccessToken = await step.do(
      "refresh-access-token",
      async () => {
        try {
          const db = await getDb();
          const [existingToken] = await db
            .select()
            .from(account)
            .where(
              and(eq(account.userId, userId), eq(account.providerId, "google"))
            );

          if (!existingToken?.refreshToken) {
            throw new NonRetryableError("no refresh token found - gmail");
          }

          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID,
              client_secret: process.env.GOOGLE_CLIENT_SECRET,
              refresh_token: existingToken?.refreshToken!,
              grant_type: "refresh_token",
            }),
          });

          if (response.ok) {
            const data = (await response.json()) as any;
            return {
              accessToken: data?.access_token as string,
              refreshToken: existingToken?.refreshToken,
            };
          }

          return {
            accessToken: existingToken?.accessToken,
            refreshToken: existingToken?.refreshToken,
          };
        } catch (e) {
          console.error(e);
          await breakIntegration({ integrationId });
          throw new Error("failed to refresh access token");
        }
      }
    );

    await step.do(
      `send-gmail`,
      {
        retries: { delay: 20000, limit: 4, backoff: "exponential" },
        timeout: "20 minutes",
      },
      async () => {
        try {
          const emailSchema = z.email();
          const toEmail = values?.find((v) => v.form_field === emailData.to);

          if (!toEmail?.value) {
            throw new NonRetryableError(
              "to email not found in submission values"
            );
          }
          const { success } = emailSchema.safeParse(toEmail?.value);
          if (!success) {
            throw new NonRetryableError(
              "not valid email found in submission values"
            );
          }

          const db = await getDb();
          const [userDetails] = await db
            .select({ name: user.name, email: user.email })
            .from(user)
            .where(eq(user.id, userId));

          const msg = createMimeMessage();
          msg.setSender({ addr: userDetails.email, name: userDetails.name });
          msg.setRecipient({ addr: toEmail.value });
          msg.setSubject(
            emailData?.subject || `Submission for ${transformedValues.formName}`
          );
          msg.addMessage({
            contentType: "text/html",
            data: emailData?.body || "Thank you for submission",
          });

          const auth = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          });

          auth.credentials.access_token = refreshedAccessToken?.accessToken;
          auth.credentials.refresh_token = refreshedAccessToken?.refreshToken;

          const emailStr = msg.asEncoded();
          const gmailClient = gmail({ version: "v1", auth });
          const res = await gmailClient.users.messages.send({
            userId: "me",
            requestBody: { raw: emailStr },
          });
          if (res.ok) {
            console.log("Gmail sent successfully");
          }
        } catch (e) {
          console.error(e);
          await breakIntegration({ integrationId });
          throw new Error("failed to send email");
        }
      }
    );
  }
}
