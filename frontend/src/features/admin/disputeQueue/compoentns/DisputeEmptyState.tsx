import React from "react";
import { Icon } from "@iconify/react";

interface DisputeEmptyStateProps {
  activeFilter: string;
  totalCount: number;
  onClearFilter: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const DisputeEmptyState: React.FC<DisputeEmptyStateProps> = ({
  activeFilter,
  totalCount,
  onClearFilter,
  onRefresh,
  isRefreshing = false,
}) => {
  const isFiltered = activeFilter !== "All" && totalCount > 0;

  const getFilterInfo = () => {
    switch (activeFilter) {
      case "Pending Review":
        return {
          title: "No Pending Reviews",
          subtitle:
            "There are currently no new buyer or seller disputes awaiting initial triage or moderation.",
          icon: "lucide:clock",
          accentColor: "text-amber-500",
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-500/20",
        };
      case "Under Investigation":
        return {
          title: "No Disputes Under Investigation",
          subtitle:
            "No cases are currently flagged for extended evidence collection or deep arbitration.",
          icon: "lucide:scale",
          accentColor: "text-indigo-500",
          bgColor: "bg-indigo-500/10",
          borderColor: "border-indigo-500/20",
        };
      case "Resolved":
        return {
          title: "No Resolved Disputes",
          subtitle:
            "No disputes have been finalized in this category yet. When arbitrations conclude, they will appear here.",
          icon: "lucide:check-circle-2",
          accentColor: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
          borderColor: "border-emerald-500/20",
        };
      default:
        return {
          title: "Dispute Queue Is All Clear",
          subtitle:
            "All marketplace transactions are operating smoothly with no unresolved buyer or seller disputes requiring administrative intervention.",
          icon: "lucide:shield-check",
          accentColor: "text-emerald-500",
          bgColor: "bg-emerald-500/10",
          borderColor: "border-emerald-500/20",
        };
    }
  };

  const info = getFilterInfo();

  return (
    <div className="w-full px-4 md:px-6 lg:px-[90px] pb-12">
      <div className="w-full bg-[var(--surface-default)] border border-[var(--outline-default)] rounded-2xl p-8 md:p-12 shadow-xs flex flex-col items-center justify-center text-center max-w-3xl mx-auto transition-all">
        <div className="relative mb-5 flex items-center justify-center">
          <div
            className={`w-20 h-20 rounded-2xl ${info.bgColor} ${info.borderColor} border flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-105`}
          >
            <Icon
              icon={isFiltered ? info.icon : "lucide:shield-check"}
              className={`w-10 h-10 ${info.accentColor}`}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
            <Icon icon="lucide:check" className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-[var(--content-primary)] tracking-tight mb-2">
          {info.title}
        </h3>
        <p className="text-xs md:text-sm text-[var(--content-secondary)] max-w-md leading-relaxed mb-6">
          {info.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {isFiltered && (
            <button
              type="button"
              onClick={onClearFilter}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[var(--accent-default,#4F46E5)] hover:bg-[#4338CA] active:bg-[#3730A3] rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Icon icon="lucide:arrow-left" className="w-3.5 h-3.5" />
              <span>View All Disputes ({totalCount})</span>
            </button>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[var(--content-secondary)] hover:text-[var(--content-primary)] bg-[var(--surface-default)] hover:bg-[var(--surface-raised)] border border-[var(--outline-default)] rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Icon
                icon="lucide:refresh-cw"
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>{isRefreshing ? "Refreshing..." : "Refresh Queue"}</span>
            </button>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--outline-subtle)] w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--surface-raised)]/50 border border-[var(--outline-subtle)]">
            <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Icon icon="lucide:shield-check" className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--content-primary)]">
                Escrow Protected
              </p>
              <p className="text-[10px] text-[var(--content-tertiary)]">
                All funds held securely
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--surface-raised)]/50 border border-[var(--outline-subtle)]">
            <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Icon icon="lucide:clock" className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--content-primary)]">
                48h SLA Triage
              </p>
              <p className="text-[10px] text-[var(--content-tertiary)]">
                Rapid case assignment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[var(--surface-raised)]/50 border border-[var(--outline-subtle)]">
            <div className="w-7 h-7 rounded-md bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
              <Icon icon="lucide:scale" className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--content-primary)]">
                Neutral Arbitration
              </p>
              <p className="text-[10px] text-[var(--content-tertiary)]">
                Fair evidence review
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeEmptyState;
