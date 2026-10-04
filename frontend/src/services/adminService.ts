import api from "@/apis/axios";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@/utils/orderSeed";
import { adaptOrder, type BackendOrderResponse } from "./orderService";

export interface StatMetric {
  value: number;
  formatted?: string;
  percentageChange: string;
  isPositive: boolean;
}

export interface AdminActivityItem {
  id: string;
  orderId: string;
  orderNumber: string;
  itemName: string;
  type: string;
  title: string;
  dotColor: string;
  amount: string;
  timestamp: string;
  buyerEmail?: string;
  sellerEmail?: string;
  note?: string | null;
}

export interface AdminDashboardData {
  timeframeDays: number;
  stats: {
    totalOrders: StatMetric;
    fundsInEscrow: StatMetric;
    openDisputes: StatMetric;
    revenueFees: StatMetric;
  };
  recentActivity: AdminActivityItem[];
  disputesRequiringAction: Order[];
}

interface RawDashboardResponse {
  timeframeDays: number;
  stats: {
    totalOrders: StatMetric;
    fundsInEscrow: StatMetric;
    openDisputes: StatMetric;
    revenueFees: StatMetric;
  };
  recentActivity: AdminActivityItem[];
  disputesRequiringAction: BackendOrderResponse[];
}

export const getAdminDashboard = async (
  days: string = "30 days",
): Promise<AdminDashboardData> => {
  const queryParam = days.toLowerCase().replace("last ", "").trim();
  const response = await api.get<RawDashboardResponse>(`/admin/dashboard`, {
    params: { days: queryParam },
  });

  return {
    ...response.data,
    disputesRequiringAction: (response.data.disputesRequiringAction || []).map(adaptOrder),
  };
};

export const useAdminDashboard = (days: string = "30 days") => {
  return useQuery({
    queryKey: ["admin", "dashboard", days],
    queryFn: () => getAdminDashboard(days),
    refetchInterval: 30000,
  });
};
