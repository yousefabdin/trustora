import Typography from "@/components/atoms/typography/typography";
import DropDown from "@/components/molecules/inputs/DropDown";
import clsx from "clsx";

const daysOptions = [
  { code: "7 days", name: "Last 7 Days" },
  { code: "30 days", name: "Last 30 Days" },
  { code: "90 days", name: "Last 90 Days" },
  { code: "all", name: "All Time" },
];

interface DashboardHeaderProps {
  filterDays: string;
  onFilterChange: (days: string) => void;
}

export default function DashboardHeader({
  filterDays = "30 days",
  onFilterChange,
}: DashboardHeaderProps) {
  return (
    <div className="w-full">
      <div className="md:hidden px-4 pt-4 pb-2 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[19px] font-bold text-content-primary leading-tight">
              Dashboard
            </h1>
            <p className="text-[12px] text-content-tertiary font-normal">
              Platform Metrics & Escrow Operations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {daysOptions.map((opt) => {
            const isSelected = filterDays === opt.code;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => onFilterChange(opt.code)}
                className={clsx(
                  "px-3.5 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium",
                  isSelected
                    ? "bg-page-inverse text-content-inverse font-semibold shadow-xs"
                    : "bg-surface-default text-content-secondary border border-outline-default hover:bg-surface-raised",
                )}
              >
                {opt.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-6 px-6 lg:px-[90px] pt-8 md:pt-[44px] pb-4">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col">
            <Typography
              variant={"h2"}
              children={"Platform Dashboard"}
              className="text-[24px]! font-[600]! text-page-inverse"
            />
            <p className="text-xs text-content-secondary mt-0.5">
              Real-time escrow volumes, active disputes, and platform transaction history
            </p>
          </div>

          <div className="w-[170px]">
            <DropDown
              label={""}
              value={filterDays}
              options={daysOptions}
              defaultValue="30 days"
              placeholder="Select timeframe"
              onChange={(val) => onFilterChange(val || "30 days")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
