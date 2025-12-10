import {
  env,
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from "cloudflare:workers";
import { NonRetryableError } from "cloudflare:workflows";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { OAuth2Tokens } from "better-auth";
import { OAuth2Client } from "google-auth-library";
import { response as responsesTable } from "../db/schema/response";
import { getDb } from "../db/config";
import { formField as formFieldTable } from "../db/schema/form.fields";
import { and, desc, eq } from "drizzle-orm";
import logger from "../utils/logger";
import { account, user } from "../db/schema/auth";
import { breakIntegration } from "../utils/breakIntegration";

export interface IgoogleSheetWorkflowParams {
  userId: string;
  formId: string;
  values: (typeof responsesTable.$inferInsert)[];
  spreadSheetId: string;
  integrationId:string
}

export class GoogleSheetWorkflow extends WorkflowEntrypoint<IgoogleSheetWorkflowParams> {
  async run(
    event: Readonly<WorkflowEvent<IgoogleSheetWorkflowParams>>,
    step: WorkflowStep
  ) {
    const { formId, userId, values, spreadSheetId , integrationId } = event.payload;

    if (!formId || !userId || !values || !spreadSheetId || !integrationId) {
      throw new NonRetryableError("formId or userId doesn't exist");
    }

    const formFields = await step.do(`get-form-fields`, async () => {
      try {
        const db = await getDb();

        return await db
          .select({
            label: formFieldTable.label,
            id: formFieldTable.id,
            index: formFieldTable.order,
          })
          .from(formFieldTable)
          .where(eq(formFieldTable.form, formId))
          .orderBy(formFieldTable.order);
      } catch (e) {
        throw new Error("failed to get-form-fields");
      }
    });

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

    await step.do("write-to-header-values-to-googleSheet", async () => {
      try {
        const auth = new OAuth2Client({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        });

        auth.credentials.access_token = refreshedAccessToken.accessToken;
        auth.credentials.refresh_token = refreshedAccessToken.refreshToken;

        const doc = new GoogleSpreadsheet(spreadSheetId, auth);

        await doc.loadInfo(); // loads sheets

        const sheet = doc?.sheetsByIndex[0];
        // using prefix index so that , even duplicate lables , can process
        const fields = formFields?.map((h) => `${h.index}_${h.label?.trim()}`);

        await sheet.setHeaderRow(fields);
        return true;
      } catch (e) {
        console.log(e);
        await breakIntegration({ integrationId });
        throw new Error("failed-write-to-header-values-to-googleSheet");
      }
    });

    const submissions = await step.do("process-submission-values", async () => {
      try {
        const processed = {} as Record<any, any>;
        for (const val of values) {
          const formField = formFields.find((f) => f.id == val.form_field);
          const index = formField?.index?.toString() || "";
          // using prefix index so that , even duplicate lables , can process
          const key = `${index}_${formField?.label?.trim()}` || "";
          processed[key] = val?.value?.trim();
        }

        return processed;
      } catch (e) {
        throw new Error("failed to process values");
      }
    });

    await step.do("write-to-submissions-values-to-googleSheet", async () => {
      try {
        const auth = new OAuth2Client({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        });

        auth.credentials.access_token = refreshedAccessToken.accessToken;
        auth.credentials.refresh_token = refreshedAccessToken.refreshToken;

        const doc = new GoogleSpreadsheet(spreadSheetId, auth);
        await doc.loadInfo(); // loads sheets
        const sheet = doc.sheetsByIndex[0];
        await sheet.loadHeaderRow();

        await sheet.addRow(submissions);

        return true;
      } catch (e) {
        await breakIntegration({ integrationId });
        throw new Error("failed to write-to-submissions-values-to-googleSheet");
      }
    });
  }
}
