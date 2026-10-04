import { Icon } from "@iconify/react";
import clsx from "clsx";
import { Link } from "react-router-dom";

interface ItemCardProps {
  id?: string | number;
  img: string;
  itemName: string;
  itemPrice: number;
  sellerName: string;
  location: string;
}

export default function ItemCard({
  id,
  itemName,
  itemPrice,
  img,
  sellerName,
  location,
}: ItemCardProps) {
  return (
    <div className="w-full h-full rounded-[8px] md:rounded-[12px] border border-outline-default overflow-hidden bg-surface-default flex flex-col hover:shadow-md transition-shadow cursor-pointer">
      <Link to={id ? `/item/${id}` : "#"} className="flex flex-col h-full w-full">
        <div
          className="w-full aspect-[4/3] overflow-hidden bg-page-secondary relative shrink-0"
          style={{ aspectRatio: "4 / 3" }}
        >
          <img
            src={img}
            alt={itemName}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="w-full p-[14px] sm:p-[16px] flex flex-col flex-1 justify-between gap-2.5">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center justify-between gap-1.5 min-w-0">
              <span
                className="text-content-tertiary text-[11px] sm:text-[12px] font-inter truncate min-w-0 flex-1"
                title={`@${sellerName}`}
              >
                @{sellerName}
              </span>
              <div className="flex items-center shrink-0 text-nowrap gap-1 bg-[#E8F8F2] text-[#00B37E] px-1.5 py-0.5 rounded-[4px] text-[10px] sm:text-[11px] font-bold tracking-wide">
                <Icon icon="lucide:shield-check" className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="hidden xl:inline">ESCROW</span> SECURED
              </div>
            </div>

            <h3 className="text-page-inverse font-inter font-semibold text-[13px] sm:text-[14px] line-clamp-2 leading-snug min-h-[36px]">
              {itemName}
            </h3>
          </div>

          <hr className="border-outline-subtle my-0.5" />

          <div className="flex items-end justify-between gap-2 mt-auto min-w-0 pt-1">
            <div className="flex flex-col shrink-0 min-w-0">
              <span className="text-content-tertiary text-[10px] font-bold uppercase tracking-wider leading-none">
                ESCROW HOLD
              </span>
              <span className="text-content-primary font-jetbrains font-bold text-[14px] sm:text-[16px] leading-tight mt-1">
                $
                {itemPrice.toLocaleString("en-us", {
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>

            <div className="flex items-center gap-1 text-content-secondary text-[11px] sm:text-[12px] font-inter min-w-0 max-w-[55%] justify-end shrink-0">
              <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 shrink-0 text-content-tertiary" />
              <span className="truncate" title={location}>
                {location || "Verified"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
