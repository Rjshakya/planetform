import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { multipleResponseObject, responseObject } from "../utils/validation";
import {
  createMultipleResponsesService,
  createResponseService,
  editResponseService,
  getFormResponsesService,
} from "../services/response";
import z from "zod";
import { env } from "cloudflare:workers";
import { authMiddleware } from "../middlewares/authMiddleware";

const response = new Hono<{
  Variables: {
    userId: string | null;
  };
}>()

.post("/", zValidator("json", responseObject), async (c) => {
  const params = c.req.valid("json");
  const response = await createResponseService(params);
  return c.json({ response }, 200);
})

.post(
  "/multiple",
  zValidator(
    "json",
    z.object({
      finalValues: multipleResponseObject,
      creator: z.string().nonempty(),
    })
  ),
  async (c) => {
    const { creator, finalValues } = c.req.valid("json");
    const limitKey = `limit-${finalValues?.[0]?.respondent}`;
    const { success } = await env.MY_SUBMISSIONS_LIMITER.limit({
      key: limitKey,
    });

    if (!success) {
      return c.json(
        {
          message: "Too many submissions. Please try again later.",
        },
        429
      );
    }

    const responses = await createMultipleResponsesService(
      finalValues,
      creator
    );
    return c.json({ responses }, 200);
  }
)

.get(
  "/form/:formId",
  authMiddleware,
  zValidator("param", z.object({ formId: z.string().nonempty() })),
  async (c) => {
    const { formId } = c.req.valid("param");
    const pageIndex = Math.max(
      0,
      parseInt(c.req?.query("pageIndex") as string)
    );
    const pageSize = Math.max(1, parseInt(c.req?.query("pageSize") as string));
    const responses = await getFormResponsesService(
      formId,
      pageIndex,
      pageSize
    );

    return c.json({ responses }, 200);
  }
)

.put("/", authMiddleware, zValidator("json", responseObject), async (c) => {
  const params = c.req.valid("json");
  const response = await editResponseService(params.id!, params);
  return c.json({ response }, 200);
})

export default response;