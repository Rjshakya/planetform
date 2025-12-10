import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  deleteMultipleRespondentsObject,
  respondentObject,
} from "../utils/validation";
import { env } from "cloudflare:workers";
import {
  createRespondentService,
  deleteMultipleRespondentService,
  deleteRespondentService,
  getFormRespondentsService,
  getRespondentbyIdService,
} from "../services/respondent";
import { authMiddleware } from "../middlewares/authMiddleware";
import z from "zod";

const respondent = new Hono<{
  Variables: {
    userId: string | null;
  };
}>()

  .post("/", zValidator("json", respondentObject), async (c) => {
    const cf = c.req.raw.cf;
    const ip = c.req.header("cf-connecting-ip");
    const respondentData = c.req.valid("json");
    let payload = { ...respondentData };

    if (cf) {
      payload = {
        longitude: cf.longitude as string,
        latitude: cf.latitude as string,
        country: cf.country as string,
        city: cf.city as string,
        ip,
        ...respondentData,
      };
    } else {
      payload = {
        ip,
        country: "IN",
        ...respondentData,
      };
    }

    const limitKey = `limit-${respondentData.form}`;

    const { success } = await env.MY_RESPONDENT_LIMITER.limit({
      key: limitKey,
    });
    if (!success) {
      return c.json(
        {
          message:
            "Too many respondents created from this form. Please try again later.",
        },
        429
      );
    }

    const respondent = await createRespondentService(payload);
    return c.json({ respondent }, 200);
  })

  .get(
    "/form/:formId",
    authMiddleware,
    zValidator("param", z.object({ formId: z.string().nonempty() })),
    async (c) => {
      const { formId } = c.req.valid("param");
      const respondent = await getFormRespondentsService(formId);
      return c.json({ respondent }, 200);
    }
  )

  .get(
    "/:respondentId",
    authMiddleware,
    zValidator("param", z.object({ respondentId: z.string().nonempty() })),
    async (c) => {
      const { respondentId } = c.req.valid("param");
      const respondent = await getRespondentbyIdService(respondentId);
      return c.json({ respondent }, 200);
    }
  )

  .delete(
    "/:respondentId",
    authMiddleware,
    zValidator("param", z.object({ respondentId: z.string().nonempty() })),
    async (c) => {
      const { respondentId } = c.req.valid("param");
      const respondent = await deleteRespondentService(respondentId);
      return c.json({ respondent }, 200);
    }
  )

  .put(
    "/multiple",
    authMiddleware,
    zValidator("json", deleteMultipleRespondentsObject),
    async (c) => {
      const params = c.req.valid("json");
      const respondents = await deleteMultipleRespondentService(params);
      return c.json({ respondents }, 200);
    }
  );

export default respondent;
