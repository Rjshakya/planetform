import { eq } from "drizzle-orm";
import { getDb } from "../db/config";
import { formField } from "../db/schema/form.fields";
import type { response } from "../db/schema/response";
import type { PageProperties } from "../services/notion/notion";

export const getSubmissionRecord = async (params: {
	formId: string;
	values: (typeof response.$inferInsert)[];
	shouldKeyIncludeIndex: boolean;
}) => {
	const { formId, shouldKeyIncludeIndex, values } = params;
	const formFields = await getFormFields(formId);

	const submission = {} as Record<string, string>;
	for (const val of values) {
		const field = formFields?.find((f) => f.id === val?.form_field);
		if (!field) continue;
		const index = field.index?.toString();
		let key = field.id.trim();
		if (shouldKeyIncludeIndex) {
			key = `${index}_${field?.label}`.trim() || "";
		}
		submission[key] = val.value as string;
	}
	return { submission, formId };
};

export const getSheetHeader = async (formId: string) => {
	const formFields = await getFormFields(formId);
	const headers = formFields.map((f) => `${f.index}_${f.label?.trim()}`);
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
			const key = `${c.order}_${c.label}`.trim();
			a[key] = { rich_text: {} };
			return a;
		},
		{} as Record<string, any>,
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

		const key = `${field.index}_${field.label}`.trim();
		const fieldValue = value.value;
		properties![key] = {
			rich_text: [{ text: { content: fieldValue || "" } }],
		};
	}

	return properties;
};

export const handleMailBody = async (params: {
	body: string;
	formId: string;
	values: (typeof response.$inferInsert)[];
}) => {
	const { body, formId, values } = params;

	const { submission } = await getSubmissionRecord({
		formId,
		values,
		shouldKeyIncludeIndex: false,
	});

	//  this regex will check for value in these template variable {{}}
	// if our submission record has value for the value we find in template variable
	// we put that otherwise we put "no value"

	const templateVarialbeRegex = /\{\{\s*(.*?)\s*\}\}/g;
	const bodyWithValueForTemplateVariable = body.replace(
		templateVarialbeRegex,
		(match, id) => {
			return submission[id] !== undefined ? submission[id] : "no value";
		},
	);

	return bodyWithValueForTemplateVariable;
};
