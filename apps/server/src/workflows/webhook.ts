import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep,
} from "cloudflare:workers";
import type { response as responsesTable } from "../db/schema/response";
import { WebhookIntegrationService } from "../services/webhook/webhook";
import { getSubmissionRecord } from "./helpers";

export interface IWebHookIntegrationWorkFlowParams {
	formId: string;
	values: (typeof responsesTable.$inferInsert)[];
	respondentId: string;
	integrationId: string;
	url: string;
	headers?: Record<string, string>;
}

export class WebHookIntegrationWorkflow extends WorkflowEntrypoint {
	async run(
		event: Readonly<WorkflowEvent<IWebHookIntegrationWorkFlowParams>>,
		step: WorkflowStep,
	) {
		const { formId, url, values, headers } = event.payload;

		const submission = await step.do("get-submission-record", async () => {
			return await getSubmissionRecord({
				formId,
				values,
				shouldKeyIncludeIndex: false,
			});
		});

		await step.do("send-webhook", async () => {
			await WebhookIntegrationService.send(
				{ url, headers },
				submission.submission,
			);
		});
	}
}
