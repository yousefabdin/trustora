import {
  adaptListing,
  type BackendListing,
  type MarketplaceListing,
} from "./itemsServices";
import api from "@/apis/axios";

export interface CreateListingInput {
  title: string;
  description: string;
  category: string;
  priceCents: number;
  status?: "active" | "draft";
}

export interface UpdateListingInput {
  title?: string;
  description?: string;
  category?: string;
  priceCents?: number;
  status?: "active" | "inactive" | "draft" | "sold";
}

export const getSellerListings = async (
  sellerId?: string,
): Promise<MarketplaceListing[]> => {
  try {
    const response = await api.get<BackendListing[]>("/listings/mine");
    return response.data.map(adaptListing);
  } catch {
    const response = await api.get<BackendListing[]>("/listings");
    const filtered = sellerId
      ? response.data.filter((item) => item.sellerId === sellerId)
      : response.data;
    return filtered.map(adaptListing);
  }
};

export const createListing = async (
  data: CreateListingInput,
): Promise<MarketplaceListing> => {
  const response = await api.post<BackendListing>("/listings", {
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category.toLowerCase().trim(),
    priceCents: data.priceCents,
    status: data.status || "active",
  });
  return adaptListing(response.data);
};

export const updateListing = async (
  id: string,
  data: UpdateListingInput,
): Promise<MarketplaceListing> => {
  const response = await api.patch<BackendListing>(`/listings/${id}`, data);
  return adaptListing(response.data);
};

export const deleteListing = async (id: string): Promise<void> => {
  await api.delete(`/listings/${id}`);
};
