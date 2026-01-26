import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import z from "zod";
import { getDb } from "../db/config";
import type { response } from "../db/schema/response";
import {
	GMAIL_INTEGRATION_TYPE,
	NOTION_INTEGRATION_TYPE,
	SHEET_INTEGRATION_TYPE,
	WEBHOOK_INTEGRATION_TYPE,
} from "../services/integration";

export type IntegrationQueueMesssage = {
	formId: string;
	values: (typeof response.$inferInsert)[];
	userId: string;
	respondentId: string;
	integrationId: string;
	metaData: string | null;
	type: string
};

export const webhookMetaDataSchema = z.object({
	url: z.url(),
	headers: z.object().optional(),
});

export const gmailMetaDataSchema = z.object({
	from: z.string(),
	to: z.string(),
	subject: z.string(),
	body: z.string(),
	isDynamicBody: z.boolean(),
});

export const handleIntegrationQueue = async (messages: readonly Message<IntegrationQueueMesssage>[]) => {

	for (const message of messages) {
		console.log(message);

		const { formId, values, userId, respondentId, integrationId, metaData, type } = message.body

		const parsedMetaData = JSON.parse(metaData || "{}");
		const idFromMetaData = parsedMetaData?.id?.trim();

		if (type === SHEET_INTEGRATION_TYPE) {
			if (!idFromMetaData) continue;
			// we will google sheet workflow
			await env.GOOGLE_SHEET_INTEGRATION_WORKFLOW.create({
				id: `${respondentId}-sheet-${integrationId}`,
				params: {
					formId,
					integrationId,
					userId,
					values,
					spreadSheetId: idFromMetaData,
				},
			});
		}

		if (type === NOTION_INTEGRATION_TYPE) {
			if (!idFromMetaData) continue;
			// we will notion workflow
			await env.NOTION_INTEGRATION_WORKFLOW.create({
				id: `${respondentId}-notion-${integrationId}`,
				params: {
					formId,
					integrationId,
					respondentId,
					values,
					userId,
					pageId: idFromMetaData,
				},
			});
		}

		if (type === WEBHOOK_INTEGRATION_TYPE) {
			// we will webhook workflow

			const { success, data } = webhookMetaDataSchema.safeParse(parsedMetaData);

			if (!success) continue;

			await env.WEBHOOK_INTEGRATION_WORKFLOW.create({
				id: `${respondentId}-webhook-${integrationId}`,
				params: {
					formId,
					integrationId,
					respondentId,
					values,
					...data,
				},
			});
		}

		if (type === GMAIL_INTEGRATION_TYPE) {
			const { success, data } = gmailMetaDataSchema.safeParse(parsedMetaData);
			if (!success) continue;

			await env.GMAIL_INTEGRATION_WORKFLOW.create({
				id: `${respondentId}-gmail-${integrationId}`,
				params: {
					formId,
					integrationId,
					userId,
					values,
					metaData: data,
				},
			});
		}
	}

	return true;
};
