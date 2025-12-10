import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { clientDashAnalyticsService } from "../services/dashboard.analytics";
import { authMiddleware } from "../middlewares/authMiddleware";
import { intervalSchema } from "../utils/validation";
import {
  getSubmissionByTimeService,
  getUniqueSubmissionByTimeService,
  getUniqueVisitorByTimeService,
  getVisitorsByTimeService,
  Interval,
} from "../services/form.analytics";

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
        200
      );
    }
  )

  .get(
    "/form",
    zValidator(
      "query",
      z.object({
        formId: z.string().nonoptional(),
        interval: intervalSchema,
      })
    ),
    async (c) => {
      const { formId, interval } = c.req.valid("query");
      const visitors = await getVisitorsByTimeService(
        formId as string,
        interval as Interval
      );
      const uniqueVisitors = await getUniqueVisitorByTimeService(
        formId as string,
        interval as Interval
      );
      const submissions = await getSubmissionByTimeService(
        formId as string,
        interval as Interval
      );
      const uniqueSubmissions = await getUniqueSubmissionByTimeService(
        formId as string,
        interval as Interval
      );

      return c.json(
        { visitors, uniqueVisitors, submissions, uniqueSubmissions },
        200
      );
    }
  );

export default analytics;
