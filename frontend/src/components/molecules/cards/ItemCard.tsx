import { Icon } from "@iconify/react";
import clsx from "clsx";
import { Link } from "react-router-dom";

interface ItemCardProps {
  img: string;
  itemName: string;
  itemPrice: number;
  sellerName: string;
  location: string;
}

export default function ItemCard({
  itemName,
  itemPrice,
  img,
  sellerName,
  location,
}: ItemCardProps) {
  return (
    <div className="w-[173px] md:w-[282px] 2xl:w-[400px] 2xl:h-[400px] rounded-[8px] md:rounded-[12px] border border-outline-default overflow-hidden bg-surface-default flex flex-col hover:shadow-md transition-shadow cursor-pointer">
      <Link to="/item/:id">
        <div className="w-full h-[140px] md:h-[200px] 2xl:h-[250px] overflow-hidden bg-page-secondary">
          <img
            src={img}
            alt={itemName}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="p-[16px] gap-[10px] flex flex-col">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-content-tertiary text-[12px] font-inter text-nowrap">
                @{sellerName}
              </span>
              <div className="hidden md:flex items-center text-nowrap gap-1 bg-[#E8F8F2] text-[#00B37E] px-2 rounded-[4px] text-[11px] font-bold tracking-wide">
                <Icon icon="lucide:shield-check" className="w-3.5 h-3.5" />
                ESCROW SECURED
              </div>
            </div>

            <h3 className="text-page-inverse font-inter font-semibold text-[13px] md:text-[14px]">
              {itemName}
            </h3>
          </div>

          <hr className="border-outline-subtle" />

          <div className="flex items-end justify-between mt-auto">
            <div className="flex flex-col">
              <span className="hidden md:block text-content-tertiary text-[10px] font-bold uppercase tracking-wider mb-0.5">
                ESCROW HOLD
              </span>
              <span className="text-content-primary font-jetbrains font-bold text-[14px] md:text-[16px] leading-none py-[10px]">
                $
                {itemPrice.toLocaleString("en-us", {
                  minimumFractionDigits: 0,
                })}
              </span>
            </div>

            <div className="flex items-center py-2 ">
              <div className="flex md:hidden items-center py- gap-1 text-[#00B37E] text-[10px] font-bold tracking-wide">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00B37E]" />
                SECURE
              </div>
              <div className="hidden md:flex items-center gap-1 text-content-secondary text-[13px] font-inter">
                <Icon icon="lucide:map-pin" className="w-3.5 h-3.5" />
                {location}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
