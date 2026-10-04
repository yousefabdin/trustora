import { Router } from 'express';
import { prisma } from '../db/client';
import { asyncHandler } from '../lib/asyncHandler';
import { forbidden, notFound } from '../lib/errors';
import { createListingSchema, listingQuerySchema, updateListingSchema } from '../lib/validation';
import { requireAuth, requireRole } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import { toListingResponse } from '../services/listingView';

export const listingsRouter = Router();

const SELLER_INCLUDE = { seller: { select: { email: true } } } as const;

listingsRouter.get(
  '/',
  validateQuery(listingQuerySchema),
  asyncHandler(async (req, res) => {
    const { search, category, minPrice, maxPrice, sortBy } = req.query as unknown as {
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
    };

    const andConditions: any[] = [{ status: 'active' }];

    if (category && category.toLowerCase() !== 'all') {
      const catLower = category.toLowerCase().trim();
      const terms = [catLower];
      if (catLower === 'fashion' || catLower === 'apparel') {
        terms.push('fashion', 'apparel', 'clothing');
      } else if (catLower === 'home') {
        terms.push('home', 'living', 'furniture');
      }
      andConditions.push({
        OR: terms.map((t) => ({ category: { contains: t, mode: 'insensitive' as const } })),
      });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      andConditions.push({
        priceCents: {
          ...(minPrice !== undefined ? { gte: minPrice } : {}),
          ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
        },
      });
    }

    if (search && search.trim() !== '') {
      const s = search.trim();
      andConditions.push({
        OR: [
          { title: { contains: s, mode: 'insensitive' as const } },
          { description: { contains: s, mode: 'insensitive' as const } },
          { category: { contains: s, mode: 'insensitive' as const } },
        ],
      });
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price-low-high') {
      orderBy = { priceCents: 'asc' };
    } else if (sortBy === 'price-high-low') {
      orderBy = { priceCents: 'desc' };
    } else if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const listings = await prisma.listing.findMany({
      where: { AND: andConditions },
      include: SELLER_INCLUDE,
      orderBy,
    });

    res.status(200).json(listings.map(toListingResponse));
  }),
);

listingsRouter.get(
  '/mine',
  requireAuth,
  asyncHandler(async (req, res) => {
    const listings = await prisma.listing.findMany({
      where: { sellerId: req.user!.id },
      include: SELLER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(listings.map(toListingResponse));
  }),
);

listingsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id }, include: SELLER_INCLUDE });
    if (!listing) throw notFound('Listing');
    res.status(200).json(toListingResponse(listing));
  }),
);

listingsRouter.post(
  '/',
  requireAuth,
  requireRole('seller'),
  validateBody(createListingSchema),
  asyncHandler(async (req, res) => {
    const { title, description, category, priceCents, status } = req.body as {
      title: string;
      description: string;
      category: string;
      priceCents: number;
      status?: 'active' | 'draft';
    };

    const listing = await prisma.listing.create({
      data: {
        sellerId: req.user!.id,
        title,
        description,
        category,
        priceCents,
        status: status || 'active',
      },
      include: SELLER_INCLUDE,
    });

    res.status(201).json(toListingResponse(listing));
  }),
);

listingsRouter.patch(
  '/:id',
  requireAuth,
  validateBody(updateListingSchema),
  asyncHandler(async (req, res) => {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) throw notFound('Listing');
    if (listing.sellerId !== req.user!.id) {
      throw forbidden('Only the owning seller can modify this listing');
    }

    const updated = await prisma.listing.update({
      where: { id: listing.id },
      data: req.body,
      include: SELLER_INCLUDE,
    });

    res.status(200).json(toListingResponse(updated));
  }),
);

listingsRouter.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const listing = await prisma.listing.findUnique({ where: { id: req.params.id } });
    if (!listing) throw notFound('Listing');
    if (listing.sellerId !== req.user!.id) {
      throw forbidden('Only the owning seller can delete this listing');
    }

    // Soft delete: existing orders reference this listing and must keep
    // rendering their historical listing details, so the row can't be
    // hard-removed. 'inactive' is the only "gone from the marketplace"
    // state the Listing model has.
    await prisma.listing.update({ where: { id: listing.id }, data: { status: 'inactive' } });

    res.status(204).send();
  }),
);
