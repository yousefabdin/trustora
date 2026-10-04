import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import type { MarketplaceListing } from "@/services/itemsServices";
import clsx from "clsx";

interface ListingHeaderProps {
  setModal: (value: boolean) => void;
  sellerItems: MarketplaceListing[];
  modal: boolean;
  user?: any;
  activeTab?: "all" | "active" | "sold" | "draft";
  onTabChange?: (tab: "all" | "active" | "sold" | "draft") => void;
}

export default function ListingHeader({
  sellerItems = [],
  setModal,
  modal,
  activeTab = "all",
  onTabChange,
}: ListingHeaderProps) {
  const handleCreateListing = () => {
    setModal(!modal);
  };

  const activeCount = sellerItems.filter(
    (item) => (item.status || "active").toLowerCase() === "active",
  ).length;

  const soldCount = sellerItems.filter(
    (item) => (item.status || "").toLowerCase() === "sold",
  ).length;

  const draftCount = sellerItems.filter(
    (item) => (item.status || "").toLowerCase() === "draft",
  ).length;

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full justify-between items-center pt-2 md:pt-[48px]">
        <div className="flex flex-col gap-[6px] md:gap-[8px]">
          <Typography
            variant={"h2"}
            children={"My Listings"}
            className="text-[26px] md:text-[28px] font-[800]! text-gray-900"
          ></Typography>
          <div className="flex items-center gap-[6px] text-xs">
            <button
              type="button"
              onClick={() =>
                onTabChange?.(activeTab === "active" ? "all" : "active")
              }
              className={clsx(
                "font-jetbrains font-bold px-2 py-0.5 rounded transition-all cursor-pointer",
                activeTab === "active"
                  ? "bg-emerald-100 text-[#059669] ring-1 ring-emerald-400"
                  : "text-[#059669] hover:bg-emerald-50",
              )}
            >
              {activeCount} Active
            </button>
            <span className="text-gray-400">·</span>
            <button
              type="button"
              onClick={() =>
                onTabChange?.(activeTab === "sold" ? "all" : "sold")
              }
              className={clsx(
                "font-jetbrains font-bold px-2 py-0.5 rounded transition-all cursor-pointer",
                activeTab === "sold"
                  ? "bg-gray-200 text-gray-800 ring-1 ring-gray-400"
                  : "text-gray-500 hover:bg-gray-100",
              )}
            >
              {soldCount} Sold
            </button>
            <span className="text-gray-400">·</span>
            <button
              type="button"
              onClick={() =>
                onTabChange?.(activeTab === "draft" ? "all" : "draft")
              }
              className={clsx(
                "font-jetbrains font-bold px-2 py-0.5 rounded transition-all cursor-pointer",
                activeTab === "draft"
                  ? "bg-amber-100 text-amber-700 ring-1 ring-amber-400"
                  : "text-amber-500 hover:bg-amber-50",
              )}
            >
              {draftCount} Draft
            </button>
            {activeTab !== "all" && (
              <>
                <span className="text-gray-400">·</span>
                <button
                  type="button"
                  onClick={() => onTabChange?.("all")}
                  className="font-jetbrains text-xs text-indigo-600 hover:underline cursor-pointer font-semibold ml-1"
                >
                  Show All ({sellerItems.length})
                </button>
              </>
            )}
          </div>
        </div>
        <div className="hidden md:block">
          <Button
            variant="primary"
            size="small"
            className="rounded-[6px]! gap-[8px] py-[12px] px-[20px]"
            onClick={handleCreateListing}
          >
            <Icon icon={"game-icons:cancel"}></Icon>
            Create Listing
          </Button>
        </div>
        <div className="block md:hidden">
          <button
            type="button"
            onClick={handleCreateListing}
            className="fixed bottom-6 right-6 w-12 h-12 bg-[#4F46E5] hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105 active:scale-95 z-50 cursor-pointer"
            aria-label="Add listing"
          >
            <Icon
              icon={"ant-design:plus-circle-outlined"}
              className="w-6 h-6 text-white"
            ></Icon>
          </button>
        </div>
      </div>
    </div>
  );
}
