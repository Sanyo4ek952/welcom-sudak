type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const storage = new Map<string, RateLimitEntry>();

export function checkRateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const existing = storage.get(key);

  if (!existing || now > existing.resetAt) {
    storage.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  storage.set(key, existing);
  return { allowed: true, retryAfterSeconds: 0 };
}

export function readClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return headers.get("x-real-ip") ?? "unknown";
}
