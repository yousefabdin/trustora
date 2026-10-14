import api from "@/apis/axios";

export interface OfferRecord {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amountCents: number;
  message?: string | null;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  updatedAt: string;
  buyerEmail?: string;
  sellerEmail?: string;
  listingTitle?: string;
  listingPriceCents?: number;
}

export interface CreateOfferInput {
  listingId: string;
  amountCents: number;
  message?: string;
}

export const createOffer = async (
  input: CreateOfferInput,
): Promise<OfferRecord> => {
  const response = await api.post<OfferRecord>("/offers", input);
  return response.data;
};

export const getOffersForListing = async (
  listingId: string,
): Promise<OfferRecord[]> => {
  const response = await api.get<OfferRecord[]>(`/offers/listing/${listingId}`);
  return response.data;
};

export const getReceivedOffers = async (): Promise<OfferRecord[]> => {
  const response = await api.get<OfferRecord[]>("/offers/received");
  return response.data;
};

export const getMySubmittedOffers = async (): Promise<OfferRecord[]> => {
  const response = await api.get<OfferRecord[]>("/offers/mine");
  return response.data;
};

export const updateOfferStatus = async (
  offerId: string,
  status: "accepted" | "declined",
): Promise<OfferRecord> => {
  const response = await api.patch<OfferRecord>(`/offers/${offerId}/status`, {
    status,
  });
  return response.data;
};
