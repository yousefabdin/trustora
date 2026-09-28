import React from "react";
import { disputeData, type Dispute } from "@/utils/disputedSeed";
import { useNavigate } from "react-router-dom";
import { getOrderById } from "@/services/orderService";
import clsx from "clsx";

const getItemNameFromOrderId = (orderId: string): string => {
  const parts = orderId.split("-");
  if (parts.length < 3) return orderId;
  return parts
    .slice(2)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatOrderId = (orderId: string): string => {
  const parts = orderId.split("-");
  if (parts.length >= 2) {
    return `#${parts[0].toUpperCase()}-${parts[1]}`;
  }
  return `#${orderId.toUpperCase()}`;
};

const formatDisputeId = (id: string): string => {
  if (id.startsWith("#")) return id;
  if (id.startsWith("dsp-00")) {
    return `#${id.replace("dsp-00", "D-014")}`;
  }
  if (id.startsWith("dsp-")) {
    return `#${id.replace("dsp-", "D-01")}`;
  }
  return `#${id.toUpperCase()}`;
};

const formatParticipantName = (name?: string, fallback = "Unknown"): string => {
  if (!name) return fallback;
  if (name.includes("_")) {
    return name
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return name;
};

const getItemTitle = (dispute: Dispute): string => {
  const order = getOrderById(dispute.orderId);
  if (order?.itemName) return order.itemName;
  return getItemNameFromOrderId(dispute.orderId);
};

const getBuyerDisplay = (dispute: Dispute): string => {
  const order = getOrderById(dispute.orderId);
  if (order?.buyerName) {
    return formatParticipantName(order.buyerName);
  }
  return dispute.buyerId.replace("user-", "User ");
};

const getSellerDisplay = (dispute: Dispute): string => {
  const order = getOrderById(dispute.orderId);
  if (order?.sellerName) {
    return formatParticipantName(order.sellerName);
  }
  return dispute.sellerId.replace("seller-", "Seller ");
};

const formatDaysOpen = (daysopen: string): string => {
  if (!daysopen) return "Opened recently";
  if (daysopen.toLowerCase().includes("ago")) return daysopen;
  return `Opened ${daysopen} ago`;
};

const getPriorityBadgeClass = (priority: Dispute["priority"]) => {
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

const getMobilePriorityBadgeClass = (priority: Dispute["priority"]) => {
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
  disputes?: Dispute[];
  onReview?: (dispute: Dispute) => void;
}

export const DisputeTable: React.FC<DisputeTableProps> = ({
  disputes = disputeData,
  onReview,
}) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="md:hidden flex flex-col gap-3 px-4 pb-8 w-full">
        {disputes.map((dispute, index) => {
          const formattedId = formatDisputeId(dispute.id);
          const itemTitle = getItemTitle(dispute);
          const buyer = getBuyerDisplay(dispute);
          const seller = getSellerDisplay(dispute);

          return (
            <div
              key={`${dispute.id}-${index}`}
              className="w-full bg-white rounded-[8px] border border-neutral-200/80 p-[12px] shadow-xs flex flex-col gap-[10px] transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-jetbrains font-semibold text-neutral-900 text-[12px]">
                  {formattedId}
                </span>
                <span
                  className={clsx(
                    "px-2 text-[10px] font-bold tracking-wider uppercase rounded",
                    getMobilePriorityBadgeClass(dispute.priority),
                  )}
                >
                  {dispute.priority}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 text-[13px]  leading-tight">
                  {itemTitle}
                </h3>

                <div className="font-jetbrains text-sm flex items-center gap-1.5">
                  <span className="font-bold text-[#4F46E5]">
                    {dispute.amount}
                  </span>
                  <span className="text-[#6366F1] font-medium">in Escrow</span>
                </div>
              </div>
              <div className="text-xs flex items-center flex-wrap gap-1 border-b border-page-tertiary pb-1">
                <span className="text-neutral-400">Buyer:</span>
                <span className="font-semibold text-neutral-800">{buyer}</span>
                <span className="text-neutral-400 ml-1">vs Seller:</span>
                <span className="font-semibold text-neutral-800">{seller}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  {formatDaysOpen(dispute.daysopen)}
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
                  Review Dispute
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
              <th className="py-3.5 px-4">ID</th>
              <th className="py-3.5 px-4">Order</th>
              <th className="py-3.5 px-4">Item</th>
              <th className="py-3.5 px-4">Buyer</th>
              <th className="py-3.5 px-4">Seller</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Reason</th>
              <th className="py-3.5 px-4">Days Open</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--outline-subtle)] text-sm font-sans">
            {disputes.map((dispute, index) => {
              const formattedId = formatDisputeId(dispute.id);
              const isLongOpen = parseInt(dispute.daysopen) >= 3;

              return (
                <tr
                  key={`${dispute.id}-${index}`}
                  className="hover:bg-[var(--surface-raised)] transition-colors"
                >
                  <td className="py-4 px-4 font-mono font-bold text-[var(--content-primary)] whitespace-nowrap">
                    {formattedId}
                  </td>

                  <td className="py-4 px-4 font-mono text-[var(--content-tertiary)] whitespace-nowrap">
                    {formatOrderId(dispute.orderId)}
                  </td>

                  <td className="py-4 px-4 font-bold text-[var(--content-primary)] whitespace-nowrap max-w-[200px] truncate">
                    {getItemTitle(dispute)}
                  </td>

                  <td className="py-4 px-4 text-[var(--content-secondary)] font-mono whitespace-nowrap">
                    @{dispute.buyerId.replace("user-", "buyer")}
                  </td>

                  <td className="py-4 px-4 text-[var(--content-secondary)] font-mono whitespace-nowrap">
                    @{dispute.sellerId.replace("seller-", "seller")}
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-[var(--content-primary)] whitespace-nowrap">
                    {dispute.amount}
                  </td>
                  <td className="py-4 px-4 text-[var(--content-secondary)] whitespace-nowrap max-w-[150px] truncate">
                    {dispute.reason}
                  </td>

                  <td
                    className={`py-4 px-4 font-mono whitespace-nowrap ${
                      isLongOpen
                        ? "text-[var(--danger-icon)] font-bold"
                        : "text-[var(--content-secondary)]"
                    }`}
                  >
                    {dispute.daysopen
                      .replace(" days", "d")
                      .replace(" day", "d")}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs rounded-md ${getPriorityBadgeClass(
                        dispute.priority,
                      )}`}
                    >
                      {dispute.priority}
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
                      className="px-3.5 py-1 text-xs font-bold text-[var(--content-link)] bg-[var(--surface-default)] border border-[var(--outline-default)] rounded-lg hover:bg-[var(--accent-subtle)] hover:border-[var(--outline-focus)] transition-all shadow-xs cursor-pointer"
                    >
                      Review
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
