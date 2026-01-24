import { env } from "cloudflare:workers";
import {
  checkout,
  dodopayments,
  portal,
  webhooks,
} from "@dodopayments/better-auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Result } from "better-result";
import DodoPayments from "dodopayments";
import { and, eq } from "drizzle-orm";
import { getDb } from "../db/config";
import { auth } from "../db/schema";
import { account } from "../db/schema/auth";
import { DatabaseError } from "../errors";
import { refreshGoogleAccessToken } from "./refresh-token";

export const dodoPayments = new DodoPayments({
  bearerToken: env.DODO_PAYMENTS_API_KEY
    ? env.DODO_PAYMENTS_API_KEY
    : "My Bearer Token",
  environment: "live_mode",
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
    user: {
      additionalFields: {
        dodoCustomerId: {
          type: "string",
          required: false,
        },
      },
    },
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
      },
    },
    plugins: [
      // @ts-expect-error
      dodopayments({
        client: dodoPayments,
        createCustomerOnSignUp: false,
        use: [
          checkout({
            products: [
              {
                productId: "pdt_zhCQkiKwiUGlKqRI6hwp7",
                slug: "Pro",
              },
            ],
            successUrl: `${FRONTEND_URL}/dashboard`,
            authenticatedUsersOnly: true,
          }),
          portal(),
          webhooks({
            webhookKey: env.DODO_PAYMENTS_WEBHOOK_SECRET,
            onPayload: async (payload: any) => {
              console.log("Received webhook:", payload?.type);
            },
          }),
        ],
      }),
    ],
    databaseHooks: {
      user: {
        create: {
          async after(user) {
            try {
              await env.DODO_CUSTOMER_CREATE_WORK_FLOW.create({
                id: user.id,
                params: {
                  email: user.email,
                  name: user.name,
                  userId: user.id,
                },
              });
            } catch (e) {
              console.log(e);
            }
          },
        },
      },
    },
  }) as ReturnType<typeof betterAuth>;
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
