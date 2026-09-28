import { orderData } from "@/utils/orderSeed";
import type { Order } from "@/utils/orderSeed";
export interface GetItemsParams {
  currentPage: number;
  limit: number;
  search?: string;
  activeFilter?: string;
}

export interface PaginatedItems {
  data: Order[];
  limit: number;
  total: number;
  totalPages: number;
  currentPage: number;
}
export const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

export const createOrder = async (order: Order) => {
  try {
    orderData.push(order);
    return order;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export function getOrderById(id: string): Order | undefined {
  return orderData.find((order) => order.id === id);
}
export const getOrder = async ({
  currentPage,
  limit,
  search,
  activeFilter,
}: GetItemsParams) => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // act as a delay like the backend

  const filterTableStatus = orderData.filter((order) => {
    if (activeFilter === "All") return true;
    return order.status.toLowerCase().includes(activeFilter.toLowerCase());
  });

  const filteredOrders = filterTableStatus.filter((order) => {
    if (!search?.trim()) {
      return true;
    }

    return order.orderNumber?.toLowerCase().includes(search.toLowerCase());
  });
  const total = filteredOrders.length;
  const totalPages = Math.ceil(total / limit);

  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const data = filteredOrders.slice(startIndex, endIndex);

  return {
    data,
    currentPage,
    limit,
    total,
    totalPages,
  };
};
