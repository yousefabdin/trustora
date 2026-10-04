import { Role } from '@prisma/client';
import { Router } from 'express';
import { prisma } from '../db/client';
import { asyncHandler } from '../lib/asyncHandler';
import { AppError, forbidden, notFound } from '../lib/errors';
import {
  createOrderSchema,
  disputeOrderSchema,
  orderQuerySchema,
  resolveOrderSchema,
  shipOrderSchema,
} from '../lib/validation';
import { requireAdmin, requireAuth, requireRole } from '../middleware/auth';
import { loadOrderForParty, requireOrderTransition } from '../middleware/orderAuthz';
import { validateBody, validateQuery } from '../middleware/validate';
import { OrderStatus } from '../services/orderStateMachine';
import { applyOrderTransition } from '../services/orderTransitions';
import { ORDER_FULL_INCLUDE, loadFullOrder, toOrderResponse } from '../services/orderView';
import { getPaymentProvider } from '../services/paymentProvider';

export const ordersRouter = Router();

ordersRouter.post(
  '/',
  requireAuth,
  requireRole(Role.buyer),
  validateBody(createOrderSchema),
  asyncHandler(async (req, res) => {
    const { listingId } = req.body as { listingId: string };

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw notFound('Listing');
    if (listing.status !== 'active') {
      throw new AppError('LISTING_NOT_ACTIVE', 'This listing is not available for purchase');
    }
    if (listing.sellerId === req.user!.id) {
      throw forbidden('You cannot purchase your own listing');
    }

    const provider = getPaymentProvider();

    const orderId = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          listingId: listing.id,
          buyerId: req.user!.id,
          sellerId: listing.sellerId,
          amountCents: listing.priceCents,
          status: 'pending_payment',
        },
      });

      await tx.listing.update({
        where: { id: listing.id },
        data: { status: 'sold' },
      });

      await tx.orderEvent.create({
        data: {
          orderId: created.id,
          actorId: req.user!.id,
          actorRole: 'buyer',
          type: 'created',
          fromStatus: null,
          toStatus: 'pending_payment',
        },
      });

      // Simulated provider call: pure/in-memory, safe to run inside the DB
      // transaction. A real Stripe-backed provider could not sit inside
      // this transaction (see README) and would need an outbox/idempotency
      // pattern instead.
      const hold = await provider.captureAndHold({
        orderId: created.id,
        amountCents: created.amountCents,
        buyerId: created.buyerId,
      });

      await tx.payment.create({
        data: {
          orderId: created.id,
          provider: 'simulated',
          providerRef: hold.providerRef,
          status: 'held',
          amountCents: created.amountCents,
        },
      });

      const updated = await applyOrderTransition(tx, {
        orderId: created.id,
        expectedVersion: created.version,
        expectedStatus: 'pending_payment',
        toStatus: 'paid_held',
        actorId: null,
        actorRole: 'system',
        eventType: 'payment_held',
      });

      return updated.id;
    });

    const full = await loadFullOrder(orderId);
    res.status(201).json(toOrderResponse(full, { id: req.user!.id, isAdmin: req.user!.isAdmin }));
  }),
);

ordersRouter.get(
  '/',
  requireAuth,
  validateQuery(orderQuerySchema),
  asyncHandler(async (req, res) => {
    const { role, search, status, page, limit } = req.query as unknown as {
      role: 'buyer' | 'seller';
      search?: string;
      status?: string;
      page?: number;
      limit?: number;
    };

    const andConditions: any[] = [
      role === 'buyer' ? { buyerId: req.user!.id } : { sellerId: req.user!.id },
    ];

    if (status && status.trim() !== '' && status.toLowerCase() !== 'all') {
      const s = status.trim().toLowerCase();
      if (s === 'in escrow' || s === 'in_escrow' || s === 'paid_held') {
        andConditions.push({ status: { in: ['paid_held', 'pending_payment'] } });
      } else if (s === 'shipped') {
        andConditions.push({ status: { in: ['shipped', 'delivered'] } });
      } else if (s === 'completed' || s === 'released') {
        andConditions.push({ status: 'released' });
      } else if (s === 'disputed') {
        andConditions.push({ status: 'disputed' });
      } else if (s === 'refunded') {
        andConditions.push({ status: 'refunded' });
      } else {
        andConditions.push({ status: s });
      }
    }

    if (search && search.trim() !== '') {
      const rawSearch = search.trim();
      const cleanTerm = rawSearch.replace(/^#/, '').replace(/^hld-/i, '').trim();
      const orConditions: any[] = [
        { listing: { title: { contains: rawSearch, mode: 'insensitive' } } },
        { listing: { description: { contains: rawSearch, mode: 'insensitive' } } },
        { seller: { email: { contains: rawSearch, mode: 'insensitive' } } },
        { buyer: { email: { contains: rawSearch, mode: 'insensitive' } } },
        { trackingInfo: { contains: rawSearch, mode: 'insensitive' } },
      ];
      if (cleanTerm) {
        orConditions.push({ id: { contains: cleanTerm, mode: 'insensitive' } });
      }
      andConditions.push({ OR: orConditions });
    }

    const where = { AND: andConditions };

    if (page !== undefined || limit !== undefined) {
      const pageNum = Math.max(1, page || 1);
      const pageSize = Math.max(1, limit || 6);
      const skip = (pageNum - 1) * pageSize;

      const [total, orders] = await Promise.all([
        prisma.order.count({ where }),
        prisma.order.findMany({
          where,
          include: ORDER_FULL_INCLUDE,
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
        }),
      ]);

      const mapped = orders.map((o) => toOrderResponse(o, { id: req.user!.id, isAdmin: req.user!.isAdmin }));
      const totalPages = Math.ceil(total / pageSize) || 1;

      res.status(200).json({
        data: mapped,
        total,
        totalPages,
        page: pageNum,
        limit: pageSize,
      });
      return;
    }

    const orders = await prisma.order.findMany({
      where,
      include: ORDER_FULL_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(orders.map((o) => toOrderResponse(o, { id: req.user!.id, isAdmin: req.user!.isAdmin })));
  }),
);

ordersRouter.get(
  '/:id',
  requireAuth,
  loadOrderForParty,
  asyncHandler(async (req, res) => {
    const full = await loadFullOrder(req.order!.id);
    res.status(200).json(toOrderResponse(full, { id: req.user!.id, isAdmin: req.user!.isAdmin }));
  }),
);

ordersRouter.post(
  '/:id/ship',
  requireAuth,
  validateBody(shipOrderSchema),
  loadOrderForParty,
  requireOrderTransition(() => 'shipped'),
  asyncHandler(async (req, res) => {
    const order = req.order!;
    const { trackingInfo } = req.body as { trackingInfo?: string };

    await prisma.$transaction((tx) =>
      applyOrderTransition(tx, {
        orderId: order.id,
        expectedVersion: order.version,
        expectedStatus: order.status as OrderStatus,
        toStatus: 'shipped',
        actorId: req.user!.id,
        actorRole: 'seller',
        eventType: 'shipped',
        note: trackingInfo,
        extraData: trackingInfo ? { trackingInfo } : undefined,
      }),
    );

    const full = await loadFullOrder(order.id);
    res.status(200).json(toOrderResponse(full, { id: req.user!.id, isAdmin: req.user!.isAdmin }));
  }),
);

ordersRouter.post(
  '/:id/confirm-receipt',
  requireAuth,
  loadOrderForParty,
  requireOrderTransition(() => 'released'),
  asyncHandler(async (req, res) => {
    const order = req.order!;
    const provider = getPaymentProvider();
    const payment = await prisma.payment.findUniqueOrThrow({ where: { orderId: order.id } });

    await prisma.$transaction(async (tx) => {
      await provider.release({
        providerRef: payment.providerRef ?? '',
        sellerId: order.sellerId,
        amountCents: order.amountCents,
      });

      await applyOrderTransition(tx, {
        orderId: order.id,
        expectedVersion: order.version,
        expectedStatus: order.status as OrderStatus,
        toStatus: 'released',
        actorId: req.user!.id,
        actorRole: 'buyer',
        eventType: 'receipt_confirmed',
      });

      await tx.payment.update({ where: { orderId: order.id }, data: { status: 'released' } });
    });

    const full = await loadFullOrder(order.id);
    res.status(200).json(toOrderResponse(full, { id: req.user!.id, isAdmin: req.user!.isAdmin }));
  }),
);

ordersRouter.post(
  '/:id/dispute',
  requireAuth,
  validateBody(disputeOrderSchema),
  loadOrderForParty,
  requireOrderTransition(() => 'disputed'),
  asyncHandler(async (req, res) => {
    const order = req.order!;
    const { reason, description, evidenceFiles } = req.body as {
      reason: string;
      description: string;
      evidenceFiles?: string[];
    };

    const formattedNote =
      evidenceFiles && evidenceFiles.length > 0
        ? `${description}\n\n[Evidence Attached: ${evidenceFiles.join(', ')}]`
        : description;

    await prisma.$transaction((tx) =>
      applyOrderTransition(tx, {
        orderId: order.id,
        expectedVersion: order.version,
        expectedStatus: order.status as OrderStatus,
        toStatus: 'disputed',
        actorId: req.user!.id,
        actorRole: 'buyer',
        eventType: 'disputed',
        note: formattedNote,
        extraData: { disputeReason: reason, disputeNote: formattedNote },
      }),
    );

    const full = await loadFullOrder(order.id);
    res.status(200).json(toOrderResponse(full, { id: req.user!.id, isAdmin: req.user!.isAdmin }));
  }),
);

ordersRouter.post(
  '/:id/resolve',
  requireAuth,
  requireAdmin,
  validateBody(resolveOrderSchema),
  loadOrderForParty,
  requireOrderTransition((req) => (req.body.resolution === 'refund' ? 'refunded' : 'released')),
  asyncHandler(async (req, res) => {
    const order = req.order!;
    const { resolution } = req.body as { resolution: 'release' | 'refund' };
    const provider = getPaymentProvider();
    const payment = await prisma.payment.findUniqueOrThrow({ where: { orderId: order.id } });

    const toStatus: OrderStatus = resolution === 'refund' ? 'refunded' : 'released';
    const eventType = resolution === 'refund' ? 'dispute_resolved_refund' : 'dispute_resolved_release';

    await prisma.$transaction(async (tx) => {
      if (resolution === 'refund') {
        await provider.refund({ providerRef: payment.providerRef ?? '', amountCents: order.amountCents });
      } else {
        await provider.release({
          providerRef: payment.providerRef ?? '',
          sellerId: order.sellerId,
          amountCents: order.amountCents,
        });
      }

      await applyOrderTransition(tx, {
        orderId: order.id,
        expectedVersion: order.version,
        expectedStatus: order.status as OrderStatus,
        toStatus,
        actorId: req.user!.id,
        actorRole: 'admin',
        eventType,
      });

      await tx.payment.update({
        where: { orderId: order.id },
        data: { status: resolution === 'refund' ? 'refunded' : 'released' },
      });
    });

    const full = await loadFullOrder(order.id);
    res.status(200).json(toOrderResponse(full, { id: req.user!.id, isAdmin: req.user!.isAdmin }));
  }),
);
