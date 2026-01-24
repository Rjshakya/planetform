import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { form } from "./form";
import { formField } from "./form.fields";
import { respondent } from "./respondent";

export const response = pgTable(
	"responses",
	{
		id: t.uuid().primaryKey().default(sql`gen_random_uuid()`),
		form_field: t.uuid().references(() => formField.id, {
			onDelete: "cascade",
		}),
		form: t
			.varchar()
			.references(() => form.shortId, {
				onDelete: "cascade",
			})
			.notNull(),
		respondent: t
			.uuid()
			.references(() => respondent.id, {
				onDelete: "cascade",
			})
			.notNull(),
		value: t.text(),
		createdAt: t.timestamp().defaultNow().notNull(),
		updatedAt: t.timestamp().defaultNow().notNull(),
	},
	(tb) => [
		t.index("responses_form_idx").on(tb.form),
		t.index("responses_respondnt_idx").on(tb.respondent),
	],
);

export const responsesRelations = relations(response, ({ one }) => ({
	form: one(form, {
		fields: [response.form],
		references: [form.shortId],
	}),
	responses: one(respondent, {
		fields: [response.respondent],
		references: [respondent.id],
	}),
	formField: one(formField, {
		fields: [response.form_field],
		references: [formField.id],
	}),
}));

export type Responses = typeof response.$inferInsert;
export type ResponsesSelect = typeof response.$inferSelect;
