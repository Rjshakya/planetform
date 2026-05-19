import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import jwt from "jsonwebtoken";
import { env } from "cloudflare:workers";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createFormService,
  deleteFormService,
  getFormService,
  getFormWithMetaDataService,
  getWorkspaceFormService,
  updateFormAndFormfieldsService,
} from "../services/form";
import {
  createFormSettingService,
  getFormSettingService,
  resetFormSettings,
  setFormPassword,
  updateFormSettingService,
  verifyPassword,
} from "../services/form.setting";
import {
  formObject,
  formSettingObject,
  multipleFormFieldObject,
} from "../utils/validation";
import { ApiResponse } from "../utils/api";

const form = new Hono<{
  Variables: {
    userId: string;
  };
}>()

  .post(
    "/",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        formValues: formObject,
        formCustomisation: z.object().loose(),
      }),
    ),
    async (c) => {
      const { formValues, formCustomisation } = c.req.valid("json");
      const result = await createFormService({ formCustomisation, formValues });
      return c.json({ form: result.unwrap() });
    },
  )

  .get(
    "/workspace/:workspaceId",
    authMiddleware,
    zValidator("param", z.object({ workspaceId: z.uuid().nonempty() })),
    async (c) => {
      const { workspaceId } = c.req.valid("param");
      const result = await getWorkspaceFormService(workspaceId);
      return c.json({ workspace: result.unwrap() });
    },
  )

  .get(
    "/:formId",
    zValidator("param", z.object({ formId: z.string().nonempty() })),
    async (c) => {
      const { formId } = c.req.valid("param");
      const result = await getFormService(formId);
      return c.json({ form: result.unwrap() });
    },
  )

  .get(
    "/:formId/meta_data",
    authMiddleware,
    zValidator("param", z.object({ formId: z.string().nonempty() })),
    async (c) => {
      const { formId } = c.req.valid("param");
      const result = await getFormWithMetaDataService(formId);
      return c.json({ form: result.unwrap() }, 200);
    },
  )

  .delete(
    "/:formId",
    authMiddleware,
    zValidator("param", z.object({ formId: z.string().nonempty() })),
    async (c) => {
      const { formId } = c.req.valid("param");
      const result = await deleteFormService(formId);
      return c.json({ form: result.unwrap() });
    },
  )

  .put(
    "/",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        formId: z.string().nonempty(),
        formName: z.string().nonempty(),
        form_schema: z.string().nonempty(),
        fields: multipleFormFieldObject,
        formCustomisation: z.any(),
      }),
    ),
    async (c) => {
      const userId = c.get("userId");
      const { formId, formName, form_schema, fields, formCustomisation } =
        c.req.valid("json");
      const result = await updateFormAndFormfieldsService({
        fields,
        form_schema,
        formCustomisation,
        formId,
        formName,
        userId: userId!,
      });
      return c.json({ form: result.unwrap() });
    },
  )

  .post(
    "/settings/create",
    authMiddleware,
    zValidator("json", formSettingObject),
    async (c) => {
      const params = c.req.valid("json");
      const settings = await createFormSettingService(params);
      return c.json({ settings });
    },
  )

  .post(
    "/settings/update",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        formId: z.string(),
        closed: z.boolean().optional(),
        closedMessage: z.string().optional(),
        closingTime: z.coerce.date().optional().nullable(),
        closeAfterSubmissions: z.number().optional().nullable(),
      }),
    ),
    async (c) => {
      const userId = c.get("userId");
      const params = c.req.valid("json");
      const settings = await updateFormSettingService({
        ...params,
        customerId: userId,
      });
      return c.json({ settings });
    },
  )
  .post(
    "/settings/reset",
    authMiddleware,
    zValidator("json", z.object({ formId: z.string() })),
    async (c) => {
      const { formId } = c.req.valid("json");
      const res = await resetFormSettings(formId);
      return c.json(
        ApiResponse({ data: res, message: "Form settings reset successfully" }),
      );
    },
  )
  .post(
    "/settings/password",
    authMiddleware,
    zValidator("json", z.object({ formId: z.string(), password: z.string() })),
    async (c) => {
      const { formId, password } = c.req.valid("json");
      const res = await setFormPassword(formId, password);
      return c.json(ApiResponse({ data: res, message: "password set" }), 200);
    },
  )
  .post(
    "/settings/password/verify",
    zValidator("json", z.object({ formId: z.string(), password: z.string() })),
    async (c) => {
      const { formId, password } = c.req.valid("json");
      const res = await verifyPassword(formId, password);
      return c.json(
        ApiResponse({
          data: { success: res.success, token: res.token },
          message: res.success ? "Password verified" : "Invalid password",
        }),
        res.success ? 200 : 401,
      );
    },
  )
  .post(
    "/settings/password/check-auth",
    zValidator("json", z.object({ formId: z.string(), token: z.string() })),
    async (c) => {
      const { formId, token } = c.req.valid("json");

      try {
        const secret = env.JWT_SECRET;
        const decoded = jwt.verify(token, secret) as {
          formId: string;
          type: string;
        };

        if (
          decoded.formId !== formId ||
          decoded.type !== "password_protected_form"
        ) {
          return c.json(
            ApiResponse({
              data: { isAuthenticated: false },
              message: "Invalid token",
            }),
            401,
          );
        }

        return c.json(
          ApiResponse({
            data: { isAuthenticated: true },
            message: "Token valid",
          }),
          200,
        );
      } catch (error) {
        return c.json(
          ApiResponse({
            data: { isAuthenticated: false },
            message: "Invalid or expired token",
          }),
          401,
        );
      }
    },
  )

  .get(
    "/settings/:formId",
    authMiddleware,
    zValidator("param", z.object({ formId: z.string().nonempty() })),
    async (c) => {
      const { formId } = c.req.valid("param");
      const settings = await getFormSettingService(formId);
      return c.json({ settings });
    },
  );

export default form;
