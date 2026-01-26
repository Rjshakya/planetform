import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { form } from "./form";
import { response } from "./response";

export const respondent = pgTable(
  "respondents",
  {
    id: t
      .uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    country: t.text(),
    city: t.text(),
    ip: t.text(),
    longitude: t.text(),
    latitude: t.text(),
    form: t
      .varchar()
      .references(() => form.shortId, {
        onDelete: "cascade",
      })
      .notNull(),
    formCreatorId: t.text().references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t.timestamp().defaultNow().notNull(),
  },
  (tb) => [
    t.index("respondnt_form_idx").on(tb.form),
    t.index("respondnt_customer_idx").on(tb.formCreatorId),
  ],
);

export const respondentRelations = relations(respondent, ({ many, one }) => ({
  form: one(form, {
    fields: [respondent.form],
    references: [form.shortId],
  }),
  responses: many(response),
}));

export type Respondent = typeof respondent.$inferInsert;
export type RespondentSelect = typeof respondent.$inferSelect;
