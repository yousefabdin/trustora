import { Icon } from "@iconify/react";
import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export type BadgeVariant =
  | "Pending"
  | "Completed"
  | "Shipped"
  | "Escrow"
  | "Disputed"
  | "In Escrow"
  | "Deliverd";

interface StatusBadgesProps extends HTMLAttributes<HTMLDivElement> {
  icons?: Partial<Record<BadgeVariant, string>>;
  children: ReactNode;
  variant?: BadgeVariant;
}

const defaultIcons: Record<BadgeVariant, string> = {
  Shipped: "lucide:truck",
  Deliverd: "lucide:truck",

  Escrow: "lucide:shield-check",
  "In Escrow": "lucide:shield-check",
  Completed: "lucide:check-circle-2",
  Disputed: "lucide:alert-triangle",
  Pending: "lucide:clock",
};

export default function StatusBadge({
  children,
  variant = "Shipped",
  icons = defaultIcons,
  className,
  ...props
}: StatusBadgesProps) {
  const iconName = icons[variant] || defaultIcons[variant];

  return (
    <div
      {...props}
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-[600] leading-none",
        {
          "bg-info-surface text-info-surface":
            variant === "Shipped" || "Deliverd",
          "border-escrow-surface bg-escrow-surface text-escrow-foreground":
            variant === "In Escrow",
          "bg-success-surface": variant === "Completed",
          "bg-danger-surface!": variant === "Disputed",
          "bg-outline-default": variant === "Pending",
        },
        className,
      )}
    >
      <Icon
        icon={iconName}
        className={clsx("w-3.5 h-3.5 shrink-0", {
          "text-content-secondary": variant === "Pending",
          "text-escrow-icon": variant === "Escrow",
          "text-success-icon": variant === "Completed",
          "text-danger-icon!": variant === "Disputed",
          "text-info-outline": variant === "Shipped" || "Deliverd",
        })}
      />

      <span
        className={clsx({
          "text-content-secondary": variant === "Pending",
          "text-escrow-icon": variant === "Escrow",
          "text-success-icon": variant === "Completed",
          "text-danger-icon!": variant === "Disputed",
          "text-info-outline": variant === "Shipped" || "Deliverd",
        })}
      >
        {children}
      </span>
    </div>
  );
}
