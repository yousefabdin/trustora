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
      where: { sellerId: req.user!.id, status: { not: 'inactive' } },
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
    const { title, description, category, priceCents, status, imageUrl, images } = req.body as {
      title: string;
      description: string;
      category: string;
      priceCents: number;
      status?: 'active' | 'draft';
      imageUrl?: string;
      images?: string[];
    };

    const imageList: string[] = [];
    if (images && Array.isArray(images)) {
      imageList.push(...images.filter(Boolean));
    } else if (imageUrl) {
      imageList.push(imageUrl);
    }

    const cleanDesc = description.replace(/\n\n\[?Images:\s*[\s\S]+?\]?(?:\s*$)?/, '').trim();
    const formattedDescription =
      imageList.length > 0 ? `${cleanDesc}\n\n[Images: ${JSON.stringify(imageList)}]` : cleanDesc;

    const listing = await prisma.listing.create({
      data: {
        sellerId: req.user!.id,
        title,
        description: formattedDescription,
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

    const { title, description, category, priceCents, status, imageUrl, images } = req.body as {
      title?: string;
      description?: string;
      category?: string;
      priceCents?: number;
      status?: 'active' | 'inactive' | 'draft' | 'sold';
      imageUrl?: string;
      images?: string[];
    };

    let formattedDescription: string | undefined = undefined;
    if (description !== undefined || imageUrl !== undefined || images !== undefined) {
      const rawBase = description !== undefined ? description : listing.description;
      const baseDesc = rawBase
        .replace(/\n\n\[?Images:\s*[\s\S]+?\]?(?:\s*$)?/, '')
        .trim();

      const imageList: string[] = [];
      if (images && Array.isArray(images)) {
        imageList.push(...images.filter(Boolean));
      } else if (imageUrl) {
        imageList.push(imageUrl);
      } else {
        const marker = '[Images:';
        const unMarker = '\n\n Images:';
        const idx = listing.description.indexOf(marker);
        const unIdx = listing.description.indexOf(unMarker);
        if (idx !== -1) {
          let raw = listing.description.slice(idx + marker.length).trim();
          if (raw.endsWith(']')) raw = raw.slice(0, -1).trim();
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) imageList.push(...parsed);
            else if (typeof parsed === 'string') imageList.push(parsed);
          } catch {
            imageList.push(...raw.split(',').map((s) => s.trim()).filter(Boolean));
          }
        } else if (unIdx !== -1) {
          const raw = listing.description.slice(unIdx + unMarker.length).trim();
          imageList.push(...raw.split(',').map((s) => s.trim()).filter(Boolean));
        }
      }

      formattedDescription =
        imageList.length > 0 ? `${baseDesc}\n\n[Images: ${JSON.stringify(imageList)}]` : baseDesc;
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (priceCents !== undefined) updateData.priceCents = priceCents;
    if (status !== undefined) updateData.status = status;
    if (formattedDescription !== undefined) updateData.description = formattedDescription;

    const updated = await prisma.listing.update({
      where: { id: listing.id },
      data: updateData,
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

    await prisma.listing.update({ where: { id: listing.id }, data: { status: 'inactive' } });

    res.status(204).send();
  }),
);
