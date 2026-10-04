import OrderSummaryCard from "@/components/molecules/cards/OrderSummaryCard";
import type { Order } from "@/utils/orderSeed";
import OrderConfirmationCard from "./OrderConfirmationCard";
import ActiviyLog from "./ActivityLog";
import SellerBuyerCard from "./SellerBuyerCard";
import LogisticsCard from "./LogisticsCard";
import { formatSeller } from "@/components/molecules/cards/OrderCard";
import { useAuth } from "@/context/AuthContext";

interface OrderInfoSectionProps {
  order: Order;
  orderId: string;
  handleOpenDisputed: (
    reason: string,
    description: string,
    evidenceFiles?: string[]
  ) => void | Promise<void>;
  handleConfirmReceipt?: () => void | Promise<void>;
  mode: string;
  setMode: (mode: string) => void;
}

export default function OrderInfoSection({
  order,
  orderId,
  handleOpenDisputed,
  handleConfirmReceipt,
  mode,
  setMode,
}: OrderInfoSectionProps) {
  const { user } = useAuth();

  const isBuyer = Boolean(
    order.isBuyer ??
      order.permissions?.isBuyer ??
      (user &&
        (user.id === order.buyerId ||
          (order.buyerEmail &&
            user.email?.toLowerCase() === order.buyerEmail.toLowerCase())))
  );

  const isSeller = Boolean(
    !isBuyer &&
      (order.isSeller ??
        order.permissions?.isSeller ??
        (user &&
          (user.id === order.sellerId ||
            (order.sellerEmail &&
              user.email?.toLowerCase() === order.sellerEmail.toLowerCase()))))
  );

  const roleForOrder: "buyer" | "seller" = isSeller ? "seller" : "buyer";

  return (
    <div className="flex flex-col md:flex-row md:justify-around items-start gap-5">
      <div className="w-full flex flex-col gap-6">
        <OrderSummaryCard
          itemName={order.itemName}
          itemDescription={order.itemDescription}
          itemSerial={order.itemSerial}
          itemImage={order.itemImg}
          sellerName={formatSeller(order.sellerName)}
          sellerImage={order.sellerAvatar}
          shippingMethod={order.shippingMethod}
          trackingNumber={order.trackingNumber}
          platformFee={15}
          shippingFees={30}
          totalPrice={order.totalPrice}
          itemPrice={order.itemPrice}
        />
        <div className="block md:hidden">
          <SellerBuyerCard order={order} />
        </div>
        <div className="block md:hidden">
          <LogisticsCard order={order} />
        </div>
        <ActiviyLog order={order} />
      </div>
      <div className="hidden md:block">
        <OrderConfirmationCard
          order={order}
          orderId={orderId}
          handleOpenDisputed={handleOpenDisputed}
          onConfirmReceipt={handleConfirmReceipt}
          roles={roleForOrder}
          mode={mode}
          setMode={setMode}
        />
      </div>
    </div>
  );
}
