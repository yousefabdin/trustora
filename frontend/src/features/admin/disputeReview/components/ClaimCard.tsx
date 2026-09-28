import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/typography";
import { type Dispute } from "@/utils/disputedSeed";
import { formatActivityDate, formatDate } from "@/utils/dateUtils";
import type { Order } from "@/utils/orderSeed";
interface EvidenceFile {
  name: string;
  url?: string;
}

interface ClaimCardProps {
  variant: "buyer" | "seller";
  dispute?: Dispute;
  evidenceFiles?: EvidenceFile[];
  order: Order;
  onMoreClick?: () => void;
}

export default function ClaimCard({
  variant,
  dispute,
  evidenceFiles,
  order,
  onMoreClick,
}: ClaimCardProps) {
  const isBuyer = variant === "buyer";
  console.log(dispute);
  console.log(order);
  const config = {
    title: isBuyer ? "Buyer's Claim" : "Seller's Response",
    initials: isBuyer ? order.sellerAvatar : order.sellerAvatar,
    name: isBuyer ? order.buyerName : order?.sellerName,
    handle: isBuyer
      ? dispute?.buyerId
        ? `@${dispute.buyerId.replace("user-", "buyer_")}`
        : "@vintage_buyer"
      : dispute?.sellerId
        ? `@${dispute.sellerId.replace("seller-", "seller_")}`
        : "@camera_collector",
    actionText: isBuyer
      ? `Filed ${formatDate(dispute?.createdAt)}`
      : `Responded ${formatDate(dispute?.updatedAt)}`,
    description: isBuyer
      ? dispute?.description || dispute?.description
      : "The lens was inspected before shipping and was in excellent condition. Any fungus may have developed during transit due to humidity. I packed it carefully with silica gel packets.",
    defaultEvidence: isBuyer
      ? [
          { name: "Lens Front.jpg" },
          { name: "Fungus Close.jpg" },
          { name: "Sample Shot.jpg" },
        ]
      : [{ name: "Packaging.jpg" }],
  };

  const activeEvidence = evidenceFiles || config.defaultEvidence;

  return (
    <div className="w-full p-[20px] gap-[16px] flex flex-col bg-surface-default border border-outline-default rounded-[6px] shadow-xs">
      <div className="flex items-center justify-between w-full">
        <Typography
          variant="h3"
          className="text-content-primary font-bold text-[15px]!"
        >
          {config.title}
        </Typography>
        <button
          type="button"
          onClick={onMoreClick}
          className="text-content-tertiary hover:text-content-primary transition-colors cursor-pointer"
        >
          <Icon icon="ph:dots-three-bold" className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 w-full">
        <div className="w-9 h-9 rounded-full bg-surface-raised border border-outline-subtle flex items-center justify-center text-xs font-bold text-content-primary font-mono ">
          <img
            src={config.initials}
            alt=""
            className="w-full h-full rounded-full"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <Typography
              variant="body"
              className="text-content-primary font-bold leading-tight text-[14px]! font-[600]!"
            >
              {config.name}
            </Typography>
            <Typography
              variant="bodySmall"
              className="text-content-secondary font-[400] leading-tight text-[12px]!"
            >
              {config.handle}
            </Typography>
          </div>
          <Typography
            variant="caption"
            className="text-content-tertiary text-[12px] leading-tight pt-0.5"
          >
            {config.actionText}
          </Typography>
        </div>
      </div>

      <Typography
        variant="body"
        className="text-content-secondary leading-[20px] line-clamp-3 text-[14px]! "
      >
        {config.description}
      </Typography>

      <div className="flex flex-col gap-2 pt-1">
        <Typography
          variant="caption"
          className="text-content-tertiary font-semibold! tracking-wider uppercase text-[11px]!"
        >
          ATTACHED EVIDENCE
        </Typography>

        <div className="flex items-center gap-3">
          {activeEvidence.map((file, index) => (
            <div
              key={index}
              className="w-[100px] h-[92px] rounded-[6px] bg-surface-raised border border-outline-subtle flex flex-col items-center justify-center gap-1.5 p-2 hover:border-outline-strong transition-colors cursor-pointer"
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
    </div>
  );
}
