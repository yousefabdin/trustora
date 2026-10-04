import React from "react";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import type { ProfileStat } from "../profileData";

interface AccountStatsProps {
  stats?: ProfileStat[];
  overviewTitle?: string;
  subtitle?: string;
  escrowNotice?: {
    title: string;
    description: string;
    icon: string;
  };
}

export default function AccountStats({
  stats,
  overviewTitle = "Marketplace Overview",
  subtitle = "Buyer Activity",
  escrowNotice = {
    title: "Trustora Escrow Guarantee",
    description:
      "Your payments are locked safely in escrow and only released after delivery inspection or confirmation.",
    icon: "lucide:shield-check",
  },
}: AccountStatsProps) {
  const displayStats = stats || [
    {
      label: "Total Orders",
      value: 6,
      icon: "lucide:package",
      color: "text-content-primary",
      bg: "bg-page-secondary",
    },
    {
      label: "In Escrow",
      value: 2,
      icon: "lucide:shield-alert",
      color: "text-escrow-icon",
      bg: "bg-escrow-surface",
    },
    {
      label: "Completed",
      value: 3,
      icon: "lucide:check-circle-2",
      color: "text-success-icon",
      bg: "bg-success-surface",
    },
    {
      label: "Disputes",
      value: 1,
      icon: "lucide:alert-triangle",
      color: "text-danger-icon",
      bg: "bg-danger-surface",
    },
  ];

  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-xl p-4 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-outline-subtle flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-accent-surface text-accent-default">
            <Icon icon="lucide:bar-chart-2" className="w-4 h-4" />
          </div>
          <Typography
            variant="h3"
            className="text-[15px] sm:text-[16px] font-bold text-content-primary leading-tight"
          >
            {overviewTitle}
          </Typography>
        </div>

        <span className="text-[11px] sm:text-[12px] font-medium text-content-tertiary">
          {subtitle}
        </span>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {displayStats.map((stat) => (
          <div
            key={stat.label}
            className="p-3 sm:p-3.5 rounded-lg bg-page-secondary/60 border border-outline-subtle flex flex-col gap-1 items-start min-w-0"
          >
            <div className={`p-1.5 rounded-md ${stat.bg} ${stat.color} mb-0.5 sm:mb-1 shrink-0`}>
              <Icon icon={stat.icon} className="w-4 h-4" />
            </div>

            <span className="font-jetbrains text-[18px] sm:text-[22px] font-bold text-content-primary leading-tight truncate w-full">
              {stat.value}
            </span>

            <span className="text-[11px] sm:text-[12px] font-medium text-content-tertiary truncate w-full">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Escrow Protection Notice */}
      <div className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-lg bg-escrow-surface/40 border border-escrow-outline/70">
        <div className="p-1.5 rounded-md bg-escrow-surface text-escrow-icon shrink-0 mt-0.5">
          <Icon icon={escrowNotice.icon || "lucide:shield-check"} className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-bold text-escrow-foreground leading-tight">
            {escrowNotice.title}
          </span>
          <span className="text-[11px] text-content-secondary leading-normal mt-0.5">
            {escrowNotice.description}
          </span>
        </div>
      </div>
    </div>
  );
}
