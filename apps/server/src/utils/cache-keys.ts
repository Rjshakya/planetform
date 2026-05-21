/**
 * Centralized cache key registry.
 * All KV cache keys used anywhere in the system must be defined here first.
 * This makes cache invalidation trivial (e.g. from webhooks).
 */

export const CacheKeyStore = {
  billing: {
    planBenefits: (userId: string) => `billing:plan-benefits:${userId}`,
    customerState: (userId: string) => `billing:customer-state:${userId}`,
  },
} as const;
