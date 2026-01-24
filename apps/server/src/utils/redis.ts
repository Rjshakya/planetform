import { env } from "cloudflare:workers";
import { Redis } from "@upstash/redis/cloudflare";

const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env;

export const getRedis = () =>
	new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN });
