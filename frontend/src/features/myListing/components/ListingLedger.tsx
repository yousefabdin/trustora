import SellerItemCard from "./SellerItemCard";
import type { MarketplaceListing } from "@/services/itemsServices";
import { formatOrderNumber } from "@/components/molecules/cards/OrderCard";
import type { User } from "@/types/auth";

interface ListingLedgerProps {
  currentPage: number;
  setTotalPages?: (pages: number) => void;
  setIsEditOpen: (open: boolean) => void;
  setSelectedListing: (item: any) => void;
  limit?: number;
  user?: User | null;
  items?: MarketplaceListing[];
  isLoading?: boolean;
  onOpenOffers?: (item: MarketplaceListing) => void;
}

export default function ListingLedger({
  currentPage,
  setIsEditOpen,
  setSelectedListing,
  limit = 8,
  items = [],
  isLoading = false,
  onOpenOffers,
}: ListingLedgerProps) {
  const onEdit = (listing: MarketplaceListing) => {
    setSelectedListing({
      id: listing.id,
      name: listing.itemName,
      description: listing.firstDescription,
      price: listing.itemPrice,
      category: listing.category,
      images:
        listing.images && listing.images.length > 0
          ? listing.images
          : listing.img
            ? [listing.img]
            : [],
      status: listing.status || "active",
    });
    setIsEditOpen(true);
  };
  if (isLoading) {
    return (
      <div className="py-12 text-center text-content-secondary">
        Loading your inventory...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-500">
        No listings found.
      </div>
    );
  }

  const start = (currentPage - 1) * limit;
  const paginatedItems = items.slice(start, start + limit);
  console.log("Listing item", items);
  return (
    <div className="flex flex-col gap-[12px]">
      {paginatedItems.map((item) => {
        return (
          <SellerItemCard
            key={item.id}
            id={formatOrderNumber(item.id)}
            title={item.itemName}
            image={item.img}
            price={item.itemPrice}
            views={12}
            offersCount={item.offersCount ?? 0}
            status={item.status || "active"}
            onEdit={() => onEdit(item)}
            onViewOffers={() => onOpenOffers?.(item)}
          ></SellerItemCard>
        );
      })}
    </div>
  );
}
