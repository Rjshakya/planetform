import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep,
} from "cloudflare:workers";
import { Result } from "better-result";
import type { response as responsesTable } from "../db/schema/response";
import { GoogleSheetService } from "../services/google/sheet";
import { getUserCredentials } from "../utils/auth";
import { getSheetHeader, getSubmissionRecord } from "./helpers";

export interface IgoogleSheetIntegrationWorkflowParams {
	userId: string;
	formId: string;
	values: (typeof responsesTable.$inferInsert)[];
	spreadSheetId: string;
	integrationId: string;
}

export class GoogleSheetIntegrationWorkflow extends WorkflowEntrypoint<IgoogleSheetIntegrationWorkflowParams> {
	async run(
		event: Readonly<WorkflowEvent<IgoogleSheetIntegrationWorkflowParams>>,
		step: WorkflowStep,
	) {
		const { formId, userId, values, spreadSheetId, integrationId } =
			event.payload;

		if (!formId || !userId || !values || !spreadSheetId || !integrationId) {
			console.error(
				"payload is missing , returning from google sheet workflow",
			);
			return;
		}

		const userCredentials = await step.do("get-user-credentiasls", async () => {
			const credentialsResult = await getUserCredentials(userId, "google");

			if (Result.isOk(credentialsResult)) {
				return credentialsResult.value;
			} else {
				throw new Error("failed to get user credentials");
			}
		});

		await step.do("set-sheet-header", async () => {
			const headers = await getSheetHeader(formId);
			const sheetService = new GoogleSheetService({
				userID: userId,
				accessToken: userCredentials.accessToken,
				refreshToken: userCredentials.refreshToken!,
			});
			await sheetService.setHeader(spreadSheetId, headers.headers);
		});

		await step.do("set-sheet-row", async () => {
			const submission = await getSubmissionRecord({
				formId,
				values,
				shouldKeyIncludeIndex: true,
			});
			const sheetService = new GoogleSheetService({
				userID: userId,
				accessToken: userCredentials.accessToken,
				refreshToken: userCredentials.refreshToken!,
			});
			await sheetService.addRow(spreadSheetId, submission.submission);
		});
	}
}
