import { Result } from "better-result";
import { Polar } from "@polar-sh/sdk";
import { PolarApiError, Benefits, FreePlanBenefits, ProPlanBenefits, CustomerState, Subscription } from "./types";

/**
 * Get customer state from Polar by externalId (our userId)
 * This queries Polar directly - no local caching
 */
export const getCustomerState =
  (deps: { polarClient: Polar }) =>
    (params: { userId: string }): Promise<Result<CustomerState, PolarApiError>> =>
      Result.tryPromise({
        try: async () => {
          const { polarClient } = deps;
          const { userId } = params;

          const state = await polarClient.customers.getStateExternal({
            externalId: userId,
          });

          // Cast to our type since we know the shape matches
          return state as CustomerState
        },
        catch: (error) =>
          new PolarApiError({
            message: "Failed to fetch customer state from Polar",
            cause: error,
          }),
      });

/**
 * Check if user has an active subscription to a specific product
 */
export const hasActiveSubscription =
  (deps: { polarClient: Polar }) =>
    (params: { userId: string; productId: string }): Promise<Result<boolean, PolarApiError>> =>
      Result.gen(async function*() {
        const state = yield* await getCustomerState(deps)({ userId: params.userId });

        const hasActive = state.activeSubscriptions.some(
          (sub: Subscription) => sub.productId === params.productId && sub.status === "active",
        );

        return Result.ok(hasActive);
      });

/**
 * Get plan benefits based on user's subscription status
 * Returns either FreePlanBenefits or ProPlanBenefits as a discriminated union
 */
export const getPlanBenefits =
  (deps: { polarClient: Polar; proProductId: string }) =>
    (params: { userId: string }): Promise<Result<Benefits, PolarApiError>> =>
      Result.gen(async function*() {
        const isPro = yield* await hasActiveSubscription({ polarClient: deps.polarClient })({
          userId: params.userId,
          productId: deps.proProductId,
        });

        if (isPro) {
          return Result.ok({
            plan: "pro",
            pro: true,
            maxWorkspaces: Infinity,
            maxFormsPerWorkspace: Infinity,
            maxResponsesPerMonth: Infinity,
            allowCustomDomains: true,
            allowAdvancedAnalytics: true,
            allowIntegrations: true,
          } satisfies ProPlanBenefits);
        }

        return Result.ok({
          plan: "free",
          pro: false,
          maxWorkspaces: 1,
          maxFormsPerWorkspace: 10,
          maxResponsesPerMonth: Infinity,
          allowCustomDomains: false,
          allowAdvancedAnalytics: false,
          allowIntegrations: false,
        } satisfies FreePlanBenefits);
      });

/**
 * Check if user is on pro plan (convenience wrapper)
 */
export const isProUser =
  (deps: { polarClient: Polar; proProductId: string }) =>
    (params: { userId: string }): Promise<Result<boolean, PolarApiError>> =>
      hasActiveSubscription({ polarClient: deps.polarClient })({
        userId: params.userId,
        productId: deps.proProductId,
      });
