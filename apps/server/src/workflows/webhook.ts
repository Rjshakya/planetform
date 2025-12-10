import {
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from "cloudflare:workers";
import { response as responsesTable } from "../db/schema/response";
import { NonRetryableError } from "cloudflare:workflows";
import { getDb } from "../db/config";
import { formField as formFieldTable } from "../db/schema/form.fields";
import { eq } from "drizzle-orm";
import { breakIntegration } from "../utils/breakIntegration";
import { error } from "console";

export interface IWebHookFlowParams {
  formId: string;
  values: (typeof responsesTable.$inferInsert)[];
  url: string;
  respondentId: string;
  integrationId: string;
}

export class WebHookFlow extends WorkflowEntrypoint {
  async run(
    event: Readonly<WorkflowEvent<IWebHookFlowParams>>,
    step: WorkflowStep
  ) {
    const { formId, url, respondentId, values, integrationId } = event?.payload;
    if (!formId || !url || !respondentId || !values || values?.length === 0) {
      throw new NonRetryableError("payload is missing");
    }

    const formFields = await step.do(`get-submission-form-fields`, async () => {
      try {
        const db = await getDb();
        const fields = await db
          .select({
            id: formFieldTable.id,
            label: formFieldTable.label,
            index: formFieldTable.order,
          })
          .from(formFieldTable)
          .where(eq(formFieldTable.form, formId));

        return fields;
      } catch (e) {
        console.log(e);
        throw new Error(`failed to get headers`);
      }
    });

    await step.do(`send-submission-data`, async () => {
      try {
        const submission = {} as Record<string, string>;
        for (const val of values) {
          const field = formFields?.find((h) => h.id === val?.form_field);
          const index = field?.index?.toString() || "";
          const key = `${index}_${field?.label}` || "";
          submission[key] = val.value as string;
        }
        const req = await fetch(url, {
          body: JSON.stringify(submission),
          method: "POST",
        });
        if (req.ok) {
          console.log(`webhook-workflow-${event.instanceId}`, req.status);
        } else {
          console.log(`webhook-workflow-${event.instanceId}`, req.status);
          throw error;
        }

        return "Done";
      } catch (e) {
        console.log(e);
        await breakIntegration({ integrationId });
        throw new Error("failed send-submission-data");
      }
    });
  }
}
