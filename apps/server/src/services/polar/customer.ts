import { Result } from "better-result";
import { polarClient } from "../../utils/auth";
import { env } from "cloudflare:workers";

export const isPaidCustomer = async (userId: string) => {
  return Result.tryPromise(async () => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: userId,
    });

    const activeProSubscription = customer.activeSubscriptions.find(
      (sub) => sub.productId === env.PRO_PLAN_PRODUCT_ID,
    );

    if (!activeProSubscription) {
      return false;
    }
    return activeProSubscription.status === "active";
  });
};

export const getCustomer = async (userId: string) => {
  return Result.tryPromise(async () => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: userId,
    });
    return customer;
  });
};
