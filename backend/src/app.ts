import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { getEnv } from './lib/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRateLimiter } from './middleware/rateLimiter';
import { authRouter } from './routes/auth';
import { disputesRouter } from './routes/disputes';
import { listingsRouter } from './routes/listings';
import { meRouter } from './routes/me';
import { ordersRouter } from './routes/orders';

export function createApp(): Express {
  const env = getEnv();
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // The rate limiter's in-memory store is keyed per-process, per-IP. In the
  // automated test suites every request originates from the same test
  // client within a single process, so it would trip well before any test
  // intends to exercise it. It stays active in dev/production.
  if (env.NODE_ENV === 'test') {
    app.use('/auth', authRouter);
  } else {
    app.use('/auth', authRateLimiter, authRouter);
  }
  app.use(meRouter);
  app.use('/listings', listingsRouter);
  app.use('/orders', ordersRouter);
  app.use('/disputes', disputesRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
