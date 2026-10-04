import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { getDaysOpen, useDisputeQueue } from "@/services/disputeService";
import type { Order } from "@/utils/orderSeed";
import {
  getPriority,
  getDisputeStage,
  isDisputeResolved,
  formatDisputeReason,
  getDisputeNumber,
} from "@/utils/disputeUtils";
import DisputeEmptyState from "./DisputeEmptyState";
import { Icon } from "@iconify/react";

const getPriorityBadgeClass = (priority: string, isResolved?: boolean) => {
  if (isResolved) {
    return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-semibold";
  }
  switch (priority) {
    case "Critical":
    case "High":
      return "bg-[var(--danger-surface)] text-[var(--danger-foreground)] border border-[var(--danger-outline)] font-semibold";
    case "Medium":
      return "bg-[var(--escrow-surface)] text-[var(--escrow-foreground)] border border-[var(--escrow-outline)] font-semibold";
    case "Low":
    default:
      return "bg-[var(--surface-raised)] text-[var(--content-secondary)] border border-[var(--outline-subtle)] font-semibold";
  }
};

const getMobilePriorityBadgeClass = (priority: string, isResolved?: boolean) => {
  if (isResolved) {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  }
  switch (priority) {
    case "Critical":
      return "bg-red-50 text-red-600 border border-red-100";
    case "High":
      return "bg-amber-50 text-amber-700 border border-amber-100";
    case "Medium":
      return "bg-indigo-50 text-indigo-700 border border-indigo-100";
    case "Low":
    default:
      return "bg-neutral-100 text-neutral-600 border border-neutral-200";
  }
};

interface DisputeTableProps {
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  disputes?: Order[];
  onReview?: (dispute: Order) => void;
}

export const DisputeTable: React.FC<DisputeTableProps> = ({
  activeFilter = "All",
  onFilterChange,
  disputes,
  onReview,
}) => {
  const navigate = useNavigate();
  const {
    data: fetchedOrders,
    isLoading,
    isFetching,
    refetch,
  } = useDisputeQueue();

  const allOrders = disputes || fetchedOrders || [];

  const filteredOrders = useMemo(() => {
    if (!activeFilter || activeFilter === "All") {
      return allOrders;
    }
    return allOrders.filter((order) => {
      const stage = getDisputeStage(order);
      return stage === activeFilter;
    });
  }, [allOrders, activeFilter]);

  if (isLoading) {
    return (
      <div className="w-full px-4 md:px-6 lg:px-[90px] py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-accent-default/20 border-t-accent-default rounded-full animate-spin" />
        <p className="text-xs md:text-sm text-content-secondary font-medium">
          Loading dispute queue...
        </p>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <DisputeEmptyState
        activeFilter={activeFilter}
        totalCount={allOrders.length}
        onClearFilter={() => onFilterChange?.("All")}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="md:hidden flex flex-col gap-3 px-4 pb-8 w-full">

        {filteredOrders.map((dispute, index) => {
          const resolved = isDisputeResolved(dispute);
          const days = getDaysOpen(dispute);
          const priority = resolved ? "Resolved" : getPriority(days);
          const disputeNum = getDisputeNumber(dispute.id);
          const formattedAmount =
            dispute.amount ||
            `$${Number(dispute.totalPrice || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          const reasonLabel = formatDisputeReason(
            dispute.disputeReason || (dispute as any).reason,
          );

          return (
            <div
              key={`${dispute.id}-${index}`}
              className="w-full bg-white rounded-[10px] border border-neutral-200/80 p-3.5 shadow-xs flex flex-col gap-2.5 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-jetbrains font-semibold text-neutral-900 text-[12px]">
                  {disputeNum}
                </span>
                <span
                  className={clsx(
                    "px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded",
                    getMobilePriorityBadgeClass(priority, resolved),
                  )}
                >
                  {priority}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 text-[13px] leading-tight">
                  {dispute.itemName}
                </h3>

                <div className="font-jetbrains text-sm flex items-center gap-1.5 mt-1">
                  <span className="font-bold text-[#4F46E5]">
                    {formattedAmount}
                  </span>
                  <span className="text-[#6366F1] font-medium text-xs">
                    {resolved ? "Total Value" : "in Escrow"}
                  </span>
                </div>
              </div>

              <div className="text-xs flex items-center flex-wrap gap-1 border-b border-page-tertiary pb-2">
                <span className="text-neutral-400">Reason:</span>
                <span className="font-medium text-neutral-800">
                  {reasonLabel}
                </span>
              </div>

              <div className="text-xs flex items-center flex-wrap gap-1">
                <span className="text-neutral-400">Buyer:</span>
                <span className="font-semibold text-neutral-800">
                  {dispute.buyerName || dispute.buyer || "Buyer"}
                </span>
                <span className="text-neutral-400 ml-1">vs Seller:</span>
                <span className="font-semibold text-neutral-800">
                  {dispute.sellerName || dispute.seller || "Seller"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-400">
                  {resolved
                    ? "Case Resolved"
                    : days === 0
                      ? "Opened today (<1d)"
                      : `${days} ${days === 1 ? "day" : "days"} open`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (onReview) {
                      onReview(dispute);
                    } else {
                      navigate(`/admin/disputes/${dispute.id}`);
                    }
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {resolved ? "View Case" : "Review Dispute"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block w-full overflow-x-auto px-6 lg:px-[90px] pb-[64px]">

        <table className="w-full text-left border-collapse bg-[var(--surface-default)] rounded-xl overflow-hidden border border-[var(--outline-default)] shadow-xs">
          <thead>
            <tr className="w-full border-b border-[var(--outline-default)] bg-[var(--surface-raised)] text-xs font-semibold text-[var(--content-tertiary)] uppercase tracking-wider">
              <th className="py-3.5 px-4">Case ID</th>
              <th className="py-3.5 px-4">Order</th>
              <th className="py-3.5 px-4">Item</th>
              <th className="py-3.5 px-4">Buyer</th>
              <th className="py-3.5 px-4">Seller</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Reason</th>
              <th className="py-3.5 px-4">Days Open</th>
              <th className="py-3.5 px-4">Status / Priority</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--outline-subtle)] text-sm font-sans">
            {filteredOrders.map((dispute, index) => {
              const resolved = isDisputeResolved(dispute);
              const days = getDaysOpen(dispute);
              const priority = resolved ? "Resolved" : getPriority(days);
              const disputeNum = getDisputeNumber(dispute.id);
              const formattedAmount =
                dispute.amount ||
                `$${Number(dispute.totalPrice || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;
              const reasonLabel = formatDisputeReason(
                dispute.disputeReason || (dispute as any).reason,
              );

              return (
                <tr
                  key={`${dispute.id}-${index}`}
                  className="hover:bg-[var(--surface-raised)] transition-colors"
                >
                  <td className="py-4 px-4 font-mono font-bold text-[var(--content-primary)] whitespace-nowrap">
                    {disputeNum}
                  </td>

                  <td className="py-4 px-4 font-mono text-[var(--content-tertiary)] whitespace-nowrap">
                    {dispute.orderNumber || `#${dispute.id.slice(0, 8)}`}
                  </td>

                  <td className="py-4 px-4 font-bold text-[var(--content-primary)] whitespace-nowrap max-w-[200px] truncate">
                    {dispute.itemName}
                  </td>

                  <td className="py-4 px-4 text-[var(--content-secondary)] font-mono whitespace-nowrap">
                    @{dispute.buyerName || dispute.buyer}
                  </td>

                  <td className="py-4 px-4 text-[var(--content-secondary)] font-mono whitespace-nowrap">
                    @{dispute.sellerName || dispute.seller}
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-[var(--content-primary)] whitespace-nowrap">
                    {formattedAmount}
                  </td>

                  <td className="py-4 px-4 text-[var(--content-secondary)] whitespace-nowrap max-w-[170px] truncate" title={reasonLabel}>
                    {reasonLabel}
                  </td>

                  <td
                    className={clsx(
                      "py-4 px-4 font-mono whitespace-nowrap text-xs",
                      resolved
                        ? "text-emerald-600 font-medium"
                        : days > 2
                          ? "text-[var(--danger-icon)] font-bold"
                          : "text-[var(--content-secondary)]",
                    )}
                  >
                    {resolved ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <Icon icon="lucide:check-circle" className="w-3.5 h-3.5" />
                        Resolved
                      </span>
                    ) : days === 0 ? (
                      "< 1 day"
                    ) : (
                      `${days} ${days === 1 ? "day" : "days"}`
                    )}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs rounded-md ${getPriorityBadgeClass(
                        priority,
                        resolved,
                      )}`}
                    >
                      {priority}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        if (onReview) {
                          onReview(dispute);
                        } else {
                          navigate(`/admin/disputes/${dispute.id}`);
                        }
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[var(--content-link)] bg-[var(--surface-default)] border border-[var(--outline-default)] rounded-lg hover:bg-[var(--accent-subtle)] hover:border-[var(--outline-focus)] transition-all shadow-xs cursor-pointer"
                    >
                      {resolved ? "View Case" : "Review"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DisputeTable;
