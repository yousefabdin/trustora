import Typography from "@/components/atoms/typography/typography";
import StatsCard from "./StatsCard";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router";
import clsx from "clsx";
import { disputeData, type Dispute } from "@/utils/disputedSeed";
import { getOrderById } from "@/services/orderService";
import Button from "@/components/atoms/Button/Button";
import { formatActivityDate } from "@/utils/dateUtils";

const formatDisputeId = (id: string): string => {
  if (id.startsWith("#")) return id;
  if (id.startsWith("dsp-00")) {
    return `#${id.replace("dsp-00", "D-014")}`;
  }
  if (id.startsWith("dsp-")) {
    return `#${id.replace("dsp-", "D-01")}`;
  }
  return `#${id.toUpperCase()}`;
};

const getMobilePriorityBadgeClass = (priority: Dispute["priority"]) => {
  switch (priority) {
    case "Critical":
      return "bg-red-50 text-red-600 border border-red-100";
    case "High":
      return "bg-amber-50 text-amber-700 border border-amber-100";
    case "Medium":
      return "bg-indigo-50 text-indigo-700 border border-indigo-100";
    case "Low":
    default:
      return "bg-neutral-100 text-neutral-600 border border-neutral-200";
  }
};

export default function DashboardContent() {
  const navigate = useNavigate();
  return (
    <div className="p-[16px] flex flex-col gap-[20px] md:px-[90px] md:pb-[64px]">
      <div className="grid grid-cols-2 md:flex gap-[10px] md:gap-[16px]">
        <StatsCard variant={"order"}></StatsCard>
        <StatsCard variant={"escrow"}></StatsCard>
        <StatsCard variant="dispute"></StatsCard>
        <StatsCard variant="fees"></StatsCard>
      </div>
      <div>
        <div className="flex md:hidden items-center justify-between">
          <Typography
            variant={"bodySmall"}
            children={"Action Required"}
            className="font-bold! uppercase"
          ></Typography>
          <Link to={"/admin/disputes"}>
            <Typography
              variant={"label"}
              children={"View Queue"}
              className="font-semibold! text-accent-default underline cursor-pointer"
            ></Typography>
          </Link>
        </div>
      </div>
      <div className="w-full">
        <div className="md:hidden flex flex-col gap-3.5 w-full">
          <div className="w-full md:hidden">
            <div className="flex flex-col gap-[10px] w-full">
              {disputeData.slice(0, 3).map((dispute, index) => {
                const formattedId = formatDisputeId(dispute.id);
                const order = getOrderById(dispute.orderId);

                return (
                  <div
                    key={`${dispute.id}-${index}`}
                    className="w-full  bg-white rounded-[6px] border border-neutral-200/80 p-[12px] shadow-xs flex flex-col gap-1 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex  items-center justify-between">
                      <span className="font-mono font-semibold text-neutral-900 text-[14px]">
                        {formattedId}
                      </span>
                      <span
                        className={clsx(
                          "px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded",
                          getMobilePriorityBadgeClass(dispute.priority),
                        )}
                      >
                        {dispute.priority}
                      </span>
                    </div>

                    <h3 className="font-bold text-neutral-900 text-[15px] leading-tight">
                      {order?.itemName}
                    </h3>

                    <div className="border-page-tertiary  pb-2 border-b font-mono text-sm flex items-center gap-1.5 ">
                      <span className="font-bold  text-accent-default font-jetbrains">
                        {dispute.amount}
                      </span>
                      <span className="text-accent-default font-medium font-jetbrains">
                        in Escrow
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-neutral-400">
                        Opend {dispute.daysopen} ago
                      </span>
                      <Button
                        type="button"
                        size="small"
                        variant="primary"
                        onClick={() =>
                          navigate(`/admin/disputes/${dispute.id}`)
                        }
                        className="px-[10px]! py-[6px]! text-[12px]! text-white bg-[ hover:bg-accent-default  rounded-[4px]!  cursor-pointer"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-4 md:hidden flex-col w-full pt-5">
          <div>
            <Typography
              variant={"body"}
              children={"Activity Log"}
              className="uppercase font-bold!"
            ></Typography>
          </div>
          <div className="bg-page-primary w-full p-[12px] flex flex-col gap-[10px] border rounded-[6px] border-page-tertiary">
            {disputeData.slice(2, 3).map((status) => {
              return status.statusHistory.slice(0, 3).map((activity) => {
                return (
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <Typography
                        variant={"label"}
                        children={activity.title}
                      ></Typography>
                      <Typography
                        variant={"caption"}
                        children={activity.status}
                        className="text-[#9C9C99] text-[10px]!"
                      ></Typography>
                    </div>
                    <Typography
                      variant={"caption"}
                      children={formatActivityDate(activity.date)}
                    ></Typography>
                  </div>
                );
              });
            })}
          </div>
        </div>
        <div className="hidden md:flex  gap-[24px] ">
          <div className=" w-full flex flex-col gap-[16px] flex-3">
            <Typography
              variant={"bodyLarge"}
              children={"Recent Activity"}
              className="font-[600]!"
            ></Typography>
            <div className="w-full bg-page-primary rounded-[12px] ">
              <div className="w-full flex gap-[16px] justify-between py-[12px] px-[16px] items-center border-b border-page-tertiary">
                <div className="flex items-center gap-[8px]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#10B981]"></span>
                  <Typography
                    variant={"caption"}
                    children={"14:32:01"}
                    className="text-[12px]! font-[400] text-content-secondary font-jetbrains"
                  ></Typography>
                </div>

                <Typography
                  variant={"body"}
                  children={"Funds released from escrow"}
                  className="font-[500]!"
                ></Typography>
                <Typography
                  variant={"bodySmall"}
                  children={"#HL-2802"}
                  className="font-[500]! text-accent-default font-jetbrains"
                ></Typography>
                <Typography
                  variant={"currencySmall"}
                  children={"$1,200.00"}
                  className="font-[500]! text-accent-default font-jetbrains"
                ></Typography>
              </div>
              <div className="w-full flex gap-[16px] justify-between py-[12px] px-[16px] items-center border-b border-page-tertiary">
                <div className="flex items-center gap-[8px]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#10B981]"></span>
                  <Typography
                    variant={"caption"}
                    children={"14:32:01"}
                    className="text-[12px]! font-[400] text-content-secondary font-jetbrains"
                  ></Typography>
                </div>

                <Typography
                  variant={"body"}
                  children={"Funds released from escrow"}
                  className="font-[500]!"
                ></Typography>
                <Typography
                  variant={"bodySmall"}
                  children={"#HL-2802"}
                  className="font-[500]! text-accent-default font-jetbrains"
                ></Typography>
                <Typography
                  variant={"currencySmall"}
                  children={"$1,200.00"}
                  className="font-[500]! text-accent-default font-jetbrains"
                ></Typography>
              </div>
              <div className="w-full flex gap-[16px] justify-between py-[12px] px-[16px] items-center border-b border-page-tertiary">
                <div className="flex items-center gap-[8px]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#10B981]"></span>
                  <Typography
                    variant={"caption"}
                    children={"14:32:01"}
                    className="text-[12px]! font-[400] text-content-secondary font-jetbrains"
                  ></Typography>
                </div>

                <Typography
                  variant={"body"}
                  children={"Funds released from escrow"}
                  className="font-[500]!"
                ></Typography>
                <Typography
                  variant={"bodySmall"}
                  children={"#HL-2802"}
                  className="font-[500]! text-accent-default font-jetbrains"
                ></Typography>
                <Typography
                  variant={"currencySmall"}
                  children={"$1,200.00"}
                  className="font-[500]! text-accent-default font-jetbrains"
                ></Typography>
              </div>{" "}
              <div className="w-full flex gap-[16px] justify-between py-[12px] px-[16px] items-center border-b border-page-tertiary">
                <div className="flex items-center gap-[8px]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#10B981]"></span>
                  <Typography
                    variant={"caption"}
                    children={"14:32:01"}
                    className="text-[12px]! font-[400] text-content-secondary font-jetbrains"
                  ></Typography>
                </div>

                <Typography
                  variant={"body"}
                  children={"Funds released from escrow"}
                  className="font-[500]!"
                ></Typography>
                <Typography
                  variant={"bodySmall"}
                  children={"#HL-2802"}
                  className="font-[500]! text-accent-default font-jetbrains"
                ></Typography>
                <Typography
                  variant={"currencySmall"}
                  children={"$1,200.00"}
                  className="font-[500]! text-accent-default font-jetbrains"
                ></Typography>
              </div>
              <div className="w-full flex gap-[16px] justify-between py-[12px] px-[16px] items-center border-b border-page-tertiary">
                <div className="flex items-center gap-[8px]">
                  <span className="w-[8px] h-[8px] rounded-full bg-[#10B981]"></span>
                  <Typography
                    variant={"caption"}
                    children={"14:32:01"}
                    className="text-[12px]! font-[400] text-content-secondary font-jetbrains"
                  ></Typography>
                </div>

                <Typography
                  variant={"body"}
                  children={"Funds released from escrow"}
                  className="font-[500]!"
                ></Typography>
                <Typography
                  variant={"bodySmall"}
                  children={"#HL-2802"}
                  className="font-[500]! text-accent-default font-jetbrains"
                ></Typography>
                <Typography
                  variant={"currencySmall"}
                  children={"$1,200.00"}
                  className="font-[500]! text-accent-default font-jetbrains"
                ></Typography>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-2 flex-col gap-[16px]">
            <Typography
              variant={"bodyLarge"}
              children={"Disputes Requiring Action"}
              className="font-[600]!"
            ></Typography>
            <div className="flex flex-col gap-[12px]">
              <div className="p-[16px] flex justify-between items-center rounded-r-[8px] bg-page-primary border border-page-tertiary border-l-4 border-l-danger-icon!">
                <div>
                  <Typography
                    variant={"bodySmall"}
                    children={"#HL-2805"}
                    className="font-[600]!"
                  ></Typography>
                  <Typography
                    variant={"caption"}
                    children={"Omega Speedmaster Pro"}
                    className="font-[400]!"
                  ></Typography>
                </div>
                <div className="flex items-center gap-[12px]">
                  <Typography
                    variant={"label"}
                    children={"5 days open"}
                    className="text-danger-icon"
                  ></Typography>
                  <Link to={"/admin/disputes/dsp-001"}>
                    <Typography
                      variant={"label"}
                      children={"Review"}
                      className="text-accent-default font-semibold! cursor-pointer"
                    ></Typography>
                  </Link>
                </div>
              </div>
              <div className="p-[16px] flex justify-between items-center rounded-r-[8px] bg-page-primary border border-page-tertiary border-l-4 border-l-danger-icon!">
                <div>
                  <Typography
                    variant={"bodySmall"}
                    children={"#HL-2805"}
                    className="font-[600]!"
                  ></Typography>
                  <Typography
                    variant={"caption"}
                    children={"Omega Speedmaster Pro"}
                    className="font-[400]!"
                  ></Typography>
                </div>
                <div className="flex gap-[12px]">
                  <Typography
                    variant={"label"}
                    children={"5 days open"}
                    className="text-danger-icon"
                  ></Typography>
                  <Typography
                    variant={"label"}
                    children={"Review"}
                    className="text-accent-default font-semibold!"
                  ></Typography>
                </div>
              </div>
              <div className="p-[16px] flex justify-between items-center rounded-r-[8px] bg-page-primary border border-page-tertiary border-l-4 border-l-danger-icon!">
                <div>
                  <Typography
                    variant={"bodySmall"}
                    children={"#HL-2805"}
                    className="font-[600]!"
                  ></Typography>
                  <Typography
                    variant={"caption"}
                    children={"Omega Speedmaster Pro"}
                    className="font-[400]!"
                  ></Typography>
                </div>
                <div className="flex gap-[12px]">
                  <Typography
                    variant={"label"}
                    children={"5 days open"}
                    className="text-danger-icon"
                  ></Typography>
                  <Typography
                    variant={"label"}
                    children={"Review"}
                    className="text-accent-default font-semibold!"
                  ></Typography>
                </div>
              </div>
              <Link
                to={"/admin/disputes"}
                className="flex items-center gap-2 text-accent-default"
              >
                <Typography
                  variant={"body"}
                  children={"View All Disputes"}
                  className="font-[600]!"
                ></Typography>
                <Icon icon="akar-icons:arrow-right" className="mt-1"></Icon>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
