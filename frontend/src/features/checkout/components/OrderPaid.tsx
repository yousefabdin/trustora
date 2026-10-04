import Typography from "@/components/atoms/typography/Typography";
import { Icon } from "@iconify/react";
import { orderData } from "@/utils/orderSeed";
import { Link, useParams } from "react-router-dom";
import StatusBadge from "@/components/molecules/statusBadges/StatusBadges";
import Button from "@/components/atoms/button/Button";
import { getOrderById } from "@/services/orderService";
import { useQuery } from "@tanstack/react-query";

export default function OrderPaid() {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: Boolean(orderId),
  });

  const fallbackOrder = orderData[0];
  const currentOrder = order || fallbackOrder;

  const displayAmount = currentOrder?.itemPrice
    ? typeof currentOrder.itemPrice === "number"
      ? `$${currentOrder.itemPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : currentOrder.itemPrice
    : currentOrder?.amount || "$1,245.00";

  const orderNum =
    currentOrder?.orderNumber?.toUpperCase() ||
    (orderId ? `#ORD-${orderId.slice(0, 8).toUpperCase()}` : "#ORD-948214");

  const sellerHandle =
    currentOrder?.seller || currentOrder?.sellerName || "timekeeper_luxury";

  const itemName = currentOrder?.itemName || "Vintage Leica M6";

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col justify-center items-center py-16 px-4 gap-4 bg-page-primary">
        <div className="w-14 h-14 rounded-full border-4 border-accent-subtle border-t-accent-default animate-spin" />
        <Typography
          variant="body"
          className="text-content-secondary font-medium text-[15px]"
        >
          Securing order details in escrow...
        </Typography>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex flex-col justify-center items-center py-8 px-4 sm:px-6 md:py-[80px] md:px-[64px] gap-6 sm:gap-8 md:gap-[36px] bg-page-primary">
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full max-w-[600px] text-center">
        <span className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-success-surface border border-success-outline rounded-full shadow-xs">
          <Icon
            icon="bx:check-shield"
            className="w-7 h-7 sm:w-8 sm:h-8 text-success-icon"
          />
        </span>
        <Typography
          variant="h1"
          className="text-2xl sm:text-[32px] font-bold text-content-primary tracking-tight leading-tight w-full"
        >
          Payment Secured!
        </Typography>
        <div className="w-full text-center">
          <p className="text-[15px] sm:text-[16px] text-content-secondary font-medium leading-normal inline-block text-center whitespace-normal">
            Your{" "}
            <span className="font-bold text-[16px] text-accent-default">
              {displayAmount}
            </span>{" "}
            is now held safely in escrow.
          </p>
        </div>
      </div>

      <div className="w-full max-w-[520px] flex flex-col p-4 sm:p-6 md:p-[32px] gap-4 sm:gap-[20px] rounded-xl sm:rounded-[8px] bg-page-secondary border border-outline-subtle shadow-xs">
        <div className="flex justify-between items-center border-b pb-3.5 sm:pb-[18px] border-outline-subtle">
          <Typography
            variant="caption"
            className="text-[13px] text-content-tertiary font-normal"
          >
            Order Number
          </Typography>
          <Typography
            variant="caption"
            className="text-[13.5px] sm:text-[14px] font-bold text-content-primary font-jetbrains"
          >
            {orderNum}
          </Typography>
        </div>

        <div className="flex justify-between items-center border-b pb-3.5 sm:pb-[18px] border-outline-subtle">
          <Typography
            variant="caption"
            className="text-[13px] text-content-tertiary font-normal"
          >
            Escrow Account Status
          </Typography>
          <StatusBadge variant="In Escrow">Awaiting Dispatch</StatusBadge>
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <Typography
            variant="caption"
            className="text-[11.5px] sm:text-[12px] font-bold tracking-wider text-content-tertiary uppercase"
          >
            ESCROW INSTRUCTION SUMMARY
          </Typography>
          <div className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-content-secondary shrink-0 mt-2" />
            <Typography
              variant="bodySmall"
              className="text-[13px] sm:text-[13.5px] leading-relaxed text-content-secondary font-medium"
            >
              The seller (@{sellerHandle}) has been notified to ship the{" "}
              {itemName}.
            </Typography>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-content-secondary shrink-0 mt-2" />
            <Typography
              variant="bodySmall"
              className="text-[13px] sm:text-[13.5px] leading-relaxed text-content-secondary font-medium"
            >
              The funds will remain in the secure escrow account and will not be
              transferred to the seller until you confirm receipt.
            </Typography>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[520px] flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center pt-2">
        <Link
          to={orderId ? `/myorder/${orderId}` : "/myorders"}
          className="w-full sm:w-auto"
        >
          <Button
            variant="primary"
            className="w-full sm:w-auto rounded-lg sm:rounded-[6px] px-6 py-3 font-semibold text-[14px] text-center justify-center shadow-xs"
            size="large"
          >
            View Order Status
          </Button>
        </Link>

        <Link to="/browse" className="w-full sm:w-auto">
          <Button
            variant="secondary"
            className="w-full sm:w-auto rounded-lg sm:rounded-[6px] px-6 py-3 font-semibold text-[14px] text-content-secondary text-center justify-center"
            size="large"
          >
            Back to Marketplace
          </Button>
        </Link>
      </div>
    </div>
  );
}
