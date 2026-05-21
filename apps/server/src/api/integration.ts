import { zValidator } from "@hono/zod-validator";
import { Result } from "better-result";
import { Hono } from "hono";
import z from "zod";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  CreateEmailNotificationIntegrationServiceSchema,
  CreateEmailToRespondentIntegrationSchema,
  CreateGmailIntegrationServiceSchema,
  CreateNotionIntegrationServiceSchema,
  CreateSheetIntegrationServiceSchema,
  CreateSlackIntegrationSchema,
  createEmailNotificationIntegrationService,
  createEmailToRespondentIntegrationService,
  createGmailIntegrationService,
  createNotionIntegrationService,
  createSheetIntegrationService,
  createSlackIntegration,
  createWebHookIntegrationService,
  createWebHookIntegrationServiceSchema,
  deleteIntegrationService,
  getIntegrationsService,
  getSlackChannels,
} from "../services/integration";
import { SlackOauthService } from "../services/slack/oauth";
import { env } from "cloudflare:workers";
import { ApiResponse } from "../utils/api";
import { canCreateEmailIntegrationMiddleware } from "../middlewares/billingGates";

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
  .post(
    "/slack/auth",
    zValidator(
      "json",
      z.object({
        callBackUrl: z
          .url()
          .optional()
          .refine((arg) => {
            if (!arg) return true;
            return new URL(arg).origin === env.FRONTEND_URL;
          }),
        scopes: z.array(z.string()),
      }),
    ),
    async (c) => {
      const { callBackUrl, scopes } = c.req.valid("json");
      const userId = c.get("userId");
      const slackOauth = new SlackOauthService({ scopes, userId });
      const redirectUrl = slackOauth.getAuthorizationUrl(callBackUrl);
      return c.json({ url: redirectUrl });
    },
  )
  .get("/slack/verify", async (c) => {
    const url = new URL(c.req.url);
    const userId = c.get("userId");
    const slackOauth = new SlackOauthService({ userId });
    const verify = await slackOauth.verifySlackToken(url);

    if ("data" in verify) {
      await slackOauth.saveAccount({ userId, ...verify.data });
      if (verify?.callbackURL) {
        return c.redirect(verify.callbackURL);
      }
    }

    return c.html(`
          <html>
            <body>
              <p>Integration successful! Closing window...</p>
              <script>
                window.close();
              </script>
            </body>
          </html>`);
  })

  // Slack routes
  .get("/slack/channels", async (c) => {
    const userId = c.get("userId");
    const result = await getSlackChannels(userId);

    if (Result.isOk(result)) {
      return c.json({ channels: result.value }, 200);
    }
    return c.json(result.error, 400);
  })

  .post(
    "/slack",
    zValidator("json", CreateSlackIntegrationSchema),
    async (c) => {
      const userId = c.get("userId");
      const params = c.req.valid("json");
      const result = await createSlackIntegration({
        ...params,
        userId,
      });

      if (Result.isOk(result)) {
        return c.json(result.value, 200);
      }
      return c.json(result.error, 400);
    },
  )
  .post(
    "/email-to-respondent",
    zValidator("json", CreateEmailToRespondentIntegrationSchema),
    canCreateEmailIntegrationMiddleware,
    async (c) => {
      const params = c.req.valid("json");
      const res = await createEmailToRespondentIntegrationService(params);
      const data = res.match({
        ok: (v) => v,
        err: (e) => {
          throw e;
        },
      });
      return c.json(ApiResponse({ data, message: "integration-created" }), 200);
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
