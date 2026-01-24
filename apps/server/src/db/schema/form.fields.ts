import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { form } from "./form";
import { response } from "./response";

interface choicesType {
	label: string;
	id: string;
	parentId: string;
	type: string;
}

export const formField = pgTable(
	"form_fields",
	{
		id: t.uuid().primaryKey().default(sql`gen_random_uuid()`),
		form: t
			.varchar({ length: 255 })
			.references(() => form.shortId, {
				onDelete: "cascade",
			})
			.notNull(),
		label: t.varchar({ length: 255 }).notNull(),
		placeholder: t.varchar({ length: 255 }),
		type: t.varchar({ length: 255 }),
		subType: t.varchar({ length: 255 }),
		order: t.integer().notNull(),
		isRequired: t.boolean().default(false),
		min: t.integer().default(1),
		max: t.integer().default(1),
		file_limit: t.varchar({ length: 50 }).default("5mb"),
		accepted_file_types: t.text().array(),
		choices: t.jsonb().$type<choicesType>().array(),
		multiple_select: t.boolean().default(false),
		createdAt: t.timestamp().defaultNow(),
		updatedAt: t.timestamp().defaultNow(),
	},
	(tb) => [t.index("form_field_form_idx").on(tb.form)],
);

export const formFieldRelations = relations(formField, ({ many, one }) => ({
	form: one(form, {
		fields: [formField.form],
		references: [form.shortId],
	}),
	responses: many(response),
}));

export type FormField = typeof formField.$inferInsert;
export type FormFieldSelect = typeof formField.$inferSelect;
