import { Express } from 'express';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { prisma } from '../../db/client';
import { authed, createListing, createOrder, makeAdmin, resetDatabase, signup } from './testUtils';

describe('concurrent transition attempts on the same order', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('two simultaneous confirm-receipt calls: exactly one wins, the other gets a clean 409 CONFLICT', async () => {
    const seller = await signup(app, ['seller'], 'seller-c1');
    const buyer = await signup(app, ['buyer'], 'buyer-c1');
    const listing = await createListing(app, seller.accessToken, { priceCents: 9900 });
    const order = await createOrder(app, buyer.accessToken, listing.id);
    await authed(app, seller.accessToken).post(`/orders/${order.id}/ship`).send({});

    const asBuyer = authed(app, buyer.accessToken);
    const [resA, resB] = await Promise.all([
      asBuyer.post(`/orders/${order.id}/confirm-receipt`).send(),
      asBuyer.post(`/orders/${order.id}/confirm-receipt`).send(),
    ]);

    const statuses = [resA.status, resB.status].sort();
    expect(statuses).toEqual([200, 409]);

    // The loser can be caught at either of two layers: the pre-write guard's
    // fresh status read (INVALID_TRANSITION, if it loses the race entirely
    // and observes the already-released order) or the transaction's
    // optimistic version check (CONFLICT, if both requests pass the guard
    // before either commits). Both are the same underlying race, both are a
    // clean 409, and neither leaves the order in a corrupted state — which
    // is the actual property this test verifies.
    const conflictBody = resA.status === 409 ? resA.body : resB.body;
    expect(['CONFLICT', 'INVALID_TRANSITION']).toContain(conflictBody.error.code);

    const finalOrder = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(finalOrder.status).toBe('released');
    expect(finalOrder.version).toBe(3); // created->paid_held (1), ->shipped (2), ->released (3)

    const receiptConfirmedEvents = await prisma.orderEvent.count({
      where: { orderId: order.id, type: 'receipt_confirmed' },
    });
    expect(receiptConfirmedEvents).toBe(1);

    const payment = await prisma.payment.findUniqueOrThrow({ where: { orderId: order.id } });
    expect(payment.status).toBe('released');
  });

  it('admin resolving RELEASE races the same admin resolving REFUND: exactly one wins, no mixed state', async () => {
    const seller = await signup(app, ['seller'], 'seller-c2');
    const buyer = await signup(app, ['buyer'], 'buyer-c2');
    const admin = await signup(app, ['buyer'], 'admin-c2');
    await makeAdmin(admin.id);

    const listing = await createListing(app, seller.accessToken, { priceCents: 4400 });
    const order = await createOrder(app, buyer.accessToken, listing.id);
    await authed(app, seller.accessToken).post(`/orders/${order.id}/ship`).send({});
    await authed(app, buyer.accessToken)
      .post(`/orders/${order.id}/dispute`)
      .send({ reason: 'other', description: 'racing resolution test' });

    const asAdmin = authed(app, admin.accessToken);
    const [releaseRes, refundRes] = await Promise.all([
      asAdmin.post(`/orders/${order.id}/resolve`).send({ resolution: 'release' }),
      asAdmin.post(`/orders/${order.id}/resolve`).send({ resolution: 'refund' }),
    ]);

    const statuses = [releaseRes.status, refundRes.status].sort();
    expect(statuses).toEqual([200, 409]);

    const winner = releaseRes.status === 200 ? 'release' : 'refund';
    const expectedOrderStatus = winner === 'release' ? 'released' : 'refunded';
    const expectedPaymentStatus = winner === 'release' ? 'released' : 'refunded';

    const finalOrder = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(finalOrder.status).toBe(expectedOrderStatus);

    const payment = await prisma.payment.findUniqueOrThrow({ where: { orderId: order.id } });
    // No mixed state: payment ledger must agree with the order status that actually won.
    expect(payment.status).toBe(expectedPaymentStatus);

    const resolutionEvents = await prisma.orderEvent.count({
      where: { orderId: order.id, type: { in: ['dispute_resolved_release', 'dispute_resolved_refund'] } },
    });
    expect(resolutionEvents).toBe(1);
  });
});
