import Typography from "@/components/atoms/typography/typography";
import OrderFilter from "./OrderFilter";
import OrderPagination from "./OrderPagination";
import OrdersTable from "./TableCard";
import { useState } from "react";

export default function OrdersSection() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="flex flex-col w-full max-w-[1184px] mx-auto px-4 sm:px-6 md:px-0 pt-6 sm:pt-10 pb-16">
      <Typography
        variant="h2"
        className="text-[20px] sm:text-[24px] font-bold text-content-primary mb-1"
      >
        My Orders
      </Typography>

      <OrderFilter
        setSearch={setSearch}
        setActiveFilter={setActiveFilter}
        activeFilter={activeFilter}
      />

      <OrdersTable
        setSearch={setSearch}
        search={search}
        activeFilter={activeFilter}
      />
    </div>
  );
}
