export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownConfig {
  id: string;
  placeholder?: string;
  defaultLabel: string;
  options: DropdownOption[];
}

export const categoryDropdownData: DropdownConfig = {
  id: "category-filter",
  defaultLabel: "All Categories",
  options: [
    { label: "All Categories", value: "all" },
    { label: "Electronics", value: "electronics" },
    { label: "Fashion & Apparel", value: "fashion" },
    { label: "Home & Living", value: "home" },
    { label: "Collectibles & Art", value: "collectibles" },
    { label: "Musical Instruments", value: "instruments" },
  ],
};

export const priceRangeDropdownData: DropdownConfig = {
  id: "price-filter",
  defaultLabel: "Price Range",
  options: [
    { label: "All Prices", value: "all" },
    { label: "Under $50", value: "0-50" },
    { label: "$50 to $150", value: "50-150" },
    { label: "$150 to $300", value: "150-300" },
    { label: "$300+", value: "300-above" },
  ],
};

export const sortByDropdownData: DropdownConfig = {
  id: "sort-filter",
  placeholder: "Sort by:",
  defaultLabel: "Highest Value",
  options: [
    { label: "Highest Value", value: "price-high-low" },
    { label: "Lowest Value", value: "price-low-high" },
    { label: "Newest Arrivals", value: "newest" },
    { label: "Most Popular", value: "popular" },
  ],
};
