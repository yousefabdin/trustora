import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/typography";
import type { Dispute } from "@/utils/disputedSeed";
import { formatActivityDate } from "@/utils/dateUtils";

interface DisputeSummaryCardProps {
  dispute?: Dispute;
  onMoreClick?: () => void;
}

export default function DisputeSummaryCard({
  dispute,
  onMoreClick,
}: DisputeSummaryCardProps) {
  const orderNumber = dispute?.orderId
    ? `#${dispute.orderId.split("-")[0].toUpperCase()}-${dispute.orderId.split("-")[1]}`
    : "#HLD-2847";

  const itemName = dispute?.orderId
    ? dispute.orderId
        .split("-")
        .slice(2)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Vintage Leica M6";

  const reason = dispute?.reason || "Item not as described";
  const buyerHandle = dispute?.buyerId
    ? `@${dispute.buyerId.replace("user-", "buyer_")}`
    : "@vintage_buyer";
  const amount = dispute?.amount || "$1,245.00";

  return (
    <div className="w-full h-[192px] p-[16px] gap-[12px] flex flex-col bg-surface-default border border-outline-default rounded-[6px] shadow-xs">
      <div className="flex items-center justify-between w-full h-full">
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
              VB
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
              {formatActivityDate(dispute?.createdAt)}
            </Typography>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 pt-2 border border-outline-subtle items-center">
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

        <div className="flex flex-col ">
          <Typography
            variant="caption"
            className="text-content-tertiary font-bold tracking-wider uppercase text-[10px]"
          >
            ORDER TOTAL
          </Typography>
          <Typography
            variant="currencySmall"
            className="text-content-link font-bold "
          >
            {amount}
          </Typography>
        </div>
      </div>
    </div>
  );
}
