import ListingLedger from "./ListingLedger";
import ListingHeader from "./Listingheader";
import ListingFooter from "./ListingFooter";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import ListingForm from "./ListingForm";
import { getSellerListings } from "@/services/ListingService";
import type { MarketplaceListing } from "@/services/itemsServices";

interface ListingContentProps {
  onFormOpenChange?: (isOpen: boolean) => void;
}

export default function ListingContent({
  onFormOpenChange,
}: ListingContentProps = {}) {
  const { user } = useAuth();
  const [items, setItems] = useState<MarketplaceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "sold" | "draft">("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const limit = 8;
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const data = await getSellerListings(user.id);
      setItems(data);
    } catch (err) {
      console.error("Failed to load seller listings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems, refreshKey]);

  useEffect(() => {
    onFormOpenChange?.(modal || isEditOpen);
  }, [modal, isEditOpen, onFormOpenChange]);

  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true;
    return (item.status || "active").toLowerCase() === activeTab;
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / limit));

  const handleTabChange = (tab: "all" | "active" | "sold" | "draft") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col gap-[20px] md:gap-[32px] px-4 py-4 md:px-[90px] md:py-[48px] bg-page-secondary min-h-screen">
      {isEditOpen && selectedListing && (
        <ListingForm
          mode="edit"
          selectedListing={selectedListing}
          setModal={setIsEditOpen}
          user={user}
          onSuccess={handleRefresh}
        />
      )}
      {modal && (
        <ListingForm
          setModal={setModal}
          mode="create"
          user={user}
          onSuccess={handleRefresh}
        />
      )}
      {!modal && !isEditOpen && (
        <>
          <ListingHeader
            sellerItems={items}
            setModal={setModal}
            modal={modal}
            user={user}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <ListingLedger
            setIsEditOpen={setIsEditOpen}
            currentPage={currentPage}
            limit={limit}
            items={filteredItems}
            isLoading={isLoading}
            setSelectedListing={setSelectedListing}
            user={user}
          />
          {filteredItems.length > 0 && (
            <ListingFooter
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              sellerItems={filteredItems}
              totalPages={totalPages}
              limit={Math.min(limit, filteredItems.length)}
            />
          )}
        </>
      )}
    </div>
  );
}
