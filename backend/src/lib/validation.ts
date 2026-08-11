import { z } from 'zod';

export const roleSchema = z.enum(['buyer', 'seller']);

export const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
  roles: z.array(roleSchema).min(1).max(2),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const createListingSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  category: z.string().trim().min(1).max(100),
  priceCents: z.number().int().nonnegative(),
});

export const updateListingSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().min(1).max(5000),
    category: z.string().trim().min(1).max(100),
    priceCents: z.number().int().nonnegative(),
    status: z.enum(['active', 'inactive']),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field must be provided' });

export const listingQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  category: z.string().trim().max(100).optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
});

export const createOrderSchema = z.object({
  listingId: z.string().uuid(),
});

export const orderQuerySchema = z.object({
  role: z.enum(['buyer', 'seller']),
});

export const shipOrderSchema = z.object({
  trackingInfo: z.string().trim().min(1).max(500).optional(),
});

export const disputeOrderSchema = z.object({
  reason: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
});

export const resolveOrderSchema = z.object({
  resolution: z.enum(['release', 'refund']),
});
