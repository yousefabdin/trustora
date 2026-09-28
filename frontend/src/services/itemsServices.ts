import { marketplaceListings } from "@/utils/ItemsSeed";

export interface GetItemsParams {
  currentPage: number;
  limit: number;
  search?: string;
}

export interface PaginatedItems {
  data: typeof marketplaceListings;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  currentPage: number;
}

export const getItems = async ({
  currentPage,
  limit,
  search,
}: GetItemsParams): Promise<PaginatedItems> => {
  await new Promise((resolve) => setTimeout(resolve, 400)); // act as a delay like the backend
  const filteredItems = marketplaceListings.filter((item) => {
    if (!search) return true;

    return item.itemName.toLowerCase().includes(search.toLowerCase());
  });
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  const data = filteredItems.slice(startIndex, endIndex);

  return {
    data,
    currentPage,
    limit,
    total: filteredItems.length,
    totalPages: Math.ceil(filteredItems.length / limit),
  };
};
