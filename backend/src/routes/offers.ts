import crypto from 'crypto';
import { Router } from 'express';
import { prisma } from '../db/client';
import { asyncHandler } from '../lib/asyncHandler';
import { AppError, forbidden, notFound } from '../lib/errors';
import { requireAuth } from '../middleware/auth';

export const offersRouter = Router();

export interface OfferRecord {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amountCents: number;
  message?: string | null;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt: string;
  buyerEmail?: string;
  sellerEmail?: string;
  listingTitle?: string;
  listingPriceCents?: number;
}

let tableEnsured = false;
export async function ensureOffersTable() {
  if (tableEnsured) return;
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS offers (
      id TEXT PRIMARY KEY,
      listing_id TEXT NOT NULL,
      buyer_id TEXT NOT NULL,
      seller_id TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_offers_listing_id ON offers(listing_id);`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_offers_seller_id ON offers(seller_id);`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS idx_offers_buyer_id ON offers(buyer_id);`);
  tableEnsured = true;
}

/**
 * POST /offers
 * Create a new offer on a listing (Buyer action)
 */
offersRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    await ensureOffersTable();

    const { listingId, amountCents, message } = req.body as {
      listingId: string;
      amountCents: number;
      message?: string;
    };

    if (!listingId) {
      throw new AppError('VALIDATION_ERROR', 'listingId is required');
    }

    if (!amountCents || typeof amountCents !== 'number' || amountCents <= 0) {
      throw new AppError('VALIDATION_ERROR', 'amountCents must be a positive number');
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { seller: true },
    });

    if (!listing) {
      throw notFound('Listing');
    }

    if (listing.status === 'inactive') {
      throw new AppError('LISTING_NOT_ACTIVE', 'This listing is no longer available');
    }

    if (listing.sellerId === req.user!.id) {
      throw forbidden('You cannot make an offer on your own listing');
    }

    const offerId = crypto.randomUUID();
    const cleanMessage = message ? message.trim() : null;

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO offers (id, listing_id, buyer_id, seller_id, amount_cents, message, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW(), NOW())
      `,
      offerId,
      listing.id,
      req.user!.id,
      listing.sellerId,
      Math.round(amountCents),
      cleanMessage,
    );

    const buyer = await prisma.user.findUnique({ where: { id: req.user!.id } });

    const created: OfferRecord = {
      id: offerId,
      listingId: listing.id,
      buyerId: req.user!.id,
      sellerId: listing.sellerId,
      amountCents: Math.round(amountCents),
      message: cleanMessage,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      buyerEmail: buyer?.email,
      sellerEmail: listing.seller.email,
      listingTitle: listing.title,
      listingPriceCents: listing.priceCents,
    };

    res.status(201).json(created);
  }),
);

/**
 * GET /offers/received
 * Get all offers received by the authenticated seller
 */
offersRouter.get(
  '/received',
  requireAuth,
  asyncHandler(async (req, res) => {
    await ensureOffersTable();

    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        listing_id: string;
        buyer_id: string;
        seller_id: string;
        amount_cents: number;
        message: string | null;
        status: string;
        created_at: Date;
        updated_at: Date;
        listing_title: string;
        listing_price_cents: number;
        buyer_email: string;
      }>
    >`
      SELECT 
        o.id,
        o.listing_id,
        o.buyer_id,
        o.seller_id,
        o.amount_cents,
        o.message,
        o.status,
        o.created_at,
        o.updated_at,
        l.title as listing_title,
        l.price_cents as listing_price_cents,
        u.email as buyer_email
      FROM offers o
      JOIN listings l ON o.listing_id = l.id
      JOIN users u ON o.buyer_id = u.id
      WHERE o.seller_id = ${req.user!.id}
      ORDER BY o.created_at DESC
    `;

    const offers: OfferRecord[] = rows.map((r) => ({
      id: r.id,
      listingId: r.listing_id,
      buyerId: r.buyer_id,
      sellerId: r.seller_id,
      amountCents: r.amount_cents,
      message: r.message,
      status: r.status as 'pending' | 'accepted' | 'declined',
      createdAt: r.created_at.toISOString(),
      updatedAt: r.updated_at.toISOString(),
      listingTitle: r.listing_title,
      listingPriceCents: r.listing_price_cents,
      buyerEmail: r.buyer_email,
    }));

    res.status(200).json(offers);
  }),
);

/**
 * GET /offers/mine
 * Get all offers submitted by the authenticated buyer
 */
offersRouter.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    await ensureOffersTable();

    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        listing_id: string;
        buyer_id: string;
        seller_id: string;
        amount_cents: number;
        message: string | null;
        status: string;
        created_at: Date;
        updated_at: Date;
        listing_title: string;
        listing_price_cents: number;
        seller_email: string;
      }>
    >`
      SELECT 
        o.id,
        o.listing_id,
        o.buyer_id,
        o.seller_id,
        o.amount_cents,
        o.message,
        o.status,
        o.created_at,
        o.updated_at,
        l.title as listing_title,
        l.price_cents as listing_price_cents,
        u.email as seller_email
      FROM offers o
      JOIN listings l ON o.listing_id = l.id
      JOIN users u ON o.seller_id = u.id
      WHERE o.buyer_id = ${req.user!.id}
      ORDER BY o.created_at DESC
    `;

    const offers: OfferRecord[] = rows.map((r) => ({
      id: r.id,
      listingId: r.listing_id,
      buyerId: r.buyer_id,
      sellerId: r.seller_id,
      amountCents: r.amount_cents,
      message: r.message,
      status: r.status as 'pending' | 'accepted' | 'declined',
      createdAt: r.created_at.toISOString(),
      updatedAt: r.updated_at.toISOString(),
      listingTitle: r.listing_title,
      listingPriceCents: r.listing_price_cents,
      sellerEmail: r.seller_email,
    }));

    res.status(200).json(offers);
  }),
);

/**
 * GET /offers/listing/:listingId
 * Get offers for a specific listing (seller or buyer)
 */
offersRouter.get(
  '/listing/:listingId',
  requireAuth,
  asyncHandler(async (req, res) => {
    await ensureOffersTable();

    const listing = await prisma.listing.findUnique({
      where: { id: req.params.listingId },
    });

    if (!listing) {
      throw notFound('Listing');
    }

    const isSeller = listing.sellerId === req.user!.id;
    const isAdmin = Boolean(req.user!.isAdmin);

    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        listing_id: string;
        buyer_id: string;
        seller_id: string;
        amount_cents: number;
        message: string | null;
        status: string;
        created_at: Date;
        updated_at: Date;
        buyer_email: string;
      }>
    >`
      SELECT 
        o.id,
        o.listing_id,
        o.buyer_id,
        o.seller_id,
        o.amount_cents,
        o.message,
        o.status,
        o.created_at,
        o.updated_at,
        u.email as buyer_email
      FROM offers o
      JOIN users u ON o.buyer_id = u.id
      WHERE o.listing_id = ${req.params.listingId}
      ORDER BY o.created_at DESC
    `;

    // If buyer (not seller/admin), only show their own offers
    const filteredRows = isSeller || isAdmin ? rows : rows.filter((r) => r.buyer_id === req.user!.id);

    const offers: OfferRecord[] = filteredRows.map((r) => ({
      id: r.id,
      listingId: r.listing_id,
      buyerId: r.buyer_id,
      sellerId: r.seller_id,
      amountCents: r.amount_cents,
      message: r.message,
      status: r.status as 'pending' | 'accepted' | 'declined',
      createdAt: r.created_at.toISOString(),
      updatedAt: r.updated_at.toISOString(),
      buyerEmail: r.buyer_email,
      listingTitle: listing.title,
      listingPriceCents: listing.priceCents,
    }));

    res.status(200).json(offers);
  }),
);

/**
 * PATCH /offers/:id/status
 * Approve or decline an offer (Seller action)
 */
offersRouter.patch(
  '/:id/status',
  requireAuth,
  asyncHandler(async (req, res) => {
    await ensureOffersTable();

    const { status } = req.body as { status: 'accepted' | 'declined' };

    if (!status || (status !== 'accepted' && status !== 'declined')) {
      throw new AppError('VALIDATION_ERROR', 'Status must be accepted or declined');
    }

    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        listing_id: string;
        buyer_id: string;
        seller_id: string;
        amount_cents: number;
        message: string | null;
        status: string;
        created_at: Date;
        updated_at: Date;
      }>
    >`
      SELECT * FROM offers WHERE id = ${req.params.id}
    `;

    if (rows.length === 0) {
      throw notFound('Offer');
    }

    const offer = rows[0];

    if (offer.seller_id !== req.user!.id && !req.user!.isAdmin) {
      throw forbidden('Only the seller can approve or decline this offer');
    }

    await prisma.$executeRawUnsafe(
      `
      UPDATE offers 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      `,
      status,
      req.params.id,
    );

    const updated = {
      ...offer,
      status,
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json({
      id: updated.id,
      listingId: updated.listing_id,
      buyerId: updated.buyer_id,
      sellerId: updated.seller_id,
      amountCents: updated.amount_cents,
      message: updated.message,
      status,
      createdAt: updated.created_at.toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }),
);
