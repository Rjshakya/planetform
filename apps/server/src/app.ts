import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import api from "./api";
import { getDb } from "./db/config";
import { getAuth } from "./utils/auth";
import {
  GmailIntegrationWorkflow,
  GoogleSheetIntegrationWorkflow,
  NotionIntegrationWorkflow,
  WebHookIntegrationWorkflow,
} from "./workflows";
import {
  handleIntegrationQueue,
  IntegrationQueueMesssage,
} from "./queues/integration-queue";

const trusted_url = process.env.FRONTEND_URL;
const trusted_domain = process.env.TRUSTED_DOMAIN;
export const app = new Hono()
  .use(
    cors({
      origin:
        env.NODE_ENV === "production"
          ? trusted_domain
          : [trusted_url, trusted_domain], // Replace with your frontend's origin
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Specify allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
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
  .get("/health/private", async (c) => {
    const db = await getDb();
    const result = await db.execute(`SELECT NOW()`);
    return c.json(
      {
        message: "server is up and running",
        result,
      },
      200,
    );
  })
  .route("/api", api)
  .onError((e, c) => {
    console.error(e);
    return c.text("Internal server error", 500);
  });

export {
  GmailIntegrationWorkflow,
  GoogleSheetIntegrationWorkflow,
  NotionIntegrationWorkflow,
  WebHookIntegrationWorkflow,
};
export default {
  fetch: app.fetch,
  queue: async (
    batch: MessageBatch<any>,
    env: Cloudflare.Env,
    ctx: ExecutionContext,
  ) => {
    const queue = batch.queue;
    if (queue === "planetform-integrations-queue") {
      const integrationBatch = batch as MessageBatch<IntegrationQueueMesssage>;
      const messages = integrationBatch.messages;
      await handleIntegrationQueue(messages);
    }
  },
} as ExportedHandler;
