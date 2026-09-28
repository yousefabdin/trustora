import React from "react";
import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/typography"; // Adjust path as needed
import { type Dispute, type DisputeStatusHistory } from "@/utils/disputedSeed"; // Adjust path as needed

interface ActivityItem {
  title: string;
  timestamp: string;
  isLatest?: boolean;
}

interface DisputeActivityLogProps {
  dispute?: Dispute;
  activities?: ActivityItem[];
  onMoreClick?: () => void;
}

export default function DisputeActivityLog({
  dispute,
  activities,
  onMoreClick,
}: DisputeActivityLogProps) {
  console.log(dispute);
  const activeLogs =
    activities ||
    (dispute?.statusHistory && dispute.statusHistory.length > 0
      ? dispute.statusHistory
          .map((historyItem: DisputeStatusHistory, index: number) => ({
            title: historyItem.title,
            timestamp: new Date(historyItem.date).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            isLatest: index === dispute.statusHistory.length - 1,
          }))
          .reverse()
      : []);

  return (
    <div className="w-full  p-[20px] gap-[16px] flex flex-col bg-surface-default border border-outline-subtle rounded-[6px] shadow-xs">
      <div className="flex items-center justify-between w-full">
        <Typography
          variant="h3"
          className="text-content-primary font-bold text-[15px]!"
        >
          Activity Log
        </Typography>
        <button
          type="button"
          onClick={onMoreClick}
          className="text-content-tertiary hover:text-content-primary transition-colors cursor-pointer"
        >
          <Icon icon="ph:dots-three-bold" className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4 w-full overflow-y-auto">
        {activeLogs?.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 w-full">
            <div className="pt-1.5 flex items-center justify-center flex-shrink-0">
              <span
                className={`w-2 h-2 rounded-full ${
                  activity.isLatest
                    ? "bg-accent-default"
                    : "bg-content-tertiary"
                }`}
              />
            </div>

            <div className="flex flex-col justify-center">
              <Typography
                variant="body"
                className={`text-[13px] leading-tight ${
                  activity.isLatest
                    ? "text-page-inverse font-semibold!"
                    : "text-content-secondary font-medium!"
                }`}
              >
                {activity.title}
              </Typography>
              <Typography
                variant="caption"
                className="text-content-tertiary text-[11px] leading-tight pt-0.5 font-mono"
              >
                {activity.timestamp}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
