import Typography from "@/components/atoms/typography/typography";
import { getDaysOpen } from "@/services/disputeService";
import type { Order } from "@/utils/orderSeed";

interface EscrowCardProps {
  disputeOrder?: Order;
  statusText?: string;
  heldSince?: string;
  className?: string;
}

export default function EscrowCard({
  disputeOrder,
  statusText = "HELD",
  heldSince,
  className = "",
}: EscrowCardProps) {
  const amount =
    disputeOrder?.totalPrice !== undefined
      ? `$${disputeOrder.totalPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "$1,245.00";

  const paymentEvent = disputeOrder?.statusHistory?.find(
    (h) =>
      h.status === "In Escrow" ||
      h.title?.toLowerCase().includes("payment") ||
      h.title?.toLowerCase().includes("escrow"),
  );

  const displayHeldSince =
    heldSince ||
    (paymentEvent?.date
      ? new Date(paymentEvent.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : disputeOrder?.createdAt
        ? new Date(disputeOrder.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : disputeOrder?.orderDate
          ? new Date(disputeOrder.orderDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Aug 5, 2026");

  const daysCount = disputeOrder ? getDaysOpen(disputeOrder) : 3;
  const daysHeld = `${daysCount} ${daysCount === 1 ? "Day" : "Days"}`;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex md:hidden items-center justify-between w-full px-4 py-3.5 bg-[#FEF3C7] border border-[#FDE68A] rounded-[6px] shadow-xs">
        <span className="text-[#92400E] font-bold tracking-wider uppercase text-[12px]">
          ESCROW SECURED
        </span>
        <span className="text-[#1C1917] font-bold text-[16px] font-jetbrains">
          {amount}
        </span>
      </div>

      <div className="hidden md:flex p-[20px] gap-[16px] flex-col bg-escrow-surface border border-escrow-outline rounded-[6px] shadow-xs w-full">
        <div className="flex items-center justify-between w-full">
          <Typography
            variant="caption"
            className="text-escrow-icon font-semibold! tracking-wider uppercase text-[13px]"
          >
            ESCROW SECURED
          </Typography>
          <Typography
            variant="caption"
            className="text-escrow-icon font-semibold! tracking-wider uppercase text-[12px]!"
          >
            {statusText}
          </Typography>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <Typography
            variant="caption"
            className="text-escrow-icon font-[400]! text-[12px]"
          >
            Amount Held
          </Typography>
          <Typography
            variant="currencyLarge"
            className="text-page-inverse font-bold! text-[28px]! leading-[36px]"
          >
            {amount}
          </Typography>
        </div>

        <div className="grid grid-cols-2 w-full pt-3 border-t border-escrow-outline/60 items-center">
          <div className="flex flex-col gap-0.5">
            <Typography
              variant="caption"
              className="text-escrow-icon font-bold tracking-wider uppercase text-[10px]"
            >
              HELD SINCE
            </Typography>
            <Typography
              variant="body"
              className="text-content-primary font-semibold! text-[13px]"
            >
              {displayHeldSince}
            </Typography>
          </div>

          <div className="flex flex-col">
            <Typography
              variant="caption"
              className="text-escrow-icon font-bold tracking-wider uppercase text-[10px]"
            >
              DAYS HELD
            </Typography>
            <Typography
              variant="body"
              className="text-content-primary font-bold! text-[13px]"
            >
              {daysHeld}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
