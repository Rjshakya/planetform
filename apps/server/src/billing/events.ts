import { Result } from "better-result";
import { Polar } from "@polar-sh/sdk";
import { PolarApiError, BillingEvent } from "./types";

/**
 * Ingest a billing event to Polar
 * Use this to track usage for usage-based billing
 */
export const ingestEvent =
	(deps: { polarClient: Polar }) =>
	(params: BillingEvent): Promise<Result<{ success: true }, PolarApiError>> =>
		Result.tryPromise({
			try: async () => {
				const { polarClient } = deps;

				await polarClient.events.ingest({
					events: [
						{
							name: params.name,
							externalCustomerId: params.userId,
							metadata: params.metadata,
						},
					],
				});

				return { success: true as const };
			},
			catch: (error) =>
				new PolarApiError({
					message: "Failed to ingest billing event",
					cause: error,
				}),
		});

/**
 * Ingest multiple billing events in batch
 */
export const ingestEvents =
	(deps: { polarClient: Polar }) =>
	(params: { events: BillingEvent[] }): Promise<Result<{ success: true }, PolarApiError>> =>
		Result.tryPromise({
			try: async () => {
				const { polarClient } = deps;
				const { events } = params;

				await polarClient.events.ingest({
					events: events.map((event) => ({
						name: event.name,
						externalCustomerId: event.userId,
						metadata: event.metadata,
					})),
				});

				return { success: true as const };
			},
			catch: (error) =>
				new PolarApiError({
					message: "Failed to ingest billing events batch",
					cause: error,
				}),
		});

// ============================================================================
// Event Creators - Factory functions for common billing events
// ============================================================================

/**
 * Create a form response event
 * Track when a user receives a form submission
 */
export const createFormResponseEvent = (params: {
	userId: string;
	formId: string;
	responseCount?: number;
}): BillingEvent => ({
	name: "form_response",
	userId: params.userId,
	metadata: {
		formId: params.formId,
		responseCount: params.responseCount ?? 1,
	},
});

/**
 * Create an email sent event
 * Track when an email notification is sent
 */
export const createEmailSentEvent = (params: {
	userId: string;
	emailType: "notification" | "confirmation" | "welcome" | "reminder";
	recipientCount?: number;
}): BillingEvent => ({
	name: "email_sent",
	userId: params.userId,
	metadata: {
		emailType: params.emailType,
		recipientCount: params.recipientCount ?? 1,
	},
});

/**
 * Create a file upload event
 * Track when files are uploaded
 */
export const createFileUploadEvent = (params: {
	userId: string;
	formId: string;
	fileSize: number;
	fileType: string;
}): BillingEvent => ({
	name: "file_upload",
	userId: params.userId,
	metadata: {
		formId: params.formId,
		fileSizeBytes: params.fileSize,
		fileType: params.fileType,
	},
});

/**
 * Create a custom domain created event
 * Track when a user creates a custom domain
 */
export const createCustomDomainEvent = (params: {
	userId: string;
	formId: string;
	hostname: string;
}): BillingEvent => ({
	name: "custom_domain_created",
	userId: params.userId,
	metadata: {
		formId: params.formId,
		hostname: params.hostname,
	},
});

/**
 * Create a workspace created event
 * Track when a user creates a workspace
 */
export const createWorkspaceCreatedEvent = (params: {
	userId: string;
	workspaceId: string;
	workspaceCount: number;
}): BillingEvent => ({
	name: "workspace_created",
	userId: params.userId,
	metadata: {
		workspaceId: params.workspaceId,
		workspaceCount: params.workspaceCount,
	},
});

/**
 * Create a form created event
 * Track when a user creates a form
 */
export const createFormCreatedEvent = (params: {
	userId: string;
	workspaceId: string;
	formId: string;
	formCount: number;
}): BillingEvent => ({
	name: "form_created",
	userId: params.userId,
	metadata: {
		workspaceId: params.workspaceId,
		formId: params.formId,
		formCount: params.formCount,
	},
});

/**
 * Create an integration connected event
 * Track when a user connects an integration
 */
export const createIntegrationConnectedEvent = (params: {
	userId: string;
	integrationType: "google_sheets" | "notion" | "slack" | "webhook";
}): BillingEvent => ({
	name: "integration_connected",
	userId: params.userId,
	metadata: {
		integrationType: params.integrationType,
	},
});
