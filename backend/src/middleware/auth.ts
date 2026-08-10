import { NextFunction, Request, Response } from 'express';
import { prisma } from '../db/client';
import { forbidden, unauthenticated } from '../lib/errors';
import { verifyAccessToken } from '../lib/jwt';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  isAdmin: boolean;
  roles: Role[];
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw unauthenticated();
    }
    const token = header.slice('Bearer '.length);

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw unauthenticated('Invalid or expired access token');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw unauthenticated();
    }

    req.user = { id: user.id, email: user.email, isAdmin: user.isAdmin, roles: user.roles };
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(role: Role) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(unauthenticated());
      return;
    }
    if (!req.user.roles.includes(role)) {
      next(forbidden(`This action requires the '${role}' role`));
      return;
    }
    next();
  };
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(unauthenticated());
    return;
  }
  if (!req.user.isAdmin) {
    next(forbidden('Admin access required'));
    return;
  }
  next();
}
