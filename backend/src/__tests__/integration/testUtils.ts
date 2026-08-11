import request from 'supertest';
import { Express } from 'express';
import { prisma } from '../../db/client';

export async function resetDatabase(): Promise<void> {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "order_events", "payments", "orders", "listings", "refresh_tokens", "users" CASCADE',
  );
}

export interface TestUser {
  accessToken: string;
  id: string;
  email: string;
}

let counter = 0;
function uniqueEmail(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}@test.holdline.dev`;
}

export async function signup(
  app: Express,
  roles: ('buyer' | 'seller')[],
  emailPrefix = 'user',
): Promise<TestUser> {
  const email = uniqueEmail(emailPrefix);
  const res = await request(app).post('/auth/signup').send({ email, password: 'password123', roles });
  if (res.status !== 201) {
    throw new Error(`signup failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return { accessToken: res.body.accessToken, id: res.body.user.id, email: res.body.user.email };
}

export async function makeAdmin(userId: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { isAdmin: true } });
}

export function authed(app: Express, token: string) {
  return {
    get: (url: string) => request(app).get(url).set('Authorization', `Bearer ${token}`),
    post: (url: string) => request(app).post(url).set('Authorization', `Bearer ${token}`),
    patch: (url: string) => request(app).patch(url).set('Authorization', `Bearer ${token}`),
    delete: (url: string) => request(app).delete(url).set('Authorization', `Bearer ${token}`),
  };
}

export async function createListing(
  app: Express,
  sellerToken: string,
  overrides: Partial<{ title: string; description: string; category: string; priceCents: number }> = {},
) {
  const res = await authed(app, sellerToken)
    .post('/listings')
    .send({
      title: overrides.title ?? 'Test Listing',
      description: overrides.description ?? 'A perfectly ordinary test listing.',
      category: overrides.category ?? 'misc',
      priceCents: overrides.priceCents ?? 5000,
    });
  if (res.status !== 201) {
    throw new Error(`createListing failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body;
}

export async function createOrder(app: Express, buyerToken: string, listingId: string) {
  const res = await authed(app, buyerToken).post('/orders').send({ listingId });
  if (res.status !== 201) {
    throw new Error(`createOrder failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body;
}
