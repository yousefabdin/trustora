import React from "react";
import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/typography";
import EscrowCard from "../../disputeReview/components/HeldCard";

interface StatCardProps {
  title?: string;
  value?: string | number;
  percentageChange?: string;
  isPositive?: boolean;
  variant: "order" | "escrow" | "dispute" | "fees";
}

export default function StatCard({
  variant = "order",
  title = "Total Orders",
  value = "1,247",
  percentageChange = "+12%",
  isPositive = true,
}: StatCardProps) {
  const cardVariant = {
    order: (
      <div className="w-full p-[12px] md:p-[20px] flex flex-col gap-1 md:gap-2 bg-surface-default border border-page-tertiary rounded-[12px] shadow-xs">
        <Typography
          variant="body"
          className="text-content-secondary font-medium leading-tight"
        >
          Total Orders
        </Typography>

        <div className="flex items-baseline justify-between w-full pt-1">
          <Typography
            variant="h1"
            className="text-page-inverse font-bold  font-jetbrains text-[28px]! leading-tight"
          >
            {value}
          </Typography>

          <div
            className={`hidden md:flex items-center gap-1 text-sm font-semibold ${
              isPositive ? "text-[#10B981]" : "text-danger-foreground"
            }`}
          >
            <Icon
              icon={isPositive ? "lucide:arrow-up" : "lucide:arrow-down"}
              className="w-4 h-4 stroke-[2.5]"
            />
            <Typography variant="bodySmall" className="font-bold">
              {percentageChange}
            </Typography>
          </div>
        </div>
      </div>
    ),
    escrow: (
      <div className="w-full p-[12px] md:p-[20px]  flex flex-col gap-1 md:gap-2  bg-escrow-surface border border-escrow-outline rounded-[12px] shadow-xs">
        <Typography
          variant="body"
          className="text-escrow-foreground font-medium text-[13px]! leading-tight"
        >
          Funds in Escrow
        </Typography>

        <div className="flex items-baseline justify-between w-full pt-2">
          <Typography
            variant="h1"
            className="text-escrow-foreground font-medium font-jetbrains text-[22px]! leading-tight"
          >
            ${value}
          </Typography>
        </div>
      </div>
    ),
    dispute: (
      <div className="w-full p-[12px] md:p-[20px] flex flex-col gap-1 md:gap-2 bg-danger-surface border border-danger-icon  rounded-[12px] shadow-xs">
        <Typography
          variant="body"
          className="text-danger-foreground text-[13px] font-medium leading-tight"
        >
          Open Disputes
        </Typography>

        <div className="flex items-baseline justify-between w-full pt-1">
          <Typography
            variant="h1"
            className="text-danger-foreground font-bold  font-jetbrains text-[28px]! leading-tight"
          >
            8
          </Typography>

          <div
            className={`hidden md:flex items-center gap-1 text-sm font-semibold ${
              isPositive ? "text-[#10B981]" : "text-danger-foreground"
            }`}
          >
            <Icon
              icon={isPositive ? "lucide:arrow-up" : "lucide:arrow-down"}
              className="w-4 h-4 stroke-[2.5]"
            />
            <Typography variant="bodySmall" className="font-bold">
              {percentageChange}
            </Typography>
          </div>
        </div>
      </div>
    ),
    fees: (
      <div className="w-full p-[12px] md:p-[20px] flex flex-col gap-1 md:gap-2 bg-page-primary border border-page-tertiary rounded-[12px] shadow-xs">
        <Typography
          variant="body"
          className="text-content-secondary text-[13px]! font-medium leading-tight"
        >
          Revenue (Fees)
        </Typography>

        <div className="flex items-baseline justify-between w-full pt-1">
          <Typography
            variant="h1"
            className="text-page-inverse font-bold  font-jetbrains text-[28px]! leading-tight"
          >
            {value}
          </Typography>

          <div
            className={`hidden md:flex items-center gap-1 text-sm font-semibold ${
              isPositive ? "text-[#10B981]" : "text-danger-foreground"
            }`}
          >
            <Icon
              icon={isPositive ? "lucide:arrow-up" : "lucide:arrow-down"}
              className="w-4 h-4 stroke-[2.5]"
            />
            <Typography variant="bodySmall" className="font-bold">
              {percentageChange}
            </Typography>
          </div>
        </div>
      </div>
    ),
  };
  return cardVariant[variant];
}
