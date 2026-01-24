import { env } from "cloudflare:workers";
import { Client } from "@notionhq/client";
import { Err, Result } from "better-result";
import { and, count, eq } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import z from "zod";
import { getDb } from "../db/config";
import { account, user } from "../db/schema/auth";
import { form as formTable } from "../db/schema/form";
import { integration as integrationTable } from "../db/schema/integration";
import { IntegrationServiceError } from "../errors";
import { getAuth, getUserCredentials } from "../utils/auth";
import { commonCatch } from "../utils/error";
import { getNotionInitialDataSource } from "../workflows/helpers";
import { GoogleSheetService } from "./google/sheet";
import { NotionIntegrationService } from "./notion/notion";
import type { WebhookData } from "./webhook/webhook";

export const SHEET_INTEGRATION_TYPE = "sheets";
export const NOTION_INTEGRATION_TYPE = "notion";
export const WEBHOOK_INTEGRATION_TYPE = "webhook";
export const GMAIL_INTEGRATION_TYPE = "gmail";
export const EMAIL_NOTIFICATION_TYPE = "email-notification";
export const EMAIL_TO_RESPONDENT_INTEGRATION = "email-to-respondent";
export const SLACK_INTEGRATION_TYPE = "slack";

type CreateSheetIntegrationServiceParams = {
	formId: string;
	userId: string;
	sheetTitle: string;
};

export const CreateSheetIntegrationServiceSchema = z.object({
	formId: z.string(),
	sheetTitle: z.string(),
	userId: z.string(),
});

export type SheetIntegrationMetaData = {
	id: string;
	url: string;
};

export const createSheetIntegrationService = async (
	params: CreateSheetIntegrationServiceParams,
) => {
	return Result.tryPromise({
		try: async () => {
			const { formId, userId, sheetTitle } = params;

			const tokens = (await getUserCredentials(userId, "google")).unwrap();

			const sheetService = new GoogleSheetService({
				accessToken: tokens.accessToken,
				refreshToken: tokens.refreshToken as string,
				userID: userId,
			});

			const createSheet = (await sheetService.createSheet(sheetTitle)).unwrap();
			const sheetId = createSheet.spreadsheetId;
			const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit`;
			const metaData = { id: sheetId, url: sheetUrl };

			// insert in db

			const db = await getDb();
			const [createIntegration] = await db
				.insert(integrationTable)
				.values({
					formId,
					type: SHEET_INTEGRATION_TYPE,
					metaData: JSON.stringify(metaData),
				})
				.returning();

			return {
				id: createIntegration.id,
				sheetId,
				sheetUrl,
			};
		},
		catch: (e) =>
			new IntegrationServiceError({
				cause: e,
				operation: "createSheetIntegrationService",
			}),
	});
};

type CreateNotionIntegrationServiceParams = {
	formId: string;
	formFields: { id: string; label: string; type: string; order: number }[];
	userId: string;
	title: string;
};

export const CreateNotionIntegrationServiceSchema = z.object({
	formId: z.string(),
	formFields: z.array(
		z.object({
			id: z.string(),
			label: z.string(),
			type: z.string(),
			order: z.number(),
		}),
	),
	title: z.string(),
});

export const createNotionIntegrationService = async (
	params: CreateNotionIntegrationServiceParams,
) => {
	return Result.tryPromise({
		try: async () => {
			const { formFields, formId, userId, title } = params;
			const tokenResult = await getUserCredentials(userId, "notion");
			const tokens = tokenResult.unwrap();

			const notion = new NotionIntegrationService({
				token: tokens.accessToken,
			});

			const properties = getNotionInitialDataSource(formFields);

			const createNotionDb = (
				await notion.createDatabase({
					parent: { type: "workspace", workspace: true },
					title: [{ type: "text", text: { content: title } }],
					initial_data_source: { properties },
				})
			).unwrap();

			if (!createNotionDb.id) {
				throw new Error("failed to create notion db");
			}

			const db = await getDb();
			const metaData = {
				url: `https://www.notion.so/${createNotionDb.id}`,
				id: createNotionDb.id,
			};
			const [integrate] = await db
				.insert(integrationTable)
				.values({
					formId,
					type: NOTION_INTEGRATION_TYPE,
					metaData: JSON.stringify(metaData),
				})
				.returning({ id: integrationTable.id });

			return { ...integrate, url: metaData.url };
		},
		catch: (e) =>
			new IntegrationServiceError({
				cause: e,
				operation: "createNotionIntegrationService",
			}),
	});
};

export const createWebHookIntegrationServiceSchema = z.object({
	formId: z.string(),
	url: z.url(),
	headers: z.object(),
});

export const createWebHookIntegrationService = async (
	params: WebhookData & { formId: string },
) => {
	return Result.tryPromise({
		try: async () => {
			const { formId, url, headers } = params;
			const metaData = { url, headers };
			const db = await getDb();

			// insert in db

			const [integrate] = await db
				.insert(integrationTable)
				.values({
					formId,
					type: WEBHOOK_INTEGRATION_TYPE,
					metaData: JSON.stringify(metaData),
				})
				.returning({ id: integrationTable.id });

			return { ...integrate, url, headers };
		},
		catch: (e) =>
			new IntegrationServiceError({
				cause: e,
				operation: "createWebHookIntegrationService",
			}),
	});
};

type CreateGmailIntegrationServiceParams = {
	formId: string;
	from: string;
	to: string;
	subject: string;
	body: string;
	isDynamicBody: boolean;
};

export const CreateGmailIntegrationServiceSchema = z.object({
	formId: z.string(),
	from: z.string(),
	to: z.string(),
	subject: z.string(),
	body: z.string(),
	isDynamicBody: z.boolean(),
});

export const createGmailIntegrationService = (
	params: CreateGmailIntegrationServiceParams,
) => {
	return Result.tryPromise({
		try: async () => {
			const { body, formId, from, isDynamicBody, subject, to } = params;

			const db = await getDb();
			const existingGmailIntegrations = await db
				.select({ id: integrationTable.id })
				.from(integrationTable)
				.where(
					and(
						eq(integrationTable.formId, formId),
						eq(integrationTable.type, GMAIL_INTEGRATION_TYPE),
					),
				);

			if (existingGmailIntegrations.length > 0) {
				throw new Error("gmail integration exist");
			}

			const metaData = {
				from,
				to,
				subject,
				body,
				isDynamicBody,
			};

			// insert in db

			const [integrate] = await db
				.insert(integrationTable)
				.values({
					formId,
					type: GMAIL_INTEGRATION_TYPE,
					metaData: JSON.stringify(metaData),
				})
				.returning({ id: integrationTable.id });

			return { ...integrate };
		},
		catch: (e) =>
			new IntegrationServiceError({
				cause: e,
				operation: "createGmailIntegrationService",
			}),
	});
};

type CreateEmailNotificationIntegrationServiceParams = {
	userId: string;
	subject: string;
	body: string;
	formId: string;
};

export const CreateEmailNotificationIntegrationServiceSchema = z.object({
	subject: z.string(),
	body: z.string(),
	formId: z.string(),
});

export const createEmailNotificationIntegrationService = (
	params: CreateEmailNotificationIntegrationServiceParams,
) => {
	return Result.tryPromise({
		try: async () => {
			const { body, formId, subject, userId } = params;

			const db = await getDb();

			// find existing
			const existingIntegration = await db
				.select({ id: integrationTable.id })
				.from(integrationTable)
				.where(
					and(
						eq(integrationTable.formId, formId),
						eq(integrationTable.type, EMAIL_NOTIFICATION_TYPE),
					),
				);

			if (existingIntegration.length > 0) {
				throw new Error("failed to createEmailNotificationIntegrationService");
			}

			// get user email

			const [email] = await db
				.select({ email: user.email })
				.from(user)
				.where(eq(user.id, userId));

			if (!email) {
				throw new Error("user doesn't exist");
			}

			const metaData = {
				to: email,
				from: env.PLANETFORM_EMAIL_NOTIFICATION_ADDRESS,
				subject,
				body,
			};

			// insert in db
			const [integrate] = await db
				.insert(integrationTable)
				.values({
					formId,
					type: EMAIL_NOTIFICATION_TYPE,
					metaData: JSON.stringify(metaData),
				})
				.returning({ id: integrationTable.id });

			return { ...integrate };
		},
		catch: (e) =>
			new IntegrationServiceError({
				cause: e,
				operation: "createEmailNotificationIntegrationService",
			}),
	});
};

type CreateEmailToRespondentIntegrationParams = {
	formId: string;
	emailFormFieldId: string;
	subject: string;
	body: string;
};

export const CreateEmailToRespondentIntegrationSchema = z.object({
	formId: z.string(),
	emailFormFieldId: z.string(),
	subject: z.string(),
	body: z.string(),
});

export const createEmailToRespondentIntegrationParams = (
	params: CreateEmailToRespondentIntegrationParams,
) => {
	return Result.tryPromise({
		try: async () => {
			const { body, emailFormFieldId, formId, subject } = params;

			const db = await getDb();

			// find existing

			const existingIntegration = await db
				.select({ id: integrationTable.id })
				.from(integrationTable)
				.where(
					and(
						eq(integrationTable.formId, formId),
						eq(integrationTable.type, EMAIL_TO_RESPONDENT_INTEGRATION),
					),
				);

			if (existingIntegration.length > 0) {
				throw new Error("createEmailToRespondentIntegrationParams");
			}

			// insert in db

			const metaData = {
				emailFormFieldId,
				from: env.PLANETFORM_EMAIL_NOTIFICATION_ADDRESS,
				subject,
				body,
			};

			const [integrate] = await db
				.insert(integrationTable)
				.values({
					formId,
					type: EMAIL_TO_RESPONDENT_INTEGRATION,
					metaData: JSON.stringify(metaData),
				})
				.returning({ id: integrationTable.id });

			return { ...integrate };
		},

		catch: (e) =>
			new IntegrationServiceError({
				cause: e,
				operation: "createEmailToRespondentIntegrationParams",
			}),
	});
};

export const deleteIntegrationService = async (integrationId: string) => {
	try {
		const db = await getDb();
		await db
			.delete(integrationTable)
			.where(eq(integrationTable.id, integrationId));
	} catch (e) {
		commonCatch(e);
	}
};

export const getIntegrationsService = async (formId: string) => {
	try {
		const db = await getDb();
		const res = await db.query.form.findFirst({
			where: eq(formTable.shortId, formId),
			columns: {
				name: true,
				shortId: true,
				createdAt: true,
				updatedAt: true,
			},
			with: {
				integrations: {
					columns: {
						id: true,
						metaData: true,
						type: true,
					},
				},
			},
		});

		return res;
	} catch (error) {
		commonCatch(error);
	}
};
