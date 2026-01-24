import { relations, sql, Table } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { workspace } from "./workspace";
import { user } from "./auth";

import { respondent } from "./respondent";
import { response } from "./response";
import { integration } from "./integration";
import { formField } from "./form.fields";
import { formSetting } from "./form.settings";

export const form = pgTable(
  "forms",
  {
    id: t.uuid().primaryKey().default(sql`gen_random_uuid()`),
    name: t.varchar({ length: 255 }).notNull(),
    workspace: t
      .uuid()
      .references(() => workspace.id, { onDelete: "cascade" })
      .notNull(),
    creator: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    customerId: t
      .text()
      .notNull()
      .references(() => user.dodoCustomerId, { onDelete: "cascade" }),
    shortId: t.varchar({ length: 255 }).unique(),
    form_schema: t.text().notNull(),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t.timestamp().defaultNow().notNull(),
  },
  (tb) => [
    t.uniqueIndex("short_idx").on(tb.shortId),
    t.index("form_workspace_idx").on(tb.workspace),
    t.index("form_cutomer_idx").on(tb.customerId),
  ],
);

export const formRelations = relations(form, ({ one, many }) => ({
  workspace: one(workspace, {
    fields: [form.workspace],
    references: [workspace.id],
  }),
  respondents: many(respondent),
  responses: many(response),
  integrations: many(integration),
  formFields: many(formField),
  formSetting: one(formSetting, {
    fields: [form.shortId],
    references: [formSetting.formId],
  }),
}));

export type Form = typeof form.$inferInsert;
export type FormSelect = typeof form.$inferSelect;
