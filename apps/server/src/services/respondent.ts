import { eq, inArray } from "drizzle-orm";
import { getDb } from "../db/config.js";
import { respondent as respondentTable } from "../db/schema/respondent";
import { response as responsesTable } from "../db/schema/response";
import { form as formTable } from "../db/schema/form";
import { formField as formFieldTable } from "../db/schema/form.fields";
import { commonCatch } from "../utils/error.js";

export const createRespondentService = async (
  respondentValues: typeof respondentTable.$inferInsert
) => {
  try {
    const db = await getDb();
    const [respondent] = await db
      .insert(respondentTable)
      .values(respondentValues)
      .returning({ id: respondentTable.id });
    return respondent;
  } catch (e) {
    commonCatch(e);
  }
};

export const getRespondentbyIdService = async (
  id: typeof respondentTable.$inferInsert.id
) => {
  try {
    const db = await getDb();
    const respondent = await db
      .select()
      .from(respondentTable)
      .where(eq(respondentTable.id, id!));

    return respondent[0];
  } catch (e) {
    commonCatch(e);
  }
};

export const getFormRespondentsService = async (
  formId: typeof respondentTable.$inferInsert.form
) => {
  try {
    const db = await getDb();
    const respondents = await db
      .select()
      .from(respondentTable)
      .where(eq(respondentTable.form, formId));

    return respondents;
  } catch (e) {
    commonCatch(e);
  }
};

export const getFormResponsesByRespondentService = async (
  respondentId: string
) => {
  try {
    const db = await getDb();
    const res = await db
      .select({
        field: { ...formFieldTable },
        fieldValue: responsesTable.value,
        formId: formTable.shortId,
        formName: formTable.name,
        respondentId: responsesTable.respondent,
      })
      .from(responsesTable)
      .where(eq(responsesTable.respondent, respondentId))
      .leftJoin(formTable, eq(responsesTable.form, formTable.shortId))
      .leftJoin(
        formFieldTable,
        eq(responsesTable.form_field, formFieldTable.id)
      );

    return res;
  } catch (e) {
    commonCatch(e);
  }
};

export const deleteRespondentService = async (respondentId: string) => {
  try {
    const db = await getDb();
    await db
      .delete(respondentTable)
      .where(eq(respondentTable.id, respondentId));

    return true;
  } catch (e) {
    commonCatch(e);
  }
};

export const deleteMultipleRespondentService = async (
  respondents: string[]
) => {
  try {
    if (respondents.length === 0) return;

    const db = await getDb();
    await db
      .delete(respondentTable)
      .where(inArray(respondentTable.id, respondents));

    return true;
  } catch (e) {
    commonCatch(e);
  }
};
