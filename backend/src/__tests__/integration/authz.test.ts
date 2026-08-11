import { Express } from 'express';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { prisma } from '../../db/client';
import { authed, createListing, createOrder, resetDatabase, signup } from './testUtils';

describe('authz rejection cases', () => {
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

  it('unauthenticated request to a protected route is rejected with 401', async () => {
    const res = await authed(app, 'not-a-real-token').get('/me');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHENTICATED');

    const noHeaderRes = await request(app).get('/me');
    expect(noHeaderRes.status).toBe(401);
  });

  it('a non-owning seller trying to ship someone else\'s order gets 403', async () => {
    const sellerA = await signup(app, ['seller'], 'sellerA');
    const sellerB = await signup(app, ['seller'], 'sellerB');
    const buyer = await signup(app, ['buyer'], 'buyer');

    const listing = await createListing(app, sellerA.accessToken);
    const order = await createOrder(app, buyer.accessToken, listing.id);

    const res = await authed(app, sellerB.accessToken).post(`/orders/${order.id}/ship`).send({});
    expect(res.status).toBe(403);
  });

  it('a non-admin trying to resolve a dispute gets 403', async () => {
    const seller = await signup(app, ['seller'], 'seller');
    const buyer = await signup(app, ['buyer'], 'buyer');
    const listing = await createListing(app, seller.accessToken);
    const order = await createOrder(app, buyer.accessToken, listing.id);
    await authed(app, seller.accessToken).post(`/orders/${order.id}/ship`).send({});
    await authed(app, buyer.accessToken)
      .post(`/orders/${order.id}/dispute`)
      .send({ reason: 'other', description: 'x' });

    const res = await authed(app, buyer.accessToken)
      .post(`/orders/${order.id}/resolve`)
      .send({ resolution: 'release' });
    expect(res.status).toBe(403);
  });

  it('an unrelated user (not buyer, seller, or admin) cannot view the order at all', async () => {
    const seller = await signup(app, ['seller'], 'seller');
    const buyer = await signup(app, ['buyer'], 'buyer');
    const stranger = await signup(app, ['buyer'], 'stranger');
    const listing = await createListing(app, seller.accessToken);
    const order = await createOrder(app, buyer.accessToken, listing.id);

    const res = await authed(app, stranger.accessToken).get(`/orders/${order.id}`);
    expect(res.status).toBe(403);
  });

  it('a non-owning seller cannot patch or delete someone else\'s listing', async () => {
    const sellerA = await signup(app, ['seller'], 'sellerA2');
    const sellerB = await signup(app, ['seller'], 'sellerB2');
    const listing = await createListing(app, sellerA.accessToken);

    const patchRes = await authed(app, sellerB.accessToken).patch(`/listings/${listing.id}`).send({ priceCents: 1 });
    expect(patchRes.status).toBe(403);

    const deleteRes = await authed(app, sellerB.accessToken).delete(`/listings/${listing.id}`);
    expect(deleteRes.status).toBe(403);
  });

  it('a buyer without the seller role cannot create a listing', async () => {
    const buyer = await signup(app, ['buyer'], 'buyeronly');
    const res = await authed(app, buyer.accessToken)
      .post('/listings')
      .send({ title: 't', description: 'd', category: 'c', priceCents: 100 });
    expect(res.status).toBe(403);
  });

  it('signup with a duplicate email returns EMAIL_TAKEN', async () => {
    const user = await signup(app, ['buyer'], 'dupe');
    const res = await request(app).post('/auth/signup').send({
      email: user.email,
      password: 'password123',
      roles: ['buyer'],
    });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_TAKEN');
  });

  it('login with a wrong password returns INVALID_CREDENTIALS (401)', async () => {
    const user = await signup(app, ['buyer'], 'wrongpw');
    const res = await request(app).post('/auth/login').send({ email: user.email, password: 'nope-nope-nope' });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('a stranger cannot dispute an order they are not the buyer of', async () => {
    const seller = await signup(app, ['seller'], 'seller3');
    const buyer = await signup(app, ['buyer'], 'buyer3');
    const stranger = await signup(app, ['buyer'], 'stranger3');
    const listing = await createListing(app, seller.accessToken);
    const order = await createOrder(app, buyer.accessToken, listing.id);

    const res = await authed(app, stranger.accessToken)
      .post(`/orders/${order.id}/dispute`)
      .send({ reason: 'other', description: 'x' });
    expect(res.status).toBe(403);
  });

  it('an admin (not a party) may view an order, but cannot ship it', async () => {
    const seller = await signup(app, ['seller'], 'seller4');
    const buyer = await signup(app, ['buyer'], 'buyer4');
    const admin = await signup(app, ['buyer'], 'admin4');
    await prisma.user.update({ where: { id: admin.id }, data: { isAdmin: true } });

    const listing = await createListing(app, seller.accessToken);
    const order = await createOrder(app, buyer.accessToken, listing.id);

    const viewRes = await authed(app, admin.accessToken).get(`/orders/${order.id}`);
    expect(viewRes.status).toBe(200);

    const shipRes = await authed(app, admin.accessToken).post(`/orders/${order.id}/ship`).send({});
    expect(shipRes.status).toBe(403);
  });
});
