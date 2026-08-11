import { Router } from 'express';
import { prisma } from '../db/client';
import { asyncHandler } from '../lib/asyncHandler';
import { notFound } from '../lib/errors';
import { requireAuth } from '../middleware/auth';
import { toUserResponse } from '../services/userView';

export const meRouter = Router();

meRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) throw notFound('User');
    res.status(200).json(toUserResponse(user));
  }),
);
