import { gmail, type gmail_v1 } from "@googleapis/gmail";
import { Result } from "better-result";
import { OAuth2Client } from "google-auth-library";
import { createMimeMessage } from "mimetext";
import { GmailIntegrationError } from "../../errors.js";
import { refreshGoogleAccessToken } from "../../utils/refresh-token.js";

interface IGmailIntegrationServiceParams {
	accessToken: string;
	refreshToken: string;
}

export class GmailIntegrationService {
	private accessToken: string;
	private refreshToken: string;
	private gmail: gmail_v1.Gmail;
	private auth: OAuth2Client;

	constructor(params: IGmailIntegrationServiceParams) {
		const { accessToken, refreshToken } = params;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.auth = new OAuth2Client({
			credentials: { access_token: accessToken, refresh_token: refreshToken },
		});
		this.gmail = gmail({ version: "v1", auth: this.auth });
	}

	private error(args: {
		operation: string;
		cause: unknown;
	}): GmailIntegrationError {
		return new GmailIntegrationError(args);
	}

	/**
	 * Send an email
	 * @param params - Email parameters
	 */
	async send(params: {
		sender: string;
		recipient: string;
		subject: string;
		html?: string;
		text?: string;
	}): Promise<Result<boolean, GmailIntegrationError>> {
		return Result.tryPromise({
			try: async () => {
				await this.handleRefreshToken(this.refreshToken);

				const mimeMessage =
					GmailIntegrationService.getMimeMessage(params).unwrap();
				await this.gmail.users.messages.send({
					userId: "me",
					requestBody: {
						raw: mimeMessage,
					},
				});

				return true;
			},
			catch: (e) => this.error({ operation: "send", cause: e }),
		});
	}

	private async handleRefreshToken(refreshToken: string) {
		const token = (await refreshGoogleAccessToken(refreshToken)).unwrap();
		this.accessToken = token.accessToken;
		this.refreshToken = refreshToken;
		this.auth = new OAuth2Client({
			credentials: {
				access_token: token.accessToken,
				refresh_token: refreshToken,
			},
		});
		this.gmail = gmail({ version: "v1", auth: this.auth });
		return token;
	}

	static getMimeMessage(params: {
		sender: string;
		recipient: string;
		subject: string;
		html?: string;
		text?: string;
	}) {
		return Result.try(() => {
			const msg = createMimeMessage();

			msg.setSender(params.sender);
			msg.setRecipient(params.recipient);
			msg.setSubject(params.subject);

			if (params.html) {
				msg.addMessage({ contentType: "text/html", data: params.html });
			} else if (params.text) {
				msg.addMessage({ contentType: "text/plain", data: params.text });
			}

			return msg.asEncoded();
		});
	}
}
