import type { Polar } from "@polar-sh/sdk";
import { Result, TaggedError } from "better-result";
import { count, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { form as formTable } from "../db/schema/form";
import { workspace as workspaceTable } from "../db/schema/workspace";
import { withCache } from "../utils/cache";
import { CacheKeyStore } from "../utils/cache-keys";
import { getPlanBenefits } from "./customer";
import { PolarApiError } from "./types";
import { makeRepo } from "../db/config";

export class BillingGateError extends TaggedError("BillingGateError")<{
  code: "UPGRADE_REQUIRED";
  message: string;
  current: number;
  max: number;
}>() { }

export const getCachedPlanBenefits =
  (deps: { polarClient: Polar; proProductId: string }) =>
    (params: { userId: string }) => {
      return Result.tryPromise({
        try: async () => {
          return withCache(
            CacheKeyStore.billing.planBenefits(params.userId),
            300,
            async () => {
              const result = await getPlanBenefits(deps)(params);
              if (Result.isError(result)) {
                throw result.error;
              }
              return result.value;
            }
          );
        },
        catch: (err) => {
          return new PolarApiError({
            message: "Failed to /gates/getCachedPlanBenefits",
            cause: err
          })
        }
      })
    }


export const checkCanCreateWorkspace =
  (deps: {
    db: NodePgDatabase<any>;
    polarClient: Polar;
    proProductId: string;
  }) =>
    (params: { userId: string }) =>
      Result.gen(async function*() {

        const benefits = yield* Result.await(
          getCachedPlanBenefits({
            polarClient: deps.polarClient,
            proProductId: deps.proProductId,
          })({ userId: params.userId }),
        );

        const repo = makeRepo<typeof workspaceTable>(deps.db)(workspaceTable)
        const currentCount = yield* Result.await(repo.wrap(async (db) => {
          const [{ count: current }] = await db
            .select({ count: count() })
            .from(workspaceTable)
            .where(eq(workspaceTable.owner, params.userId));

          return current

        }))

        if (
          benefits.maxWorkspaces !== 9999 &&
          currentCount >= benefits.maxWorkspaces
        ) {
          return yield* Result.err(
            new BillingGateError({
              code: "UPGRADE_REQUIRED",
              message: `You have reached the maximum number of workspaces (${benefits.maxWorkspaces}). Upgrade to Pro for unlimited workspaces.`,
              current: currentCount,
              max: benefits.maxWorkspaces,
            }),
          );
        }

        return Result.ok(benefits);
      });

export const checkCanCreateForm =
  (deps: {
    db: NodePgDatabase<any>;
    polarClient: Polar;
    proProductId: string;
  }) =>
    (params: { userId: string; workspaceId: string }) =>
      Result.gen(async function*() {
        const benefits = yield* Result.await(
          getCachedPlanBenefits({
            polarClient: deps.polarClient,
            proProductId: deps.proProductId,
          })({ userId: params.userId }),
        );

        const repo = makeRepo<typeof formTable>(deps.db)(formTable)
        const currentCount = yield* Result.await(repo.wrap(async (db) => {
          const [{ count: current }] = await db
            .select({ count: count() })
            .from(formTable)
            .where(eq(formTable.workspace, params.workspaceId));

          return current

        }))

        if (
          benefits.maxFormsPerWorkspace !== 9999 &&
          currentCount >= benefits.maxFormsPerWorkspace
        ) {
          return yield* Result.err(
            new BillingGateError({
              code: "UPGRADE_REQUIRED",
              message: `You have reached the maximum number of forms (${benefits.maxFormsPerWorkspace}) for this workspace. Upgrade to Pro for unlimited forms.`,
              current: currentCount,
              max: benefits.maxFormsPerWorkspace,
            }),
          );
        }

        return Result.ok(benefits);
      });

export const checkCanUseCustomDomain =
  (deps: { polarClient: Polar; proProductId: string }) =>
    (params: { userId: string }) =>
      Result.gen(async function*() {
        const benefits = yield* Result.await(
          getCachedPlanBenefits(deps)({ userId: params.userId }),
        );

        if (!benefits.allowCustomDomains) {
          return yield* Result.err(
            new BillingGateError({
              code: "UPGRADE_REQUIRED",
              message:
                "Custom domains require a Pro plan. Upgrade to access this feature.",
              current: 0,
              max: 0,
            }),
          );
        }

        return Result.ok(benefits);
      });


export const checkCanCreateEmailIntegration = (deps: { polarClient: Polar, proProductId: string }) => (params: { userId: string }) => {

  return Result.gen(async function*() {
    const benefits = yield* Result.await(
      getCachedPlanBenefits(deps)({ userId: params.userId }),
    );


    if (!benefits.pro) {
      return yield* Result.err(
        new BillingGateError({
          code: "UPGRADE_REQUIRED",
          message:
            "Custom domains require a Pro plan. Upgrade to access this feature.",
          current: 0,
          max: 0,
        }),
      );

    }

    return Result.ok(benefits)

  })
}
