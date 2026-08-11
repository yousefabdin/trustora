import { Icon } from "@iconify/react";
import type { HTMLAttributes } from "react";
import clsx from "clsx";

interface StatusBadgesProps extends HTMLAttributes<HTMLDivElement> {
  icons: React.ReactNode;
  children: React.ReactNode;
  variant:
    | "Pending"
    | "PaidHeld"
    | "Shipped"
    | "Delivered"
    | "Released"
    | "Disputed"
    | "Refunded";
}
const icons = {
  Pending: (
    <Icon
      icon="mingcute:time-line"
      className="w-3 h-3 text-[#1E40AF] [&>path]:stroke-[4px]"
    ></Icon>
  ),
  PaidHeld: (
    <Icon
      icon="boxicons:lock"
      className="w-3 h-3 text-[#92400E] [&>path]:stroke-[4px]"
    ></Icon>
  ),
  Shipped: (
    <Icon icon="lucide:van" className="w-3 h-3 text-[#92400E] border-2"></Icon>
  ),
  Released: (
    <Icon
      icon="ix:success"
      className="w-3 h-3 text-[#166534] [&>path]:stroke-[4px]"
    ></Icon>
  ),
  Delivered: (
    <Icon
      icon="solar:box-linear"
      className="w-3 h-3 text-[#92400E] [&>path]:stroke-[4px]"
    ></Icon>
  ),
  Disputed: (
    <Icon
      icon="material-symbols:warning-outline-rounded"
      className="w-3 h-3 text-[#991B1B] [&>path]:stroke-[4px]"
    ></Icon>
  ),
  Refunded: (
    <Icon
      icon="meteor-icons:move-left"
      className="w-2.5 h-2.5 text-[#1F2937] [&>path]:stroke-[4px]"
    ></Icon>
  ),
};

export default function StatusBadge({
  children,
  variant = "Shipped",
  className,
}: StatusBadgesProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium leading-none",
        {
          " border-blue-200 bg-blue-50 #1E40AF text-[#92400E]":
            variant === "Pending",
          " border-[#FDE68A] bg-[#FFFBEB] text-red-200":
            variant === "PaidHeld" ||
            variant === "Shipped" ||
            variant === "Delivered",
          " border-[#BBF7D0] bg-[#F0FDF4] ": variant === "Released",
          " border-[#FECACA] bg-[#FEF2F2]": variant === "Disputed",
          " border-[#E5E7EB] bg-[#F9FAFB]": variant === "Refunded",
        },
        className,
      )}
    >
      {icons[variant]}

      <span
        className={clsx({
          " border-blue-200 bg-blue-50 #1E40AF text-[#1E40AF] text-center":
            variant === "Pending",
          " border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]":
            variant === "PaidHeld" ||
            variant === "Shipped" ||
            variant === "Delivered",
          " border-[#BBF7D0] bg-[#F0FDF4] text-[#166534] ":
            variant === "Released",
          " border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]":
            variant === "Disputed",
          " border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]":
            variant === "Refunded",
        })}
      >
        {variant}
      </span>
    </div>
  );
}
