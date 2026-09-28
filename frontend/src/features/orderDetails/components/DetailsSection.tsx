import OrderHeaderSection from "./OrderHeaderSection";
import OrderInfoSection from "./OrderInfoSection";
import { useParams } from "react-router";
import { getOrderById } from "@/services/orderService";
import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/typography";
import StatusBadge from "@/components/molecules/statusBadges/StatusBadges";
import { useNavigate } from "react-router";
export default function DetailsSection() {
  const { orderId } = useParams();
  const order = getOrderById(orderId);
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between md:hidden bg-natural-white! border-b border-page-tertiary py-[12px] px-[16px] items-center">
        <div className="flex items-center gap-2">
          <Icon
            icon={"akar-icons:chevron-left"}
            className="text-page-inverse "
            onClick={() => navigate(-1)}
          ></Icon>
          <div className="flex flex-col">
            <Typography
              variant={"h3"}
              className="text-[16px]! font-bold! text-page-inverse"
            >
              Order {order?.orderNumber}
            </Typography>
            <Typography
              variant={"caption"}
              className="text-[12px]! font-[400]! text-[#9C9C99]"
            >
              Secure Escrow Payment
            </Typography>
          </div>
        </div>
        <StatusBadge
          icon={"hugeicons:shipping-truck-02"}
          children={order?.status}
          variant={order?.status}
          className="h-full"
        ></StatusBadge>
      </div>
      <div className="flex flex-col gap-[12px] md:gap-[24px] p-[16px] md:px-[48px] md:pt-[48px] md:pb-[64px] bg-[#F5F5F4]">
        <OrderHeaderSection order={order}></OrderHeaderSection>
        <OrderInfoSection order={order}></OrderInfoSection>
      </div>
    </>
  );
}
