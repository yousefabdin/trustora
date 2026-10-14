import FilterSection from "./FilterSection";
import ItemsCardSection from "./ItemsCardSection";
import { useState, useMemo } from "react";
import { useMarketplaceListings } from "@/services/itemsServices";

export default function MarketplaceBrowse() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("price-high-low");

  const { data: listings = [], isLoading, error } = useMarketplaceListings();
  const filteredItems = useMemo(() => {
    return listings
      .filter((item) => {
        if (
          search &&
          !item.itemName.toLowerCase().includes(search.toLowerCase()) &&
          !item.category.toLowerCase().includes(search.toLowerCase())
        ) {
          return false;
        }
        if (category && category !== "all") {
          const itemCat = item.category.toLowerCase();
          const selCat = category.toLowerCase();
          if (!itemCat.includes(selCat)) {
            return false;
          }
        }
        if (priceRange && priceRange !== "all") {
          const price = item.itemPrice;
          if (priceRange === "0-50" && price > 50) return false;
          if (priceRange === "50-150" && (price < 50 || price > 150))
            return false;
          if (priceRange === "150-300" && (price < 150 || price > 300))
            return false;
          if (priceRange === "300-above" && price < 300) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-high-low") return b.itemPrice - a.itemPrice;
        if (sortBy === "price-low-high") return a.itemPrice - b.itemPrice;
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        return 0;
      });
  }, [listings, search, category, priceRange, sortBy]);
  const renderScreenData = () => {
    if (isLoading) {
      return (
        <div className="py-20 text-center text-content-secondary font-medium">
          Loading marketplace catalog...
        </div>
      );
    }
    if (error) {
      return (
        <div className="py-20 text-center text-danger-icon font-medium">
          Failed to load listings. Please check if the backend is running.
        </div>
      );
    }
    return <ItemsCardSection search={search} items={filteredItems} />;
  };
  return (
    <div>
      <FilterSection
        setSearch={setSearch}
        category={category}
        onCategoryChange={setCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />
      {renderScreenData()}
    </div>
  );
}
