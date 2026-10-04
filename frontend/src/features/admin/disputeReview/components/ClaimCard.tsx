import { useState } from "react";
import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/typography";
import { formatActivityDate } from "@/utils/dateUtils";
import type { Order } from "@/utils/orderSeed";

interface EvidenceFile {
  name: string;
  url?: string;
}

interface ClaimCardProps {
  variant: "buyer" | "seller";
  disputeOrder?: Order;
  evidenceFiles?: EvidenceFile[];
  onMoreClick?: () => void;
}

export default function ClaimCard({
  variant,
  disputeOrder,
  evidenceFiles,
  onMoreClick,
}: ClaimCardProps) {
  const isBuyer = variant === "buyer";
  const [isOpen, setIsOpen] = useState(isBuyer);

  const buyerHandle = disputeOrder?.buyerName
    ? disputeOrder.buyerName.startsWith("@")
      ? disputeOrder.buyerName
      : `@${disputeOrder.buyerName}`
    : "@vintage_buyer";

  const sellerHandle = disputeOrder?.sellerName
    ? disputeOrder.sellerName.startsWith("@")
      ? disputeOrder.sellerName
      : `@${disputeOrder.sellerName}`
    : "@camera_collector";

  const buyerDisplayName = disputeOrder?.buyerName
    ? disputeOrder.buyerName
        .replace("@", "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Vintage Buyer";

  const sellerDisplayName = disputeOrder?.sellerName
    ? disputeOrder.sellerName
        .replace("@", "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Camera Collector";

  const buyerInitials = disputeOrder?.buyerName
    ? disputeOrder.buyerName.replace("@", "").slice(0, 2).toUpperCase()
    : "VB";

  const sellerInitials = disputeOrder?.sellerName
    ? disputeOrder.sellerName.replace("@", "").slice(0, 2).toUpperCase()
    : "CC";

  const disputeEvent = disputeOrder?.statusHistory?.find(
    (h) => h.status === "Disputed" || h.title?.toLowerCase().includes("dispute"),
  );
  const shippedEvent = disputeOrder?.statusHistory?.find(
    (h) => h.status === "Shipped" || h.title?.toLowerCase().includes("shipped") || h.title?.toLowerCase().includes("seller"),
  );

  const buyerDateStr =
    disputeEvent?.date || disputeOrder?.createdAt || disputeOrder?.orderDate;
  const sellerDateStr =
    shippedEvent?.date || disputeOrder?.orderDate || disputeOrder?.createdAt;

  const buyerActionText = buyerDateStr
    ? formatActivityDate(buyerDateStr)
    : "Aug 7, 2:15 PM";
  const sellerActionText = sellerDateStr
    ? formatActivityDate(sellerDateStr)
    : "Aug 8, 11:30 AM";

  const buyerDescription =
    disputeOrder?.disputeNote ||
    "The lens has significant fungus that was not disclosed in the listing..";

  const sellerDescription =
    "The lens was inspected before shipping and was in excellent condition. Any fungus may have developed during transit due to humidity. I packed it carefully with silica gel packets.";

  const defaultEvidence = isBuyer
    ? [{ name: "Lens Front.jpg" }, { name: "Fungus.jpg" }]
    : [{ name: "Packaging.jpg" }];

  const activeEvidence = evidenceFiles || defaultEvidence;

  return (
    <div className="w-full p-4 md:p-[20px] gap-3 md:gap-[16px] flex flex-col bg-surface-default border border-outline-default rounded-[6px] shadow-xs transition-all">
      <div
        className="flex items-center justify-between w-full cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Typography
          variant="h3"
          className="text-content-primary font-bold text-[15px]!"
        >
          {isBuyer ? "Buyer's Claim" : "Seller's Response"}
        </Typography>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="text-content-tertiary hover:text-content-primary transition-colors cursor-pointer p-1"
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            <Icon
              icon={isOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
              className="w-4 h-4 text-content-secondary"
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="flex items-center gap-3 w-full">
            <div className="w-9 h-9 rounded-full bg-surface-raised border border-outline-subtle flex items-center justify-center text-xs font-bold text-content-primary font-mono shrink-0">
              {isBuyer ? buyerInitials : sellerInitials}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Typography
                  variant="body"
                  className="text-content-primary font-bold leading-tight text-[14px]! font-[600]!"
                >
                  {isBuyer ? buyerDisplayName : sellerDisplayName}
                </Typography>
                <Typography
                  variant="bodySmall"
                  className="text-content-secondary font-[400] leading-tight text-[12px]!"
                >
                  {isBuyer ? buyerHandle : sellerHandle}
                </Typography>
              </div>
              <Typography
                variant="caption"
                className="text-content-tertiary text-[12px] leading-tight pt-0.5"
              >
                {isBuyer ? buyerActionText : sellerActionText}
              </Typography>
            </div>
          </div>

          <Typography
            variant="body"
            className="text-content-secondary leading-[20px] text-[13px] md:text-[14px]"
          >
            {isBuyer ? buyerDescription : sellerDescription}
          </Typography>

          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center gap-3">
              {activeEvidence.map((file, index) => (
                <div
                  key={index}
                  className="w-[105px] h-[92px] rounded-[6px] bg-[#F5F5F4] border border-outline-subtle flex flex-col items-center justify-center gap-1.5 p-2 hover:border-outline-strong transition-colors cursor-pointer"
                >
                  <Icon
                    icon="lucide:image"
                    className="w-6 h-6 text-content-tertiary"
                  />
                  <Typography
                    variant="caption"
                    className="text-content-secondary font-medium text-[11px] text-center truncate w-full"
                  >
                    {file.name}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
