/**
 * Small in-memory sliding-window rate limiter.
 *
 * It needs no database or external service. The trade-off: counters live in the memory
 * of one server instance, so on serverless platforms (where several instances may run
 * and restart) the limit is best-effort rather than exact. For stricter limits, swap this
 * for a shared store such as Upstash Redis or your host's firewall rules.
 */

type Bucket = { hits: number[]; windowMs: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 5000;
let lastSweep = 0;

function sweep(now: number) {
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    bucket.hits = bucket.hits.filter((time) => now - time < bucket.windowMs);
    if (bucket.hits.length === 0) buckets.delete(key);
  }
  if (buckets.size > MAX_KEYS) buckets.clear();
}

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  if (now - lastSweep > 60_000 || buckets.size > MAX_KEYS) sweep(now);

  const bucket = buckets.get(key) ?? { hits: [], windowMs };
  bucket.windowMs = windowMs;
  bucket.hits = bucket.hits.filter((time) => now - time < windowMs);

  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    const oldest = bucket.hits[0] ?? now;
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)) };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Best-effort client address. Hosts such as Vercel set `x-forwarded-for` themselves. */
export function clientAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 64);
  }
  return request.headers.get("x-real-ip")?.trim().slice(0, 64) || "unknown";
}
