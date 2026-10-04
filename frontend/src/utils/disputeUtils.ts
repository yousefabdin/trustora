import type { Order } from "./orderSeed";
import type { BackendOrderResponse } from "@/services/orderService";

export const getDaysOpen = (
  order?: Order | BackendOrderResponse | string | null,
): number => {
  if (!order || typeof order === "string") return 0;

  if (typeof (order as any).daysOpen === "number") {
    return (order as any).daysOpen;
  }
  if (typeof (order as any).daysopen === "string") {
    const parsed = parseInt((order as any).daysopen, 10);
    if (!isNaN(parsed)) return parsed;
  }

  const events = (order as any).events || (order as any).statusHistory || [];
  const disputeEvent = events.find(
    (event: any) =>
      event.type === "disputed" ||
      event.status === "Disputed" ||
      (event.title && event.title.toLowerCase().includes("dispute")),
  );

  const disputeDateStr =
    disputeEvent?.createdAt ||
    disputeEvent?.date ||
    (order as any).createdAt ||
    (order as any).orderDate;
  if (!disputeDateStr) return 0;

  const disputeDate = new Date(disputeDateStr);
  const resolveEvent = events.find(
    (event: any) =>
      event.type === "dispute_resolved_release" ||
      event.type === "dispute_resolved_refund",
  );

  const endDate = resolveEvent?.createdAt
    ? new Date(resolveEvent.createdAt)
    : new Date();
  const diffInMilliseconds = endDate.getTime() - disputeDate.getTime();
  const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  return Math.max(0, days);
};

export const getPriority = (
  daysOpen: number,
): "Low" | "Medium" | "High" | "Critical" => {
  if (daysOpen >= 7) return "Critical";
  if (daysOpen >= 5) return "High";
  if (daysOpen >= 3) return "Medium";
  return "Low";
};

export const isDisputeResolved = (order: Order): boolean => {
  if (
    order.rawStatus === "released" ||
    order.rawStatus === "refunded" ||
    order.status === "Completed" ||
    order.status === "Refunded"
  ) {
    return true;
  }
  const events = order.events || [];
  return events.some(
    (e) =>
      e.type === "dispute_resolved_release" ||
      e.type === "dispute_resolved_refund",
  );
};

export const getDisputeStage = (
  order: Order,
): "Pending Review" | "Under Investigation" | "Resolved" => {
  if (isDisputeResolved(order)) {
    return "Resolved";
  }

  if (
    (order as any).status === "Under Investigation" ||
    (order as any).disputeStatus === "Under Investigation"
  ) {
    return "Under Investigation";
  }
  if (
    (order as any).status === "Pending Review" ||
    (order as any).disputeStatus === "Pending Review"
  ) {
    return "Pending Review";
  }

  const days = getDaysOpen(order);
  if (days > 2) {
    return "Under Investigation";
  }

  return "Pending Review";
};

export const isResolvedThisMonth = (order: Order): boolean => {
  if (!isDisputeResolved(order)) return false;
  const events = order.events || [];
  const resolveEvent = events.find(
    (e) =>
      e.type === "dispute_resolved_release" ||
      e.type === "dispute_resolved_refund",
  );
  const dateStr = resolveEvent?.createdAt || order.createdAt;
  if (!dateStr) return true;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  );
};

export const formatDisputeReason = (reason?: string): string => {
  if (!reason) return "Item not as described";
  const map: Record<string, string> = {
    not_as_described: "Item not as described",
    defective_unusable: "Defective / Unusable",
    never_arrived: "Item never arrived",
    wrong_item: "Wrong item received",
    counterfeit: "Counterfeit item",
    damaged_shipping: "Damaged in shipping",
  };
  return (
    map[reason] ||
    reason
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
};

export const getDisputeNumber = (id: string): string => {
  if (!id) return "DSP-0001";
  if (id.toLowerCase().startsWith("dsp-")) return id.toUpperCase();
  return `DSP-${id.slice(0, 4).toUpperCase()}`;
};
