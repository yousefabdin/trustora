import { AddressInfo } from 'net';
import { Server } from 'http';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../app';
import { prisma } from '../../db/client';
import { resetDatabase } from '../integration/testUtils';

/**
 * Thin smoke test against a REAL listening HTTP server (app.listen + fetch),
 * not supertest's in-process request injection and not direct function
 * calls — this is the closest thing in this repo to "does the server
 * actually work when you curl it."
 */
describe('e2e smoke test', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    await resetDatabase();
    const app = createApp();
    server = app.listen(0);
    await new Promise<void>((resolve) => server.once('listening', resolve));
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
    await prisma.$disconnect();
  });

  it('health check responds ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });

  it('signup -> login -> one full order transition, over real HTTP', async () => {
    const sellerEmail = `smoke-seller-${Date.now()}@test.holdline.dev`;
    const buyerEmail = `smoke-buyer-${Date.now()}@test.holdline.dev`;

    const sellerSignup = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: sellerEmail, password: 'password123', roles: ['seller'] }),
    });
    expect(sellerSignup.status).toBe(201);
    const sellerBody = (await sellerSignup.json()) as { accessToken: string };
    const sellerToken = sellerBody.accessToken;

    const buyerSignup = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: buyerEmail, password: 'password123', roles: ['buyer'] }),
    });
    expect(buyerSignup.status).toBe(201);

    const buyerLogin = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: buyerEmail, password: 'password123' }),
    });
    expect(buyerLogin.status).toBe(200);
    const buyerLoginBody = (await buyerLogin.json()) as { accessToken: string };
    const buyerToken = buyerLoginBody.accessToken;

    const listingRes = await fetch(`${baseUrl}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sellerToken}` },
      body: JSON.stringify({ title: 'Smoke Test Widget', description: 'd', category: 'misc', priceCents: 1500 }),
    });
    expect(listingRes.status).toBe(201);
    const listing = (await listingRes.json()) as { id: string };

    const orderRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${buyerToken}` },
      body: JSON.stringify({ listingId: listing.id }),
    });
    expect(orderRes.status).toBe(201);
    const order = (await orderRes.json()) as { id: string; status: string };
    expect(order.status).toBe('paid_held');

    const shipRes = await fetch(`${baseUrl}/orders/${order.id}/ship`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sellerToken}` },
      body: JSON.stringify({}),
    });
    expect(shipRes.status).toBe(200);
    const shipBody = (await shipRes.json()) as { status: string };
    expect(shipBody.status).toBe('shipped');
  });
});
