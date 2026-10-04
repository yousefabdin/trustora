import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";

interface ListingFooterProps {
  sellerItems: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  limit: number;
}

export default function ListingFooter({
  sellerItems,
  currentPage,
  setCurrentPage,
  totalPages,
  limit,
}: ListingFooterProps) {
  return (
    <div className=" flex items-center justify-center md:justify-between py-[16px]">
      <Typography
        variant={"caption"}
        children={
          "Payouts occur instantly after sold items clear buyer validation."
        }
        className="hidden md:block text-[#9C9C99] text-[12px]!"
      ></Typography>
      <div className="flex items-center gap-[16px]">
        <Typography
          variant={"currencySmall"}
          className="hidden md:block text-[12px]! text-content-secondary"
          children={`Showing ${limit}  of ${sellerItems.length} Listings`}
        ></Typography>

        <Button
          disabled={currentPage === 1}
          variant="ghost"
          size="small"
          onClick={() => setCurrentPage(currentPage - 1)}
          className="flex items-center justify-center bg-page-primary border border-page-tertiary rounded-[4px]"
        >
          <Icon icon={"akar-icons:arrow-left"}></Icon>
        </Button>

        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="ghost"
          size="small"
          className=" flex items-center justify-center bg-page-primary border border-page-tertiary rounded-[4px]"
        >
          <Icon icon={"akar-icons:arrow-right"}></Icon>
        </Button>
      </div>
    </div>
  );
}
