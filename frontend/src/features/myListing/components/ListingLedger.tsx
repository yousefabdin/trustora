import { getListing } from "@/services/Listingservice";

import SellerItemCard from "./SellerItemCard";
import { useEffect, useState } from "react";

export default function ListingLedger({
  sellerItems,
  currentPage,
  setTotalPages,
  setIsEditOpen,
  setModal,
  limit,
  setSelectedListing,
  user,
}) {
  const [items, setItems] = useState<typeof sellerItems>([]);
  const onEdit = (listing) => {
    setSelectedListing(listing);
    setIsEditOpen(true);
  };
  useEffect(() => {
    const fetchItems = async () => {
      if (!user?.id) return;

      const response = await getListing({
        currentPage,
        limit,
        sellerId: user.id,
      });
      setItems(response.data);
      setTotalPages(response.totalPages);
    };
    fetchItems();
  }, [currentPage, limit, user?.id]);
  return (
    <div className="flex flex-col gap-[12px]">
      {items.map((item) => {
        return (
          <SellerItemCard
            key={item.id}
            id={item.id}
            title={item.name}
            image={item.images?.[0] ?? ""}
            price={item.price}
            views={item.views}
            status={item.status}
            onEdit={() => onEdit(item)}
          ></SellerItemCard>
        );
      })}
    </div>
  );
}
