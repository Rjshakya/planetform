import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { form } from "./form";

export const workspace = pgTable(
	"workspaces",
	{
		id: t.uuid().primaryKey().default(sql`gen_random_uuid()`),
		name: t.varchar().default("my-work-space"),
		owner: t
			.text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		customerId: t.text().references(() => user.dodoCustomerId, {
			onDelete: "cascade",
		}),
		createdAt: t.timestamp().defaultNow().notNull(),
		updatedAt: t.timestamp().defaultNow().notNull(),
	},
	(tb) => [
		t.index("owner_idx").on(tb.owner),
		t.index("wrk_customer_idx").on(tb.customerId),
	],
);

export const workspaceRelations = relations(workspace, ({ many, one }) => ({
	forms: many(form),
	owner: one(user, {
		fields: [workspace.owner],
		references: [user.id],
	}),
}));

export type Workspace = typeof workspace.$inferInsert;
export type WorkspaceSelect = typeof workspace.$inferSelect;
