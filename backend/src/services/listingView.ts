import { Listing, User } from '@prisma/client';

export interface ListingResponse {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  category: string;
  priceCents: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function toListingResponse(listing: Listing & { seller: Pick<User, 'email'> }): ListingResponse {
  return {
    id: listing.id,
    sellerId: listing.sellerId,
    sellerName: listing.seller.email,
    title: listing.title,
    description: listing.description,
    category: listing.category,
    priceCents: listing.priceCents,
    status: listing.status,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}
