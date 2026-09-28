import { useAuth } from "@/context/AuthContext";
import { sellerListings, type ListingType } from "@/utils/sellerListingSeed";
export interface GetListringParams {
  currentPage: number;
  limit: number;
  sellerId: string;
}
interface CreateListingData {
  title: string;
  description: string;
  category: string;
  condition: string;
  images: string[];
  price: string;
  sellerId: string;
}

export interface PaginatedItems {
  data: typeof sellerListings;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  currentPage: number;
}

export const getListing = async ({
  currentPage,
  limit,
  sellerId,
}: GetListringParams): Promise<PaginatedItems> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const sellerItems = sellerListings.filter((item) => {
    return item.sellerId === sellerId;
  });
  console.log(sellerItems);
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  console.log(sellerItems);
  const data = sellerItems.slice(startIndex, endIndex);

  return {
    data,
    page: currentPage,
    currentPage,
    limit,
    total: sellerItems.length,
    totalPages: Math.ceil(sellerItems.length / limit),
  };
};
export const createItem = (data: CreateListingData) => {
  const newListing: ListingType = {
    id: `listing-${Date.now()}`,
    sellerId: data.sellerId,
    name: data.title,
    description: data.description,
    category: data.category as ListingCategory,
    condition: data.condition as ListingCondition,
    images: data.images,
    price: Number(data.price),
    status: "Active",
    views: 0,
  };

  console.log("NEW LISTING:", newListing);

  sellerListings.unshift(newListing);

  return newListing;
};
