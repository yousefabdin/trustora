import rateLimit from 'express-rate-limit';

/**
 * Blunt credential-stuffing / signup-spam attempts. In-memory store is fine
 * for this scope (single instance); swap the `store` option for a
 * Redis-backed one if this ever runs behind multiple instances.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many attempts, please try again later' } },
});
