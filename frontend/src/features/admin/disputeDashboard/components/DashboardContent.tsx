import React from "react";
import Typography from "@/components/atoms/typography/typography";
import StatsCard from "./StatsCard";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button/Button";
import { useAdminDashboard } from "@/services/adminService";
import { getDaysOpen } from "@/utils/disputeUtils";
import { formatDisputeReason, getDisputeNumber } from "@/utils/disputeUtils";

interface DashboardContentProps {
  filterDays?: string;
}

export default function DashboardContent({
  filterDays = "30 days",
}: DashboardContentProps) {
  const { data: dashboard, isLoading } = useAdminDashboard(filterDays);
  const navigate = useNavigate();

  const formatEventTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "Recent";
      return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "Recent";
    }
  };

  const formatEventRelative = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return "";
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 md:px-[90px] md:py-16 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-accent-default/20 border-t-accent-default rounded-full animate-spin" />
        <p className="text-xs md:text-sm text-content-secondary font-medium">
          Loading dashboard metrics and recent activity...
        </p>
      </div>
    );
  }

  const stats = dashboard?.stats || {
    totalOrders: { value: 0, percentageChange: "0%", isPositive: true },
    fundsInEscrow: { value: 0, formatted: "$0.00", percentageChange: "+0%", isPositive: true },
    openDisputes: { value: 0, percentageChange: "0", isPositive: true },
    revenueFees: { value: 0, formatted: "$0.00", percentageChange: "+0%", isPositive: true },
  };

  const recentActivity = dashboard?.recentActivity || [];
  const actionDisputes = dashboard?.disputesRequiringAction || [];

  return (
    <div className="p-[16px] flex flex-col gap-[20px] md:px-[90px] md:pb-[64px]">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-[16px]">
        <StatsCard
          variant="order"
          title="Total Orders"
          value={stats.totalOrders.value}
          percentageChange={stats.totalOrders.percentageChange}
          isPositive={stats.totalOrders.isPositive}
        />
        <StatsCard
          variant="escrow"
          title="Funds in Escrow"
          value={stats.fundsInEscrow.formatted || `$${stats.fundsInEscrow.value}`}
        />
        <StatsCard
          variant="dispute"
          title="Open Disputes"
          value={stats.openDisputes.value}
          percentageChange={stats.openDisputes.percentageChange}
          isPositive={stats.openDisputes.isPositive}
        />
        <StatsCard
          variant="fees"
          title="Revenue (Fees)"
          value={stats.revenueFees.formatted || `$${stats.revenueFees.value}`}
          percentageChange={stats.revenueFees.percentageChange}
          isPositive={stats.revenueFees.isPositive}
        />
      </div>

      <div className="md:hidden flex items-center justify-between pt-2">
        <Typography
          variant={"bodySmall"}
          children={"Action Required"}
          className="font-bold! uppercase"
        />
        <Link to={"/admin/disputes"}>
          <Typography
            variant={"label"}
            children={"View Queue"}
            className="font-semibold! text-accent-default underline cursor-pointer"
          />
        </Link>
      </div>

      <div className="md:hidden flex flex-col gap-4 w-full">
        {actionDisputes.length > 0 ? (
          <div className="flex flex-col gap-[10px] w-full">
            {actionDisputes.slice(0, 3).map((dispute, index) => {
              const formattedId = getDisputeNumber(dispute.id);
              const days = getDaysOpen(dispute);
              const reason = formatDisputeReason(dispute.disputeReason);

              return (
                <div
                  key={`${dispute.id}-${index}`}
                  className="w-full bg-white rounded-[8px] border border-neutral-200/80 p-[12px] shadow-xs flex flex-col gap-1 transition-shadow hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-neutral-900 text-[13px]">
                      {formattedId}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-red-50 text-red-600 border border-red-100">
                      Disputed
                    </span>
                  </div>

                  <h3 className="font-semibold text-neutral-900 text-[14px] leading-tight mt-0.5">
                    {dispute.itemName}
                  </h3>

                  <p className="text-xs text-neutral-500">{reason}</p>

                  <div className="border-page-tertiary pb-2 border-b font-mono text-xs flex items-center gap-1.5 mt-1">
                    <span className="font-bold text-accent-default">
                      {dispute.amount || `$${dispute.totalPrice}`}
                    </span>
                    <span className="text-accent-default font-medium">
                      in Escrow
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-neutral-400">
                      {days === 0 ? "Opened today" : `${days} days open`}
                    </span>
                    <Button
                      type="button"
                      size="small"
                      variant="primary"
                      onClick={() => navigate(`/admin/disputes/${dispute.id}`)}
                      className="px-[10px]! py-[6px]! text-[12px]! rounded-[6px]! cursor-pointer"
                    >
                      Review
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-neutral-200 p-4 text-center flex flex-col items-center justify-center gap-1.5">
            <Icon icon="lucide:check-circle-2" className="w-5 h-5 text-emerald-500" />
            <p className="text-xs font-semibold text-neutral-800">No Open Disputes</p>
            <p className="text-[11px] text-neutral-500">All transactions are healthy and dispute-free.</p>
          </div>
        )}

        <div className="flex gap-2 flex-col w-full pt-3">
          <Typography
            variant={"body"}
            children={"Recent Activity Log"}
            className="uppercase font-bold! text-xs"
          />
          <div className="bg-page-primary w-full p-[12px] flex flex-col divide-y divide-page-tertiary border rounded-[8px] border-page-tertiary shadow-xs">
            {recentActivity.slice(0, 6).map((activity) => (
              <div key={activity.id} className="py-2.5 flex justify-between items-start first:pt-0 last:pb-0">
                <div className="flex flex-col gap-0.5 max-w-[70%]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: activity.dotColor }}
                    />
                    <span className="text-xs font-semibold text-content-primary leading-tight">
                      {activity.title}
                    </span>
                  </div>
                  <span className="text-[11px] text-content-secondary truncate">
                    {activity.itemName} · {activity.orderNumber}
                  </span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="font-jetbrains text-xs font-bold text-content-primary">
                    {activity.amount}
                  </span>
                  <span className="text-[10px] text-content-tertiary font-jetbrains">
                    {formatEventRelative(activity.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:flex gap-[24px]">
        <div className="w-full flex flex-col gap-[14px] flex-3">
          <div className="flex items-center justify-between">
            <Typography
              variant={"bodyLarge"}
              children={"Recent Activity"}
              className="font-[600]! text-content-primary"
            />
            <span className="text-xs text-content-tertiary">
              Showing live transactions & status updates
            </span>
          </div>

          <div className="w-full bg-page-primary rounded-[12px] border border-page-tertiary overflow-hidden shadow-xs divide-y divide-page-tertiary">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 8).map((activity) => (
                <div
                  key={activity.id}
                  className="w-full flex gap-[16px] justify-between py-[12px] px-[16px] items-center hover:bg-surface-raised/50 transition-colors"
                >
                  <div className="flex items-center gap-[10px] min-w-[100px]">
                    <span
                      className="w-[8px] h-[8px] rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: activity.dotColor }}
                    />
                    <Typography
                      variant={"caption"}
                      className="text-[12px]! font-[400] text-content-secondary font-jetbrains whitespace-nowrap"
                    >
                      {formatEventTime(activity.timestamp)}
                    </Typography>
                  </div>

                  <div className="flex-1 flex flex-col min-w-0 pr-2">
                    <Typography
                      variant={"body"}
                      className="font-[500]! text-xs md:text-sm text-content-primary truncate"
                    >
                      {activity.title}
                    </Typography>
                    <span className="text-[11px] text-content-tertiary truncate">
                      {activity.itemName} {activity.buyerEmail ? `· @${activity.buyerEmail.split('@')[0]}` : ""}
                    </span>
                  </div>

                  <div className="shrink-0">
                    <Link
                      to={`/admin/disputes`}
                      className="font-jetbrains text-xs font-semibold text-accent-default hover:underline whitespace-nowrap"
                    >
                      {activity.orderNumber}
                    </Link>
                  </div>

                  <div className="shrink-0 text-right min-w-[90px]">
                    <Typography
                      variant={"currencySmall"}
                      className="font-[600]! text-content-primary font-jetbrains text-xs md:text-sm"
                    >
                      {activity.amount}
                    </Typography>
                    <span className="text-[10px] text-content-tertiary block font-jetbrains">
                      {formatEventRelative(activity.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <Icon icon="lucide:inbox" className="w-8 h-8 text-content-tertiary" />
                <p className="text-xs text-content-secondary font-medium">
                  No activity recorded for this timeframe.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex flex-2 flex-col gap-[14px]">
          <div className="flex items-center justify-between">
            <Typography
              variant={"bodyLarge"}
              children={"Disputes Requiring Action"}
              className="font-[600]! text-content-primary"
            />
            {actionDisputes.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-danger-surface text-danger-foreground border border-danger-outline rounded-full">
                {actionDisputes.length} Open
              </span>
            )}
          </div>

          <div className="flex flex-col gap-[12px]">
            {actionDisputes.length > 0 ? (
              <>
                {actionDisputes.slice(0, 4).map((dispute) => {
                  const daysOpen = getDaysOpen(dispute);
                  const formattedId = getDisputeNumber(dispute.id);
                  const reason = formatDisputeReason(dispute.disputeReason);

                  return (
                    <div
                      key={dispute.id}
                      className="p-[14px] flex justify-between items-center rounded-r-[8px] bg-page-primary border border-page-tertiary border-l-4 border-l-danger-icon! shadow-xs hover:shadow-sm transition-shadow"
                    >
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <Typography
                            variant={"bodySmall"}
                            className="font-[600]! font-mono text-content-primary text-xs"
                          >
                            {formattedId}
                          </Typography>
                          <span className="text-[11px] font-semibold text-accent-default font-jetbrains">
                            {dispute.amount || `$${dispute.totalPrice}`}
                          </span>
                        </div>
                        <Typography
                          variant={"caption"}
                          className="font-[500]! text-content-secondary text-xs truncate max-w-[180px] block mt-0.5"
                        >
                          {dispute.itemName}
                        </Typography>
                        <span className="text-[10px] text-content-tertiary block truncate">
                          {reason}
                        </span>
                      </div>

                      <div className="flex items-center gap-[10px] shrink-0">
                        <Typography
                          variant={"label"}
                          className="text-danger-icon text-[11px]! font-semibold"
                        >
                          {daysOpen === 0 ? "< 1d" : `${daysOpen}d open`}
                        </Typography>
                        <Link
                          to={`/admin/disputes/${dispute.id}`}
                          className="px-2.5 py-1 text-xs font-bold text-accent-default hover:bg-accent-subtle/50 rounded transition-colors"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="bg-page-primary border border-page-tertiary rounded-[12px] p-6 text-center flex flex-col items-center justify-center gap-2 shadow-xs">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Icon icon="lucide:shield-check" className="w-5 h-5" />
                </div>
                <h4 className="text-xs md:text-sm font-semibold text-content-primary">
                  Queue Fully Cleared
                </h4>
                <p className="text-[11px] text-content-secondary max-w-xs leading-relaxed">
                  There are no pending dispute cases requiring moderation. Escrow balances are performing normally.
                </p>
              </div>
            )}

            <Link
              to={"/admin/disputes"}
              className="flex items-center gap-2 text-accent-default hover:underline text-xs font-semibold pt-1"
            >
              <span>View All Disputes In Queue</span>
              <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
