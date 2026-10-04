import clsx from "clsx";
import DropDownButton from "@/components/molecules/inputs/DropDownButton";
import SearchInput from "@/components/molecules/inputs/SearchInput";
import {
  categoryDropdownData,
  priceRangeDropdownData,
  sortByDropdownData,
} from "@/utils/dropDownData";

interface FilterSectionProps {
  search?: string;
  setSearch?: (search: string) => void;
  className?: string;
  category?: string;
  onCategoryChange?: (value: string) => void;
  priceRange?: string;
  onPriceRangeChange?: (value: string) => void;
  sortBy?: string;
  onSortByChange?: (value: string) => void;
}

export default function FilterSection({
  search,
  setSearch,
  className,
  category,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortByChange,
}: FilterSectionProps) {
  return (
    <div
      className={clsx(
        "w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-[12px] p-[16px] md:px-[40px] md:py-[16px] border-b border-page-tertiary",
        className,
      )}
    >
      <div className="w-full md:w-auto">
        <SearchInput
          value={search}
          setSearch={setSearch}
          className="w-full bg-[#F5F5F4]"
        />
      </div>
      <div className="w-full md:w-auto flex flex-wrap items-center justify-start gap-2 sm:gap-2.5 md:gap-4">
        <DropDownButton
          dataDropDown={priceRangeDropdownData}
          value={priceRange}
          onChange={onPriceRangeChange}
        />
        <DropDownButton
          dataDropDown={categoryDropdownData}
          value={category}
          onChange={onCategoryChange}
        />
        <DropDownButton
          dataDropDown={sortByDropdownData}
          value={sortBy}
          onChange={onSortByChange}
        />
      </div>
    </div>
  );
}
