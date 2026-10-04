import Typography from "@/components/atoms/typography/typography";
import StatusBadge from "@/components/molecules/statusBadges/StatusBadges";
import StepperBar from "@/components/molecules/stepper/StepperBar";
import OrderConfirmationCard from "./OrderConfirmationCard";
import { useAuth } from "@/context/AuthContext";
interface OrderHeaderSectionProps {
  order: any;
  orderId?: string;
  mode?: string;
  setMode?: (mode: string) => void;
  handleOpenDisputed?: (
    reason: string,
    description: string,
    evidenceFiles?: string[]
  ) => void | Promise<void>;
  handleConfirmReceipt?: () => void | Promise<void>;
}

export default function OrderHeaderSection({
  order,
  orderId,
  mode,
  setMode,
  handleOpenDisputed,
  handleConfirmReceipt,
}: OrderHeaderSectionProps) {
  const statusToStep = {
    Captured: 1,
    "In Escrow": 2,
    Shipped: 3,
    Deliverd: 4,
    Completed: 5,
  } as const;
  const { user } = useAuth();
  const currentStep = statusToStep[order?.status as keyof typeof statusToStep] || 2;

  const isBuyer = Boolean(
    order?.isBuyer ??
      order?.permissions?.isBuyer ??
      (user &&
        (user.id === order?.buyerId ||
          (order?.buyerEmail &&
            user.email?.toLowerCase() === order.buyerEmail.toLowerCase())))
  );

  const isSeller = Boolean(
    !isBuyer &&
      (order?.isSeller ??
        order?.permissions?.isSeller ??
        (user &&
          (user.id === order?.sellerId ||
            (order?.sellerEmail &&
              user.email?.toLowerCase() === order.sellerEmail.toLowerCase()))))
  );

  const roleForOrder: "buyer" | "seller" = isSeller ? "seller" : "buyer";

  return (
    <div className=" w-full flex flex-col gap-[24px]">
      <div className="block md:hidden">
        <OrderConfirmationCard
          roles={roleForOrder}
          order={order}
          orderId={orderId || order?.id}
          mode={mode}
          setMode={setMode}
          handleOpenDisputed={handleOpenDisputed}
          onConfirmReceipt={handleConfirmReceipt}
        />
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
            children={order?.status}
            variant={order?.status}
            className=""
          ></StatusBadge>
        </div>
      </div>
      <div className="bg-white p-4 md:px-[24px] md:py-[20px] border border-page-tertiary rounded-[16px]">
        <StepperBar
          order={order}
          isDisputed={order?.status === "Disputed" || order?.rawStatus === "disputed"}
          currentStep={currentStep}
          statusDate={order?.statusHistory}
        />
      </div>
    </div>
  );
}
