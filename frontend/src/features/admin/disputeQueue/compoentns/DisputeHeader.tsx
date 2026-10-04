import Typography from "@/components/atoms/typography/typography";
import { useState } from "react";
import clsx from "clsx";

export interface DisputeCounts {
  all: number;
  open: number;
  pendingReview: number;
  underInvestigation: number;
  resolved: number;
  resolvedThisMonth: number;
}

const defaultCounts: DisputeCounts = {
  all: 0,
  open: 0,
  pendingReview: 0,
  underInvestigation: 0,
  resolved: 0,
  resolvedThisMonth: 0,
};

const filters = ["All", "Pending Review", "Under Investigation", "Resolved"];

interface DisputeHeaderProps {
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  counts?: DisputeCounts;
}

export default function DisputeHeader({
  activeFilter,
  onFilterChange,
  counts = defaultCounts,
}: DisputeHeaderProps) {
  const [internalActive, setInternalActive] = useState("All");

  const currentFilter = activeFilter !== undefined ? activeFilter : internalActive;
  const handleFilterClick = (filter: string) => {
    if (onFilterChange) {
      onFilterChange(filter);
    } else {
      setInternalActive(filter);
    }
  };

  const mobileFilters = [
    { id: "All", label: `All (${counts.all})` },
    { id: "Pending Review", label: `Pending (${counts.pendingReview})` },
    { id: "Under Investigation", label: `Under Review (${counts.underInvestigation})` },
    { id: "Resolved", label: `Resolved (${counts.resolved})` },
  ];

  return (
    <div className="w-full">
      <div className="md:hidden px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[19px] font-bold text-content-primary leading-tight">
              Dispute Console
            </h1>
            <p className="text-[12px] text-content-tertiary font-normal">
              Adjudication Center · {counts.open} Active Open
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {mobileFilters.map((tab) => {
            const isSelected = currentFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleFilterClick(tab.id)}
                className={clsx(
                  "px-4 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors cursor-pointer",
                  isSelected
                    ? "bg-page-inverse text-content-inverse font-semibold shadow-xs"
                    : "bg-surface-default text-content-secondary border border-outline-default hover:bg-surface-raised font-medium",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-8 md:gap-10 px-6 lg:px-[90px] pb-6 md:pb-[32px] pt-8 md:pt-[44px]">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <Typography
              variant={"h2"}
              children={"Dispute Queue"}
              className="text-[24px]! font-[600]! text-content-primary"
            />
          </div>

          <div className="flex gap-1.5 items-center bg-page-primary border border-page-tertiary rounded-[8px] p-[3px]">
            {filters.map((filter) => {
              const isSelected = currentFilter === filter;
              let count = counts.all;
              if (filter === "Pending Review") count = counts.pendingReview;
              if (filter === "Under Investigation") count = counts.underInvestigation;
              if (filter === "Resolved") count = counts.resolved;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilterClick(filter)}
                  className={clsx(
                    "flex items-center gap-2 text-nowrap justify-center cursor-pointer text-[13px] font-[500] px-[12px] py-[6px] rounded-[6px] transition-all",
                    isSelected
                      ? "text-accent-default! font-[600]! bg-page-tertiary shadow-xs"
                      : "text-content-secondary hover:text-content-primary hover:bg-page-tertiary/40",
                  )}
                >
                  <span>{filter}</span>
                  <span
                    className={clsx(
                      "text-[11px] font-mono px-1.5 py-0.5 rounded-full font-semibold",
                      isSelected
                        ? "bg-accent-default/15 text-accent-default"
                        : "bg-surface-raised text-content-tertiary",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center border border-page-tertiary gap-3 w-full bg-page-primary p-[16px] rounded-[8px]">
          <button
            type="button"
            onClick={() => handleFilterClick("All")}
            className="inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            title="Filter: All Disputes"
          >
            <Typography
              variant={"label"}
              className="text-[13px]! font-[700]! text-page-inverse"
            >
              {counts.open}{" "}
              <span className="text-content-secondary! font-[500]!">Open</span> ·
            </Typography>
          </button>

          <button
            type="button"
            onClick={() => handleFilterClick("Pending Review")}
            className="inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            title="Filter: Pending Review"
          >
            <Typography
              variant={"label"}
              className="text-[13px]! font-[700]! text-page-inverse"
            >
              {counts.pendingReview}
              <span className="text-content-secondary! font-[500]! px-[3px]">
                Pending Review ·
              </span>
            </Typography>
          </button>

          <button
            type="button"
            onClick={() => handleFilterClick("Under Investigation")}
            className="inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            title="Filter: Under Investigation"
          >
            <Typography
              variant={"label"}
              className="text-[13px]! font-[700]! text-page-inverse"
            >
              {counts.underInvestigation}
              <span className="text-content-secondary! font-[500]! px-[2px]">
                Under Investigation
              </span>{" "}
              ·
            </Typography>
          </button>

          <button
            type="button"
            onClick={() => handleFilterClick("Resolved")}
            className="inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
            title="Filter: Resolved Disputes"
          >
            <Typography
              variant={"label"}
              className="text-[13px]! font-[700]! text-emerald-500"
            >
              {counts.resolvedThisMonth}
              <span className="text-content-secondary! font-[500]! px-[2px]">
                Resolved This Month
              </span>
            </Typography>
          </button>
        </div>
      </div>
    </div>
  );
}
