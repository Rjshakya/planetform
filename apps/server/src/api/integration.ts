import { Hono } from "hono";
import { authMiddleware } from "../middlewares/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { integrationObject } from "../utils/validation";
import {
  createGmailIntegrationService,
  createGmailNotifyIntegrationService,
  createNotionPageService,
  createSheetIntegrationService,
  createWebHookIntegrationService,
  deleteIntegrationService,
  getIntegrationsService,
} from "../services/integration";
import z, { object } from "zod";

const integration = new Hono<{
  Variables: {
    userId: string | null;
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
    }
  )

  .post("/sheet", zValidator("json", integrationObject), async (c) => {
    const userId = c.get("userId");
    const params = c.req.valid("json");
    const sheet = await createSheetIntegrationService(params, userId!);
    return c.json({ data: sheet }, 200);
  })

  .post(
    "/notion/page",
    zValidator(
      "json",
      z.object({
        formId: z.string().nonempty(),
        customerId: z.string().nonempty(),
        metaData: z.string().nonempty(),
      })
    ),
    async (c) => {
      const userId = c.get("userId");
      const params = c.req.valid("json");
      const res = await createNotionPageService({ ...params, userId: userId! });
      return c.json({ res }, 200);
    }
  )

  .post(
    "/webhook",
    zValidator(
      "json",
      z.object({
        formId: z.string().nonempty(),
        customerId: z.string().nonempty(),
        metaData: z.string().nonempty(),
      })
    ),
    async (c) => {
      const params = c.req.valid("json");
      await createWebHookIntegrationService(params);
      return c.json(
        { message: "Webhook integration created successfully" },
        200
      );
    }
  )

  .post(
    "/gmail-notify",
    zValidator(
      "json",
      z.object({
        formId: z.string().nonempty(),
        customerId: z.string().nonempty(),
        metaData: z.string().nonempty(),
      })
    ),
    async (c) => {
      const params = c.req.valid("json");
      const integration = await createGmailNotifyIntegrationService(params);
      if (!integration) {
        return c.json(
          { message: "Failed to create gmail notification integration" },
          400
        );
      }
      return c.json(
        { message: "Gmail Notify integration created successfully" },
        200
      );
    }
  )

  .post(
    "/gmail",
    zValidator(
      "json",
      z.object({
        metaData: z.string(),
        formId: z.string().nonempty(),
        customerId: z.string().nonempty(),
      })
    ),
    async (c) => {
      const params = c.req.valid("json");
      const integration = await createGmailIntegrationService(params);

      if (!integration) {
        return c.json({ message: "Failed to create gmail integration" }, 400);
      }

      return c.json({ integration }, 200);
    }
  )

  .delete(
    "/:integrationId",
    zValidator(
      "param",
      z.object({ integrationId: z.string().nonempty().nonoptional() })
    ),
    async (c) => {
      const { integrationId } = c.req.valid("param");
      await deleteIntegrationService(integrationId);
      return c.json({ message: "Integration deleted successfully" }, 200);
    }
  );

export default integration;
