import Typography from "@/components/atoms/typography/Typography";
import Cards from "@/components/molecules/cards/Cards";
import { Icon } from "@iconify/react";
import { useState } from "react";

interface CardSummarySectionProps {
  item?: {
    id?: number | string;
    itemName?: string;
    itemPrice?: number | string;
    img?: string;
    images?: string[];
    sellerName?: string;
  };
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

export default function CardSummarySection({
  item,
  mobileOnly = false,
  desktopOnly = false,
}: CardSummarySectionProps) {
  const escrowFees = 12.45;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const price =
    typeof item?.itemPrice === "number"
      ? item.itemPrice
      : Number(item?.itemPrice) || 25.88;

  const total = price + escrowFees;
  const itemName = item?.itemName || "Vintage Leica M6";
  const itemImg =
    item?.img || item?.images?.[0] || "/assets/images/itemImg.png";
  const sellerHandle = item?.sellerName || "timekeeper_luxury";

  if (mobileOnly) {
    return (
      <div className="w-full bg-page-tertiary border-b border-outline-subtle">
        <button
          type="button"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          aria-expanded={isDrawerOpen}
          className="w-full flex justify-between items-center gap-2 px-4 py-3.5 cursor-pointer select-none transition-colors hover:bg-page-tertiary/80"
        >
          <div className="flex gap-2 items-center">
            <Icon
              icon="lets-icons:basket-alt-3-light"
              className="text-accent-default w-5 h-5 shrink-0"
            />
            <Typography
              variant="caption"
              className="text-[14px]! text-content-primary font-medium font-inter flex items-center gap-1.5"
            >
              {isDrawerOpen ? "Hide order summary" : "Show order summary"}
              <Icon
                icon="akar-icons:chevron-down"
                className={`w-3.5 h-3.5 text-content-secondary transition-transform duration-300 ${
                  isDrawerOpen ? "rotate-180" : ""
                }`}
              />
            </Typography>
          </div>
          <Typography
            className="text-[15px] font-mono font-semibold text-heading"
            variant="currencySmall"
          >
            $
            {total.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isDrawerOpen
              ? "max-h-[900px] opacity-100 p-4 border-t border-outline-subtle bg-page-primary"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="w-full">
            <Cards
              variant="orderSummaryCard"
              className="w-full border border-outline-subtle bg-page-secondary shadow-xs min-h-0"
              price={price}
              itemName={itemName}
              itemImg={itemImg}
              listPrice={price}
              sellerHandle={sellerHandle}
            />
          </div>
        </div>
      </div>
    );
  }

  if (desktopOnly) {
    return (
      <div className="w-full">
        <Cards
          variant="orderSummaryCard"
          className="w-full"
          price={price}
          itemName={itemName}
          itemImg={itemImg}
          listPrice={price}
          sellerHandle={sellerHandle}
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="block md:hidden w-full bg-page-tertiary border-b border-outline-subtle">
        <button
          type="button"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          aria-expanded={isDrawerOpen}
          className="w-full flex justify-between items-center gap-2 px-4 py-3.5 cursor-pointer select-none transition-colors hover:bg-page-tertiary/80"
        >
          <div className="flex gap-2 items-center">
            <Icon
              icon="lets-icons:basket-alt-3-light"
              className="text-accent-default w-5 h-5 shrink-0"
            />
            <Typography
              variant="caption"
              className="text-[14px]! text-content-primary font-medium font-inter flex items-center gap-1.5"
            >
              {isDrawerOpen ? "Hide order summary" : "Show order summary"}
              <Icon
                icon="akar-icons:chevron-down"
                className={`w-3.5 h-3.5 text-content-secondary transition-transform duration-300 ${
                  isDrawerOpen ? "rotate-180" : ""
                }`}
              />
            </Typography>
          </div>
          <Typography
            className="text-[15px] font-mono font-semibold text-heading"
            variant="currencySmall"
          >
            $
            {total.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isDrawerOpen
              ? "max-h-[900px] opacity-100 p-4 border-t border-outline-subtle bg-page-primary"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="w-full">
            <Cards
              variant="orderSummaryCard"
              className="w-full border border-outline-subtle bg-page-secondary shadow-xs min-h-0"
              price={price}
              itemName={itemName}
              itemImg={itemImg}
              listPrice={price}
              sellerHandle={sellerHandle}
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block w-full">
        <Cards
          variant="orderSummaryCard"
          className="w-full"
          price={price}
          itemName={itemName}
          itemImg={itemImg}
          listPrice={price}
          sellerHandle={sellerHandle}
        />
      </div>
    </div>
  );
}
