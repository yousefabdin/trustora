import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/typography";
import { type Order } from "@/utils/orderSeed";
import { formatActivityDate } from "@/utils/dateUtils";

interface OrderDetailsCardProps {
  disputeOrder?: Order;
  onMoreClick?: () => void;
}

export default function OrderDetailsCard({
  disputeOrder,
  onMoreClick,
}: OrderDetailsCardProps) {
  const itemName = disputeOrder?.itemName || "Vintage Leica M6";
  const amount =
    disputeOrder?.totalPrice !== undefined
      ? `$${disputeOrder.totalPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "$1,245.00";

  const carrier = disputeOrder?.shippingMethod || "FedEx";
  const trackingNumber = disputeOrder?.trackingNumber || "TRK-2847";
  const orderDateStr = disputeOrder?.orderDate || disputeOrder?.createdAt;

  return (
    <div className="w-full p-4 md:p-[20px] gap-3 md:gap-[16px] flex flex-col bg-surface-default border border-outline-default rounded-[6px] shadow-xs">
      <div className="flex items-center justify-between w-full">
        <Typography
          variant="h3"
          className="text-content-primary text-[15px]! font-semibold!"
        >
          Order Details
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
        <div className="w-11 h-11 md:w-[60px] md:h-[60px] rounded-[6px] bg-[#F5F5F4] border border-outline-subtle flex items-center justify-center shrink-0">
          {disputeOrder?.itemImg && disputeOrder.itemImg.startsWith("http") && !disputeOrder.itemImg.includes("dicebear") ? (
            <img
              src={disputeOrder.itemImg}
              alt={itemName}
              className="w-full h-full object-cover rounded-[6px]"
            />
          ) : (
            <Icon
              icon="lucide:camera"
              className="w-5 h-5 md:w-6 md:h-6 text-content-tertiary"
            />
          )}
        </div>
        <div className="flex flex-col gap-0.5 md:gap-1 justify-center min-w-0">
          <Typography
            variant="body"
            className="text-page-inverse font-bold truncate leading-tight text-[14px]! font-[600]!"
          >
            {itemName}
          </Typography>
          <Typography
            variant="bodySmall"
            className="text-content-secondary font-medium font-jetbrains text-[13px]!"
          >
            {amount} <span className="text-content-tertiary mx-1 font-sans">•</span> {carrier}
          </Typography>
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-2 pt-3 border-t border-outline-subtle w-full">
        <div className="flex justify-between items-center">
          <Typography variant="body" className="text-content-secondary text-[13px]">
            Order Date
          </Typography>
          <Typography
            variant="body"
            className="text-content-primary font-medium text-[13px]"
          >
            {orderDateStr ? formatActivityDate(orderDateStr) : "Aug 8, 2026"}
          </Typography>
        </div>

        <div className="flex justify-between items-center">
          <Typography variant="body" className="text-content-secondary text-[13px]">
            Carrier
          </Typography>
          <Typography
            variant="body"
            className="text-content-primary font-medium text-[13px]"
          >
            {carrier}
          </Typography>
        </div>

        <div className="flex justify-between items-center">
          <Typography variant="body" className="text-content-secondary text-[13px]">
            Tracking
          </Typography>
          <Typography
            variant="body"
            className="text-content-link font-medium font-jetbrains hover:underline cursor-pointer text-[13px]"
          >
            {trackingNumber}
          </Typography>
        </div>
      </div>
    </div>
  );
}
