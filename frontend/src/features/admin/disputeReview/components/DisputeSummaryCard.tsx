import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/typography";
import { formatActivityDate } from "@/utils/dateUtils";
import type { Order } from "@/utils/orderSeed";

interface DisputeSummaryCardProps {
  disputeOrder?: Order;
  onMoreClick?: () => void;
}

export default function DisputeSummaryCard({
  disputeOrder,
  onMoreClick,
}: DisputeSummaryCardProps) {
  const orderNumber =
    disputeOrder?.orderNumber ||
    (disputeOrder?.id
      ? `#HLD-${disputeOrder.id.slice(0, 4).toUpperCase()}`
      : "#HLD-2847");

  const itemName = disputeOrder?.itemName || "Vintage Leica M6";
  const reason = disputeOrder?.disputeReason || "Item not as described";
  const buyerHandle = disputeOrder?.buyerName
    ? disputeOrder.buyerName.startsWith("@")
      ? disputeOrder.buyerName
      : `@${disputeOrder.buyerName}`
    : "@vintage_buyer";

  const buyerInitials = disputeOrder?.buyerName
    ? disputeOrder.buyerName.replace("@", "").slice(0, 2).toUpperCase()
    : "VB";

  const amount =
    disputeOrder?.totalPrice !== undefined
      ? `$${disputeOrder.totalPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "$1,245.00";

  const disputeEvent = disputeOrder?.statusHistory?.find(
    (h) => h.status === "Disputed" || h.title?.toLowerCase().includes("dispute"),
  );
  const dateStr =
    disputeEvent?.date || disputeOrder?.createdAt || disputeOrder?.orderDate;
  const shortDate = dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Aug 7";

  return (
    <div className="w-full p-4 md:p-[16px] gap-3 md:gap-[12px] flex flex-col bg-surface-default border border-outline-default rounded-[6px] shadow-xs">
      <div className="flex items-center justify-between w-full">
        <Typography
          variant="h3"
          className="text-content-primary font-[600]! text-[15px]!"
        >
          Dispute Summary
        </Typography>
        <button
          type="button"
          onClick={onMoreClick}
          className="text-content-tertiary hover:text-content-primary transition-colors cursor-pointer"
        >
          <Icon icon="ph:dots-three-bold" className="w-5 h-5" />
        </button>
      </div>

      <div className="flex md:hidden flex-col gap-3 pt-1">
        <div>
          <span className="text-[11px] font-bold text-content-tertiary uppercase tracking-wider block mb-0.5">
            REASON
          </span>
          <span className="text-[13px] font-medium text-content-primary">
            {reason}
          </span>
        </div>

        <div>
          <span className="text-[11px] font-bold text-content-tertiary uppercase tracking-wider block mb-0.5">
            FILED BY
          </span>
          <span className="text-[13px] font-medium text-content-primary">
            {buyerHandle} ({shortDate})
          </span>
        </div>

        <div>
          <span className="text-[11px] font-bold text-content-tertiary uppercase tracking-wider block mb-0.5">
            ORDER
          </span>
          <span className="text-[13px] font-medium text-content-primary font-jetbrains">
            {orderNumber} <span className="text-content-tertiary mx-1">•</span> {amount}
          </span>
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-[12px]">
        <div className="flex items-center justify-between w-full gap-[32px]">
          <div className="flex flex-col gap-1 flex-1">
            <Typography
              variant="caption"
              className="text-content-tertiary font-bold tracking-wider uppercase text-[12px]"
            >
              REASON FOR DISPUTE
            </Typography>
            <div className="flex items-center justify-between px-3 py-2 bg-surface-default border border-outline-default rounded-[6px] cursor-pointer hover:border-outline-strong transition-colors">
              <Typography
                variant="body"
                className="text-content-primary font-medium"
              >
                {reason}
              </Typography>
              <Icon
                icon="lucide:chevron-down"
                className="w-4 h-4 text-content-secondary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <Typography
              variant="caption"
              className="text-content-tertiary font-bold tracking-wider uppercase text-[11px]"
            >
              FILED BY
            </Typography>
            <div className="flex items-center gap-2 pt-1">
              <div className="w-6 h-6 rounded-full bg-surface-raised border border-outline-subtle flex items-center justify-center text-[10px] font-bold text-content-primary font-mono">
                {buyerInitials}
              </div>
              <Typography
                variant="body"
                className="text-content-primary font-semibold"
              >
                {buyerHandle}
              </Typography>
              <span className="text-content-tertiary text-xs">•</span>
              <Typography
                variant="bodySmall"
                className="text-content-tertiary text-[12px]!"
              >
                {dateStr ? formatActivityDate(dateStr) : "Aug 7, 2:15 PM"}
              </Typography>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 pt-2 border-t border-outline-subtle items-center">
          <div className="flex flex-col">
            <Typography
              variant="caption"
              className="text-content-tertiary font-bold tracking-wider uppercase text-[10px]"
            >
              ORIGINAL ORDER
            </Typography>
            <Typography
              variant="body"
              className="text-content-primary font-bold font-mono"
            >
              {orderNumber}
            </Typography>
          </div>

          <div className="flex flex-col">
            <Typography
              variant="caption"
              className="text-content-tertiary font-bold tracking-wider uppercase text-[10px]"
            >
              ITEM
            </Typography>
            <Typography
              variant="body"
              className="text-content-primary font-semibold truncate"
            >
              {itemName}
            </Typography>
          </div>

          <div className="flex flex-col">
            <Typography
              variant="caption"
              className="text-content-tertiary font-bold tracking-wider uppercase text-[10px]"
            >
              ORDER TOTAL
            </Typography>
            <Typography
              variant="currencySmall"
              className="text-content-link font-bold"
            >
              {amount}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
