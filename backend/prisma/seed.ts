import argon2 from 'argon2';
import { OrderEventType, OrderStatus, PaymentStatus, PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'password123';

interface EventStep {
  type: OrderEventType;
  from: OrderStatus | null;
  to: OrderStatus;
  actorRole: 'buyer' | 'seller' | 'admin' | 'system';
}

async function createOrderWithHistory(params: {
  listingId: string;
  buyerId: string;
  sellerId: string;
  amountCents: number;
  steps: EventStep[];
  actorIdByRole: Record<'buyer' | 'seller' | 'admin' | 'system', string | null>;
  paymentStatus: PaymentStatus;
  trackingInfo?: string;
  disputeReason?: string;
  disputeNote?: string;
}) {
  const finalStatus = params.steps[params.steps.length - 1].to;

  const order = await prisma.order.create({
    data: {
      listingId: params.listingId,
      buyerId: params.buyerId,
      sellerId: params.sellerId,
      amountCents: params.amountCents,
      status: finalStatus,
      version: params.steps.length,
      trackingInfo: params.trackingInfo,
      disputeReason: params.disputeReason,
      disputeNote: params.disputeNote,
    },
  });

  for (const step of params.steps) {
    await prisma.orderEvent.create({
      data: {
        orderId: order.id,
        actorId: params.actorIdByRole[step.actorRole],
        actorRole: step.actorRole,
        type: step.type,
        fromStatus: step.from ?? undefined,
        toStatus: step.to,
      },
    });
  }

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: 'simulated',
      providerRef: `sim_pi_seed_${order.id}`,
      status: params.paymentStatus,
      amountCents: params.amountCents,
    },
  });

  return order;
}

async function main() {
  console.log('Seeding Holdline demo data...');

  const passwordHash = await argon2.hash(DEMO_PASSWORD);

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@holdline.dev' },
    update: { roles: [Role.buyer, Role.seller] },
    create: { email: 'buyer@holdline.dev', passwordHash, roles: [Role.buyer, Role.seller], isAdmin: false },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@holdline.dev' },
    update: { roles: [Role.buyer, Role.seller] },
    create: { email: 'seller@holdline.dev', passwordHash, roles: [Role.buyer, Role.seller], isAdmin: false },
  });

  const dual = await prisma.user.upsert({
    where: { email: 'dual@holdline.dev' },
    update: { roles: [Role.buyer, Role.seller] },
    create: { email: 'dual@holdline.dev', passwordHash, roles: [Role.buyer, Role.seller], isAdmin: false },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@holdline.dev' },
    update: { roles: [Role.buyer, Role.seller] },
    create: { email: 'admin@holdline.dev', passwordHash, roles: [Role.buyer, Role.seller], isAdmin: true },
  });

  const jacket = await prisma.listing.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      sellerId: seller.id,
      title: 'Vintage Leather Jacket',
      description: 'Genuine leather, barely worn, size M.',
      category: 'apparel',
      priceCents: 12000,
      status: 'active',
    },
  });

  const keyboard = await prisma.listing.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      sellerId: seller.id,
      title: 'Mechanical Keyboard',
      description: 'Hot-swappable switches, RGB backlight.',
      category: 'electronics',
      priceCents: 8500,
      status: 'active',
    },
  });

  const mugs = await prisma.listing.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      sellerId: dual.id,
      title: 'Handmade Ceramic Mug Set',
      description: 'Set of four, hand-thrown stoneware.',
      category: 'home',
      priceCents: 3200,
      status: 'active',
    },
  });

  await prisma.listing.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      sellerId: seller.id,
      title: 'Broken Drone (for parts)',
      description: 'Motor #3 is dead, everything else works.',
      category: 'electronics',
      priceCents: 2000,
      status: 'inactive',
    },
  });

  // Skip re-seeding orders on repeated runs (upsert has no natural key for
  // orders here) so `npm run seed` stays idempotent when re-run locally.
  const existingOrders = await prisma.order.count();
  if (existingOrders > 0) {
    console.log(`Orders already present (${existingOrders}), skipping order seed.`);
    await prisma.$disconnect();
    return;
  }

  const actorIds = {
    buyer: buyer.id,
    seller: seller.id,
    admin: admin.id,
    system: null,
  };

  // Order 1: just paid, awaiting shipment.
  await createOrderWithHistory({
    listingId: jacket.id,
    buyerId: buyer.id,
    sellerId: seller.id,
    amountCents: jacket.priceCents,
    paymentStatus: 'held',
    actorIdByRole: actorIds,
    steps: [
      { type: 'created', from: null, to: 'pending_payment', actorRole: 'buyer' },
      { type: 'payment_held', from: 'pending_payment', to: 'paid_held', actorRole: 'system' },
    ],
  });

  // Order 2: shipped, in transit.
  await createOrderWithHistory({
    listingId: keyboard.id,
    buyerId: buyer.id,
    sellerId: seller.id,
    amountCents: keyboard.priceCents,
    paymentStatus: 'held',
    trackingInfo: 'USPS 9400111899223344556677',
    actorIdByRole: actorIds,
    steps: [
      { type: 'created', from: null, to: 'pending_payment', actorRole: 'buyer' },
      { type: 'payment_held', from: 'pending_payment', to: 'paid_held', actorRole: 'system' },
      { type: 'shipped', from: 'paid_held', to: 'shipped', actorRole: 'seller' },
    ],
  });

  // Order 3: full happy path, funds released to seller.
  await createOrderWithHistory({
    listingId: jacket.id,
    buyerId: dual.id,
    sellerId: seller.id,
    amountCents: jacket.priceCents,
    paymentStatus: 'released',
    actorIdByRole: { ...actorIds, buyer: dual.id },
    steps: [
      { type: 'created', from: null, to: 'pending_payment', actorRole: 'buyer' },
      { type: 'payment_held', from: 'pending_payment', to: 'paid_held', actorRole: 'system' },
      { type: 'shipped', from: 'paid_held', to: 'shipped', actorRole: 'seller' },
      { type: 'receipt_confirmed', from: 'shipped', to: 'released', actorRole: 'buyer' },
    ],
  });

  // Order 4: buyer disputed after shipment, awaiting admin resolution.
  await createOrderWithHistory({
    listingId: mugs.id,
    buyerId: buyer.id,
    sellerId: dual.id,
    amountCents: mugs.priceCents,
    paymentStatus: 'held',
    disputeReason: 'item_not_as_described',
    disputeNote: 'Two of the four mugs arrived cracked.',
    actorIdByRole: { ...actorIds, seller: dual.id },
    steps: [
      { type: 'created', from: null, to: 'pending_payment', actorRole: 'buyer' },
      { type: 'payment_held', from: 'pending_payment', to: 'paid_held', actorRole: 'system' },
      { type: 'shipped', from: 'paid_held', to: 'shipped', actorRole: 'seller' },
      { type: 'disputed', from: 'shipped', to: 'disputed', actorRole: 'buyer' },
    ],
  });

  // Order 5: dispute resolved by admin in the buyer's favor (refunded).
  await createOrderWithHistory({
    listingId: keyboard.id,
    buyerId: dual.id,
    sellerId: seller.id,
    amountCents: keyboard.priceCents,
    paymentStatus: 'refunded',
    disputeReason: 'item_not_received',
    disputeNote: 'Tracking shows delivered but package never arrived.',
    actorIdByRole: { ...actorIds, buyer: dual.id },
    steps: [
      { type: 'created', from: null, to: 'pending_payment', actorRole: 'buyer' },
      { type: 'payment_held', from: 'pending_payment', to: 'paid_held', actorRole: 'system' },
      { type: 'shipped', from: 'paid_held', to: 'shipped', actorRole: 'seller' },
      { type: 'disputed', from: 'shipped', to: 'disputed', actorRole: 'buyer' },
      { type: 'dispute_resolved_refund', from: 'disputed', to: 'refunded', actorRole: 'admin' },
    ],
  });

  console.log('Seed complete:');
  console.log(`  buyer@holdline.dev / ${DEMO_PASSWORD} (buyer)`);
  console.log(`  seller@holdline.dev / ${DEMO_PASSWORD} (seller)`);
  console.log(`  dual@holdline.dev / ${DEMO_PASSWORD} (buyer + seller)`);
  console.log(`  admin@holdline.dev / ${DEMO_PASSWORD} (admin)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
