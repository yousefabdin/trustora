import api from "@/apis/axios";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface AppNotification {
  id: string;
  type:
    | "item_sold"
    | "item_shipped"
    | "order_shipped"
    | "funds_released"
    | "dispute_opened"
    | "order_held"
    | "offer_received";
  title: string;
  message: string;
  orderId?: string;
  listingId?: string;
  createdAt: string;
  isRead: boolean;
  role: "seller" | "buyer" | "system" | "admin";
  actionUrl?: string;
}

export interface NotificationsResponse {
  data: AppNotification[];
  unreadCount: number;
}

export const fetchNotificationsApi =
  async (): Promise<NotificationsResponse> => {
    const response = await api.get<NotificationsResponse>("/notifications");
    return response.data;
  };

export const markNotificationAsReadApi = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsAsReadApi = async (
  ids: string[],
): Promise<void> => {
  await api.post("/notifications/read-all", { ids });
};

export const NOTIFICATIONS_QUERY_KEY = ["notifications"] as const;

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchNotificationsApi,
    enabled: Boolean(isAuthenticated),
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    staleTime: 10000,
  });

  const notifications = data?.data || [];
  const unreadCount =
    data?.unreadCount ?? notifications.filter((n) => !n.isRead).length;

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsReadApi,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      const previousData = queryClient.getQueryData<NotificationsResponse>(
        NOTIFICATIONS_QUERY_KEY,
      );

      if (previousData) {
        queryClient.setQueryData<NotificationsResponse>(
          NOTIFICATIONS_QUERY_KEY,
          {
            data: previousData.data.map((n) =>
              n.id === id ? { ...n, isRead: true } : n,
            ),
            unreadCount: Math.max(0, previousData.unreadCount - 1),
          },
        );
      }

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsReadApi,
    onMutate: async (ids: string[]) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      const previousData = queryClient.getQueryData<NotificationsResponse>(
        NOTIFICATIONS_QUERY_KEY,
      );

      if (previousData) {
        const idSet = new Set(ids);
        queryClient.setQueryData<NotificationsResponse>(
          NOTIFICATIONS_QUERY_KEY,
          {
            data: previousData.data.map((n) =>
              idSet.has(n.id) ? { ...n, isRead: true } : n,
            ),
            unreadCount: 0,
          },
        );
      }

      return { previousData };
    },
    onError: (_err, _ids, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const markAllAsRead = () => {
    const allUnreadIds = notifications
      .filter((n) => !n.isRead)
      .map((n) => n.id);
    if (allUnreadIds.length > 0) {
      markAllAsReadMutation.mutate(allUnreadIds);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading: isLoading || (isAuthenticated && !data),
    isFetching,
    refresh: refetch,
    markAsRead,
    markAllAsRead,
  };
}
