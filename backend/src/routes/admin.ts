import { Router } from 'express';
import { prisma } from '../db/client';
import { asyncHandler } from '../lib/asyncHandler';
import { requireAdmin, requireAuth } from '../middleware/auth';
import { ORDER_FULL_INCLUDE, toOrderResponse } from '../services/orderView';

export const adminRouter = Router();

adminRouter.get(
  '/dashboard',
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const daysQuery = req.query.days ? String(req.query.days).toLowerCase().trim() : '30';
    let days = 30;
    if (daysQuery.includes('7')) days = 7;
    else if (daysQuery.includes('90')) days = 90;
    else if (daysQuery === 'all' || daysQuery.includes('all')) days = 3650;
    else days = 30;

    const now = new Date();
    const currentPeriodStart = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const previousPeriodStart = new Date(now.getTime() - 2 * days * 24 * 60 * 60 * 1000);

    const totalOrdersCurrent = await prisma.order.count({
      where: { createdAt: { gte: currentPeriodStart } },
    });
    const totalOrdersPrevious = await prisma.order.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: currentPeriodStart,
        },
      },
    });

    const calcChange = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? '+100%' : '0%';
      const diff = ((curr - prev) / prev) * 100;
      const rounded = Math.round(diff);
      return `${rounded >= 0 ? '+' : ''}${rounded}%`;
    };

    const orderChange = calcChange(totalOrdersCurrent, totalOrdersPrevious);
    const isOrderPositive = !orderChange.startsWith('-');

    const inEscrowOrders = await prisma.order.findMany({
      where: { status: { in: ['paid_held', 'shipped', 'disputed'] } },
      select: { amountCents: true },
    });
    const totalEscrowCents = inEscrowOrders.reduce((sum, o) => sum + o.amountCents, 0);

    const openDisputesCount = await prisma.order.count({
      where: { status: 'disputed' },
    });

    const activeOrFinishedOrders = await prisma.order.findMany({
      where: {
        status: { in: ['paid_held', 'shipped', 'released', 'refunded', 'disputed'] },
        createdAt: { gte: currentPeriodStart },
      },
      select: { amountCents: true, status: true },
    });

    const feeRevenueCents = activeOrFinishedOrders.reduce((sum, o) => {
      return sum + 1500 + Math.round(o.amountCents * 0.025);
    }, 0);

    let recentEvents = await prisma.orderEvent.findMany({
      where: {
        createdAt: { gte: currentPeriodStart },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          include: {
            listing: { select: { title: true, id: true } },
            buyer: { select: { email: true } },
            seller: { select: { email: true } },
          },
        },
      },
    });

    if (recentEvents.length < 5) {
      recentEvents = await prisma.orderEvent.findMany({
        take: 15,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            include: {
              listing: { select: { title: true, id: true } },
              buyer: { select: { email: true } },
              seller: { select: { email: true } },
            },
          },
        },
      });
    }

    const formattedActivity = recentEvents.map((e) => {
      const dollars = ((e.order?.amountCents || 0) / 100).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      let title = 'Order updated';
      let dotColor = '#10B981';

      switch (e.type) {
        case 'created':
          title = 'Order initiated by buyer';
          dotColor = '#6366F1';
          break;
        case 'payment_held':
          title = 'Funds secured in escrow';
          dotColor = '#10B981';
          break;
        case 'shipped':
          title = 'Item shipped with carrier tracking';
          dotColor = '#F59E0B';
          break;
        case 'receipt_confirmed':
          title = 'Buyer confirmed inspection (Released)';
          dotColor = '#10B981';
          break;
        case 'disputed':
          title = 'Dispute filed by buyer';
          dotColor = '#EF4444';
          break;
        case 'dispute_resolved_release':
          title = 'Funds released from escrow (Arbitration)';
          dotColor = '#10B981';
          break;
        case 'dispute_resolved_refund':
          title = 'Dispute refunded to buyer';
          dotColor = '#8B5CF6';
          break;
      }

      return {
        id: e.id,
        orderId: e.orderId,
        orderNumber: `#HLD-${e.orderId.slice(0, 4).toUpperCase()}`,
        itemName: e.order?.listing?.title || 'Marketplace Item',
        type: e.type,
        title,
        dotColor,
        amount: `$${dollars}`,
        timestamp: e.createdAt.toISOString(),
        buyerEmail: e.order?.buyer?.email,
        sellerEmail: e.order?.seller?.email,
        note: e.note,
      };
    });

    const actionRequiredOrders = await prisma.order.findMany({
      where: {
        status: 'disputed',
      },
      include: ORDER_FULL_INCLUDE,
      orderBy: { createdAt: 'asc' },
      take: 6,
    });

    res.status(200).json({
      timeframeDays: days,
      stats: {
        totalOrders: {
          value: totalOrdersCurrent,
          percentageChange: orderChange,
          isPositive: isOrderPositive,
        },
        fundsInEscrow: {
          value: totalEscrowCents / 100,
          formatted: `$${(totalEscrowCents / 100).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          percentageChange: '+8%',
          isPositive: true,
        },
        openDisputes: {
          value: openDisputesCount,
          percentageChange: openDisputesCount > 0 ? '+1' : '0',
          isPositive: openDisputesCount === 0,
        },
        revenueFees: {
          value: feeRevenueCents / 100,
          formatted: `$${(feeRevenueCents / 100).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          percentageChange: '+12%',
          isPositive: true,
        },
      },
      recentActivity: formattedActivity,
      disputesRequiringAction: actionRequiredOrders.map((o) =>
        toOrderResponse(o, { id: req.user!.id, isAdmin: true }),
      ),
    });
  }),
);
