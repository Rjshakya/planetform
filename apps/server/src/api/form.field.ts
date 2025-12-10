import { Hono } from "hono";
import { authMiddleware } from "../middlewares/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import {
  multipleFormFieldObject,
  updateMultipleFieldObject,
} from "../utils/validation";
import {
  createMultipleFormFieldService,
  deleteFormFieldService,
  getFormFieldsService,
} from "../services/form.field";
import z from "zod";

const formField = new Hono<{
  Variables: {
    userId: string | null;
  };
}>()

.use(authMiddleware)
.post("/", zValidator("json", multipleFormFieldObject), async (c) => {
  const formFields = c.req.valid("json");
  await createMultipleFormFieldService(formFields);
  return c.json({ message: "Form fields created successfully" }, 200);
})
.get(
  "/form/:formId",
  zValidator("param", z.object({ formId: z.string().nonempty() })),
  async (c) => {
    const { formId } = c.req.valid("param");
    const formFields = await getFormFieldsService(formId);
    return c.json({ formFields }, 200);
  }
)
.delete(
  "/:formFieldId",
  zValidator("param", z.object({ formFieldId: z.string().nonempty() })),
  async (c) => {
    const { formFieldId } = c.req.valid("param");
    const formField = await deleteFormFieldService(formFieldId);
    return c.json(
      { message: "Form field deleted successfully", formField },
      200
    );
  }
)

export default formField;
