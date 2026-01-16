import * as t from "drizzle-orm/pg-core";
import { form } from "./form";
import { user } from "./auth";
import { relations, sql } from "drizzle-orm";

export const formSetting = t.pgTable("form_settings", {
  id: t.uuid().primaryKey().default(sql`gen_random_uuid()`),
  customisation: t.jsonb(),
  closed: t.boolean().default(false),
  closedMessage: t.text().default("This form is closed."),
  closingTime: t.timestamp(),
  closeAfterSubmissions: t.integer(),
  formId: t
    .text()
    .notNull()
    .references(() => form.shortId, { onDelete: "cascade" }),
  customerId: t
    .text()
    .notNull()
    .references(() => user.dodoCustomerId, { onDelete: "cascade" }),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp().defaultNow().notNull(),
});

export const formSettingTableRelations = relations(
  formSetting,
  ({ many, one }) => ({
    form: one(form, {
      fields: [formSetting.formId],
      references: [form.shortId],
    }),
  }),
);

export type FormSetting = typeof formSetting.$inferInsert;
export type FormSettingSelect = typeof formSetting.$inferSelect;
