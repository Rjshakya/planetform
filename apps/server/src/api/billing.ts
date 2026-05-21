import { Hono } from "hono";
import { Result } from "better-result";
import { polarClient } from "../utils/auth";
import { env } from "cloudflare:workers";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  getCustomerState,
  hasActiveSubscription,
  getPlanBenefits,
  isProUser,
} from "../billing/customer";

const app = new Hono<{ Variables: { userId: string } }>()

  // Apply auth middleware to all routes
  .use("/*", authMiddleware)

  /**
   * GET /billing/customer
   * Get current customer state from Polar
   */
  .get("/customer", async (c) => {
    const userId = c.get("userId");

    const result = await getCustomerState({ polarClient })({ userId });

    if (Result.isError(result)) {
      return c.json(
        {
          error: result.error.message,
          code: "CUSTOMER_FETCH_FAILED",
        },
        500,
      );
    }

    return c.json(result.value);
  })

  /**
   * GET /billing/subscription
   * Check if user has an active pro subscription
   */
  .get("/subscription", async (c) => {
    const userId = c.get("userId");

    const result = await hasActiveSubscription({ polarClient })({
      userId,
      productId: env.PRO_PLAN_PRODUCT_ID,
    });

    if (Result.isError(result)) {
      return c.json(
        {
          error: result.error.message,
          code: "SUBSCRIPTION_CHECK_FAILED",
        },
        500,
      );
    }

    return c.json({
      hasActiveSubscription: result.value,
      isPro: result.value,
    });
  })

  /**
   * GET /billing/is-pro
   * Quick check if user is on pro plan
   */
  .get("/is-pro", async (c) => {
    const userId = c.get("userId");

    const result = await isProUser({ polarClient, proProductId: env.PRO_PLAN_PRODUCT_ID })({
      userId,
    });

    if (Result.isError(result)) {
      return c.json(
        {
          error: result.error.message,
          code: "PRO_CHECK_FAILED",
        },
        500,
      );
    }

    return c.json({ isPro: result.value });
  })

  /**
   * GET /billing/benefits
   * Get current plan benefits (free or pro)
   */
  .get("/benefits", async (c) => {
    const userId = c.get("userId");

    const result = await getPlanBenefits({
      polarClient,
      proProductId: env.PRO_PLAN_PRODUCT_ID,
    })({ userId });

    if (Result.isError(result)) {
      return c.json(
        {
          error: result.error.message,
          code: "BENEFITS_FETCH_FAILED",
        },
        500,
      );
    }

    return c.json(result.value);
  });

export default app;
