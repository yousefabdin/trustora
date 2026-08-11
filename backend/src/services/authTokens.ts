import { prisma } from '../db/client';
import { generateOpaqueToken, hashToken, refreshTokenExpiry, signAccessToken } from '../lib/jwt';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

export async function issueTokenPair(userId: string): Promise<TokenPair> {
  const accessToken = signAccessToken(userId);
  const refreshToken = generateOpaqueToken();
  const refreshTokenExpiresAt = refreshTokenExpiry();

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshTokenExpiresAt,
    },
  });

  return { accessToken, refreshToken, refreshTokenExpiresAt };
}
