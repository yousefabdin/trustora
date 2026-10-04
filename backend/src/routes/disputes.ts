import { Router } from 'express';
import { prisma } from '../db/client';
import { asyncHandler } from '../lib/asyncHandler';
import { requireAdmin, requireAuth } from '../middleware/auth';
import { ORDER_FULL_INCLUDE, toOrderResponse } from '../services/orderView';

export const disputesRouter = Router();

disputesRouter.get(
  '/',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { status: 'disputed' },
          { disputeReason: { not: null } },
          {
            events: {
              some: {
                type: { in: ['dispute_resolved_release', 'dispute_resolved_refund', 'disputed'] },
              },
            },
          },
        ],
      },
      include: ORDER_FULL_INCLUDE,
      orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json(orders.map((o) => toOrderResponse(o, { id: req.user!.id, isAdmin: true })));
  }),
);

