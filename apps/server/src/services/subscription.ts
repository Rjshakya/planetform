import { type Product } from "@polar-sh/sdk/models/components/product.js";
import { polarClient } from "../utils/auth";
import { Result } from "better-result";
import { env } from "cloudflare:workers";
import { SubscriptionServiceError } from "../errors";

type SubscriptionPlan = Omit<
  Product,
  | "organizationId"
  | "attachedCustomFields"
  | "recurringIntervalCount"
  | "isArchived"
  | "metadata"
  | "trialIntervalCount"
>;

export const getSubscriptionPlansService = () => {
  return Result.tryPromise({
    try: async () => {
      const getPlans = await polarClient.products.list({
        organizationId: env.POLAR_ORG_ID,
      });
      const plans: SubscriptionPlan[] = getPlans.result.items.map((p) => {
        return {
          ...p,
        };
      });

      return plans;
    },
    catch: (e) =>
      new SubscriptionServiceError({
        cause: e,
        operation: "getSubscriptionPlansService",
      }),
  });
};
