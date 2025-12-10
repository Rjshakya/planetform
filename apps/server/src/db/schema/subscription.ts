import * as t from "drizzle-orm/pg-core";

export const subsciption = t.pgTable("susbscription", {
  id: t.text("id").primaryKey(),
  dodoSubscriptionId: t.text("dodo_subscription_id").notNull().unique(),
  customerId: t.text().notNull().unique(),
  status: t.text("status").notNull(),
  productId: t.text().notNull(),
  productName: t.text(),
  nextBillintDate: t.text(),
  previousBillingDate: t.text(),
  paymentFrequencyCount: t.text(),
  paymentFrequencyInterval: t.text(),
  cancelAtNextBillingDate: t.text(),
  currency: t.text(),
  expiresAt: t.text(),
  quantity: t.text(),
  subscriptionPeriodInterval: t.text(),
  subscriptionPeriodCount: t.text(),
  trialPeriodDays: t.text(),
  createdAt: t
    .timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: t
    .timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export type Subsciption = typeof subsciption.$inferInsert;
export type SubsciptionSelect = typeof subsciption.$inferSelect;
