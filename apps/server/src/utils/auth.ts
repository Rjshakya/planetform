import { env } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Result } from "better-result";
import { and, eq } from "drizzle-orm";
import { getDb } from "../db/config";
import { auth } from "../db/schema";
import { account } from "../db/schema/auth";
import { DatabaseError } from "../errors";
import { refreshGoogleAccessToken } from "./refresh-token";
import { polar, checkout, portal, usage } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: env.NODE_ENV === "production" ? "production" : "sandbox",
});

export const getAuth = async () => {
  const { FRONTEND_URL, TRUSTED_DOMAIN } = env;
  const db = await getDb();

  return betterAuth({
    appName: "planetform",
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 6 * 60,
      },
    },
    rateLimit: {
      enabled: true,
      window: 60,
      max: 1000,
    },
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: auth.user,
        account: auth.account,
        session: auth.session,
        verification: auth.verification,
      },
    }),
    trustedOrigins: [FRONTEND_URL, TRUSTED_DOMAIN],
    socialProviders: {
      google: {
        prompt: "consent",
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        accessType: "offline",
      },
      notion: {
        clientId: env.NOTION_CLIENT_ID,
        clientSecret: env.NOTION_CLIENT_SECRET,
      },
      slack: {
        clientId: env.SLACK_CLIENT_ID,
        clientSecret: env.SLACK_CLIENT_SECRET,
        scope: ["channels:read", "chat:write"],
        disableDefaultScope: true,
        authorizationEndpoint:""
      },
    },
    plugins: [
      polar({
        client: polarClient,
        createCustomerOnSignUp: true,
        use: [
          checkout({
            products: [
              {
                productId: env.PRO_PLAN_PRODUCT_ID, // ID of Product from Polar Dashboard
                slug: "pro", // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
              },
            ],
            successUrl: "/success?checkout_id={CHECKOUT_ID}",
            authenticatedUsersOnly: true,
          }),
          portal(),
          usage(),
        ],
      }),
    ],
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["notion", "google", "slack"],
      },
    },
  });
};

type GetUserCredentialsResponse = {
  accessToken: string;
  refreshToken: string | null;
};

/**
 *
 * if provider is google , it will give refreshed credentials.
 *
 * @param userId
 * @param providerId
 * @returns
 */
export const getUserCredentials = (
  userId: string,
  providerId: "google" | "notion" | "slack",
): Promise<Result<GetUserCredentialsResponse, DatabaseError>> => {
  return Result.tryPromise({
    try: async () => {
      const db = await getDb();
      const [acc] = await db
        .select({
          accessToken: account.accessToken,
          refreshToken: account.refreshToken,
        })
        .from(account)
        .where(
          and(eq(account.userId, userId), eq(account.providerId, providerId)),
        );

      if (providerId === "google" && acc.refreshToken) {
        const tokens = (
          await refreshGoogleAccessToken(acc.refreshToken)
        ).unwrap();
        return tokens;
      }

      return {
        accessToken: acc.accessToken as string,
        refreshToken: acc.refreshToken,
      };
    },
    catch: (e) =>
      new DatabaseError({ cause: e, operation: "getUserCredentials" }),
  });
};
