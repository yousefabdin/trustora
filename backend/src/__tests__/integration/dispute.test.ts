import { Express } from 'express';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { prisma } from '../../db/client';
import { authed, createListing, createOrder, makeAdmin, resetDatabase, signup } from './testUtils';

async function checkoutAndShip(app: Express, sellerToken: string, buyerToken: string, priceCents = 3000) {
  const listing = await createListing(app, sellerToken, { priceCents });
  const order = await createOrder(app, buyerToken, listing.id);
  const shipRes = await authed(app, sellerToken).post(`/orders/${order.id}/ship`).send({});
  expect(shipRes.status).toBe(200);
  return shipRes.body;
}

describe('order lifecycle: dispute path', () => {
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

  it('checkout -> ship -> dispute -> admin resolves RELEASE (seller wins)', async () => {
    const seller = await signup(app, ['seller'], 'seller-rel');
    const buyer = await signup(app, ['buyer'], 'buyer-rel');
    const admin = await signup(app, ['buyer'], 'admin-rel');
    await makeAdmin(admin.id);

    const order = await checkoutAndShip(app, seller.accessToken, buyer.accessToken, 5500);

    const disputeRes = await authed(app, buyer.accessToken)
      .post(`/orders/${order.id}/dispute`)
      .send({ reason: 'item_not_as_described', description: 'Not what the photos showed.' });
    expect(disputeRes.status).toBe(200);
    expect(disputeRes.body.status).toBe('disputed');
    expect(disputeRes.body.permissions.canResolveDispute).toBe(false);

    const nonAdminResolve = await authed(app, seller.accessToken)
      .post(`/orders/${order.id}/resolve`)
      .send({ resolution: 'release' });
    expect(nonAdminResolve.status).toBe(403);

    const resolveRes = await authed(app, admin.accessToken)
      .post(`/orders/${order.id}/resolve`)
      .send({ resolution: 'release' });
    expect(resolveRes.status).toBe(200);
    expect(resolveRes.body.status).toBe('released');

    const payment = await prisma.payment.findUniqueOrThrow({ where: { orderId: order.id } });
    expect(payment.status).toBe('released');

    const events = resolveRes.body.events as Array<{ type: string }>;
    expect(events.at(-1)?.type).toBe('dispute_resolved_release');
  });

  it('checkout -> ship -> dispute -> admin resolves REFUND (buyer wins)', async () => {
    const seller = await signup(app, ['seller'], 'seller-ref');
    const buyer = await signup(app, ['buyer'], 'buyer-ref');
    const admin = await signup(app, ['buyer'], 'admin-ref');
    await makeAdmin(admin.id);

    const order = await checkoutAndShip(app, seller.accessToken, buyer.accessToken, 7700);

    await authed(app, buyer.accessToken)
      .post(`/orders/${order.id}/dispute`)
      .send({ reason: 'item_not_received', description: 'Tracking says delivered, nothing arrived.' });

    const resolveRes = await authed(app, admin.accessToken)
      .post(`/orders/${order.id}/resolve`)
      .send({ resolution: 'refund' });
    expect(resolveRes.status).toBe(200);
    expect(resolveRes.body.status).toBe('refunded');

    const payment = await prisma.payment.findUniqueOrThrow({ where: { orderId: order.id } });
    expect(payment.status).toBe('refunded');

    const events = resolveRes.body.events as Array<{ type: string }>;
    expect(events.at(-1)?.type).toBe('dispute_resolved_refund');
  });

  it('GET /disputes (admin only) lists disputed orders', async () => {
    const seller = await signup(app, ['seller'], 'seller-list');
    const buyer = await signup(app, ['buyer'], 'buyer-list');
    const admin = await signup(app, ['buyer'], 'admin-list');
    await makeAdmin(admin.id);

    const order = await checkoutAndShip(app, seller.accessToken, buyer.accessToken);
    await authed(app, buyer.accessToken)
      .post(`/orders/${order.id}/dispute`)
      .send({ reason: 'other', description: 'placeholder' });

    const nonAdminList = await authed(app, seller.accessToken).get('/disputes');
    expect(nonAdminList.status).toBe(403);

    const adminList = await authed(app, admin.accessToken).get('/disputes');
    expect(adminList.status).toBe(200);
    expect(adminList.body).toHaveLength(1);
    expect(adminList.body[0].id).toBe(order.id);
  });
});
