import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding disputed orders for Admin testing...');
  const buyer = await prisma.user.findUnique({
    where: { email: 'buyer@holdline.dev' },
  });
  const seller = await prisma.user.findUnique({
    where: { email: 'seller@holdline.dev' },
  });
  const dual = await prisma.user.findUnique({
    where: { email: 'dual@holdline.dev' },
  });

  if (!buyer || !seller || !dual) {
    throw new Error("Demo users not found. Please run 'npm run seed' first to create base users.");
  }

  const listings = await prisma.listing.findMany({ where: { status: 'active' } });
  if (listings.length === 0) {
    throw new Error('No active listings found in database to dispute.');
  }

  const listing1 = listings[0];
  const listing2 = listings[1] || listings[0];
  const listing3 = listings[2] || listings[0];

  // Dispute test cases with different dates and reasons
  const disputeCases = [
    {
      listing: listing1,
      buyerId: buyer.id,
      sellerId: seller.id,
      amountCents: listing1.priceCents,
      reason: 'Item Damaged in Transit',
      note: 'The package arrived crushed and the item has visible scratches and structural damage.',
      daysAgo: 4,
    },
    {
      listing: listing2,
      buyerId: dual.id,
      sellerId: seller.id,
      amountCents: listing2.priceCents,
      reason: 'Item Not as Described',
      note: "Listing claimed excellent condition, but inner lining is torn and color doesn't match photos.",
      daysAgo: 2,
    },
    {
      listing: listing3,
      buyerId: buyer.id,
      sellerId: dual.id,
      amountCents: listing3.priceCents,
      reason: 'Wrong Item Received',
      note: 'Seller sent completely different product than the one shown in the listing catalog.',
      daysAgo: 1,
    },
  ];

  for (const [idx, data] of disputeCases.entries()) {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - data.daysAgo);

    // Create the Order in 'disputed' state
    const order = await prisma.order.create({
      data: {
        listingId: data.listing.id,
        buyerId: data.buyerId,
        sellerId: data.sellerId,
        amountCents: data.amountCents,
        status: 'disputed',
        version: 4,
        trackingInfo: `USPS-DISPUTE-99${idx}452`,
        disputeReason: data.reason,
        disputeNote: data.note,
        createdAt: pastDate,
      },
    });

    // Create the timeline audit events
    await prisma.orderEvent.createMany({
      data: [
        {
          orderId: order.id,
          actorId: data.buyerId,
          actorRole: 'buyer',
          type: 'created',
          fromStatus: null,
          toStatus: 'pending_payment',
          createdAt: pastDate,
        },
        {
          orderId: order.id,
          actorId: null,
          actorRole: 'system',
          type: 'payment_held',
          fromStatus: 'pending_payment',
          toStatus: 'paid_held',
          createdAt: pastDate,
        },
        {
          orderId: order.id,
          actorId: data.sellerId,
          actorRole: 'seller',
          type: 'shipped',
          fromStatus: 'paid_held',
          toStatus: 'shipped',
          note: `Shipped with tracking USPS-DISPUTE-99${idx}452`,
          createdAt: pastDate,
        },
        {
          orderId: order.id,
          actorId: data.buyerId,
          actorRole: 'buyer',
          type: 'disputed',
          fromStatus: 'shipped',
          toStatus: 'disputed',
          note: data.note,
          createdAt: pastDate,
        },
      ],
    });

    // Lock payment in escrow
    await prisma.payment.create({
      data: {
        orderId: order.id,
        provider: 'simulated',
        providerRef: `sim_pi_dispute_${order.id.slice(0, 8)}`,
        status: 'held',
        amountCents: data.amountCents,
        createdAt: pastDate,
      },
    });

    console.log(`Seeded dispute order #${idx + 1}: ${order.id} (${data.reason})`);
  }

  console.log('Finished seeding disputed orders!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
