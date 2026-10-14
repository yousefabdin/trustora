import { useQuery } from "@tanstack/react-query";
import api from "@/apis/axios";
export interface GetItemsParams {
  currentPage: number;
  limit: number;
  search?: string;
}
export interface BackendListing {
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
  imageUrl?: string | null;
  images?: string[];
}
export interface PaginatedItems {
  data: MarketplaceListing[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface MarketplaceListing {
  id: string;
  itemName: string;
  itemPrice: number;
  sellerName: string;
  sellerAvatar: string;
  condition: "New" | "Like New" | "Good" | "Refurbished";
  rating: number;
  category: string;
  img: string;
  images: string[];
  firstDescription: string;
  secondDescription: string;
  status: string;
}
const CATEGORY_IMAGES: Record<string, string[]> = {
  apparel: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=600&q=80",
  ],
  electronics: [
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  ],
  home: [
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
  ],
  cameras: [
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
  ],
};
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";

export const adaptListing = (item: BackendListing): MarketplaceListing => {
  const imagePool =
    item.images && item.images.length > 0
      ? item.images.filter(Boolean)
      : item.imageUrl
        ? [item.imageUrl]
        : [];
  const primaryImg = item.imageUrl || imagePool[0] || DEFAULT_IMAGE;
  const sellerHandle = item.sellerName
    ? item.sellerName.split("@")[0]
    : "seller";
  return {
    id: item.id,
    itemName: item.title,
    itemPrice: item.priceCents / 100,
    sellerName: sellerHandle,
    sellerAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${sellerHandle}`,
    condition: "Like New",
    rating: 4.9,
    category: item.category,
    status: item.status || "active",
    img: primaryImg,
    images: imagePool.length > 0 ? imagePool : [primaryImg],
    firstDescription: item.description,
    secondDescription: `Verified listing under Escrow protocol. Listed on ${new Date(item.createdAt).toLocaleDateString()}.`,
  };
};

export const getMarketplaceListings = async (params?: {
  search?: string;
  category?: string;
}): Promise<MarketplaceListing[]> => {
  const response = await api.get<BackendListing[]>("/listings", { params });
  return response.data.map(adaptListing);
};

export const getListingById = async (
  id: string,
): Promise<MarketplaceListing> => {
  const response = await api.get<BackendListing>(`/listings/${id}`);
  return adaptListing(response.data);
};

export const useMarketplaceListings = (params?: {
  search?: string;
  category?: string;
}) => {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => getMarketplaceListings(params),
    refetchInterval: 200000,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });
};

export const useListingDetails = (id?: string) => {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListingById(id!),
    enabled: Boolean(id),
  });
};
