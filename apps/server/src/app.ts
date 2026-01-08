import { env } from "cloudflare:workers";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { contextStorage } from "hono/context-storage";
import { bodyLimit } from "hono/body-limit";
import { getAuth } from "./utils/auth";
import { getDb } from "./db/config";
import { GoogleSheetWorkflow } from "./workflows/googleSheet";
import { ManagerWorkflow } from "./workflows/manager";
import {
  NotionPageCreateWorkflow,
  NotionSubmissionWorkflow,
} from "./workflows/notion";
import { WebHookFlow } from "./workflows/webhook";
import { GmailWorkflow, PersonalGmailNotifyFlow } from "./workflows/gmail";
import { DodoCustomerCreateFlow } from "./workflows/customer";
import { prettyJSON } from "hono/pretty-json";
import api from "./api";

const trusted_url = process.env.FRONTEND_URL;
const trusted_domain = process.env.TRUSED_DOMAIN;
const app = new Hono()
  .use(
    cors({
      origin:
        env.NODE_ENV === "production"
          ? trusted_domain
          : [trusted_url, trusted_domain], // Replace with your frontend's origin
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Specify allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
  )
  .use(prettyJSON())
  .use(logger())
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
        429
      );
    }
    return await next();
  })
  .use(
    bodyLimit({
      maxSize: 50 * 1024,
      onError: (c) => {
        return c.text("overflow :(", 413);
      },
    })
  )
  .on(["POST", "GET"], "/api/auth/*", async (c) => {
    const auth = await getAuth();
    return await auth.handler(c.req.raw);
  })
  .get("/", async (c) => {
    return c.redirect(trusted_domain);
  })
  .get("/health", async (c) => {
    const db = await getDb();
    const result = await db.execute(`SELECT NOW()`);
    return c.json(
      {
        message: "server is up and running",
        result,
      },
      200
    );
  })
  .route("/api", api)
  .onError((e, c) => {
    console.error(e);
    return c.text("Internal server error", 500);
  });

export {
  GoogleSheetWorkflow,
  ManagerWorkflow,
  NotionPageCreateWorkflow,
  NotionSubmissionWorkflow,
  WebHookFlow,
  PersonalGmailNotifyFlow,
  DodoCustomerCreateFlow,
  GmailWorkflow,
};
export default app;
