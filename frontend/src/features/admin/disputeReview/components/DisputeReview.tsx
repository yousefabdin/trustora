import Typography from "@/components/atoms/typography/typography";
import StatusBadge from "@/components/molecules/statusBadges/StatusBadges";
import { useDisputeDetails, getDaysOpen } from "@/services/disputeService";
import { Icon } from "@iconify/react";
import { useNavigate, useParams } from "react-router-dom";
import DisputeSummaryCard from "./DisputeSummaryCard";
import OrderDetailsCard from "./OrderDetailsCard";
import ClaimCard from "./ClaimCard";
import HeldCard from "./HeldCard";
import AdminDecisionCard from "./AdminDescionCard";
import DisputeActivityLog from "./DisputeActivityLog";

export default function DisputeReview() {
  const { disputeId } = useParams();
  const navigate = useNavigate();
  const {
    data: disputeOrder,
    isLoading,
    isError,
  } = useDisputeDetails(disputeId);

  const daysCount = disputeOrder ? getDaysOpen(disputeOrder) : 3;
  const daysOpen = `${daysCount} ${daysCount === 1 ? "day" : "days"}`;

  const disputeNumber = disputeOrder?.id
    ? disputeOrder.id.toLowerCase().startsWith("dsp-")
      ? disputeOrder.id.toUpperCase()
      : `DSP-${disputeOrder.id.slice(0, 4).toUpperCase()}`
    : disputeId?.toUpperCase() || "DSP-0041";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-content-secondary text-sm">
        Loading dispute details...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F5F5F4] flex flex-col gap-4 md:gap-[24px] p-4 md:p-[32px]">
      <div className="flex flex-col gap-2 md:gap-3">
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => navigate("/admin/disputes")}
            className="text-[13px] text-content-tertiary hover:text-content-primary transition-colors cursor-pointer"
          >
            Disputes
          </button>
          <Icon
            icon="akar-icons:chevron-right-small"
            className="text-content-secondary h-4 w-4"
          />
          <Typography
            variant="caption"
            className="text-[13px] text-page-inverse font-[500]! uppercase"
          >
            #{disputeNumber}
          </Typography>
        </div>

        <div className="flex flex-col gap-1 md:hidden">
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-bold text-page-inverse uppercase tracking-tight">
              Dispute #{disputeNumber}
            </h1>
            <StatusBadge
              children={
                disputeOrder?.rawStatus === "disputed"
                  ? "Open"
                  : disputeOrder?.status || "Open"
              }
              variant="Disputed"
            />
          </div>
          <span className="text-[13px] font-normal text-content-secondary">
            Filed {daysOpen} ago
          </span>
        </div>

        <div className="hidden md:flex gap-[16px] items-center">
          <Typography
            variant="caption"
            className="text-[24px] font-[600]! text-page-inverse uppercase"
          >
            Dispute #{disputeNumber}
          </Typography>
          <StatusBadge
            children={
              disputeOrder?.rawStatus === "disputed"
                ? "Open"
                : disputeOrder?.status || "Open"
            }
            variant="Disputed"
          />
          <Typography
            variant="caption"
            className="text-[14px] font-[400]! text-content-secondary"
          >
            Filed {daysOpen} ago
          </Typography>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-[24px] h-full w-full">
        <div className="flex-2 flex flex-col gap-4 lg:gap-[24px]">
          <DisputeSummaryCard disputeOrder={disputeOrder} />
          <ClaimCard variant="buyer" disputeOrder={disputeOrder} />
          <ClaimCard variant="seller" disputeOrder={disputeOrder} />
        </div>

        <div className="flex-1 flex flex-col gap-4 lg:gap-[24px]">
          <HeldCard disputeOrder={disputeOrder} className="block lg:hidden" />
          <OrderDetailsCard disputeOrder={disputeOrder} />
          <HeldCard disputeOrder={disputeOrder} className="hidden lg:flex" />
          <AdminDecisionCard disputeOrder={disputeOrder} />
          <DisputeActivityLog disputeOrder={disputeOrder} />

          <div className="block lg:hidden pt-2 pb-6">
            <button
              type="submit"
              form="admin-decision-form"
              className="w-full py-3 bg-[#4F46E5] hover:bg-[#4338CA] active:bg-[#3730A3] text-white font-semibold text-[14px] rounded-[8px] transition-colors cursor-pointer shadow-xs"
            >
              Submit Resolution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
