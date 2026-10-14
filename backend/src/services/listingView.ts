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
  imageUrl?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export function toListingResponse(listing: Listing & { seller: Pick<User, 'email'> }): ListingResponse {
  let images: string[] | undefined = undefined;
  let imageUrl: string | undefined = undefined;
  let cleanDescription = listing.description;

  const marker = '[Images:';
  const unbracketedMarker = '\n\n Images:';
  const idx = listing.description.indexOf(marker);
  const unIdx = listing.description.indexOf(unbracketedMarker);

  if (idx !== -1) {
    let raw = listing.description.slice(idx + marker.length).trim();
    if (raw.endsWith(']')) {
      raw = raw.slice(0, -1).trim();
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        images = parsed;
        imageUrl = parsed[0];
      } else if (typeof parsed === 'string') {
        images = [parsed];
        imageUrl = parsed;
      }
    } catch {
      const split = raw.split(',').map((s) => s.trim()).filter(Boolean);
      if (split.length > 0) {
        images = split;
        imageUrl = split[0];
      }
    }
    cleanDescription = listing.description.slice(0, idx).trim();
  } else if (unIdx !== -1) {
    const raw = listing.description.slice(unIdx + unbracketedMarker.length).trim();
    const split = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (split.length > 0) {
      images = split;
      imageUrl = split[0];
    }
    cleanDescription = listing.description.slice(0, unIdx).trim();
  }

  return {
    id: listing.id,
    sellerId: listing.sellerId,
    sellerName: listing.seller.email,
    title: listing.title,
    description: cleanDescription,
    category: listing.category,
    priceCents: listing.priceCents,
    status: listing.status,
    imageUrl,
    images,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
  };
}
