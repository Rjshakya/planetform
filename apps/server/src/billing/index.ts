// Export all billing types
export type {
	Benefits,
	FreePlanBenefits,
	ProPlanBenefits,
	CustomerState,
	Subscription,
	SubscriptionStatus,
	Benefit,
	Meter,
	BillingEvent,
} from "./types";

// Export webhook payload types from Polar SDK
export type {
	WebhookCustomerStateChangedPayload,
	WebhookSubscriptionActivePayload,
	WebhookSubscriptionCanceledPayload,
	WebhookSubscriptionRevokedPayload,
	WebhookSubscriptionUncanceledPayload,
	WebhookOrderPaidPayload,
	WebhookOrderRefundedPayload,
	WebhookCheckoutCreatedPayload,
	WebhookCheckoutUpdatedPayload,
} from "@polar-sh/sdk/models/components/webhookcustomerstatechangedpayload.js";

// Export errors
export { BillingError, PolarApiError } from "./types";

// Export customer functions
export {
	getCustomerState,
	hasActiveSubscription,
	getPlanBenefits,
	isProUser,
} from "./customer";

// Export event functions
export {
	ingestEvent,
	ingestEvents,
	createFormResponseEvent,
	createEmailSentEvent,
	createFileUploadEvent,
	createCustomDomainEvent,
	createWorkspaceCreatedEvent,
	createFormCreatedEvent,
	createIntegrationConnectedEvent,
} from "./events";

// Export webhook handlers
export {
	handleCustomerStateChanged,
	handleSubscriptionActive,
	handleSubscriptionCanceled,
	handleSubscriptionRevoked,
	handleSubscriptionUncanceled,
	handleOrderPaid,
	handleOrderRefunded,
	handleCheckoutCreated,
	handleCheckoutUpdated,
	handleUnknownWebhook,
} from "./webhooks";
