import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middlewares/authMiddleware";
import z from "zod";
import { zValidator } from "@hono/zod-validator";
import { env } from "cloudflare:workers";
import { getDb, makeRepo } from "../db/config";
import { customDomainTable } from "../db/schema/custom-domain";
import {
  createCustomDomain,
  deleteCustomDomain,
  getDomainStatus,
  getDomainCname,
  updateCustomDomain,
} from "../services/custom.domain";
import { ApiResponse } from "../utils/api";

const createCustomDomainSchema = z.object({
  formId: z.string(),
  hostName: z.string(),
});

const updateCustomDomainSchema = z.object({
  formId: z.string(),
  status: z.string(),
  hostName: z.string()
}).refine(
  (data) => data.formId !== undefined || data.status !== undefined,
  { message: "At least one field (formId or status) must be provided" }
);


const customDomain = new Hono<{
  Variables: {
    userId: string | null;
  };
}>()
  .get(
    "/hostname/:hostname",
    zValidator("param", z.object({ hostname: z.string().nonoptional() })),
    async (c) => {
      const { hostname } = c.req.valid("param");
      const db = await getDb();

      const result = await db
        .select()
        .from(customDomainTable)
        .where(eq(customDomainTable.hostName, hostname));

      if (result.length === 0) {
        return c.json(
          ApiResponse({ data: null, message: "Domain not found" }),
          404
        );
      }

      return c.json(ApiResponse({ data: result[0], message: "success" }));
    },
  )
  .get("/cname", async (c) => {
    const cname = getDomainCname();
    return c.json(ApiResponse({ data: { cname }, message: "success" }));
  })
  .use(authMiddleware)
  .get("/", async (c) => {
    const userId = c.get("userId") as string;
    const db = await getDb();
    const repo = makeRepo<typeof customDomainTable>(db)(customDomainTable);
    const result = await repo.selectById()("userId")(userId);

    if (!result.isOk()) {
      throw result.error
    }
    const domains = result.value

    return c.json(ApiResponse({ data: domains, message: "success" }));
  })
  .get(
    "/form/:formId",
    zValidator("param", z.object({ formId: z.string().nonempty() })),
    async (c) => {
      const { formId } = c.req.valid("param");
      const db = await getDb();
      const repo = makeRepo<typeof customDomainTable>(db)(customDomainTable);
      const result = await repo.selectById()("formId")(formId);

      if (!result.isOk()) {
        throw result.error
      }

      const domains = result.value

      return c.json(ApiResponse({ data: domains, message: "success" }));
    },
  )
  .get(
    "/:id",
    zValidator("param", z.object({ id: z.string().nonempty() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const db = await getDb();
      const repo = makeRepo<typeof customDomainTable>(db)(customDomainTable);
      const result = await repo.selectById()("id")(id);

      if (!result.isOk()) {
        throw result.error
      }

      const domain = result.value[0]

      return c.json(ApiResponse({ data: domain, message: "success" }));
    },
  )
  .get(
    "/:id/status",
    zValidator("param", z.object({ id: z.string().nonempty() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const { CLOUDFLARE_ZONE_ID: cfZoneId, CLOUDFLARE_API_TOKEN_FOR_DOMAIN: cfApiToken } =
        env;
      const db = await getDb();

      const getStatus = getDomainStatus({ db, cfApiToken, cfZoneId });
      const result = await getStatus({ id });

      if (!result.isOk()) {
        throw result.error
      }
      const status = result.value

      return c.json(ApiResponse({ data: status, message: "success" }));
    },
  )
  .post("/", zValidator("json", createCustomDomainSchema), async (c) => {
    const userId = c.get("userId") as string;
    const { formId, hostName } = c.req.valid("json");
    const { CLOUDFLARE_ZONE_ID: cfZoneId, CLOUDFLARE_API_TOKEN_FOR_DOMAIN: cfApiToken } =
      env;

    const db = await getDb();

    const create = createCustomDomain({ db, cfApiToken, cfZoneId });
    const result = await create({ formId, hostName, userId });
    if (!result.isOk()) {
      throw result.error
    }
    const domainRecord = result.value

    return c.json(ApiResponse({ data: domainRecord, message: "success" }));
  })
  .post(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", updateCustomDomainSchema),
    async (c) => {
      const userId = c.get("userId") as string
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");
      const db = await getDb();

      const update = updateCustomDomain({ db });
      const result = await update({ id, ...body, userId });

      if (!result.isOk()) {
        throw result.error;
      }

      return c.json(ApiResponse({ data: result.value[0], message: "success" }));
    },
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string().nonempty() })),
    async (c) => {
      const { id } = c.req.valid("param");
      const { CLOUDFLARE_ZONE_ID: cfZoneId, CLOUDFLARE_API_TOKEN_FOR_DOMAIN: cfApiToken } =
        env;
      const db = await getDb();

      const deleteDomain = deleteCustomDomain({ db, cfApiToken, cfZoneId });
      const result = await deleteDomain({ id });

      if (!result.isOk()) {
        throw result.error
      }

      const deletedDomain = result.value

      return c.json(
        ApiResponse({
          data: deletedDomain,
          message: "Custom domain deleted successfully",
        }),
      );
    },
  );

export default customDomain;
