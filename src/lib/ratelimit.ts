import { type Duration, Ratelimit } from "@upstash/ratelimit";

import { redis } from "@/lib/redis";

export async function checkRateLimit(
  identifier: string,
  requests: number,
  window: Duration,
  prefix: string,
) {
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: `@upstash/ratelimit/${prefix}`,
  });

  const { success, reset } = await ratelimit.limit(identifier);
  if (!success) {
    throw new Error(
      `Rate limit exceeded. Try again in ${new Date(reset).getSeconds()} seconds.`,
    );
  }
}
