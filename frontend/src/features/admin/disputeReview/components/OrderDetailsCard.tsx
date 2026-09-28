import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/typography";
import { type Dispute } from "@/utils/disputedSeed";
import { type Order } from "@/utils/orderSeed";
import { formatActivityDate } from "@/utils/dateUtils";

interface OrderDetailsCardProps {
  dispute?: Dispute;
  order?: Order;
  onMoreClick?: () => void;
}

export default function OrderDetailsCard({
  dispute,
  onMoreClick,
  order,
}: OrderDetailsCardProps) {
  const itemName = dispute?.orderId
    ? dispute.orderId
        .split("-")
        .slice(2)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "Vintage Leica M6";
  console.log("order is", order);
  return (
    <div className="w-full p-[20px] gap-[16px] flex flex-col bg-surface-default border border-page-tertiary rounded-[6px] shadow-xs">
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
        <div className="w-[60px] h-[60px] rounded-[6px] bg-surface-raised border border-outline-subtle flex items-center justify-center flex-shrink-0">
          <img
            src={order?.itemImg}
            alt=""
            className="w-full h-full p-[2px] rounded-[6px]"
          />
        </div>
        <div className="flex flex-col gap-1 justify-center min-w-0">
          <Typography
            variant="body"
            className="text-page-inverse font-bold truncate leading-tight text-[14px]! font-[600]!"
          >
            {itemName}
          </Typography>
          <Typography
            variant="currencySmall"
            className="text-content-secondary font-medium font-jetbrains"
          >
            {dispute?.amount}
          </Typography>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-outline-subtle w-full">
        <div className="flex justify-between items-center">
          <Typography variant="body" className="text-content-secondary">
            Order Date
          </Typography>
          <Typography
            variant="body"
            className="text-content-primary font-medium"
          >
            {formatActivityDate(order?.orderDate)}
          </Typography>
        </div>

        <div className="flex justify-between items-center">
          <Typography variant="body" className="text-content-secondary">
            Carrier
          </Typography>
          <Typography
            variant="body"
            className="text-content-primary font-medium"
          >
            {order?.shippingMethod}
          </Typography>
        </div>

        <div className="flex justify-between items-center">
          <Typography variant="body" className="text-content-secondary">
            Tracking
          </Typography>
          <Typography
            variant="body"
            className="text-content-link font-medium font-jetbrains hover:underline cursor-pointer"
          >
            {order?.trackingNumber}
          </Typography>
        </div>
      </div>
    </div>
  );
}
