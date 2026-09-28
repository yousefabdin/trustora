import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import clsx from "clsx";
interface ItemPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export default function MarketBrowserPagination({
  page,
  totalPages,
  onPageChange,
}: ItemPaginationProps) {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return (
    <>
      <div className="hidden md:flex justify-between items-center gap-[24px] py-[24px]">
        <Button
          variant="ghost"
          className="flex items-center text-content-primary text-[13px]! border border-page-tertiary rounded-[6px]! py-[8px] px-[14px] gap-[6px]"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <Icon
            icon="akar-icons:arrow-left"
            className="text-content-tertiary w-[15px] h-[15px] mt-[2px]"
          ></Icon>
          <Typography variant="label">Previous</Typography>
        </Button>
        <div className="flex gap-[12px]">
          {pages.map((pageNumber) => {
            return (
              <div
                className="cursor-pointer"
                onClick={() => onPageChange(pageNumber)}
              >
                <Typography
                  variant="label"
                  className={clsx(
                    "flex items-center justify-center bg-page-primary w-[32px] h-[32px] text-[13px]! text-content-tertiary font-medium border border-page-tertiary rounded-[6px]  ",
                    pageNumber === page &&
                      "bg-page-tertiary! text-accent-default! border border-accent-default!",
                  )}
                >
                  {pageNumber}
                </Typography>
              </div>
            );
          })}
        </div>
        <div onClick={() => onPageChange(page + 1)}>
          <Button
            variant="ghost"
            disabled={page === totalPages}
            className="flex items-center text-content-primary text-[13px]! border border-page-tertiary rounded-[6px]! py-[8px] px-[14px] gap-[6px]"
          >
            <Typography variant="label">Next</Typography>
            <Icon
              icon="akar-icons:arrow-right"
              className="text-content-tertiary w-[15px] h-[15px] mt-[2px]"
            ></Icon>
          </Button>
        </div>
      </div>
      <Button
        className="flex w-full md:hidden bg-page-primary items-center font-semibold justify-center text-content-primary text-[14px]! border border-page-tertiary rounded-[6px]! py-[8px] px-[14px] gap-[6px]"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Load More Listings
      </Button>
    </>
  );
}
