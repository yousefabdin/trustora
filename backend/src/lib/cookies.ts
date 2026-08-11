import { Response } from 'express';
import { getEnv } from './env';

export const REFRESH_COOKIE_NAME = 'refreshToken';

export function setRefreshCookie(res: Response, token: string, expiresAt: Date): void {
  const env = getEnv();
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/auth',
    expires: expiresAt,
  });
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/auth' });
}
