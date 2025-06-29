export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

interface RateRecord {
  count: number;
  expires: number;
}

const records = new Map<string, RateRecord>();

export function checkRateLimit(
  identifier: string,
  { windowMs, maxRequests }: RateLimitOptions,
): boolean {
  const now = Date.now();
  const record = records.get(identifier) || {
    count: 0,
    expires: now + windowMs,
  };

  if (now > record.expires) {
    record.count = 0;
    record.expires = now + windowMs;
  }

  record.count += 1;
  records.set(identifier, record);

  return record.count <= maxRequests;
}
