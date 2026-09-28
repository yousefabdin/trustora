import type { Order, OrderStatus } from "@/utils/orderSeed";
import { useNavigate } from "react-router";
interface OrderCardProps {
  order: Order;
  onClick?: () => void;
}

export const getStatusBadgeClass = (status: OrderStatus) => {
  switch (status) {
    case "In Escrow":
      return "bg-escrow-surface text-escrow-foreground border border-escrow-outline";
    case "Shipped":
      return "bg-info-surface text-info-foreground border border-info-outline";
    case "Completed":
      return "bg-success-surface text-success-foreground border border-success-outline";
    case "Disputed":
      return "bg-danger-surface text-danger-foreground border border-danger-outline";
    case "Refunded":
      return "bg-page-secondary text-content-secondary border border-outline-default";
    case "Escrow Pending":
    default:
      return "bg-escrow-surface text-escrow-foreground border border-escrow-outline";
  }
};

export const formatOrderNumber = (order: Order) => {
  if (order.orderNumber) return order.orderNumber;
  return `#HLD-${order.id.slice(0, 4).toUpperCase()}`;
};

export const formatPrice = (price: number) => {
  return `$${price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDate = (order: Order) => {
  if (order.displayDate) return order.displayDate;
  if (!order.orderDate) return "";

  const rawDate =
    typeof order.orderDate === "object" &&
    order.orderDate !== null &&
    "orderDate" in order.orderDate
      ? (order.orderDate as { orderDate: string }).orderDate
      : order.orderDate;

  const date = new Date(String(rawDate));
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatSeller = (seller: string) => {
  if (seller.startsWith("@")) return seller;
  return `@${seller.toLowerCase().replace(/\s+/g, "_")}`;
};

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/myorder/${order.id}`)}
      className="w-full bg-surface-default rounded-lg border border-outline-subtle p-4 shadow-2xs transition-shadow hover:shadow-xs cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-jetbrains text-[12px] text-content-tertiary">
          {formatOrderNumber(order)}
        </span>
        <span className="font-inter text-[12px] text-content-tertiary">
          {formatDate(order)}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3.5">
        <img
          src={order.itemImg}
          alt={order.itemName}
          className="w-12 h-12 rounded-md object-cover border border-outline-subtle shrink-0"
        />
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="font-inter font-semibold text-[14px] text-content-primary leading-snug truncate">
            {order.itemName}
          </h3>
          <span className="font-inter text-[12px] text-content-tertiary mt-0.5 truncate">
            Seller: {formatSeller(order.sellerName)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="font-jetbrains font-bold text-[15px] text-content-primary">
          {formatPrice(order.totalPrice)}
        </span>
        <span
          className={`inline-block rounded px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${getStatusBadgeClass(
            order.status,
          )}`}
        >
          {order.status}
        </span>
      </div>
    </div>
  );
}
