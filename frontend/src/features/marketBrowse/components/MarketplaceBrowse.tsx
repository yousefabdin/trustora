import FilterSection from "./FilterSection";
import ItemsCardSection from "./ItemsCardSection";
import { useState, useMemo, useEffect } from "react";
import { useMarketplaceListings } from "@/services/itemsServices";

export default function MarketplaceBrowse() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("price-high-low");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const priceBounds = useMemo(() => {
    if (priceRange === "0-50") return { minPrice: 0, maxPrice: 5000 };
    if (priceRange === "50-150") return { minPrice: 5000, maxPrice: 15000 };
    if (priceRange === "150-300") return { minPrice: 15000, maxPrice: 30000 };
    if (priceRange === "300-above") return { minPrice: 30000 };
    return {};
  }, [priceRange]);

  const queryParams = useMemo(() => {
    return {
      search: debouncedSearch.trim() || undefined,
      category: category !== "all" ? category : undefined,
      minPrice: priceBounds.minPrice,
      maxPrice: priceBounds.maxPrice,
      sortBy,
    };
  }, [debouncedSearch, category, priceBounds, sortBy]);

  const { data: listings = [], isLoading, error } = useMarketplaceListings(queryParams);

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCategory("all");
    setPriceRange("all");
    setSortBy("price-high-low");
  };

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
    return (
      <ItemsCardSection
        search={debouncedSearch}
        items={listings}
        onClearFilters={handleClearFilters}
      />
    );
  };

  return (
    <div>
      <FilterSection
        search={search}
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
