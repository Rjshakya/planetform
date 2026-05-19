import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import api from "./api";
import { wideLogger } from "hono-wide-logger";
import { getAuth } from "./utils/auth";
import {
  GmailIntegrationWorkflow,
  GoogleSheetIntegrationWorkflow,
  NotionIntegrationWorkflow,
  SlackIntegrationWorkflow,
  WebHookIntegrationWorkflow,
  EmailIntegrationWorkflow,
  CustomerOnboardingWorkflow,
} from "./workflows";
import {
  handleIntegrationQueue,
  type IntegrationQueueMesssage,
} from "./queues/integration-queue";

const trusted_domain = process.env.TRUSTED_DOMAIN;

// Define public routes that allow any origin
const publicRoutes: RegExp[] = [
  /^\/api\/form\/[^\/]+$/,
  /^\/api\/respondent/,
  /^\/api\/response/,
  /^\/api\/response\/multiple/,
  /^\/api\/customDomain\/hostname\/[^\/]+$/,
  /^\/api\/customDomain\/cname$/,
  /^\/api\/form\/settings\/password\/verify$/,
  /^\/api\/form\/settings\/password\/check-auth$/,
];

function isPublicRoute(path: string): boolean {
  return publicRoutes.some((pattern) => pattern.test(path));
}

export const app = new Hono<{ Variables: { userId: string | null } }>()
  .use(
    cors({
      origin: (origin, c) => {
        const path = c.req.path;

        // Development mode - allow localhost origins
        if (env.NODE_ENV !== "production") {
          if (
            origin?.includes("localhost") ||
            origin?.includes("127.0.0.1")
          ) {
            return origin;
          }
        }

        // Public routes - echo the actual origin (allows any domain)
        if (isPublicRoute(path)) {
          return origin || "*";
        }

        // Protected routes - only allow trusted domain
        return trusted_domain;
      },
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      maxAge: 600,
    }),
  )
  .use(prettyJSON())
  .use(contextStorage())
  .use(async (c, next) => {
    const pathname = c?.req?.path;
    const method = c?.req?.method;

    const specialRateLimitedPaths = [
      "/api/respondent",
      "/api/response/multiple",
    ];
    if (specialRateLimitedPaths.includes(pathname) && method === "POST") {
      return await next();
    }
    const { success } = await env.MY_GENERAL_LIMITER.limit({ key: pathname });
    if (!success) {
      return c?.json(
        { message: "Too many requests. Please try again later." },
        429,
      );
    }
    return await next();
  })
  .on(["POST", "GET"], "/api/auth/*", async (c) => {
    const auth = await getAuth();
    return await auth.handler(c.req.raw);
  })
  .get("/", async (c) => {
    return c.redirect(trusted_domain);
  })
  .get("/health", async (c) => {
    return c.json(
      {
        message: "server is up and running",
      },
      200,
    );
  })
  .use(wideLogger())
  .use("*", async (c, next) => {
    const logger = c.get("wide-logger");
    const userId = c.get("userId");
    logger.addContext("user", { id: userId });
    logger.addContext("infra", { platform: "cloudflare" });
    await next();
  })
  .route("/api", api)
  .onError((e, c) => {
    console.error(e);
    return c.text("Internal server error", 500);
  });

export {
  CustomerOnboardingWorkflow,
  EmailIntegrationWorkflow,
  GmailIntegrationWorkflow,
  GoogleSheetIntegrationWorkflow,
  NotionIntegrationWorkflow,
  SlackIntegrationWorkflow,
  WebHookIntegrationWorkflow,
};
export default {
  fetch: app.fetch,
  queue: async (
    // biome-ignore lint: no-explicit-any
    batch: MessageBatch<any>,
  ) => {
    const queue = batch.queue;
    if (queue === "planetform-integrations-queue") {
      const integrationBatch = batch as MessageBatch<IntegrationQueueMesssage>;
      const messages = integrationBatch.messages;
      await handleIntegrationQueue(messages);
    }
  },
} as ExportedHandler;
