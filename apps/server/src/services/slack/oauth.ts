import { env } from "cloudflare:workers";
import { getDb } from "../../db/config";
import { account } from "../../db/schema/auth";
import { v7 } from "uuid";

interface slackOauth {
  clientId: string;
  clientSecret: string;
  scopes: string[];
  redirectUri: URL;
  userId: string;
}

export class SlackOauthService implements slackOauth {
  clientId: string;
  clientSecret: string;
  scopes: string[];
  redirectUri: URL;
  userId: string;

  constructor({ scopes, userId }: { scopes?: string[]; userId: string }) {
    this.clientId = env.SLACK_CLIENT_ID;
    this.clientSecret = env.SLACK_CLIENT_SECRET;
    this.scopes = scopes ?? ["channels:read", "chat:write"];
    this.redirectUri = new URL(
      `${env.BETTER_AUTH_URL}${SlackOauthService.redirectUrlPath()}`,
    );

    this.userId = userId;
  }

  static redirectUrlPath() {
    return "/api/integration/slack/verify";
  }

  static SlackVerifyApiPath() {
    return "/slack/verify";
  }

  static SlackIntegrationAuthApiPath() {
    return "/slack/auth";
  }

  /**
   *
   * @param callbackURL
   * get authorization url to , install
   * planetform app in their slack workspace
   */
  getAuthorizationUrl(callbackURL?: string) {
    const authorizationUrl = new URL("https://slack.com/oauth/v2/authorize");
    authorizationUrl.searchParams.set("client_id", this.clientId);
    authorizationUrl.searchParams.set("scope", this.scopes.join(","));
    const redirectUri = this.redirectUri;

    if (callbackURL) {
      redirectUri.searchParams.set("callback_url", callbackURL);
    }

    authorizationUrl.searchParams.set("redirect_uri", redirectUri.toString());
    return authorizationUrl;
  }

  async verifySlackToken(url: URL) {
    const code = url.searchParams.get("code");
    if (!code) return new Response("Missing code param", { status: 400 });
    const callbackURL = url.searchParams.get("callback_url");

    const redirectUri = this.redirectUri;

    if (callbackURL) {
      redirectUri.searchParams.set("callback_url", callbackURL);
    }

    const formData = new FormData();
    formData.append("code", code);
    formData.append("client_id", this.clientId);
    formData.append("client_secret", this.clientSecret);
    formData.append("redirect_uri", redirectUri.toString());

    const response = await fetch(
      "https://slack.com/api/oauth.v2.access?redirect_uri=" + redirectUri,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json<{
      team?: { id: string };
      access_token: string;
    }>();

    const teamId = data.team?.id;
    if (!teamId) return new Response("Missing team id", { status: 400 });
    return { data, callbackURL };
  }

  async saveAccount(params: {
    team?: {
      id: string;
    };
    access_token: string;
    userId: string;
  }) {
    if (params && "access_token" in params && params.team?.id) {
      const db = await getDb();
      await db.insert(account).values({
        accountId: params.team.id,
        createdAt: new Date(),
        id: v7(),
        providerId: "slack",
        updatedAt: new Date(),
        userId: params.userId,
        accessToken: params.access_token,
      });
    }

    return;
  }
}
