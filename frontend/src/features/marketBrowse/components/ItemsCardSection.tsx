import Typography from "@/components/atoms/typography/typography";
import CardsListingItems from "./CardsListingItems";
import { Icon } from "@iconify/react";
import { useState } from "react";

import type { MarketplaceListing } from "@/utils/ItemsSeed";

interface ItemsCardSectionProps {
  search?: string;
  items?: MarketplaceListing[];
}

export default function ItemsCardSection({
  search,
  items,
}: ItemsCardSectionProps) {
  return (
    <div className="bg-page-secondary">
      <div className="flex items-start justify-between gap-2  py-[2px] md:py-[24px] px-[10px] md:px-[40px]">
        <div className="flex gap-2">
          <Typography
            variant="h2"
            className="hidden md:block text-[18px] font-bold text-page-inverse"
          >
            Escrow Catalog
          </Typography>
          <Typography
            variant="h2"
            className="md:hidden text-[12px]! md:text-[16px]! font-bold text-page-inverse text-nowrap"
          >
            Verified Escrow Catalog ({items ? items.length : 8})
          </Typography>
          <Typography
            variant="caption"
            className="hidden md:block *:text-[13px] font-[400] pt-2 text-content-tertiary"
          >
            (154 verifications secured today)
          </Typography>
        </div>
        <div className="hidden md:flex items-center gap-1 justify-end">
          <Icon
            icon="akar-icons:circle-fill"
            className="text-green-500 w-[8px] h-[8px]"
          ></Icon>
          <Typography
            variant="h3"
            className="hidden md:block text-[12px]! font-[600]! text-content-tertiary"
          >
            API Escrow Nodes Active
          </Typography>
        </div>
      </div>
      <CardsListingItems search={search} items={items}></CardsListingItems>
    </div>
  );
}
