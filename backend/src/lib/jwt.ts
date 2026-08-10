import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { getEnv } from './env';

export interface AccessTokenPayload {
  sub: string;
}

export function signAccessToken(userId: string): string {
  const env = getEnv();
  return jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const env = getEnv();
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
  if (typeof decoded === 'string' || typeof decoded.sub !== 'string') {
    throw new Error('Malformed access token payload');
  }
  return { sub: decoded.sub };
}

/**
 * Refresh tokens are opaque random strings, not JWTs — only a sha256 hash of
 * the token is ever persisted, so a leaked database dump alone can't be used
 * to forge a session (mirrors how you'd store a password).
 */
export function generateOpaqueToken(): string {
  return crypto.randomBytes(48).toString('base64url');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function refreshTokenExpiry(): Date {
  const env = getEnv();
  return new Date(Date.now() + env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
}
