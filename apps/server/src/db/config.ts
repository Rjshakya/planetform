import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { Pool } from "pg";
import { neon } from "@neondatabase/serverless";
import { env } from "cloudflare:workers";
import * as auth from "./schema/auth";
import * as form from "./schema/form";
import * as formField from "./schema/form.fields";
import * as formSetting from "./schema/form.settings";
import * as response from "./schema/response";
import * as respondent from "./schema/respondent";
import * as workspace from "./schema/workspace";
import * as integration from "./schema/integration";
import * as subscription from "./schema/subscription";
import { upstashCache } from "drizzle-orm/cache/upstash";

export const getDb = async () => {
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, NODE_ENV } = env;

  const pool = new Pool({
    connectionString: env.HYPERDRIVE.connectionString,
    max: 100,
    min: 10,
    idleTimeoutMillis: 10000,
  });

  return drizzle({
    client: pool,
    schema: {
      ...auth,
      ...workspace,
      ...form,
      ...formField,
      ...formSetting,
      ...respondent,
      ...response,
      ...integration,
      ...subscription,
    },
    cache:
      NODE_ENV === "production"
        ? upstashCache({
            token: UPSTASH_REDIS_REST_TOKEN,
            url: UPSTASH_REDIS_REST_URL,
            global: true,
          })
        : undefined,
  });
};

export const getDrizzleConfig = () => {};
