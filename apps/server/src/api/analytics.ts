import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { authMiddleware } from "../middlewares/authMiddleware";
import { clientDashAnalyticsService } from "../services/dashboard.analytics";
import {
  getSubmissionByTimeService,
  getUniqueSubmissionByTimeService,
  getUniqueVisitorByTimeService,
  getVisitorsByGeoService,
  getVisitorsByTimeService,
} from "../services/form.analytics";
import { intervalSchema } from "../utils/validation";
import { ApiResponse } from "../utils/api";

const analytics = new Hono<{
  Variables: {
    userId: string | null;
  };
}>()

  .use(authMiddleware)
  .get(
    "/dashboard/:customerId",
    zValidator("param", z.object({ customerId: z.string().nonoptional() })),
    async (c) => {
      const { customerId } = c.req.valid("param");
      const { forms, respondents, workspaces } =
        await clientDashAnalyticsService(customerId);
      return c.json(
        {
          TotalWorkspaces: workspaces,
          TotalForms: forms,
          TotalRespondents: respondents,
        },
        200,
      );
    },
  )

  .get(
    "/form",
    zValidator(
      "query",
      z.object({
        formId: z.string().nonoptional(),
        interval: intervalSchema,
      }),
    ),
    async (c) => {
      const { formId, interval } = c.req.valid("query");

      const tz = (c.req.raw.cf?.timezone as string) || "Asia/Kolkata";
      const visitors = await getVisitorsByTimeService(formId, interval, tz);
      const uniqueVisitors = await getUniqueVisitorByTimeService(
        formId,
        interval,
        tz,
      );
      const submissions = await getSubmissionByTimeService(
        formId,
        interval,
        tz,
      );
      const uniqueSubmissions = await getUniqueSubmissionByTimeService(
        formId,
        interval,
        tz,
      );

      return c.json(
        { visitors, uniqueVisitors, submissions, uniqueSubmissions },
        200,
      );
    },
  )
  .get(
    "/form/geo",
    zValidator(
      "query",
      z.object({
        formId: z.string().nonoptional(),
      }),
    ),
    async (c) => {
      const { formId } = c.req.valid("query");
      const data = await getVisitorsByGeoService({ formId });
      return c.json(ApiResponse({ data, message: "success" }));
    },
  );

export default analytics;
