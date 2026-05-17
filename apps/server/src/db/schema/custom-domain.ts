import { type InferInsertModel, type InferSelectModel, sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { user } from "./auth";
import { form } from "./form";

export const customDomainTable = t.pgTable("custom_domain", {
  id: t
    .uuid()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  formId: t
    .uuid()
    .notNull()
    .references(() => form.id, { onDelete: "cascade" }),
  cfId: t.text(),
  hostName: t.text().notNull(),
  status: t.text().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t.timestamp().defaultNow().notNull(),
});

export type customDomainTableInsert = InferInsertModel<
  typeof customDomainTable
>;
export type customDomainTableSelect = InferSelectModel<
  typeof customDomainTable
>;
