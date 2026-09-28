import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import Cards from "@/components/molecules/cards/Cards";
import OrderSummaryCard from "@/components/molecules/cards/OrderSummaryCard";
import type { Order } from "@/utils/orderSeed";
import OrderConfirmationCard from "./OrderConfirmationCard";
import ActiviyLog from "./ActivityLog";
import SellerBuyerCard from "./SellerBuyerCard";
import LogisticsCard from "./LogisticsCard";
interface OrderInfoSection {
  order: Order;
}
export default function OrderInfoSection({ order }: OrderInfoSection) {
  return (
    <div className="flex flex-col md:flex-row md:justify-around items-start gap-5">
      <div className="w-full flex flex-col gap-6">
        <OrderSummaryCard
          itemName={order.itemName}
          itemDescription={order.itemDescription}
          itemSerial={order.itemSerial}
          itemImage={order.itemImg}
          sellerName={order.sellerName}
          sellerImage={order.sellerAvatar}
          shippingMethod={order.shippingMethod}
          trackingNumber={order.trackingNumber}
          platformFee={15}
          shippingFees={30}
          totalPrice={order.totalPrice}
          itemPrice={order.itemPrice}
        />
        <div className="block md:hidden">
          <SellerBuyerCard order={order}></SellerBuyerCard>
        </div>
        <div className="block md:hidden">
          <LogisticsCard></LogisticsCard>
        </div>
        <ActiviyLog order={order}></ActiviyLog>
      </div>
      <div className="hidden md:block">
        <OrderConfirmationCard roles={"buyer"}></OrderConfirmationCard>
      </div>
    </div>
  );
}
