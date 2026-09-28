import Typography from "@/components/atoms/typography/typography";
import StatusBadge from "@/components/molecules/statusBadges/StatusBadges";
import StepperBar from "@/components/molecules/stepper/StepperBar";
import { Icon } from "@iconify/react";
import OrderConfirmationCard from "./OrderConfirmationCard";
export default function OrderHeaderSection({ order }) {
  const statusToStep = {
    Captured: 1,
    "In Escrow": 2,
    Shipped: 3,
    Deliverd: 4,
    Completed: 6,
  } as const;

  const currentStep = statusToStep[order?.status as keyof typeof statusToStep];
  return (
    <div className=" w-full flex flex-col gap-[24px]">
      <div className="block md:hidden">
        <OrderConfirmationCard roles={"buyer"}></OrderConfirmationCard>
      </div>
      <div className="hidden md:flex justify-between items-center">
        <div className="flex flex-col gap-[12px]">
          <Typography
            variant={"caption"}
            className="text-content-tertiary text-[13px] font-[500]!"
          >
            My Orders / Order {order?.orderNumber}
          </Typography>
          <Typography variant={"h2"} className=" text-[20px]! font-[600]!">
            {order?.itemName}
          </Typography>
          <Typography
            variant={"caption"}
            className="text-content-tertiary text-[13px] font-[500]!"
          >
            Order {order?.orderNumber} · Placed {order?.orderDate} · Seller:
            {order?.sellerName}
          </Typography>
        </div>
        <div>
          <StatusBadge
            icon={"hugeicons:shipping-truck-02"}
            children={order.status}
            variant={order?.status}
            className=""
          ></StatusBadge>
        </div>
      </div>
      <div className="bg-white px-[12px] py-[16px] border border-page-tertiary rounded-[12px] ">
        <StepperBar
          isDisputed={false}
          currentStep={currentStep}
          statusDate={order?.statusHistory}
        ></StepperBar>
      </div>
    </div>
  );
}
