import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { form } from "./form";

export const integration = pgTable(
  "integrations",
  {
    id: t
      .uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    formId: t
      .varchar()
      .references(() => form.shortId, {
        onDelete: "cascade",
      })
      .notNull(),
    type: t.text().notNull(),
    metaData: t.text(),
    customerId: t.text().references(() => user.id, {
      onDelete: "cascade",
    }),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t.timestamp().defaultNow().notNull(),
  },
  (tb) => [
    t.index("integration_form_idx").on(tb.formId),
    t.index("integration_customer_idx").on(tb.customerId),
  ],
);

export const integrationsRelations = relations(integration, ({ one }) => ({
  forms: one(form, {
    fields: [integration.formId],
    references: [form.shortId],
  }),
}));

export type Integration = typeof integration.$inferInsert;
export type IntegrationSelect = typeof integration.$inferSelect;
