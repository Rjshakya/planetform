import { Result } from "better-result";
import { createMiddleware } from "hono/factory";
import {
  BillingGateError,
  checkCanCreateEmailIntegration,
  checkCanCreateForm,
  checkCanCreateWorkspace,
  checkCanUseCustomDomain,
} from "../billing/gates";
import type { Benefits } from "../billing/types";
import { getDb } from "../db/config";
import { env } from "cloudflare:workers";
import { polarClient } from "../utils/auth";

type GateContext = {
  Variables: {
    userId: string | null;
    planBenefits?: Benefits;
  };
};

export const canCreateWorkspaceMiddleware = createMiddleware<GateContext>(
  async (c, next) => {
    const userId = c.get("userId");
    if (!userId) {
      return c.json(
        { error: "UNAUTHORIZED", message: "User ID required" },
        401,
      );
    }
    const db = await getDb()
    const check = checkCanCreateWorkspace({ db, polarClient: polarClient, proProductId: env.PRO_PLAN_PRODUCT_ID })
    const result = await check({ userId })

    if (Result.isError(result)) {
      const error = result.error;
      if (error instanceof BillingGateError) {
        return c.json(
          {
            error: error.code,
            message: error.message,
            limits: { current: error.current, max: error.max },
          },
          403,
        );
      }

      return c.json({
        error: "Internal server error",
        message: "Internal server error",
      }, 500)
    }

    c.set("planBenefits", result.value);
    await next();
  },
);

export const canCreateFormMiddleware = createMiddleware<GateContext>(
  async (c, next) => {
    const userId = c.get("userId");
    if (!userId) {
      return c.json(
        { error: "UNAUTHORIZED", message: "User ID required" },
        401,
      );
    }

    let workspaceId: string;
    try {


      const body = (await c.req.json()) as {
        formValues: { workspace: string };
      };
      workspaceId = body.formValues.workspace;
    } catch {
      return c.json(
        {
          error: "BAD_REQUEST",
          message: "Missing workspace in request body",
        },
        400,
      );
    }

    const db = await getDb()
    const check = checkCanCreateForm({
      db,
      polarClient,
      proProductId: env.PRO_PLAN_PRODUCT_ID,
    });

    const result = await check({ userId, workspaceId })

    if (Result.isError(result)) {
      const error = result.error;

      if (error instanceof BillingGateError) {
        return c.json(
          {
            error: error.code,
            message: error.message,
            limits: { current: error.current, max: error.max },
          },
          403,
        )
      }

      return c.json({
        error: "Internal server error",
        message: "Internal server error",
      }, 500)



    }

    c.set("planBenefits", result.value);
    await next();
  },
);

export const canUseCustomDomainMiddleware = createMiddleware<GateContext>(
  async (c, next) => {
    const userId = c.get("userId");
    if (!userId) {
      return c.json(
        { error: "UNAUTHORIZED", message: "User ID required" },
        401,
      );
    }

    const check = checkCanUseCustomDomain({
      polarClient,
      proProductId: env.PRO_PLAN_PRODUCT_ID
    });

    const result = await check({ userId })

    if (Result.isError(result)) {
      const error = result.error;

      if (error instanceof BillingGateError) {
        return c.json(
          {
            error: error.code,
            message: error.message,
          },
          403,
        )


      }


      return c.json({
        error: "Internal server error",
        message: "Internal server error",
      }, 500)

    }

    c.set("planBenefits", result.value);
    await next();
  },
);

export const canCreateEmailIntegrationMiddleware = createMiddleware<GateContext>(
  async (c, next) => {
    const userId = c.get("userId");
    if (!userId) {
      return c.json(
        { error: "UNAUTHORIZED", message: "User ID required" },
        401,
      );
    }

    const check = checkCanCreateEmailIntegration({
      polarClient,
      proProductId: env.PRO_PLAN_PRODUCT_ID
    });

    const result = await check({ userId })

    if (Result.isError(result)) {
      const error = result.error;

      if (error instanceof BillingGateError) {
        return c.json(
          {
            error: error.code,
            message: error.message,
          },
          403,
        )


      }


      return c.json({
        error: "Internal server error",
        message: "Internal server error",
      }, 500)

    }

    c.set("planBenefits", result.value);
    await next();
  },
)
