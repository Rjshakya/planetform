import { Hono } from "hono";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
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
} from "../services/custom.domain";
import { ApiResponse } from "../utils/api";

const createCustomDomainSchema = z.object({
    formId: z.string(),
    hostName: z.string(),
});

const customDomain = new Hono<{
    Variables: {
        userId: string | null;
    };
}>()
    .use(authMiddleware)
    .get("/", async (c) => {
        const userId = c.get("userId") as string;
        const db = await getDb();
        const repo = makeRepo<typeof customDomainTable>(db)(customDomainTable);
        const result = await repo.selectById()("userId")(userId);

        const domains = result.match({
            ok: (data) => data,
            err: (e) => {
                throw e;
            },
        });

        return c.json(ApiResponse({ data: domains, message: "success" }));
    })
    .get("/cname", async (c) => {
        const cname = getDomainCname();
        return c.json(ApiResponse({ data: { cname }, message: "success" }));
    })
    .get(
        "/form/:formId",
        zValidator("param", z.object({ formId: z.string().nonempty() })),
        async (c) => {
            const { formId } = c.req.valid("param");
            const db = await getDb();
            const repo = makeRepo<typeof customDomainTable>(db)(customDomainTable);
            const result = await repo.selectById()("formId")(formId);

            const domains = result.match({
                ok: (data) => data,
                err: (e) => {
                    throw e;
                },
            });

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

            const domain = result.match({
                ok: (data) => data[0],
                err: (e) => {
                    throw e;
                },
            });

            return c.json(ApiResponse({ data: domain, message: "success" }));
        },
    )
    .get(
        "/:id/status",
        zValidator("param", z.object({ id: z.string().nonempty() })),
        async (c) => {
            const { id } = c.req.valid("param");
            const { CLOUDFLARE_ZONE_ID: cfZoneId, CLOUDFLARE_API_TOKEN: cfApiToken } =
                env;
            const db = await getDb();

            const getStatus = getDomainStatus({ db, cfApiToken, cfZoneId });
            const result = await getStatus({ id });

            const status = result.match({
                ok: (data) => data,
                err: (e) => {
                    throw e;
                },
            });

            return c.json(ApiResponse({ data: status, message: "success" }));
        },
    )
    .post("/", zValidator("json", createCustomDomainSchema), async (c) => {
        const userId = c.get("userId") as string;
        const { formId, hostName } = c.req.valid("json");
        const { CLOUDFLARE_ZONE_ID: cfZoneId, CLOUDFLARE_API_TOKEN: cfApiToken } =
            env;

        const db = await getDb();

        const create = createCustomDomain({ db, cfApiToken, cfZoneId });
        const result = await create({ formId, hostName, userId });
        const domainRecord = result.match({
            ok: (a) => a,
            err: (e) => {
                throw e;
            },
        });

        return c.json(ApiResponse({ data: domainRecord, message: "success" }));
    })
    .delete(
        "/:id",
        zValidator("param", z.object({ id: z.string().nonempty() })),
        async (c) => {
            const { id } = c.req.valid("param");
            const { CLOUDFLARE_ZONE_ID: cfZoneId, CLOUDFLARE_API_TOKEN: cfApiToken } =
                env;
            const db = await getDb();

            const deleteDomain = deleteCustomDomain({ db, cfApiToken, cfZoneId });
            const result = await deleteDomain({ id });

            const deletedDomain = result.match({
                ok: (data) => data,
                err: (e) => {
                    throw e;
                },
            });

            return c.json(
                ApiResponse({
                    data: deletedDomain,
                    message: "Custom domain deleted successfully",
                }),
            );
        },
    );

export default customDomain;
