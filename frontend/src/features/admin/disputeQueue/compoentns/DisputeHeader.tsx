import Typography from "@/components/atoms/typography/typography";
import { useState } from "react";
import clsx from "clsx";

const filters = ["All", "Pending Review", "Under Investigation", "Resolved"];

const mobileFilters = [
  { id: "All", label: "All (8)" },
  { id: "Pending Review", label: "Pending" },
  { id: "Under Investigation", label: "Under Review" },
  { id: "Resolved", label: "Resolved" },
];

export default function DisputeHeader() {
  const [isActive, setIsActive] = useState("All");

  return (
    <div className="w-full">
      <div className="md:hidden px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[19px] font-bold text-content-primary leading-tight">
              Dispute Console
            </h1>
            <p className="text-[12px] text-content-tertiary font-normal">
              Adjudication Center
            </p>
          </div>
        </div>

        {/* Mobile Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {mobileFilters.map((tab) => {
            const isSelected = isActive === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setIsActive(tab.id)}
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

      {/* Desktop Header (>= md) */}
      <div className="hidden md:flex flex-col gap-8 md:gap-12 px-6 lg:px-[90px] pb-6 md:pb-[40px] pt-8 md:pt-[48px]">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <Typography
              variant={"h2"}
              children={"Dispute Queue"}
              className="text-[24px]! font-[600]! text-content-primary"
            />
          </div>

          <div className="flex gap-4 items-center bg-page-primary border border-page-tertiary rounded-[8px] p-[2px]">
            {filters.map((filter) => {
              return (
                <Typography
                  key={filter}
                  variant={"label"}
                  children={filter}
                  className={clsx(
                    "w-full h-full flex text-nowrap justify-center items-center cursor-pointer text-[13px]! font-[500]! px-[12px] py-[6px] text-content-secondary rounded-[6px] transition-colors",
                    isActive === filter &&
                      "text-accent-default! font-[600]! bg-page-tertiary! ",
                  )}
                  onClick={() => setIsActive(filter)}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center border border-page-tertiary gap-2 w-full bg-page-primary p-[16px] rounded-[8px]">
          <Typography
            variant={"label"}
            className="text-[13px]! font-[700]! text-page-inverse"
          >
            2 <span className="text-content-secondary! font-[500]!">Open</span>{" "}
            ·
          </Typography>
          <Typography
            variant={"label"}
            className="text-[13px]! font-[700]! text-page-inverse"
          >
            5
            <span className="text-content-secondary! font-[500]! px-[3px]">
              Pending Review ·
            </span>
          </Typography>
          <Typography
            variant={"label"}
            className="text-[13px]! font-[700]! text-page-inverse"
          >
            5
            <span className="text-content-secondary! font-[500]! px-[2px]">
              Under Investigation
            </span>{" "}
            ·
          </Typography>
          <Typography
            variant={"label"}
            className="text-[13px]! font-[700]! text-green-500"
          >
            12
            <span className="text-content-secondary! font-[500]! px-[2px]">
              Resolved This Month
            </span>
          </Typography>
        </div>
      </div>
    </div>
  );
}
