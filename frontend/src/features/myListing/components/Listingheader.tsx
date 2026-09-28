import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import type { ListingType } from "@/utils/sellerListingSeed";

interface LisitingHeaderProps {
  setModal: (value: boolean) => void;
  sellerItems: ListingType[];
  modal: boolean;
  user?: any;
}
export default function ListingHeader({
  sellerItems = [],
  setModal,
  modal,
  user,
}: LisitingHeaderProps) {
  const handleCreateListing = () => {
    setModal(!modal);
  };

  const activeCount = sellerItems.filter((item) => {
    return item.status === "Active";
  }).length;
  const soldCount = sellerItems.filter((item) => {
    return item.status === "Sold";
  }).length;
  const draftCount = sellerItems.filter((item) => {
    return item.status === "Draft";
  }).length;
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
            <span className="font-jetbrains font-bold text-[#059669]">
              {activeCount} Active
            </span>
            <span className="text-gray-400">·</span>
            <span className="font-jetbrains font-bold text-gray-500">
              {soldCount} Sold
            </span>
            <span className="text-gray-400">·</span>
            <span className="font-jetbrains font-bold text-amber-500">
              {draftCount} Draft
            </span>
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
