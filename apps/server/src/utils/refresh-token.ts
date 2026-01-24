import { Result } from "better-result";
import { RefreshGoogleAccessTokenError } from "../errors";
import { env } from "cloudflare:workers";

export const refreshGoogleAccessToken = (refreshToken: string) => {
	return Result.tryPromise({
		try: async () => {
			const client_id = env.GOOGLE_CLIENT_ID;
			const client_secret = env.GOOGLE_CLIENT_SECRET;

			const response = await fetch("https://oauth2.googleapis.com/token", {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					client_id,
					client_secret,
					refresh_token: refreshToken,
					grant_type: "refresh_token",
				}),
			});

			if (!response.ok) throw new Error("refreshGoogleAccessToken");

			const data = (await response.json()) as any;
			return {
				accessToken: data?.access_token as string,
				refreshToken: refreshToken,
			};
		},
		catch: (e) => new RefreshGoogleAccessTokenError({ cause: e }),
	});
};
