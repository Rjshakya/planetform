import { Result } from "better-result";
import { and, eq } from "drizzle-orm";
import { getDb } from "../../db/config.js";
import { integration } from "../../db/schema/integration.js";
import { WebhookIntegrationError } from "../../errors.js";

// export interface IWebhookServiceParams {
//   customerId: string;
// }

export interface WebhookData {
	url: string;
	headers?: Record<string, string>;
}

export class WebhookIntegrationService {
	private error(args: {
		operation: string;
		cause: unknown;
	}): WebhookIntegrationError {
		return new WebhookIntegrationError(args);
	}

	/**
	 * Add a webhook integration for a form
	 * @param formId - The form ID
	 * @param webhookData - URL and headers
	 */
	async addWebhook(
		formId: string,
		webhookData: WebhookData,
	): Promise<Result<string, WebhookIntegrationError>> {
		return Result.tryPromise({
			try: async () => {
				const db = await getDb();
				const [inserted] = await db
					.insert(integration)
					.values({
						formId,
						type: "webhook",
						metaData: JSON.stringify(webhookData),
					})
					.returning({ id: integration.id });
				return inserted.id;
			},
			catch: (e) => this.error({ operation: "addWebhook", cause: e }),
		});
	}

	/**
	 * Delete a webhook integration
	 * @param webhookId - The webhook integration ID
	 */
	async deleteWebhook(
		webhookId: string,
	): Promise<Result<boolean, WebhookIntegrationError>> {
		return Result.tryPromise({
			try: async () => {
				const db = await getDb();
				const result = await db
					.delete(integration)
					.where(eq(integration.id, webhookId))
					.returning({ id: integration.id });
				return result.length > 0;
			},
			catch: (e) => this.error({ operation: "deleteWebhook", cause: e }),
		});
	}

	/**
	 *
	 * @param params
	 * @param responseData
	 * @returns
	 */
	static async send(params: WebhookData, responseData: Record<string, string>) {
		return Result.tryPromise(
			{
				try: () => {
					return fetch(params.url, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							...params.headers,
						},
						body: JSON.stringify(responseData),
					});
				},
				catch: (e) =>
					new WebhookIntegrationError({ cause: e, operation: "send" }),
			},
			{ retry: { backoff: "exponential", delayMs: 1000, times: 3 } },
		);
	}
}
