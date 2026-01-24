import {
	WorkflowEntrypoint,
	type WorkflowEvent,
	type WorkflowStep,
} from "cloudflare:workers";
import { Result } from "better-result";
import type { response as responsesTable } from "../db/schema/response";
import { NotionIntegrationService } from "../services/notion/notion";
import { getUserCredentials } from "../utils/auth";
import { breakIntegration } from "../utils/breakIntegration";
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
			if (Result.isOk(credentialsResult)) {
				return credentialsResult.value;
			} else {
				throw new Error("failed to get credentials");
			}
		});

		await step.do("set-notion-db-header", async () => {
			const notion = new NotionIntegrationService({
				token: credentials.accessToken,
			});

			const dbResult = await notion.search({})
			const db = dbResult.unwrap()
			console.log(db);




		})



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
