import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { user } from "./auth";
import { form } from "./form";

interface IFormCustomization {
  formBackgroundColor: string | null;
  formFontFamily: string | null;
  formFontSize: string | null;
  actionBtnSize: string | null;
  actionBtnColor: string | null;
  formTextColor: string | null;
  actionBtnTextColor: string | null;
  inputBackgroundColor: string | null;
  inputBorderColor: string | null;
  actionBtnBorderColor: string | null;
  formColorScheme: string | null;
  customThankyouMessage: string | null;
}

export const formSetting = t.pgTable("form_settings", {
  id: t
    .uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
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
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp().defaultNow().notNull(),
});

export const formSettingTableRelations = relations(formSetting, ({ one }) => ({
  form: one(form, {
    fields: [formSetting.formId],
    references: [form.shortId],
  }),
}));

export type FormSetting = typeof formSetting.$inferInsert;
export type FormSettingSelect = typeof formSetting.$inferSelect;
