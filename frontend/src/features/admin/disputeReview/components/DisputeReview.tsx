import Typography from "@/components/atoms/typography/typography";
import StatusBadge from "@/components/molecules/statusBadges/StatusBadges";
import { getDisputeById } from "@/services/disputeService";
import type { Dispute } from "@/utils/disputedSeed";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import DisputeSummaryCard from "./DisputeSummaryCard";
import OrderDetailsCard from "./OrderDetailsCard";
import { getOrderById } from "@/services/orderService";
import type { Order } from "@/utils/orderSeed";
import ClaimCard from "./ClaimCard";
import HeldCard from "./HeldCard";
import AdminDecisionCard from "./AdminDescionCard";
import DisputeActivityLog from "./DisputeActivityLog";
export default function DisputeReview() {
  const { disputeId } = useParams();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    if (!disputeId) return;

    const fetchData = async () => {
      const disputeItem = await getDisputeById(disputeId);

      if (!disputeItem) return;

      setDispute(disputeItem);

      const disputeOrder = getOrderById(disputeItem.orderId);

      setOrder(disputeOrder ?? null);
    };

    fetchData();
  }, [disputeId]);
  console.log(order);
  if (!dispute || !order) {
    return <div>Loading dispute...</div>;
  }
  return (
    <div className="flex flex-col gap-[24px] p-[32px] bg-[#F5F5F4] h-full">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <Typography
            variant={"caption"}
            children={"Disputes"}
            className="text-[13px] text-content-tertiary"
          ></Typography>
          <Icon
            icon={"akar-icons:chevron-right-small"}
            className="text-content-secondary h-5"
          ></Icon>

          <Typography
            variant={"caption"}
            children={`#${dispute?.id}`}
            className="text-[13px] text-page-inverse font-[500]! uppercase"
          ></Typography>
        </div>
        <div className="flex gap-[16px] items-center">
          <Typography
            variant={"caption"}
            children={`Dispute #${dispute?.id} `}
            className="text-[24px] font-[600]! text-page-inverse uppercase"
          ></Typography>
          <StatusBadge children={"Open"} variant="Disputed"></StatusBadge>
          <Typography
            variant={"caption"}
            children={`Filed ${dispute?.daysopen} ago`}
            className="text-[14px] font-[400]! text-content-secondary "
          ></Typography>
        </div>
      </div>
      <div className="flex gap-[24px] h-full">
        <div className="flex-2 flex flex-col gap-[24px]">
          <DisputeSummaryCard dispute={dispute}></DisputeSummaryCard>
          <ClaimCard
            variant={"buyer"}
            dispute={dispute}
            order={order}
          ></ClaimCard>
          <ClaimCard
            variant={"seller"}
            dispute={dispute}
            order={order}
          ></ClaimCard>
        </div>
        <div className="flex-1 flex flex-col gap-[24px]">
          <OrderDetailsCard dispute={dispute} order={order}></OrderDetailsCard>
          <HeldCard></HeldCard>
          <AdminDecisionCard></AdminDecisionCard>
          <DisputeActivityLog dispute={dispute}></DisputeActivityLog>
        </div>
      </div>
    </div>
  );
}
