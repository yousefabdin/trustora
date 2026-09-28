import FilterSection from "./FilterSection";
import ItemsCardSection from "./ItemsCardSection";
import { useState, useMemo } from "react";
import { marketplaceListings } from "@/utils/ItemsSeed";

export default function MarketplaceBrowse() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("price-high-low");

  const filteredItems = useMemo(() => {
    return marketplaceListings
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
          if (selCat === "electronics") {
            if (
              !itemCat.includes("electronic") &&
              !itemCat.includes("photo") &&
              !itemCat.includes("camera") &&
              !itemCat.includes("audio") &&
              !itemCat.includes("tech") &&
              !itemCat.includes("headphone")
            ) {
              return false;
            }
          } else if (selCat === "fashion") {
            if (
              !itemCat.includes("fashion") &&
              !itemCat.includes("footwear") &&
              !itemCat.includes("accessories") &&
              !itemCat.includes("bag") &&
              !itemCat.includes("sneaker") &&
              !itemCat.includes("watch") &&
              !itemCat.includes("wallet")
            ) {
              return false;
            }
          } else if (selCat === "home") {
            if (
              !itemCat.includes("home") &&
              !itemCat.includes("furniture") &&
              !itemCat.includes("decor") &&
              !itemCat.includes("kitchen") &&
              !itemCat.includes("garden") &&
              !itemCat.includes("office") &&
              !itemCat.includes("lamp") &&
              !itemCat.includes("chair")
            ) {
              return false;
            }
          } else if (selCat === "collectibles") {
            if (!itemCat.includes("collectible") && !itemCat.includes("art")) {
              return false;
            }
          } else if (selCat === "instruments") {
            if (
              !itemCat.includes("instrument") &&
              !itemCat.includes("music") &&
              !itemCat.includes("guitar") &&
              !itemCat.includes("vinyl")
            ) {
              return false;
            }
          } else if (!itemCat.includes(selCat)) {
            return false;
          }
        }

        if (priceRange && priceRange !== "all") {
          const price = item.itemPrice;
          if (priceRange === "0-50" && price > 50) return false;
          if (priceRange === "50-150" && (price < 50 || price > 150)) return false;
          if (priceRange === "150-300" && (price < 150 || price > 300)) return false;
          if (priceRange === "300-above" && price < 300) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-high-low") {
          return b.itemPrice - a.itemPrice;
        }
        if (sortBy === "price-low-high") {
          return a.itemPrice - b.itemPrice;
        }
        if (sortBy === "popular") {
          return b.rating - a.rating;
        }
        if (sortBy === "newest") {
          return b.id - a.id;
        }
        return 0;
      });
  }, [search, category, priceRange, sortBy]);

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
      <ItemsCardSection search={search} items={filteredItems} />
    </div>
  );
}
