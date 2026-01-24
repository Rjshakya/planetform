import { Hono } from "hono";
import { authMiddleware } from "../middlewares/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import {
  formObject,
  formSettingObject,
  multipleFormFieldObject,
} from "../utils/validation";
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
  updateFormSettingService,
} from "../services/form.setting";

const form = new Hono<{
  Variables: {
    userId: string | null;
  };
}>()

  .post(
    "/",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        formValues: formObject,
        formCustomisation: z.any(),
      }),
    ),
    async (c) => {
      const { formValues, formCustomisation } = c.req.valid("json");
      const form = await createFormService({ formCustomisation, formValues });
      return c.json({ form });
    },
  )

  .get(
    "/workspace/:workspaceId",
    authMiddleware,
    zValidator("param", z.object({ workspaceId: z.uuid().nonempty() })),
    async (c) => {
      const { workspaceId } = c.req.valid("param");
      const workspace = await getWorkspaceFormService(workspaceId);
      return c.json({ workspace });
    },
  )

  .get(
    "/:formId",
    zValidator("param", z.object({ formId: z.string().nonempty() })),
    async (c) => {
      const { formId } = c.req.valid("param");
      const form = await getFormService(formId);
      return c.json({ form });
    },
  )

  .get(
    "/:formId/meta_data",
    authMiddleware,
    zValidator("param", z.object({ formId: z.string().nonempty() })),
    async (c) => {
      const { formId } = c?.req?.valid("param");
      const form = await getFormWithMetaDataService(formId);
      return c.json({ form }, 200);
    },
  )

  .delete(
    "/:formId",
    authMiddleware,
    zValidator("param", z.object({ formId: z.string().nonempty() })),
    async (c) => {
      const { formId } = c.req.valid("param");
      const form = await deleteFormService(formId);
      return c.json({ form });
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
      const form = await updateFormAndFormfieldsService({
        fields,
        form_schema,
        formCustomisation,
        formId,
        formName,
        userId: userId!,
      });
      return c.json({ form });
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
    zValidator("json", formSettingObject),
    async (c) => {
      const params = c.req.valid("json");
      const settings = await updateFormSettingService(params);
      return c.json({ settings });
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
