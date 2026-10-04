import api from "@/apis/axios";
import type { Order, OrderStatus, OrderStatusHistory } from "@/utils/orderSeed";
import { useQuery } from "@tanstack/react-query";
import { formatSellerHandle } from "./itemsServices";

export interface GetItemsParams {
  currentPage: number;
  limit: number;
  search?: string;
  activeFilter?: string;
}
export interface BackendOrderEvent {
  id: string;
  actorId: string | null;
  actorRole: string;
  type: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  createdAt: string;
}
export interface BackendOrderResponse {
  id: string;
  listing: {
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
    imageUrl?: string;
    image?: string;
  };
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amountCents: number;
  status: string;
  trackingInfo?: string | null;
  disputeReason?: string | null;
  disputeNote?: string | null;
  permissions: {
    isBuyer?: boolean;
    isSeller?: boolean;
    canShip: boolean;
    canConfirmReceipt: boolean;
    canDispute: boolean;
    canResolveDispute: boolean;
  };
  events: BackendOrderEvent[];
  createdAt: string;
}

export interface PaginatedItems {
  data: Order[];
  limit: number;
  total: number;
  totalPages: number;
  currentPage: number;
}
const STATUS_MAP: Record<string, OrderStatus> = {
  pending_payment: "Escrow Pending",
  paid_held: "In Escrow",
  shipped: "Shipped",
  delivered: "Delivered",
  disputed: "Disputed",
  refunded: "Refunded",
  released: "Completed",
};

const EVENT_TITLE_MAP: Record<string, string> = {
  created: "Order Created",
  payment_held: "Payment Secured in Escrow",
  shipped: "Seller responded",
  receipt_confirmed: "Receipt Confirmed",
  disputed: "Dispute filed",
  dispute_resolved_release: "Dispute Resolved (Funds Released)",
  dispute_resolved_refund: "Dispute Resolved (Refund Issued)",
};

const DEFAULT_ITEM_IMG =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";

export const adaptOrder = (
  backendOrder: BackendOrderResponse,
): Order & {
  permissions: BackendOrderResponse["permissions"];
  rawStatus: string;
} => {
  const sellerHandle = formatSellerHandle(backendOrder.sellerName);
  const buyerHandle = formatSellerHandle(backendOrder.buyerName);
  const orderDate = backendOrder.createdAt ? backendOrder.createdAt.split("T")[0] : "";
  const dateObj = new Date(backendOrder.createdAt);
  const displayDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : orderDate;
  const dollarsPrice = (backendOrder.amountCents || 0) / 100;
  const mappedStatus = STATUS_MAP[backendOrder.status] || "In Escrow";
  
  const disputeEvent = (backendOrder.events || []).find((e) => e.type === "disputed");
  const disputeReason = backendOrder.disputeReason || (disputeEvent ? "Item not as described" : undefined);
  const disputeNote = backendOrder.disputeNote || disputeEvent?.note || undefined;

  let carrier = "FedEx";
  if (backendOrder.trackingInfo) {
    const rawUpper = backendOrder.trackingInfo.toUpperCase();
    if (rawUpper.includes("USPS")) carrier = "USPS";
    else if (rawUpper.includes("FEDEX")) carrier = "FedEx";
    else if (rawUpper.includes("UPS")) carrier = "UPS";
    else if (rawUpper.includes("DHL")) carrier = "DHL";
  }

  const statusHistory: OrderStatusHistory[] = (backendOrder.events || []).map(
    (event) => {
      let title = EVENT_TITLE_MAP[event.type] || "Status Update";
      if (event.actorRole === "admin") {
        title = "Admin assigned";
      } else if (event.type === "shipped") {
        title = "Seller responded";
      } else if (event.type === "disputed") {
        title = "Dispute filed";
      }
      return {
        status: STATUS_MAP[event.toStatus] || "In Escrow",
        date: event.createdAt,
        title,
        description:
          event.note ||
          `Order transitioned to ${STATUS_MAP[event.toStatus] || event.toStatus}`,
      };
    },
  );

    const evidenceMatches = disputeNote?.match(/\[Evidence Attached:\s*([^\]]+)\]/);
    const parsedEvidenceFiles = evidenceMatches
      ? evidenceMatches[1].split(",").map((f) => ({ name: f.trim() }))
      : undefined;

    return {
      id: backendOrder.id,
      orderNumber: `#HLD-${backendOrder.id.slice(0, 4).toUpperCase()}`,
      listingId: backendOrder.listing?.id as any,
      itemName: backendOrder.listing?.title || "Marketplace Item",
      itemDescription: backendOrder.listing?.description || "",
      itemSerial: `#${backendOrder.id.slice(0, 6).toUpperCase()}`,
      itemPrice: dollarsPrice,
      shipping: 0,
      totalPrice: dollarsPrice,
      orderDate,
      displayDate,
      status: mappedStatus,
      escrowInstructionSummary:
        "Funds held securely in escrow until buyer confirms inspection within 48 hours of delivery.",
      itemImg: backendOrder.listing?.imageUrl || backendOrder.listing?.image || DEFAULT_ITEM_IMG,
      sellerName: sellerHandle,
      sellerAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${sellerHandle}`,
      buyerName: buyerHandle,
      buyerAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${buyerHandle}`,
      shippingMethod: carrier,
      trackingNumber: backendOrder.trackingInfo || `TRK-${backendOrder.id.slice(0, 8).toUpperCase()}`,
      disputeReason,
      disputeNote,
      evidenceFiles: parsedEvidenceFiles,
      createdAt: backendOrder.createdAt,
      buyer: buyerHandle,
      sellerId: backendOrder.sellerId,
      sellerEmail: backendOrder.sellerName,
      buyerId: backendOrder.buyerId,
      buyerEmail: backendOrder.buyerName,
      amount: `$${dollarsPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      events: backendOrder.events,
      statusHistory,
      permissions: backendOrder.permissions,
      isBuyer: backendOrder.permissions?.isBuyer,
      isSeller: backendOrder.permissions?.isSeller,
      rawStatus: backendOrder.status,
    };
  };

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await api.get(`/orders/${id}`);
  return adaptOrder(response.data);
};

export const confirmReceipt = async (id: string): Promise<Order> => {
  const response = await api.post(`/orders/${id}/confirm-receipt`);
  return adaptOrder(response.data);
};

export const shipOrder = async (
  id: string,
  trackingInfo: string,
): Promise<Order> => {
  const response = await api.post(`/orders/${id}/ship`, { trackingInfo });
  return adaptOrder(response.data);
};

export interface GetOrdersParams {
  role?: "buyer" | "seller";
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const getOrdersListing = async (
  params?: GetOrdersParams | ("buyer" | "seller"),
): Promise<PaginatedOrders> => {
  const queryParams: Record<string, any> = {
    role: "buyer",
  };

  if (typeof params === "string") {
    queryParams.role = params;
  } else if (params) {
    if (params.role) queryParams.role = params.role;
    if (params.search && params.search.trim()) queryParams.search = params.search.trim();
    if (params.status && params.status !== "All") queryParams.status = params.status;
    if (params.page !== undefined) queryParams.page = params.page;
    if (params.limit !== undefined) queryParams.limit = params.limit;
  }

  const response = await api.get<
    BackendOrderResponse[] | { data: BackendOrderResponse[]; total: number; totalPages: number; page: number; limit: number }
  >("/orders", {
    params: queryParams,
  });

  if (Array.isArray(response.data)) {
    const orders = response.data.map(adaptOrder);
    return {
      data: orders,
      total: orders.length,
      totalPages: 1,
      page: 1,
      limit: orders.length,
    };
  }

  return {
    data: (response.data.data || []).map(adaptOrder),
    total: response.data.total ?? 0,
    totalPages: response.data.totalPages ?? 1,
    page: response.data.page ?? 1,
    limit: response.data.limit ?? 6,
  };
};

export const createOrder = async (listingId: string): Promise<Order> => {
  const response = await api.post<BackendOrderResponse>("/orders", {
    listingId,
  });
  return adaptOrder(response.data);
};

export const useGetOrderslisting = (
  params?: GetOrdersParams | ("buyer" | "seller"),
) => {
  const parsedParams = typeof params === "string" ? { role: params } : params;
  const role = parsedParams?.role ?? "buyer";
  const search = parsedParams?.search ?? "";
  const status = parsedParams?.status ?? "";
  const page = parsedParams?.page ?? 1;
  const limit = parsedParams?.limit ?? 6;

  return useQuery({
    queryKey: ["orders", role, search, status, page, limit],
    queryFn: () => getOrdersListing(params),
  });
};
