import argon2 from 'argon2';
import { Router } from 'express';
import { prisma } from '../db/client';
import { asyncHandler } from '../lib/asyncHandler';
import { REFRESH_COOKIE_NAME, clearRefreshCookie, setRefreshCookie } from '../lib/cookies';
import { AppError, unauthenticated } from '../lib/errors';
import { generateOpaqueToken, hashToken, refreshTokenExpiry, signAccessToken } from '../lib/jwt';
import { loginSchema, signupSchema } from '../lib/validation';
import { validateBody } from '../middleware/validate';
import { issueTokenPair } from '../services/authTokens';
import { toUserResponse } from '../services/userView';

export const authRouter = Router();

authRouter.post(
  '/signup',
  validateBody(signupSchema),
  asyncHandler(async (req, res) => {
    const { email, password, roles } = req.body as {
      email: string;
      password: string;
      roles: ('buyer' | 'seller')[];
    };

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('EMAIL_TAKEN', 'An account with this email already exists');
    }

    const passwordHash = await argon2.hash(password);
    // isAdmin is never accepted from the request body — it has no field in
    // signupSchema at all, so there is no path from client input to admin.
    const user = await prisma.user.create({
      data: { email, passwordHash, roles, isAdmin: false },
    });

    const tokens = await issueTokenPair(user.id);
    setRefreshCookie(res, tokens.refreshToken, tokens.refreshTokenExpiresAt);

    res.status(201).json({ user: toUserResponse(user), accessToken: tokens.accessToken });
  }),
);

authRouter.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const tokens = await issueTokenPair(user.id);
    setRefreshCookie(res, tokens.refreshToken, tokens.refreshTokenExpiresAt);

    res.status(200).json({ user: toUserResponse(user), accessToken: tokens.accessToken });
  }),
);

authRouter.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const presented = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    if (!presented) {
      throw unauthenticated('No refresh token presented');
    }

    const presentedHash = hashToken(presented);
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: presentedHash } });

    if (!stored) {
      throw unauthenticated('Invalid refresh token');
    }

    if (stored.revokedAt) {
      // Reuse of an already-rotated token: treat as compromised and revoke
      // the whole family so a stolen token can't keep refreshing.
      await prisma.refreshToken.updateMany({
        where: { userId: stored.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      clearRefreshCookie(res);
      throw unauthenticated('Refresh token reuse detected; all sessions revoked');
    }

    if (stored.expiresAt.getTime() < Date.now()) {
      throw unauthenticated('Refresh token expired');
    }

    const newRefreshToken = await prisma.$transaction(async (tx) => {
      const newToken = generateOpaqueToken();
      const newExpiresAt = refreshTokenExpiry();
      const newTokenHash = hashToken(newToken);

      await tx.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date(), replacedByTokenHash: newTokenHash },
      });

      await tx.refreshToken.create({
        data: { userId: stored.userId, tokenHash: newTokenHash, expiresAt: newExpiresAt },
      });

      return { token: newToken, expiresAt: newExpiresAt };
    });

    setRefreshCookie(res, newRefreshToken.token, newRefreshToken.expiresAt);

    const accessToken = signAccessToken(stored.userId);
    res.status(200).json({ accessToken });
  }),
);

authRouter.post(
  '/logout',
  asyncHandler(async (req, res) => {
    const presented = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    if (presented) {
      const presentedHash = hashToken(presented);
      await prisma.refreshToken.updateMany({
        where: { tokenHash: presentedHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    clearRefreshCookie(res);
    res.status(204).send();
  }),
);
