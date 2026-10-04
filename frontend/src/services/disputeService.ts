import { adaptOrder, type BackendOrderResponse } from "./orderService";
import { type Order, orderData } from "@/utils/orderSeed";
import { disputeData } from "@/utils/disputedSeed";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/apis/axios";

export interface DisputeResolutionPayload {
  orderId: string;
  resolution: "release" | "refund";
}
export interface OpenDisputePayload {
  orderId: string;
  reason: string;
  description: string;
  evidenceFiles?: string[];
}

export const getDisputeQueue = async (): Promise<Order[]> => {
  const response = await api.get<BackendOrderResponse[]>("/disputes");
  return response.data.map(adaptOrder);
};

export const getDisputeOrderById = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get<BackendOrderResponse>(`/orders/${orderId}`);
    return adaptOrder(response.data);
  } catch (error) {
    const seedOrder = orderData.find(
      (o) => o.id === orderId || o.orderNumber?.toLowerCase() === orderId.toLowerCase(),
    );
    if (seedOrder) return seedOrder;

    const seedDispute = disputeData.find(
      (d) => d.id === orderId || d.orderId === orderId,
    );
    if (seedDispute) {
      const relatedOrder = orderData.find((o) => o.id === seedDispute.orderId);
      if (relatedOrder) {
        return {
          ...relatedOrder,
          disputeReason: seedDispute.reason,
          disputeNote: seedDispute.description,
        };
      }
    }
    throw error;
  }
};

export const openDispute = async ({
  orderId,
  reason,
  description,
  evidenceFiles,
}: OpenDisputePayload): Promise<Order> => {
  const response = await api.post<BackendOrderResponse>(
    `/orders/${orderId}/dispute`,
    {
      reason,
      description,
      evidenceFiles,
    },
  );
  return adaptOrder(response.data);
};

export const resolveDispute = async ({
  orderId,
  resolution,
}: DisputeResolutionPayload): Promise<Order> => {
  const response = await api.post<BackendOrderResponse>(
    `/orders/${orderId}/resolve`,
    {
      resolution,
    },
  );
  return adaptOrder(response.data);
};

export const useDisputeQueue = () => {
  return useQuery({
    queryKey: ["admin", "disputes"],
    queryFn: getDisputeQueue,
  });
};

export const useDisputeDetails = (orderId?: string) => {
  return useQuery({
    queryKey: ["admin", "dispute", orderId],
    queryFn: () => getDisputeOrderById(orderId!),
    enabled: Boolean(orderId),
  });
};

export const useResolveDispute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resolveDispute,
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "dispute", updatedOrder.id],
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", updatedOrder.id] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export { getDaysOpen } from "@/utils/disputeUtils";

