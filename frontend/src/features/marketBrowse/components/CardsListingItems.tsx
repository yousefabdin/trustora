import ItemCard from "@/components/molecules/cards/ItemCard";
import EmptyState from "@/components/organisms/EmptyState";
import { marketplaceListings } from "@/utils/ItemsSeed";
import { useEffect, useState } from "react";
import MarketBrowserPagination from "./MarketBrowserPagination";
import { useNavigate } from "react-router-dom";
import { getItems } from "@/services/itemsServices";
import type { MarketplaceListing } from "@/utils/ItemsSeed";

interface CardsListingProps {
  search?: string;
  items?: MarketplaceListing[];
}

export default function CardsListing({ search, items: propItems }: CardsListingProps) {
  const [items, setItems] = useState<typeof marketplaceListings>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const limit = 8;

  const handleClick = (id: number) => {
    navigate(`/item/${id}`);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, propItems]);

  useEffect(() => {
    if (propItems !== undefined) {
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      setItems(propItems.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(propItems.length / limit));
      return;
    }

    const fetchItems = async () => {
      const response = await getItems({
        currentPage,
        limit,
        search,
      });

      setItems(response.data);
      setTotalPages(response.totalPages);
    };

    fetchItems();
  }, [currentPage, search, propItems]);
  return (
    <div className="flex flex-col items-center justify-center gap-[24px] px-[10px] md:px-[40px] py-[16px]">
      <div className="flex w-full h-full items-center ">
        <div className="w-full flex flex-wrap  gap-2 md:gap-3 justify-center md:justify-around">
          {items.length === 0 ? (
            <EmptyState
              placeholder="No items found"
              description="Your current filter combination didn't yield any results. Holdline secures high-value digital and physical assets via smart contracts. Try adjusting your parameters."
              buttonLabel="Clear Filters"
              buttonLink="#"
            />
          ) : (
            items.map((card) => {
              return (
                <div onClick={() => handleClick(card.id)}>
                  <ItemCard
                    key={card.id}
                    itemName={card.itemName}
                    img={card.img}
                    itemPrice={card.itemPrice}
                    sellerName={card.sellerName}
                    location={card.itemName}
                  ></ItemCard>
                </div>
              );
            })
          )}
        </div>
      </div>
      {items.length > 0 && (
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
