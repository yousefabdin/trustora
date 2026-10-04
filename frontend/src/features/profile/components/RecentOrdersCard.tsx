import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Typography from "@/components/atoms/typography/typography";
import StatusBadge from "@/components/molecules/statusBadges/StatusBadges";
import { Icon } from "@iconify/react";
import { orderData, type Order } from "@/utils/orderSeed";
import { formatOrderNumber, formatPrice, formatDate } from "@/components/molecules/cards/OrderCard";
import type { UserRole } from "@/types/auth";

interface RecentOrdersCardProps {
  title?: string;
  subtitle?: string;
  orders?: Order[];
  viewAllLink?: string;
  viewAllLabel?: string;
  role?: UserRole;
}

export default function RecentOrdersCard({
  title = "Recent Orders",
  subtitle = "Items you've purchased",
  orders = orderData.slice(0, 4),
  viewAllLink = "/myorders",
  viewAllLabel = "View all",
  role = "user",
}: RecentOrdersCardProps) {
  const navigate = useNavigate();

  const getCardIcon = () => {
    switch (role) {
      case "seller":
        return "lucide:receipt";
      case "admin":
        return "lucide:scale";
      case "user":
      default:
        return "lucide:shopping-bag";
    }
  };

  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-xl p-4 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-outline-subtle flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-accent-surface text-accent-default">
            <Icon icon={getCardIcon()} className="w-4 h-4" />
          </div>
          <div>
            <Typography
              variant="h3"
              className="text-[15px] sm:text-[16px] font-bold text-content-primary leading-tight"
            >
              {title}
            </Typography>
            <span className="text-[11px] text-content-tertiary">
              {subtitle}
            </span>
          </div>
        </div>

        <Link
          to={viewAllLink}
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-content-link hover:underline shrink-0"
        >
          {viewAllLabel}
          <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
          <Icon icon="lucide:package-open" className="w-8 h-8 text-content-tertiary" />
          <span className="text-[14px] text-content-secondary">
            No orders found for this account.
          </span>
          <Link
            to={viewAllLink}
            className="text-[13px] text-accent-default font-semibold hover:underline mt-1"
          >
            {viewAllLabel}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-outline-subtle">
          {orders.map((order: Order) => (
            <div
              key={order.id}
              onClick={() => {
                if (role === "admin" && (order.status === "Disputed" || order.disputeReason)) {
                  navigate("/admin/disputes");
                } else {
                  navigate(`/myorder/${order.id}`);
                }
              }}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group cursor-pointer hover:bg-page-secondary/50 -mx-1 sm:-mx-2 px-1 sm:px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <img
                  src={order.itemImg}
                  alt={order.itemName}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg object-cover border border-outline-subtle shrink-0 group-hover:border-outline-strong transition-colors"
                />

                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[13px] sm:text-[14px] font-semibold text-content-primary leading-tight truncate group-hover:text-accent-default transition-colors">
                    {order.itemName}
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[12px] text-content-tertiary mt-1 flex-wrap">
                    <span className="font-jetbrains text-content-secondary">
                      {formatOrderNumber(order.orderNumber || order.id)}
                    </span>
                    <span>·</span>
                    <span>{formatDate(order.orderDate || order.createdAt || "")}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="font-jetbrains font-bold text-[13px] sm:text-[14px] text-content-primary">
                  {formatPrice(order.totalPrice || order.itemPrice || 0)}
                </span>
                <StatusBadge variant={order.status}>
                  {order.status}
                </StatusBadge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
