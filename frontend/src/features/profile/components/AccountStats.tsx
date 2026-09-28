import React from "react";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import { orderData } from "@/utils/orderSeed";
import { disputeData } from "@/utils/disputedSeed";

export default function AccountStats() {
  const totalOrders = orderData.length;
  const inEscrowOrders = orderData.filter(
    (o) =>
      o.status === "In Escrow" ||
      o.status === "Held in Escrow" ||
      o.status === "Shipped"
  ).length;
  const completedOrders = orderData.filter(
    (o) =>
      o.status === "Completed" ||
      o.status === "Delivered" ||
      o.status === "Funds Released"
  ).length;
  const disputedOrders =
    orderData.filter((o) => o.status === "Disputed").length ||
    disputeData.length;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: "lucide:package",
      color: "text-content-primary",
      bg: "bg-page-secondary",
    },
    {
      label: "In Escrow",
      value: inEscrowOrders,
      icon: "lucide:shield-alert",
      color: "text-escrow-icon",
      bg: "bg-escrow-surface",
    },
    {
      label: "Completed",
      value: completedOrders,
      icon: "lucide:check-circle-2",
      color: "text-success-icon",
      bg: "bg-success-surface",
    },
    {
      label: "Disputes",
      value: disputedOrders,
      icon: "lucide:alert-triangle",
      color: "text-danger-icon",
      bg: "bg-danger-surface",
    },
  ];

  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-outline-subtle">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:bar-chart-2" className="w-4.5 h-4.5 text-accent-default" />
          <Typography
            variant="h3"
            className="text-[16px] font-bold text-content-primary leading-tight"
          >
            Marketplace Overview
          </Typography>
        </div>

        <span className="text-[12px] font-medium text-content-tertiary">
          Buyer Activity
        </span>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-3.5 rounded-lg bg-page-secondary/60 border border-outline-subtle flex flex-col gap-1 items-start"
          >
            <div className={`p-1.5 rounded-md ${stat.bg} ${stat.color} mb-1`}>
              <Icon icon={stat.icon} className="w-4 h-4" />
            </div>

            <span className="font-jetbrains text-[22px] font-bold text-content-primary leading-none">
              {stat.value}
            </span>

            <span className="text-[12px] font-medium text-content-tertiary">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Escrow Protection Notice */}
      <div className="flex items-start gap-3 p-3.5 rounded-lg bg-escrow-surface/40 border border-escrow-outline/70">
        <div className="p-1 rounded bg-escrow-surface text-escrow-icon shrink-0 mt-0.5">
          <Icon icon="lucide:shield-check" className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] font-bold text-escrow-foreground leading-tight">
            Trustora Escrow Guarantee
          </span>
          <span className="text-[11px] text-content-secondary leading-normal mt-0.5">
            Your payments are locked safely in escrow and only released after delivery inspection or confirmation.
          </span>
        </div>
      </div>
    </div>
  );
}
