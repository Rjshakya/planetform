import { env } from "cloudflare:workers";

/**
 * Generic cache helper using Cloudflare KV.
 * @param key - Cache key (should come from CacheKeyStore)
 * @param ttlSeconds - Time-to-live in seconds
 * @param fetcher - Async function that fetches the actual value
 * @returns Cached or freshly fetched value
 */
export async function withCache<T>(
	key: string,
	ttlSeconds: number,
	fetcher: () => Promise<T>,
): Promise<T> {
	const kv = env.planetform_kv;
	const cached = await kv.get(key);
	if (cached) {
		return JSON.parse(cached) as T;
	}

	const value = await fetcher();
	await kv.put(key, JSON.stringify(value), { expirationTtl: ttlSeconds });
	return value;
}
