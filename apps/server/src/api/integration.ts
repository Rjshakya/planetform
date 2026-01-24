import { zValidator } from "@hono/zod-validator";
import { Result } from "better-result";
import { Hono } from "hono";
import z from "zod";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
	CreateEmailNotificationIntegrationServiceSchema,
	CreateGmailIntegrationServiceSchema,
	CreateNotionIntegrationServiceSchema,
	CreateSheetIntegrationServiceSchema,
	createEmailNotificationIntegrationService,
	createGmailIntegrationService,
	createNotionIntegrationService,
	createSheetIntegrationService,
	createWebHookIntegrationService,
	createWebHookIntegrationServiceSchema,
	deleteIntegrationService,
	getIntegrationsService,
} from "../services/integration";

const integration = new Hono<{
	Variables: {
		userId: string;
	};
}>()

	.use(authMiddleware)
	.get(
		"/:formId",
		zValidator("param", z.object({ formId: z.string().nonempty() })),
		async (c) => {
			const { formId } = c.req.valid("param");
			const integrations = await getIntegrationsService(formId);
			return c.json({ integrations }, 200);
		},
	)

	.post(
		"/sheet",
		zValidator("json", CreateSheetIntegrationServiceSchema),
		async (c) => {
			const params = c.req.valid("json");
			const service = await createSheetIntegrationService(params);

			if (Result.isOk(service)) {
				const sheet = service.value;
				return c.json(sheet, 200);
			}

			return c.json(service.error, 400);
		},
	)
	.post(
		"/notion",
		zValidator("json", CreateNotionIntegrationServiceSchema),
		async (c) => {
			const userId = c.get("userId");
			const params = c.req.valid("json");
			const service = await createNotionIntegrationService({
				...params,
				userId,
			});

			if (Result.isOk(service)) {
				const doc = service.value;
				return c.json(doc, 200);
			}

			return c.json(service.error, 400);
		},
	)

	.post(
		"/webhook",
		zValidator("json", createWebHookIntegrationServiceSchema),
		async (c) => {
			const params = c.req.valid("json");
			const service = await createWebHookIntegrationService(params);
			if (Result.isOk(service)) {
				const sheet = service.value;
				return c.json(sheet, 200);
			}

			return c.json(service.error, 400);
		},
	)

	.post(
		"/email-notification",
		zValidator("json", CreateEmailNotificationIntegrationServiceSchema),
		async (c) => {
			const userId = c.get("userId");
			const params = c.req.valid("json");
			const service = await createEmailNotificationIntegrationService({
				...params,
				userId,
			});

			if (Result.isOk(service)) {
				const sheet = service.value;
				return c.json(sheet, 200);
			}

			return c.json(service.error, 400);
		},
	)

	.post(
		"/gmail",
		zValidator("json", CreateGmailIntegrationServiceSchema),
		async (c) => {
			const params = c.req.valid("json");
			const service = await createGmailIntegrationService(params);
			if (Result.isOk(service)) {
				const sheet = service.value;
				return c.json(sheet, 200);
			}

			return c.json(service.error, 400);
		},
	)

	.delete(
		"/:integrationId",
		zValidator(
			"param",
			z.object({ integrationId: z.string().nonempty().nonoptional() }),
		),
		async (c) => {
			const { integrationId } = c.req.valid("param");
			await deleteIntegrationService(integrationId);
			return c.json({ message: "Integration deleted successfully" }, 200);
		},
	);

export default integration;
