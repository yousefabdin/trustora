import EmptyState from "@/components/organisms/EmptyState";
import OrderCard, {
  getStatusBadgeClass,
  formatOrderNumber,
  formatPrice,
  formatDate,
  formatSeller,
} from "@/components/molecules/cards/OrderCard";
import OrderPagination from "./OrderPagination";
import { useEffect, useState } from "react";
import { useGetOrderslisting } from "@/services/orderService";
import { useNavigate } from "react-router-dom";
interface TableCardProps {
  search: string;
  setSearch?: (val: string) => void;
  activeFilter: string;
  setActiveFilter?: (val: string) => void;
}

export default function OrdersTable({
  search,
  setSearch,
  activeFilter,
  setActiveFilter,
}: TableCardProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const navigate = useNavigate();
  const limit = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeFilter]);

  const { data: paginatedData, isLoading } = useGetOrderslisting({
    role: "buyer",
    search: debouncedSearch,
    status: activeFilter,
    page: currentPage,
    limit,
  });

  const orders = paginatedData?.data || [];
  const total = paginatedData?.total || 0;
  const totalPages = paginatedData?.totalPages || 1;

  if (isLoading) {
    return <div className="py-12 text-center text-content-secondary">Loading orders...</div>;
  }

  if (!orders.length) {
    const isFiltered = Boolean(debouncedSearch.trim() || (activeFilter && activeFilter !== "All"));
    return (
      <div className="py-6 w-full max-w-[1184px] mx-auto">
        <EmptyState
          placeholder={isFiltered ? "No orders found" : "No orders yet"}
          description={
            isFiltered
              ? "We couldn't find any orders matching your criteria. Try adjusting your search or filters."
              : "Explore our secure two-sided escrow marketplace and protect your transactions today."
          }
          buttonLabel={isFiltered ? "Clear filters" : "Start browsing"}
          buttonLink={isFiltered ? undefined : "/browse"}
          onAction={
            isFiltered
              ? () => {
                  setSearch?.("");
                  setActiveFilter?.("All");
                }
              : undefined
          }
          img="assets/images/noOrderYet.png"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1184px] mx-auto">
      <div className="hidden md:block w-full rounded-md border border-outline-subtle bg-surface-default overflow-x-auto">
        <table className="w-full min-w-[760px] table-fixed border-collapse">
          <thead>
            <tr className="border-b border-outline-subtle bg-page-secondary">
              <th className="w-[14%] px-6 py-4 text-left text-[11px] font-semibold tracking-wider text-content-secondary uppercase">
                ORDER #
              </th>
              <th className="w-[28%] px-6 py-4 text-left text-[11px] font-semibold tracking-wider text-content-secondary uppercase">
                ITEM
              </th>
              <th className="w-[16%] px-6 py-4 text-left text-[11px] font-semibold tracking-wider text-content-secondary uppercase">
                SELLER
              </th>
              <th className="w-[13%] px-6 py-4 text-left text-[11px] font-semibold tracking-wider text-content-secondary uppercase">
                AMOUNT
              </th>
              <th className="w-[14%] px-6 py-4 text-left text-[11px] font-semibold tracking-wider text-content-secondary uppercase">
                STATUS
              </th>
              <th className="w-[15%] px-6 py-4 text-right text-[11px] font-semibold tracking-wider text-content-secondary uppercase">
                DATE
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((row) => (
              <tr
                key={row.id}
                className="border-b border-outline-subtle last:border-b-0 hover:bg-page-secondary/60 transition-colors cursor-pointer"
                onClick={() => navigate(`/myorder/${row.id}`)}
              >
                <td className="px-6 py-3.5 align-middle font-jetbrains font-medium text-[13px] text-content-primary">
                  {formatOrderNumber(row.id)}
                </td>

                <td className="px-6 py-3.5 align-middle">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={row.itemImg}
                      alt={row.itemName}
                      className="h-10 w-10 rounded-md object-cover border border-outline-subtle shrink-0"
                    />
                    <span className="font-inter font-semibold text-[14px] text-content-primary truncate">
                      {row.itemName}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-3.5 align-middle font-inter text-[13px] text-content-secondary truncate">
                  {formatSeller(row.sellerName)}
                </td>

                <td className="px-6 py-3.5 align-middle font-jetbrains font-bold text-[14px] text-content-primary">
                  {formatPrice(row.itemPrice)}
                </td>

                <td className="px-6 py-3.5 align-middle">
                  <span
                    className={`inline-block rounded px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-nowrap ${getStatusBadgeClass(
                      row.status,
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>

                <td className="px-6 py-3.5 align-middle text-right font-inter text-[13px] text-content-secondary whitespace-nowrap">
                  {formatDate(row.createdAt || row.orderDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-3 w-full">
        {orders.map((row) => (
          <OrderCard key={row.id} order={row} />
        ))}
      </div>

      <OrderPagination
        page={currentPage}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
