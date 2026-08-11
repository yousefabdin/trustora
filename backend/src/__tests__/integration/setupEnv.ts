import { config } from 'dotenv';

config();

// Integration tests must never run against the dev/prod database — point
// DATABASE_URL at TEST_DATABASE_URL before anything imports the Prisma
// client, since PrismaClient reads DATABASE_URL from the environment at
// construction time.
if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET ??= 'test-access-secret-please-change-me-32ch';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret-please-change-me-32ch';
process.env.JWT_ACCESS_TTL ??= '15m';
process.env.JWT_REFRESH_TTL_DAYS ??= '30';
process.env.CORS_ORIGIN ??= 'http://localhost:5173';
process.env.PAYMENT_PROVIDER ??= 'simulated';
