import { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { prisma } from '../../db/client';
import { authed, createListing, createOrder, resetDatabase, signup } from './testUtils';

describe('order lifecycle: full happy path', () => {
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

  it('signup -> login -> create listing -> checkout -> ship -> confirm receipt -> released + ledger correct', async () => {
    const seller = await signup(app, ['seller'], 'seller');
    const buyer = await signup(app, ['buyer'], 'buyer');

    // login (rather than reusing the signup token) to exercise the login path explicitly
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: buyer.email, password: 'password123' });
    expect(loginRes.status).toBe(200);
    const buyerToken = loginRes.body.accessToken as string;

    const listing = await createListing(app, seller.accessToken, { priceCents: 4200 });
    expect(listing.status).toBe('active');

    const order = await createOrder(app, buyerToken, listing.id);
    expect(order.status).toBe('paid_held');
    expect(order.amountCents).toBe(4200);
    expect(order.permissions.canShip).toBe(false); // buyer viewing their own order can't ship

    const asSeller = authed(app, seller.accessToken);
    const asBuyer = authed(app, buyerToken);

    const wrongShip = await asBuyer.post(`/orders/${order.id}/ship`).send({});
    expect(wrongShip.status).toBe(403);

    const shipRes = await asSeller.post(`/orders/${order.id}/ship`).send({ trackingInfo: 'UPS 123' });
    expect(shipRes.status).toBe(200);
    expect(shipRes.body.status).toBe('shipped');

    const wrongConfirm = await asSeller.post(`/orders/${order.id}/confirm-receipt`).send();
    expect(wrongConfirm.status).toBe(403);

    const confirmRes = await asBuyer.post(`/orders/${order.id}/confirm-receipt`).send();
    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.status).toBe('released');

    const events = confirmRes.body.events as Array<{ type: string; toStatus: string }>;
    expect(events.map((e) => e.type)).toEqual([
      'created',
      'payment_held',
      'shipped',
      'receipt_confirmed',
    ]);

    const payment = await prisma.payment.findUniqueOrThrow({ where: { orderId: order.id } });
    expect(payment.status).toBe('released');
    expect(payment.amountCents).toBe(4200);

    const finalOrder = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(finalOrder.status).toBe('released');
    expect(finalOrder.version).toBe(3);

    const getRes = await asBuyer.get(`/orders/${order.id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.permissions).toEqual({
      canShip: false,
      canConfirmReceipt: false,
      canDispute: false,
      canResolveDispute: false,
    });
  });

  it('GET /orders?role= scopes correctly to buyer vs seller', async () => {
    const seller = await signup(app, ['seller'], 'seller2');
    const buyer = await signup(app, ['buyer'], 'buyer2');
    const listing = await createListing(app, seller.accessToken);
    await createOrder(app, buyer.accessToken, listing.id);

    const asBuyer = authed(app, buyer.accessToken);
    const asSeller = authed(app, seller.accessToken);

    const buyerOrders = await asBuyer.get('/orders?role=buyer');
    expect(buyerOrders.status).toBe(200);
    expect(buyerOrders.body).toHaveLength(1);

    const sellerOrders = await asSeller.get('/orders?role=seller');
    expect(sellerOrders.status).toBe(200);
    expect(sellerOrders.body).toHaveLength(1);

    const buyerAsSeller = await asBuyer.get('/orders?role=seller');
    expect(buyerAsSeller.status).toBe(200);
    expect(buyerAsSeller.body).toHaveLength(0);
  });
});
