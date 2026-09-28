import { useState } from "react";
import clsx from "clsx";
import type { DropdownConfig } from "@/utils/dropDownData";

interface DropDownButtonProps {
  label?: string;
  dataDropDown: DropdownConfig;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const getMobileLabel = (label: string, id: string) => {
  if (id === "category-filter") {
    return label === "All Categories" ? "Category" : label;
  }
  if (id === "price-filter") {
    return label === "All Prices" || label === "Price Range" ? "Price" : label;
  }
  if (id === "sort-filter") {
    if (label === "Highest Value") return "High Value";
    if (label === "Lowest Value") return "Low Value";
    if (label === "Newest Arrivals") return "Newest";
    if (label === "Most Popular") return "Popular";
  }
  return label;
};

export default function DropDownButton({
  label,
  dataDropDown,
  value,
  onChange,
  className,
}: DropDownButtonProps) {
  const [internalValue, setInternalValue] = useState(
    dataDropDown.options[0]?.value || "",
  );

  const selectedValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const selectedOption =
    dataDropDown.options.find((opt) => opt.value === selectedValue) ||
    dataDropDown.options[0];

  const isSortBy = dataDropDown.id === "sort-filter";
  const isActive =
    isSortBy || (selectedValue !== "all" && selectedValue !== "");
  const mobileLabel = getMobileLabel(selectedOption.label, dataDropDown.id);

  return (
    <div className={clsx("relative inline-flex items-center", className)}>
      {label && (
        <label className="text-xs md:text-sm px-2 text-content-secondary">
          {label}
        </label>
      )}

      <select
        name={dataDropDown.id}
        id={dataDropDown.id}
        value={selectedValue}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 appearance-none text-[12px]"
      >
        {dataDropDown.options.map((option) => {
          const optionText = dataDropDown.placeholder
            ? `${dataDropDown.placeholder} ${option.label}`
            : option.label;
          return (
            <option key={option.value} value={option.value}>
              {optionText}
            </option>
          );
        })}
      </select>

      <div
        className={clsx(
          "flex items-center gap-1.5 md:gap-2",
          "rounded-full md:rounded-[6px]",
          "border py-[6px] px-[12px] md:py-[8px] md:px-[12px]",
          "transition-colors font-inter font-[500] text-[12px] md:text-[13px] leading-none tracking-normal",
          "md:border-page-tertiary md:bg-surface-default",
          "max-md:data-[active=true]:border-accent-default max-md:data-[active=true]:bg-page-secondary",
          "max-md:data-[active=false]:border-page-tertiary max-md:data-[active=false]:bg-surface-default",
        )}
        data-active={isActive}
      >
        <span className="hidden md:inline-flex items-center whitespace-nowrap">
          {dataDropDown.placeholder && (
            <span className="text-content-secondary font-[400] mr-1">
              {dataDropDown.placeholder}
            </span>
          )}
          <span
            className={clsx(
              isActive
                ? "text-accent-default font-[500]"
                : "text-page-inverse font-[400]",
            )}
          >
            {selectedOption.label}
          </span>
        </span>

        <span
          className={clsx(
            "md:hidden whitespace-nowrap font-[500]",
            isActive ? "text-accent-default" : "text-content-primary",
          )}
        >
          {mobileLabel}
        </span>

        <svg
          className={clsx(
            "w-3.5 h-3.5 md:w-4 md:h-4 pointer-events-none transition-colors",
            isActive ? "text-accent-default" : "text-content-secondary",
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
