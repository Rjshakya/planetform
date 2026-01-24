import { env } from "cloudflare:workers";
import { and, eq } from "drizzle-orm";
import { getDb } from "../db/config.js";
import { formField as formFieldTable } from "../db/schema/form.fields.js";
import { commonCatch } from "../utils/error.js";

export const createFormFieldService = async (
  formFieldvalues: typeof formFieldTable.$inferInsert,
) => {
  try {
    const db = await getDb();
    const ff = await db
      .select()
      .from(formFieldTable)
      .where(
        and(
          eq(formFieldTable.form, formFieldvalues.form),
          eq(formFieldTable.order, formFieldvalues.order),
        ),
      );

    if (ff[0]?.id) {
      throw new Error("failed in creating formfield");
    }

    const formField = await db
      .insert(formFieldTable)
      .values(formFieldvalues)
      .returning();
    return formField[0];
  } catch (error) {
    commonCatch(error);
  }
};

export const createMultipleFormFieldService = async (
  multipleFormFields: (typeof formFieldTable.$inferInsert)[],
) => {
  try {
    const db = await getDb();
    const res = await db.insert(formFieldTable).values(multipleFormFields);
    return res;
  } catch (error) {
    commonCatch(error);
  }
};

export const getFormFieldsService = async (
  formId: typeof formFieldTable.$inferSelect.form,
) => {
  try {
    const db = await getDb();
    const formFields = await db
      .select({
        id: formFieldTable.id,
        form: formFieldTable.form,
        label: formFieldTable.label,
        type: formFieldTable.type,
        isRequired: formFieldTable.isRequired,
        order: formFieldTable.order,
      })
      .from(formFieldTable)
      .where(eq(formFieldTable.form, formId));

    return formFields;
  } catch (error) {
    commonCatch(error);
  }
};

export const deleteFormFieldService = async (formFieldId: string) => {
  try {
    const db = await getDb();
    const formField = await db
      .delete(formFieldTable)
      .where(eq(formFieldTable?.id, formFieldId))
      .returning({ id: formFieldTable.id, form: formFieldTable.form });

    await env.planetform_kv.delete(`getFormFields-${formField[0]?.form}`);

    return formField[0];
  } catch (error) {
    commonCatch(error);
  }
};
