import { env } from "cloudflare:workers";
import type { WebhookCheckoutCreatedPayload } from "@polar-sh/sdk/models/components/webhookcheckoutcreatedpayload.js";
import type { WebhookCheckoutUpdatedPayload } from "@polar-sh/sdk/models/components/webhookcheckoutupdatedpayload.js";
import type { WebhookCustomerStateChangedPayload } from "@polar-sh/sdk/models/components/webhookcustomerstatechangedpayload.js";
import type { WebhookOrderPaidPayload } from "@polar-sh/sdk/models/components/webhookorderpaidpayload.js";
import type { WebhookOrderRefundedPayload } from "@polar-sh/sdk/models/components/webhookorderrefundedpayload.js";
import type { WebhookSubscriptionActivePayload } from "@polar-sh/sdk/models/components/webhooksubscriptionactivepayload.js";
import type { WebhookSubscriptionCanceledPayload } from "@polar-sh/sdk/models/components/webhooksubscriptioncanceledpayload.js";
import type { WebhookSubscriptionRevokedPayload } from "@polar-sh/sdk/models/components/webhooksubscriptionrevokedpayload.js";
import type { WebhookSubscriptionUncanceledPayload } from "@polar-sh/sdk/models/components/webhooksubscriptionuncanceledpayload.js";
import { Result } from "better-result";
import { CacheKeyStore } from "../utils/cache-keys";

// Logger type for dependency injection
type Logger = {
	info: (message: string, meta?: Record<string, unknown>) => void;
	error: (message: string, meta?: Record<string, unknown>) => void;
	warn: (message: string, meta?: Record<string, unknown>) => void;
};

// Helper type for accessing nested data safely
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PayloadData = any;

/**
 * Handle customer state changed webhook
 * Triggered when anything regarding a customer changes (subscriptions, benefits, etc.)
 */
export const handleCustomerStateChanged =
	(deps: { logger: Logger }) =>
	(
		payload: WebhookCustomerStateChangedPayload,
	): Promise<
		Result<{ processed: true }, { message: string; cause?: unknown }>
	> =>
		Result.tryPromise({
			try: async () => {
				const { logger } = deps;
				const data = payload.data as PayloadData;

				logger.info("Customer state changed", {
					customerId: data?.customer?.id,
					externalId: data?.customer?.externalId,
					email: data?.customer?.email,
					subscriptionCount: data?.subscriptions?.length ?? 0,
					benefitCount: data?.benefits?.length ?? 0,
					meterCount: data?.meters?.length ?? 0,
				});

				// Invalidate cached plan benefits so next request fetches fresh state
				const userId = data?.customer?.externalId as string | undefined;
				if (userId) {
					await env.planetform_kv.delete(
						CacheKeyStore.billing.planBenefits(userId),
					);
				}

				return { processed: true as const };
			},
			catch: (error) => ({
				message: "Failed to process customer state change",
				cause: error,
			}),
		});

/**
 * Handle subscription activated webhook
 * Triggered when a subscription becomes active
 */
export const handleSubscriptionActive =
	(deps: { logger: Logger }) =>
	(
		payload: WebhookSubscriptionActivePayload,
	): Promise<
		Result<{ activated: true }, { message: string; cause?: unknown }>
	> =>
		Result.tryPromise({
			try: async () => {
				const { logger } = deps;
				const data = payload.data as PayloadData;

				logger.info("Subscription activated", {
					userId: data?.customer?.externalId,
					email: data?.customer?.email,
					subscriptionId: data?.id,
					productId: data?.productId,
					productName: data?.product?.name,
					periodStart: data?.currentPeriodStart,
					periodEnd: data?.currentPeriodEnd,
				});

				// Invalidate cached plan benefits
				const userId = data?.customer?.externalId as string | undefined;
				if (userId) {
					await env.planetform_kv.delete(
						CacheKeyStore.billing.planBenefits(userId),
					);
				}

				return { activated: true as const };
			},
			catch: (error) => ({
				message: "Failed to process subscription activation",
				cause: error,
			}),
		});

/**
 * Handle subscription canceled webhook
 * Triggered when a subscription is canceled (but may still be active until period end)
 */
export const handleSubscriptionCanceled =
	(deps: { logger: Logger }) =>
	(
		payload: WebhookSubscriptionCanceledPayload,
	): Promise<
		Result<{ canceled: true }, { message: string; cause?: unknown }>
	> =>
		Result.tryPromise({
			try: async () => {
				const { logger } = deps;
				const data = payload.data as PayloadData;

				logger.info("Subscription canceled", {
					userId: data?.customer?.externalId,
					email: data?.customer?.email,
					subscriptionId: data?.id,
					productId: data?.productId,
					cancelAtPeriodEnd: data?.cancelAtPeriodEnd,
					currentPeriodEnd: data?.currentPeriodEnd,
				});

				// Invalidate cached plan benefits
				const userId = data?.customer?.externalId as string | undefined;
				if (userId) {
					await env.planetform_kv.delete(
						CacheKeyStore.billing.planBenefits(userId),
					);
				}

				return { canceled: true as const };
			},
			catch: (error) => ({
				message: "Failed to process subscription cancellation",
				cause: error,
			}),
		});

/**
 * Handle subscription revoked webhook
 * Triggered when a subscription is immediately revoked (access removed)
 */
export const handleSubscriptionRevoked =
	(deps: { logger: Logger }) =>
	(
		payload: WebhookSubscriptionRevokedPayload,
	): Promise<Result<{ revoked: true }, { message: string; cause?: unknown }>> =>
		Result.tryPromise({
			try: async () => {
				const { logger } = deps;
				const data = payload.data as PayloadData;

				logger.info("Subscription revoked", {
					userId: data?.customer?.externalId,
					email: data?.customer?.email,
					subscriptionId: data?.id,
					productId: data?.productId,
				});

				// Invalidate cached plan benefits
				const userId = data?.customer?.externalId as string | undefined;
				if (userId) {
					await env.planetform_kv.delete(
						CacheKeyStore.billing.planBenefits(userId),
					);
				}

				return { revoked: true as const };
			},
			catch: (error) => ({
				message: "Failed to process subscription revocation",
				cause: error,
			}),
		});

/**
 * Handle subscription uncanceled webhook
 * Triggered when a subscription cancellation is reversed
 */
export const handleSubscriptionUncanceled =
	(deps: { logger: Logger }) =>
	(
		payload: WebhookSubscriptionUncanceledPayload,
	): Promise<
		Result<{ uncanceled: true }, { message: string; cause?: unknown }>
	> =>
		Result.tryPromise({
			try: async () => {
				const { logger } = deps;
				const data = payload.data as PayloadData;

				logger.info("Subscription uncanceled", {
					userId: data?.customer?.externalId,
					email: data?.customer?.email,
					subscriptionId: data?.id,
					productId: data?.productId,
				});

				// Invalidate cached plan benefits
				const userId = data?.customer?.externalId as string | undefined;
				if (userId) {
					await env.planetform_kv.delete(
						CacheKeyStore.billing.planBenefits(userId),
					);
				}

				return { uncanceled: true as const };
			},
			catch: (error) => ({
				message: "Failed to process subscription uncancellation",
				cause: error,
			}),
		});

/**
 * Handle order paid webhook
 * Triggered when an order is paid (purchase, subscription renewal, etc.)
 */
export const handleOrderPaid =
	(deps: { logger: Logger }) =>
	(
		payload: WebhookOrderPaidPayload,
	): Promise<
		Result<{ processed: true }, { message: string; cause?: unknown }>
	> =>
		Result.tryPromise({
			try: async () => {
				const { logger } = deps;
				const data = payload.data as PayloadData;

				logger.info("Order paid", {
					userId: data?.customer?.externalId,
					email: data?.customer?.email,
					orderId: data?.id,
					amount: data?.amount,
					billingReason: data?.billingReason,
				});

				// Could trigger: receipt email, analytics, etc.

				return { processed: true as const };
			},
			catch: (error) => ({
				message: "Failed to process order payment",
				cause: error,
			}),
		});

/**
 * Handle order refunded webhook
 * Triggered when an order is refunded
 */
export const handleOrderRefunded =
	(deps: { logger: Logger }) =>
	(
		payload: WebhookOrderRefundedPayload,
	): Promise<
		Result<{ processed: true }, { message: string; cause?: unknown }>
	> =>
		Result.tryPromise({
			try: async () => {
				const { logger } = deps;
				const data = payload.data as PayloadData;

				logger.info("Order refunded", {
					userId: data?.customer?.externalId,
					email: data?.customer?.email,
					orderId: data?.id,
					amount: data?.amount,
				});

				return { processed: true as const };
			},
			catch: (error) => ({
				message: "Failed to process order refund",
				cause: error,
			}),
		});

/**
 * Handle checkout created webhook
 * Triggered when a checkout is created
 */
export const handleCheckoutCreated =
	(deps: { logger: Logger }) =>
	(
		payload: WebhookCheckoutCreatedPayload,
	): Promise<
		Result<{ processed: true }, { message: string; cause?: unknown }>
	> =>
		Result.tryPromise({
			try: async () => {
				const { logger } = deps;
				const data = payload.data as PayloadData;

				logger.info("Checkout created", {
					checkoutId: data?.id,
					customerId: data?.customerId,
					productId: data?.productId,
					status: data?.status,
				});

				return { processed: true as const };
			},
			catch: (error) => ({
				message: "Failed to process checkout creation",
				cause: error,
			}),
		});

/**
 * Handle checkout updated webhook
 * Triggered when a checkout is updated
 */
export const handleCheckoutUpdated =
	(deps: { logger: Logger }) =>
	(
		payload: WebhookCheckoutUpdatedPayload,
	): Promise<
		Result<{ processed: true }, { message: string; cause?: unknown }>
	> =>
		Result.tryPromise({
			try: async () => {
				const { logger } = deps;
				const data = payload.data as PayloadData;

				logger.info("Checkout updated", {
					checkoutId: data?.id,
					customerId: data?.customerId,
					productId: data?.productId,
					status: data?.status,
				});

				return { processed: true as const };
			},
			catch: (error) => ({
				message: "Failed to process checkout update",
				cause: error,
			}),
		});

/**
 * Generic webhook handler for any unhandled event type
 * Logs the event for debugging
 */
export const handleUnknownWebhook =
	(deps: { logger: Logger }) =>
	(payload: {
		type: string;
		data: unknown;
	}): Promise<Result<{ logged: true }, { message: string; cause?: unknown }>> =>
		Result.tryPromise({
			try: async () => {
				const { logger } = deps;

				logger.warn("Unhandled webhook event", {
					type: payload.type,
					data: payload.data,
				});

				return { logged: true as const };
			},
			catch: (error) => ({
				message: "Failed to log unknown webhook",
				cause: error,
			}),
		});
