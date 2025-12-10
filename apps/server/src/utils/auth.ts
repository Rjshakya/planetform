import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "../db/config";
import { auth } from "../db/schema";
import { env } from "cloudflare:workers";
import {
  dodopayments,
  checkout,
  portal,
  webhooks,
} from "@dodopayments/better-auth";
import DodoPayments from "dodopayments";

export const dodoPayments = new DodoPayments({
  bearerToken: env.DODO_PAYMENTS_API_KEY ? env.DODO_PAYMENTS_API_KEY : 'My Bearer Token',
  environment: "live_mode",
});

export const getAuth = async () => {
  const { FRONTEND_URL, TRUSED_DOMAIN } = env;
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
          defaultValue: "null",
        },
      },
    },
    trustedOrigins: [FRONTEND_URL, TRUSED_DOMAIN],
    socialProviders: {
      google: {
        prompt: "consent",
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        accessType: "offline",
        display: "popup",
        
      },
      notion: {
        clientId: process.env.NOTION_CLIENT_ID as string,
        clientSecret: process.env.NOTION_CLIENT_SECRET as string,
      },
      slack: {
        clientId: process.env.SLACK_CLIENT_ID,
        clientSecret: process.env.SLACK_CLIENT_SECRET,
      },
    },
    plugins: [
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
            successUrl: `${process.env.FRONTEND_URL}/dashboard`,
            authenticatedUsersOnly: true,
          }),
          portal(),
          webhooks({
            webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET,
            onPayload: async (payload: any) => {
              console.log("Received webhook:", payload?.type);
            },
          }),
        ],
      }),
    ],

  });
};
