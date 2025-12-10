import { eq } from "drizzle-orm";
import { getDb } from "../db/config";
import { user } from "../db/schema/auth";
import { dodoPayments } from "../utils/auth";
import { commonCatch } from "../utils/error";

export const getSubscriptionsPlansService = async () => {
  try {
    const res = await dodoPayments.products.list();

    return res.items;
  } catch (e) {
    commonCatch(e);
  }
};

export const getUserSubscriptionsService = async (userId: string) => {
  try {
    if (!userId) return;

    const db = await getDb();

    const [userFromDb] = await db
      .select({ customerId: user.dodoCustomerId })
      .from(user)
      .where(eq(user.id, userId));
    const { customerId } = userFromDb;

    const res = await dodoPayments.subscriptions.list({
      customer_id: customerId!,
    });

    const activeSubscriptions = res?.items?.filter(
      (item) => item?.status === "active"
    );

    const products = await dodoPayments.products.list({});
    const activePlans = activeSubscriptions.map((sub) => {
      const plan = products.items.find(
        (prod) => prod.product_id === sub.product_id
      );

      return {
        subscriptionId: sub?.subscription_id,
        status: sub?.status,
        previousBillingData: sub?.previous_billing_date,
        nextBillingDate: sub?.next_billing_date,
        plan: plan?.name,
        planDescription: plan?.description,
        price: plan?.price,
        priceDetails: plan?.price_detail,
        customerId: sub?.customer.customer_id,
      };
    });

    return activePlans;
  } catch (e) {
    commonCatch(e);
  }
};
