import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Typography from "@/components/atoms/typography/typography";
import StatusBadge from "@/components/molecules/statusBadges/StatusBadges";
import { Icon } from "@iconify/react";
import { orderData, type Order } from "@/utils/orderSeed";
import { formatOrderNumber, formatPrice, formatDate } from "@/components/molecules/cards/OrderCard";

interface RecentOrdersCardProps {
  limit?: number;
}

export default function RecentOrdersCard({ limit = 3 }: RecentOrdersCardProps) {
  const navigate = useNavigate();
  const recentOrders = orderData.slice(0, limit);

  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-outline-subtle">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:shopping-bag" className="w-4.5 h-4.5 text-accent-default" />
          <Typography
            variant="h3"
            className="text-[16px] font-bold text-content-primary leading-tight"
          >
            Recent Orders
          </Typography>
        </div>

        <Link
          to="/myorders"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-content-link hover:underline"
        >
          View all
          <Icon icon="lucide:arrow-right" className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recentOrders.length === 0 ? (
        <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
          <Icon icon="lucide:package-open" className="w-8 h-8 text-content-tertiary" />
          <span className="text-[14px] text-content-secondary">
            No marketplace orders yet.
          </span>
          <Link
            to="/browse"
            className="text-[13px] text-accent-default font-semibold hover:underline mt-1"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-outline-subtle">
          {recentOrders.map((order: Order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/myorder/${order.id}`)}
              className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group cursor-pointer hover:bg-page-secondary/50 -mx-2 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={order.itemImg}
                  alt={order.itemName}
                  className="w-12 h-12 rounded-lg object-cover border border-outline-subtle shrink-0 group-hover:border-outline-strong transition-colors"
                />

                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-semibold text-content-primary leading-tight truncate group-hover:text-accent-default transition-colors">
                    {order.itemName}
                  </span>
                  <div className="flex items-center gap-2 text-[12px] text-content-tertiary mt-1">
                    <span className="font-jetbrains text-content-secondary">
                      {formatOrderNumber(order)}
                    </span>
                    <span>·</span>
                    <span>{formatDate(order)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                <span className="font-jetbrains font-bold text-[14px] text-content-primary">
                  {formatPrice(order.totalPrice)}
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
