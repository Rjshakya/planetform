import { eq } from "drizzle-orm";
import { getDb } from "../db/config";
import { formField } from "../db/schema/form.fields";
import type { response } from "../db/schema/response";
import type { PageProperties } from "../services/notion/notion";

export const getSubmissionRecord = async (params: {
  formId: string;
  values: (typeof response.$inferInsert)[];
  useFieldLabelAsKey: boolean;
}) => {
  const { formId, useFieldLabelAsKey, values } = params;
  const formFields = await getFormFields(formId);

  const submission = {} as Record<string, string>;
  for (const val of values) {
    const field = formFields?.find((f) => f.id === val?.form_field);
    if (!field) continue;
    let key = field.id;
    if (useFieldLabelAsKey) {
      key = field.label;
    }
    submission[key.trim()] = val.value as string;
  }
  return { submission, formId };
};

export const getSheetHeader = async (formId: string) => {
  const formFields = await getFormFields(formId);
  const headers = formFields.map((f) => f.label?.trim());
  return { headers };
};

export const getFormFields = async (formId: string) => {
  const db = await getDb();
  const formFields = await db
    .select({
      id: formField.id,
      label: formField.label,
      index: formField.order,
    })
    .from(formField)
    .where(eq(formField.form, formId));
  return formFields;
};

export const getNotionInitialDataSource = (
  formFields: {
    id: string;
    label: string;
    type: string;
    order: number;
  }[],
) => {
  const fieldsRecord = formFields.reduce(
    (a, c) => {
      const key = c.label.trim();
      a[key] = { rich_text: {} };
      return a;
    },
    {} as Record<string, unknown>,
  );

  return {
    respondent: { title: {} },
    ...fieldsRecord,
  };
};

export const getNotionPropertiesFromSubmission = async (params: {
  formId: string;
  respondentId: string;
  values: (typeof response.$inferInsert)[];
}): Promise<PageProperties> => {
  const { formId, respondentId, values } = params;
  const formFields = await getFormFields(formId);
  const properties = {} as PageProperties;

  properties!["respondent"] = {
    title: [{ text: { content: respondentId.trim() } }],
  };

  for (const value of values) {
    const field = formFields.find((f) => f.id === (value.form_field as string));
    if (!field) continue;

    const key = field.label.trim();
    const fieldValue = value.value;
    properties![key] = {
      rich_text: [{ text: { content: fieldValue || "" } }],
    };
  }

  return properties;
};

export const handleMailBody = async (params: {
  body: string;
  submissions: Record<string, string>;
}) => {
  const { body, submissions } = params;

  // this regex will check for value in these template variable {{}}
  // if our submission record has formField-Id that is mentioned in these template-literals {{}} ,
  // we put that values in our mail body otherwise "no value"

  const templateVariableRegex = /\{\{\s*(.*?)\s*\}\}/g;
  const bodyWithValueForTemplateVariable = body.replace(
    templateVariableRegex,
    (_, id) => {
      return submissions[id] !== undefined ? submissions[id] : "no value";
    },
  );

  return bodyWithValueForTemplateVariable;
};

export const getSubmissionsForSlack = async ({
  formId,
  values,
  fields,
}: {
  formId: string;
  values: (typeof response.$inferInsert)[];
  fields: string[];
}) => {
  const formFields = await getFormFields(formId);
  const submissions = {} as Record<string, string>;

  for (const fieldId of fields) {
    const getFieldFromValues = values.find((v) => v.form_field === fieldId);
    if (!getFieldFromValues) continue;

    const getFieldLabel = formFields.find(
      (v) => v.id === getFieldFromValues.form_field,
    );
    if (!getFieldLabel) continue;

    submissions[getFieldLabel.label] = getFieldFromValues.value ?? "N/A";
  }

  return submissions;
};
