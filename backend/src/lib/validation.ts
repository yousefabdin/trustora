import { z } from 'zod';

export const roleSchema = z.enum(['buyer', 'seller']);

export const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
  roles: z.array(roleSchema).min(1).max(2).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const createListingSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10_000_000),
  category: z.string().trim().min(1).max(100),
  priceCents: z.number().int().nonnegative(),
  status: z.enum(['active', 'draft']).optional().default('active'),
  imageUrl: z.string().max(15_000_000).optional(),
  images: z.array(z.string().max(15_000_000)).max(10).optional(),
});

export const updateListingSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(10_000_000),
    category: z.string().trim().min(1).max(100),
    priceCents: z.number().int().nonnegative(),
    status: z.enum(['active', 'inactive', 'draft', 'sold']),
    imageUrl: z.string().max(15_000_000).optional(),
    images: z.array(z.string().max(15_000_000)).max(10).optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' });

export const listingQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  category: z.string().trim().max(100).optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  sortBy: z.string().trim().max(50).optional(),
});

export const createOrderSchema = z.object({
  listingId: z.string().uuid(),
});

export const orderQuerySchema = z.object({
  role: z.enum(['buyer', 'seller']),
  search: z.string().trim().max(200).optional(),
  status: z.string().trim().max(50).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const shipOrderSchema = z.object({
  trackingInfo: z.string().trim().min(1).max(500).optional(),
});

export const disputeOrderSchema = z.object({
  reason: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10_000_000),
  evidenceFiles: z
    .array(
      z.union([
        z.string().max(15_000_000),
        z.object({
          name: z.string().trim().max(500),
          url: z.string().max(15_000_000).optional(),
        }),
      ]),
    )
    .max(10)
    .optional(),
});

export const resolveOrderSchema = z.object({
  resolution: z.enum(['release', 'refund']),
});
