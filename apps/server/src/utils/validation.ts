import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import {
	form,
	formField,
	formSetting,
	integration,
	respondent,
	response,
	workspace,
} from "../db/schema";
import { user } from "../db/schema/auth";

export const userObject = createInsertSchema(user);
export const workspaceObject = createInsertSchema(workspace.workspace);
export const formObject = createInsertSchema(form.form);
export const formSettingObject = createInsertSchema(formSetting.formSetting);
export const formFieldObject = createInsertSchema(formField.formField);
export const respondentObject = createInsertSchema(respondent.respondent);
export const responseObject = createInsertSchema(response.response);
export const multipleFormFieldObject = z.array(formFieldObject);
export const multipleResponseObject = z.array(responseObject);
export const integrationObject = createInsertSchema(integration.integration);

export const updateMultipleFieldObject = z.object({
	formId: z.string().nonempty(),
	fields: multipleFormFieldObject,
});

export const updateWorkspaceObject = z.object({
	data: z.object({
		name: z.string().nonoptional(),
	}),
	workspaceId: z.string().nonoptional(),
});

export const deleteMultipleRespondentsObject = z.array(z.string());

export const intervalSchema = z.enum([
	"3h",
	"6h",
	"12h",
	"24h",
	"7d",
	"30d",
	"3M",
	"6M",
	"1Y",
]);

export const resolutionsSchema = z.enum([
	"1 hour",
	"3 hours",
	"6 hours",
	"12 hours",
	"24 hours",
	"1 day",
	"1 week",
	"1 month",
	"3 months",
	"6 months",
	"12 months",
	"1 year",
]);
