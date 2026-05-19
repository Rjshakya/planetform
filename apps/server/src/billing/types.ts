import { TaggedError } from "better-result";

// Billing-specific errors
export class BillingError extends TaggedError("BillingError")<{
	message: string;
	code: "CUSTOMER_NOT_FOUND" | "SUBSCRIPTION_NOT_FOUND" | "CHECKOUT_FAILED" | "EVENT_INGESTION_FAILED";
	cause?: unknown;
}>() {}

export class PolarApiError extends TaggedError("PolarApiError")<{
	message: string;
	status?: number;
	cause?: unknown;
}>() {}

// Base benefits interface
type BaseBenefits = {
	maxWorkspaces: number;
	maxFormsPerWorkspace: number;
	maxResponsesPerMonth: number;
	allowCustomDomains: boolean;
	allowAdvancedAnalytics: boolean;
	allowIntegrations: boolean;
};

// Free plan benefits
export type FreePlanBenefits = BaseBenefits & {
	plan: "free";
	pro: false;
};

// Pro plan benefits
export type ProPlanBenefits = BaseBenefits & {
	plan: "pro";
	pro: true;
};

// Discriminated union of all benefit types
export type Benefits = FreePlanBenefits | ProPlanBenefits;

// Subscription status from Polar
export type SubscriptionStatus =
	| "active"
	| "canceled"
	| "past_due"
	| "revoked"
	| "uncanceled";

// Domain types (mirroring what Polar returns, but typed for our use)
export type CustomerState = {
	id: string;
	externalId: string; // our userId
	email: string;
	name?: string;
	createdAt: Date;
	modifiedAt?: Date | null;
	metadata?: Record<string, unknown>;
	activeSubscriptions: Subscription[];
	grantedBenefits: Benefit[];
	activeMeters: Meter[];
};

export type Subscription = {
	id: string;
	status: SubscriptionStatus;
	productId: string;
	productName?: string;
	priceId?: string;
	currentPeriodStart?: Date | string;
	currentPeriodEnd?: Date | string;
	cancelAtPeriodEnd?: boolean;
	canceledAt?: Date | string | null;
};

export type Benefit = {
	id: string;
	description?: string;
	granted?: boolean;
};

export type Meter = {
	id: string;
	name?: string;
	consumed?: number;
	credited?: number;
	balance?: number;
};

// Event ingestion types
export type BillingEvent = {
	name: string;
	userId: string;
	metadata?: Record<string, string | number | boolean>;
};
