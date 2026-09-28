import { orderData } from "../../../utils/orderSeed";
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
import { getOrder } from "@/services/orderService";
import type { Order } from "@/utils/orderSeed";
import { useNavigate } from "react-router-dom";
interface TableCardProps {
  search: string;
  setSearch?: (val: string) => void;
  activeFilter: string;
}

export default function OrdersTable({ search, activeFilter }: TableCardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("ORDERS STATE:", orders.length, orders);
  }, [orders]);
  const limit = 6;
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilter]);
  useEffect(() => {
    const fetchOrder = async () => {
      const response = await getOrder({
        search,
        limit,
        currentPage,
        activeFilter,
      });

      setOrders(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    };
    fetchOrder();
  }, [currentPage, search, activeFilter]);

  if (!orders.length) {
    return (
      <div className="py-6 w-full max-w-[1184px] mx-auto">
        <EmptyState
          placeholder="No orders yet"
          description="Explore our secure two-sided escrow marketplace and protect your transactions today."
          buttonLabel="Start browsing"
          buttonLink="/browse"
          img="assets/images/noOrderYet.png"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1184px] mx-auto">
      <div className="hidden md:block w-full rounded-md border border-outline-subtle bg-surface-default overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b border-outline-subtle bg-page-secondary">
              <th className="w-[14%] px-6 py-4 text-left text-[11px] font-semibold tracking-wider text-content-secondary uppercase">
                ORDER #
              </th>
              <th className="w-[36%] px-6 py-4 text-left text-[11px] font-semibold tracking-wider text-content-secondary uppercase">
                ITEM
              </th>
              <th className="w-[20%] px-6 py-4 text-left text-[11px] font-semibold tracking-wider text-content-secondary uppercase">
                SELLER
              </th>
              <th className="w-[14%] px-6 py-4 text-left text-[11px] font-semibold tracking-wider text-content-secondary uppercase">
                AMOUNT
              </th>
              <th className="w-[10%] px-6 py-4 text-left text-[11px] font-semibold tracking-wider text-content-secondary uppercase">
                STATUS
              </th>
              <th className="w-[6%] px-6 py-4 text-right text-[11px] font-semibold tracking-wider text-content-secondary uppercase">
                DATE
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((row) => (
              <tr
                key={row.id}
                className="border-b border-outline-subtle last:border-b-0 hover:bg-page-secondary/60 transition-colors"
                onClick={() => navigate(`/myorder/${row.id}`)}
              >
                <td className="px-6 py-3.5 align-middle font-jetbrains font-medium text-[13px] text-content-primary">
                  {formatOrderNumber(row)}
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
                  {formatPrice(row.totalPrice)}
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
                  {formatDate(row)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className=" md:hidden flex flex-col gap-3 w-full">
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
