import { useQuery } from "@tanstack/react-query";
import api from "@/apis/axios"; // <--- ADD THIS LINE
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
  sellerId?: string;
  sellerEmail?: string;
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
  status?: "active" | "sold" | "draft" | "inactive";
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

export const formatSellerHandle = (rawName?: string): string => {
  if (!rawName) return "seller";
  let handle = rawName.split("@")[0];
  // Strip trailing timestamps / generated test IDs like "-1790951187875-17"
  if (handle.includes("-")) {
    const parts = handle.split("-");
    if (parts.length > 1 && /^\d+/.test(parts[1])) {
      handle = parts[0];
    }
  }
  if (handle.length > 14) {
    handle = `${handle.slice(0, 11)}...`;
  }
  return handle;
};

export const adaptListing = (item: BackendListing): MarketplaceListing => {
  const catKey = item.category?.toLowerCase() || "electronics";
  const imagePool = CATEGORY_IMAGES[catKey] || [DEFAULT_IMAGE];
  const primaryImg = imagePool[0] || DEFAULT_IMAGE;
  const sellerHandle = formatSellerHandle(item.sellerName);
  return {
    id: item.id,
    sellerId: item.sellerId,
    sellerEmail: item.sellerName,
    itemName: item.title,
    itemPrice: item.priceCents / 100,
    sellerName: sellerHandle,
    sellerAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${sellerHandle}`,
    condition: "Like New",
    rating: 4.9,
    category: item.category,
    img: primaryImg,
    images: imagePool,
    firstDescription: item.description,
    secondDescription: `Verified listing under Escrow protocol. Listed on ${new Date(item.createdAt).toLocaleDateString()}.`,
    status: (item.status?.toLowerCase() as any) || "active",
  };
};
export interface MarketplaceQueryParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export const getMarketplaceListings = async (
  params?: MarketplaceQueryParams,
): Promise<MarketplaceListing[]> => {
  const queryParams: Record<string, string | number> = {};
  if (params?.search && params.search.trim()) queryParams.search = params.search.trim();
  if (params?.category && params.category !== "all") queryParams.category = params.category;
  if (params?.minPrice !== undefined) queryParams.minPrice = params.minPrice;
  if (params?.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice;
  if (params?.sortBy) queryParams.sortBy = params.sortBy;

  const response = await api.get<BackendListing[]>("/listings", {
    params: queryParams,
  });
  return response.data.map(adaptListing);
};

export const getListingById = async (
  id: string,
): Promise<MarketplaceListing> => {
  const response = await api.get<BackendListing>(`/listings/${id}`);
  return adaptListing(response.data);
};

export const useMarketplaceListings = (params?: MarketplaceQueryParams) => {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => getMarketplaceListings(params),
  });
};

export const useListingDetails = (id?: string) => {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListingById(id!),
    enabled: Boolean(id),
  });
};
