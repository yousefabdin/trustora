import React from "react";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import { formatActivityDate } from "@/utils/dateUtils";
import type { ProfileActivityItem } from "../profileData";

interface RecentActivityCardProps {
  activities?: ProfileActivityItem[];
  subtitle?: string;
}

export default function RecentActivityCard({
  activities: customActivities,
  subtitle = "Marketplace Log",
}: RecentActivityCardProps) {
  const activities: ProfileActivityItem[] = customActivities || [
    {
      id: "act-1",
      title: "Package Delivered & Inspection Started",
      description: "Delivered to mailbox. 48-hour escrow inspection period initiated.",
      date: "2026-08-12T11:15:00Z",
      orderNumber: "#HLD-2847",
      itemName: "Vintage Leica M6",
      type: "delivery",
    },
    {
      id: "act-2",
      title: "Item Shipped by Seller",
      description: "Seller shipped via USPS Priority Mail (Tracking #9400111899223847652).",
      date: "2026-08-10T14:34:00Z",
      orderNumber: "#HLD-2847",
      itemName: "Vintage Leica M6",
      type: "shipping",
    },
    {
      id: "act-3",
      title: "Funds Released to Seller",
      description: "Buyer authenticated print and finalized transaction. Escrow released.",
      date: "2026-08-02T10:00:00Z",
      orderNumber: "#HLD-2756",
      itemName: "First Edition Dune",
      type: "release",
    },
    {
      id: "act-4",
      title: "Payment Held in Escrow",
      description: "Funds locked securely in Holdline smart contract.",
      date: "2026-07-29T09:15:00Z",
      orderNumber: "#HLD-2756",
      itemName: "First Edition Dune",
      type: "escrow",
    },
    {
      id: "act-5",
      title: "Dispute Opened by Buyer",
      description: "Escrow funds locked pending arbitration review for cosmetic imperfection.",
      date: "2026-07-22T09:15:00Z",
      orderNumber: "#HLD-2654",
      itemName: "Braun TP1 Radio",
      type: "dispute",
    },
  ];

  const getEventBadge = (type: ActivityItem["type"]) => {
    switch (type) {
      case "escrow":
        return {
          icon: "lucide:shield-check",
          color: "bg-escrow-surface text-escrow-icon",
        };
      case "shipping":
        return {
          icon: "lucide:truck",
          color: "bg-info-surface text-info-icon",
        };
      case "delivery":
        return {
          icon: "lucide:package-check",
          color: "bg-success-surface text-success-icon",
        };
      case "release":
        return {
          icon: "lucide:check-circle-2",
          color: "bg-success-surface text-success-icon",
        };
      case "dispute":
        return {
          icon: "lucide:alert-triangle",
          color: "bg-danger-surface text-danger-icon",
        };
      default:
        return {
          icon: "lucide:circle",
          color: "bg-page-secondary text-content-tertiary",
        };
    }
  };

  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-xl p-4 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-outline-subtle flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-accent-surface text-accent-default">
            <Icon icon="lucide:history" className="w-4 h-4" />
          </div>
          <Typography
            variant="h3"
            className="text-[15px] sm:text-[16px] font-bold text-content-primary leading-tight"
          >
            Recent Activity
          </Typography>
        </div>

        <span className="text-[11px] sm:text-[12px] font-medium text-content-tertiary">
          {subtitle}
        </span>
      </div>

      <div className="flex flex-col pl-2 sm:pl-3 relative border-l-2 border-outline-subtle ml-3 my-1 gap-6">
        {activities.map((item, index) => {
          const badge = getEventBadge(item.type);
          return (
            <div key={item.id} className="relative pl-6">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-[23px] top-0 w-7 h-7 rounded-full flex items-center justify-center border-2 border-surface-default shadow-xs ${badge.color}`}
              >
                <Icon icon={badge.icon} className="w-3.5 h-3.5" />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[13px] font-semibold text-content-primary leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[11px] font-jetbrains text-content-tertiary">
                    {formatActivityDate(item.date)}
                  </span>
                </div>

                <p className="text-[12px] text-content-secondary leading-snug">
                  {item.description}
                </p>

                {item.itemName && (
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-content-tertiary">
                    <span className="font-medium text-content-secondary">
                      {item.itemName}
                    </span>
                    <span>·</span>
                    <span className="font-jetbrains">{item.orderNumber}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
