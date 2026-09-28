import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import { orderData } from "@/utils/orderSeed";
import { Link, useParams } from "react-router-dom";
import StatusBadge from "@/components/molecules/statusBadges/StatusBadges";
import Button from "@/components/atoms/Button/Button";
import { getOrderById } from "@/services/orderService";
export default function OrderPaid() {
  const { orderId } = useParams();
  const order = getOrderById(orderId);

  return (
    <div className="w-full flex flex-col justify-center items-center pt-[100px] px-[64px] pb-[120px] gap-[40px]">
      <div className="flex flex-col items-center justify-center gap-[24px]">
        <span className=" flex items-center justify-center w-[64px] h-[64px] bg-success-surface rounded-full">
          <Icon
            icon="bx:check-shield"
            className="w-[20px] h-[20px] text-success-icon"
          ></Icon>
        </span>
        <Typography variant={"h1"} className="text-[32px]! font-bold">
          Payment Secured!
        </Typography>
        <Typography variant={"label"} className="text-[16px] font-bold ">
          Your
          <span className="font-bold text-[16px] text-accent-default px-1">
            ${order?.totalPrice}
          </span>
          is now held safely in escrow.
        </Typography>
      </div>
      <div className="w-full max-w-[520px] flex flex-col p-[32px] gap-[24px] rounded-[6px] bg-[#F9FAFB] border-outline-subtle">
        <div className="flex justify-between items-center border-b pb-[24px] border-page-tertiary ">
          <Typography
            variant={"caption"}
            className="text-[13px] text-content-tertiary font-normal"
          >
            Order Number
          </Typography>
          <Typography
            variant={"caption"}
            className="text-[14px] font-bold! text-page-inverse"
          >
            {order?.orderNumber?.toUpperCase()}
          </Typography>
        </div>
        <div className="flex justify-between items-center border-b   border-outline-subtle pb-[24px]">
          <Typography
            variant={"caption"}
            className="text-[13px] text-content-tertiary font-normal"
          >
            Escrow Account Status
          </Typography>
          <Typography
            variant={"caption"}
            className="text-[14px] font-bold text-page-inverse"
          >
            <StatusBadge
              icons={undefined}
              children={"Awating Dispatch"}
              variant={"Escrow"}
            ></StatusBadge>
          </Typography>
        </div>
        <div className="flex flex-col justify-between items-start gap-4">
          <Typography
            variant={"caption"}
            className="text-[13px] text-content-tertiary font-bold!"
          >
            ESCROW INSTRUCTION SUMMARY
          </Typography>
          <div className="flex items-center gap-3">
            <span className="border-2 border-content-secondary rounded-full"></span>
            <Typography
              variant={"caption"}
              className="text-[13px]  text-content-secondary font-bold"
            >
              The seller (@timekeeper_luxury) has been notified to ship the
              Vintage Chronograph Cal. 321.
            </Typography>
          </div>
          <div className="flex items-center gap-3">
            <span className="border-2 border-content-secondary rounded-full"></span>
            <Typography
              variant={"caption"}
              className="text-[13px] text-content-secondary font-bold"
            >
              The funds will remain in the secure escrow account and will not be
              transferred to the seller until you confirm receipt.
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex gap-4 ">
        <Link to={`/myorder/${order?.id}`}>
          <Button className="rounded-[6px]! px-[24px]!" size="large">
            View Order status
          </Button>
        </Link>

        <Link to="/browse">
          <Button
            variant="secondary"
            className="rounded-[6px]! px-[24px] text-content-secondary"
            size="large"
          >
            Back to Marketplace
          </Button>
        </Link>
      </div>
    </div>
  );
}
