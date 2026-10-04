import { Router } from 'express';
import { prisma } from '../db/client';
import { asyncHandler } from '../lib/asyncHandler';
import { requireAuth } from '../middleware/auth';

export const notificationsRouter = Router();

export interface ServerNotification {
  id: string;
  type:
    | 'item_sold'
    | 'order_held'
    | 'item_shipped'
    | 'order_shipped'
    | 'funds_released'
    | 'dispute_opened';
  title: string;
  message: string;
  orderId?: string;
  listingId?: string;
  createdAt: string;
  isRead: boolean;
  role: 'buyer' | 'seller' | 'admin';
  actionUrl?: string;
}

async function ensureNotificationReadsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS notification_reads (
      user_id TEXT NOT NULL,
      notification_id TEXT NOT NULL,
      read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      PRIMARY KEY (user_id, notification_id)
    );
  `);
}

notificationsRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    await ensureNotificationReadsTable();
    const userId = req.user!.id;
    const isAdmin = Boolean(req.user!.isAdmin);

    let readIds: string[] = [];
    try {
      const records = await prisma.$queryRaw<Array<{ notification_id: string }>>`
        SELECT notification_id FROM notification_reads WHERE user_id = ${userId}
      `;
      readIds = records.map((r) => r.notification_id);
    } catch {
      readIds = [];
    }
    const readSet = new Set(readIds);

    const items: ServerNotification[] = [];

    if (isAdmin) {
      const disputedOrders = await prisma.order.findMany({
        where: {
          OR: [
            { status: 'disputed' },
            {
              events: {
                some: {
                  type: { in: ['disputed', 'dispute_resolved_release', 'dispute_resolved_refund'] },
                },
              },
            },
          ],
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              priceCents: true,
            },
          },
          buyer: {
            select: {
              email: true,
            },
          },
          seller: {
            select: {
              email: true,
            },
          },
          events: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 50,
      });

      for (const order of disputedOrders) {
        const disputeEvent = order.events.find((e) => e.type === 'disputed');
        const resolveReleaseEvent = order.events.find((e) => e.type === 'dispute_resolved_release');
        const resolveRefundEvent = order.events.find((e) => e.type === 'dispute_resolved_refund');
        const formattedAmount = `$${(order.amountCents / 100).toFixed(2)}`;
        const itemTitle = order.listing?.title || 'Marketplace Item';
        const orderNum = `#HLD-${order.id.slice(0, 4).toUpperCase()}`;
        const buyerName = order.buyer?.email ? order.buyer.email.split('@')[0] : 'Buyer';
        const sellerName = order.seller?.email ? order.seller.email.split('@')[0] : 'Seller';
        const reason = order.disputeReason ? order.disputeReason.replace(/_/g, ' ') : 'Inspection issue';

        if (order.status === 'disputed') {
          const id = `admin_dispute_${order.id}`;
          items.push({
            id,
            type: 'dispute_opened',
            title: '🚨 Dispute Filed — Action Required',
            message: `Buyer @${buyerName} opened a dispute for ${itemTitle} (${formattedAmount}, ${orderNum}). Reason: ${reason}. Adjudication required.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (disputeEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'admin',
            actionUrl: `/admin/disputes/${order.id}`,
          });
        } else if (resolveRefundEvent || order.status === 'refunded') {
          const id = `admin_dispute_refunded_${order.id}`;
          items.push({
            id,
            type: 'dispute_opened',
            title: '✅ Dispute Resolved — Refund Issued',
            message: `Dispute for ${itemTitle} (${orderNum}) was resolved with ${formattedAmount} refunded to buyer @${buyerName}.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (resolveRefundEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'admin',
            actionUrl: `/admin/disputes/${order.id}`,
          });
        } else if (resolveReleaseEvent || order.status === 'released') {
          const id = `admin_dispute_released_${order.id}`;
          items.push({
            id,
            type: 'dispute_opened',
            title: '✅ Dispute Resolved — Funds Released',
            message: `Dispute for ${itemTitle} (${orderNum}) was resolved with ${formattedAmount} released to seller @${sellerName}.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (resolveReleaseEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'admin',
            actionUrl: `/admin/disputes/${order.id}`,
          });
        }
      }
    }

    const orders = await prisma.order.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            priceCents: true,
          },
        },
        events: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });

    for (const order of orders) {
      const isBuyer = order.buyerId === userId;
      const isSeller = !isBuyer && order.sellerId === userId;
      const formattedAmount = `$${(order.amountCents / 100).toFixed(2)}`;
      const itemTitle = order.listing?.title || 'Marketplace Item';
      const orderNum = `#HLD-${order.id.slice(0, 4).toUpperCase()}`;

      const disputeReleaseEvent = order.events.find((e) => e.type === 'dispute_resolved_release');
      const disputeRefundEvent = order.events.find((e) => e.type === 'dispute_resolved_refund');
      const receiptConfirmedEvent = order.events.find((e) => e.type === 'receipt_confirmed');

      if (isSeller) {
        if (order.status === 'paid_held') {
          const id = `seller_paid_${order.id}`;
          items.push({
            id,
            type: 'item_sold',
            title: '🎉 Item Sold — Ship Required',
            message: `Buyer paid ${formattedAmount} for ${itemTitle}. Escrow funds are secured. Please provide carrier tracking to ship.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: order.createdAt.toISOString(),
            isRead: readSet.has(id),
            role: 'seller',
            actionUrl: `/myorder/${order.id}`,
          });
        } else if (order.status === 'shipped') {
          const id = `seller_shipped_${order.id}`;
          const shippedEvent = order.events.find((e) => e.type === 'shipped');
          items.push({
            id,
            type: 'item_shipped',
            title: '📦 Package In Transit',
            message: `${itemTitle} is in transit to the buyer (${order.trackingInfo || 'Tracking updated'}).`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (shippedEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'seller',
            actionUrl: `/myorder/${order.id}`,
          });
        } else if (disputeRefundEvent || order.status === 'refunded') {
          const id = `seller_dispute_refunded_${order.id}`;
          items.push({
            id,
            type: 'dispute_opened',
            title: '⚠️ Dispute Resolved: Buyer Refunded',
            message: `Trustora administration concluded the dispute for ${itemTitle} (${orderNum}). Escrow funds of ${formattedAmount} were refunded to the buyer.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (disputeRefundEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'seller',
            actionUrl: `/myorder/${order.id}`,
          });
        } else if (disputeReleaseEvent) {
          const id = `seller_dispute_released_${order.id}`;
          items.push({
            id,
            type: 'funds_released',
            title: '⚖️ Dispute Resolved in Your Favor',
            message: `Trustora administration ruled in your favor for ${itemTitle} (${orderNum}). ${formattedAmount} has been released to your balance.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (disputeReleaseEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'seller',
            actionUrl: `/myorder/${order.id}`,
          });
        } else if (order.status === 'released') {
          const id = `seller_released_${order.id}`;
          items.push({
            id,
            type: 'funds_released',
            title: '💰 Payout Released to You',
            message: `Buyer verified receipt for ${itemTitle}. ${formattedAmount} has been released to your balance.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (receiptConfirmedEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'seller',
            actionUrl: `/myorder/${order.id}`,
          });
        } else if (order.status === 'disputed') {
          const id = `seller_disputed_${order.id}`;
          const disputeEvent = order.events.find((e) => e.type === 'disputed');
          items.push({
            id,
            type: 'dispute_opened',
            title: '⚠️ Dispute Under Review',
            message: `A dispute was opened for ${itemTitle} (${orderNum}). Trustora arbitration is reviewing the claim.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (disputeEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'seller',
            actionUrl: `/myorder/${order.id}`,
          });
        }
      }

      if (isBuyer) {
        if (order.status === 'paid_held') {
          const id = `buyer_paid_${order.id}`;
          items.push({
            id,
            type: 'order_held',
            title: '🔒 Escrow Locked & Verified',
            message: `Your payment of ${formattedAmount} for ${itemTitle} is protected in escrow. Seller has been notified to ship.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: order.createdAt.toISOString(),
            isRead: readSet.has(id),
            role: 'buyer',
            actionUrl: `/myorder/${order.id}`,
          });
        } else if (order.status === 'shipped') {
          const id = `buyer_shipped_${order.id}`;
          const shippedEvent = order.events.find((e) => e.type === 'shipped');
          items.push({
            id,
            type: 'order_shipped',
            title: '🚚 Your Item Has Shipped!',
            message: `Seller shipped ${itemTitle}. Tracking code: ${order.trackingInfo || 'Generated'}.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (shippedEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'buyer',
            actionUrl: `/myorder/${order.id}`,
          });
        } else if (disputeRefundEvent || order.status === 'refunded') {
          const id = `buyer_dispute_refunded_${order.id}`;
          items.push({
            id,
            type: 'funds_released',
            title: '💰 Dispute Resolved: Full Refund Issued',
            message: `Trustora administration ruled in your favor for ${itemTitle} (${orderNum}). A full refund of ${formattedAmount} has been returned to your payment method.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (disputeRefundEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'buyer',
            actionUrl: `/myorder/${order.id}`,
          });
        } else if (disputeReleaseEvent) {
          const id = `buyer_dispute_released_${order.id}`;
          items.push({
            id,
            type: 'funds_released',
            title: '⚖️ Dispute Resolved: Escrow Released',
            message: `Trustora administration concluded review for ${itemTitle} (${orderNum}) and ruled to release escrow funds to the seller.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (disputeReleaseEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'buyer',
            actionUrl: `/myorder/${order.id}`,
          });
        } else if (order.status === 'released') {
          const id = `buyer_released_${order.id}`;
          items.push({
            id,
            type: 'funds_released',
            title: '✅ Transaction Completed',
            message: `You confirmed receipt for ${itemTitle}. Held escrow funds were released to the seller.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (receiptConfirmedEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'buyer',
            actionUrl: `/myorder/${order.id}`,
          });
        } else if (order.status === 'disputed') {
          const id = `buyer_disputed_${order.id}`;
          const disputeEvent = order.events.find((e) => e.type === 'disputed');
          items.push({
            id,
            type: 'dispute_opened',
            title: '⚠️ Dispute Filed',
            message: `Your dispute for ${itemTitle} (${orderNum}) is currently under review by Trustora arbitration.`,
            orderId: order.id,
            listingId: order.listingId,
            createdAt: (disputeEvent?.createdAt || order.updatedAt).toISOString(),
            isRead: readSet.has(id),
            role: 'buyer',
            actionUrl: `/myorder/${order.id}`,
          });
        }
      }
    }

    items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const unreadCount = items.filter((n) => !n.isRead).length;

    res.status(200).json({
      data: items,
      unreadCount,
    });
  }),
);

notificationsRouter.patch(
  '/:id/read',
  requireAuth,
  asyncHandler(async (req, res) => {
    await ensureNotificationReadsTable();
    const userId = req.user!.id;
    const notificationId = req.params.id;

    await prisma.$executeRawUnsafe(
      `INSERT INTO notification_reads (user_id, notification_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, notification_id) DO NOTHING`,
      userId,
      notificationId,
    );

    res.status(200).json({ success: true, id: notificationId });
  }),
);

notificationsRouter.post(
  '/read-all',
  requireAuth,
  asyncHandler(async (req, res) => {
    await ensureNotificationReadsTable();
    const userId = req.user!.id;
    const { ids } = (req.body || {}) as { ids?: string[] };

    if (Array.isArray(ids) && ids.length > 0) {
      for (const id of ids) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO notification_reads (user_id, notification_id)
           VALUES ($1, $2)
           ON CONFLICT (user_id, notification_id) DO NOTHING`,
          userId,
          id,
        );
      }
    }

    res.status(200).json({ success: true });
  }),
);
