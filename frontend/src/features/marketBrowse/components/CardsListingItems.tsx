import ItemCard from "@/components/molecules/cards/ItemCard";
import EmptyState from "@/components/organisms/EmptyState";
import { marketplaceListings } from "@/utils/ItemsSeed";
import { useEffect, useState } from "react";
import MarketBrowserPagination from "./MarketBrowserPagination";
import { useNavigate } from "react-router-dom";
import type { MarketplaceListing } from "@/utils/ItemsSeed";

interface CardsListingProps {
  search?: string;
  items?: MarketplaceListing[];
  onClearFilters?: () => void;
}

export default function CardsListing({
  search,
  items = [],
  onClearFilters,
}: CardsListingProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const limit = 8;
  useEffect(() => {
    setCurrentPage(1);
  }, [search, items]);
  const totalPages = Math.ceil(items.length / limit) || 1;
  const startIndex = (currentPage - 1) * limit;
  const currentItems = items.slice(startIndex, startIndex + limit);

  const handleClick = (id: string | number) => {
    navigate(`/item/${id}`);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-[24px] md:py-[16px]">
      {currentItems.length === 0 ? (
        <div className="w-full min-h-[380px] flex items-center justify-center py-6">
          <EmptyState
            placeholder="No items found"
            description="Your current filter combination didn't yield any results. Trustora secures high-value digital and physical assets via escrow protocol. Try adjusting your parameters."
            buttonLabel="Clear Filters"
            onAction={onClearFilters}
          />
        </div>
      ) : (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {currentItems.map((card) => (
            <div key={card.id} onClick={() => handleClick(card.id)} className="h-full">
              <ItemCard
                id={card.id}
                itemName={card.itemName}
                img={card.img}
                itemPrice={card.itemPrice}
                sellerName={card.sellerName}
                location={
                  card.category
                    ? card.category.charAt(0).toUpperCase() + card.category.slice(1)
                    : "Verified"
                }
              />
            </div>
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="w-full">
          <MarketBrowserPagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          ></MarketBrowserPagination>
        </div>
      )}
    </div>
  );
}
