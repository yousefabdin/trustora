import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/typography";
import type { Order } from "@/utils/orderSeed";

interface ActivityItem {
  title: string;
  timestamp: string;
  isLatest?: boolean;
}

interface DisputeActivityLogProps {
  disputeOrder?: Order;
  activities?: ActivityItem[];
  onMoreClick?: () => void;
}

export default function DisputeActivityLog({
  disputeOrder,
  activities,
  onMoreClick,
}: DisputeActivityLogProps) {
  const formatLogTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const defaultLogs: ActivityItem[] = [
    { title: "Admin assigned", timestamp: "Aug 9, 09:15 AM" },
    { title: "Seller responded", timestamp: "Aug 8, 11:30 AM" },
    { title: "Dispute filed", timestamp: "Aug 7, 02:15 PM" },
  ];

  const activeLogs: ActivityItem[] =
    activities ||
    (disputeOrder?.statusHistory && disputeOrder.statusHistory.length > 0
      ? disputeOrder.statusHistory
          .map((historyItem, index) => ({
            title: historyItem.title,
            timestamp: formatLogTime(historyItem.date),
            isLatest: index === disputeOrder.statusHistory.length - 1,
          }))
          .reverse()
      : defaultLogs);

  return (
    <div className="w-full p-4 md:p-[20px] gap-3 md:gap-[16px] flex flex-col bg-surface-default border border-outline-default rounded-[6px] shadow-xs">
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

      <div className="flex flex-col gap-3 w-full">
        {activeLogs.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between w-full text-xs"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  index === 0 ? "bg-accent-default" : "bg-neutral-400"
                }`}
              />
              <span
                className={`text-[13px] leading-none ${
                  index === 0
                    ? "text-neutral-900 font-semibold"
                    : "text-neutral-600 font-medium"
                }`}
              >
                {activity.title}
              </span>
            </div>

            <span className="text-[11px] text-neutral-400 font-jetbrains shrink-0">
              {activity.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
