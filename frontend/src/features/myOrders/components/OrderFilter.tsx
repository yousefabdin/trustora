import SearchInput from "@/components/molecules/inputs/SearchInput";

interface OrderFilterProps {
  setSearch: (search: string) => void;
  setActiveFilter: (filter: string) => void;
  activeFilter: string;
}

export default function OrderFilter({
  setSearch,
  setActiveFilter,
  activeFilter,
}: OrderFilterProps) {
  const filters = ["All", "In Escrow", "Shipped", "Completed", "Disputed"];

  return (
    <div className="w-full mb-6">
      <div className="hidden sm:flex items-center justify-between border-b border-outline-subtle">
        <div className="flex items-center gap-8">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`relative pb-3 text-[14px] cursor-pointer transition-colors ${
                  isActive
                    ? "font-semibold text-content-primary"
                    : "font-medium text-content-secondary hover:text-content-primary"
                }`}
              >
                <span>{filter}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-default rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        <div className="pb-2">
          <SearchInput
            setSearch={setSearch}
            className="bg-surface-default w-[240px]"
            placeholder="Search orders..."
          />
        </div>
      </div>

      <div className="flex sm:hidden flex-col gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] transition-all cursor-pointer ${
                  isActive
                    ? "bg-accent-default text-content-inverse font-semibold shadow-2xs"
                    : "bg-surface-default text-content-secondary hover:text-content-primary border border-outline-default font-medium"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="w-full">
          <SearchInput
            setSearch={setSearch}
            className="bg-surface-default w-full"
            placeholder="Search orders..."
          />
        </div>
      </div>
    </div>
  );
}
