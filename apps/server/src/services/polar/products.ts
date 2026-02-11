import { env } from "cloudflare:workers";
import { polarClient } from "../../utils/auth";
import { Result } from "better-result";

export const getProducts = async () => {
  return Result.tryPromise(async () => {
    const products = await polarClient.products.list({
      organizationId: env.POLAR_ORG_ID,
    });
    return products.result.items.filter((p) => !p.isArchived);
  });
};
