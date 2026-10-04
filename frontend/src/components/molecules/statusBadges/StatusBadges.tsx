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
  | "Deliverd"
  | "Delivered"
  | "Escrow Pending"
  | "Refunded"
  | string;

interface StatusBadgesProps extends HTMLAttributes<HTMLDivElement> {
  icons?: Partial<Record<string, string>>;
  children: ReactNode;
  variant?: BadgeVariant;
}

const defaultIcons: Record<string, string> = {
  Shipped: "lucide:truck",
  Deliverd: "lucide:truck",
  Delivered: "lucide:truck",
  Escrow: "lucide:shield-check",
  "In Escrow": "lucide:shield-check",
  "Escrow Pending": "lucide:shield-check",
  Completed: "lucide:check-circle-2",
  Disputed: "lucide:alert-triangle",
  Pending: "lucide:clock",
  Refunded: "lucide:rotate-ccw",
};

const getBadgeStyles = (variant?: string) => {
  switch (variant) {
    case "In Escrow":
    case "Escrow":
    case "Escrow Pending":
      return {
        container: "border border-escrow-outline bg-escrow-surface text-escrow-foreground",
        icon: "text-escrow-icon",
        text: "text-escrow-foreground",
      };
    case "Shipped":
    case "Deliverd":
    case "Delivered":
      return {
        container: "border border-info-outline bg-info-surface text-info-foreground",
        icon: "text-info-outline",
        text: "text-info-foreground",
      };
    case "Completed":
      return {
        container: "border border-success-outline bg-success-surface text-success-foreground",
        icon: "text-success-icon",
        text: "text-success-foreground",
      };
    case "Disputed":
      return {
        container: "border border-danger-outline bg-danger-surface text-danger-foreground",
        icon: "text-danger-icon",
        text: "text-danger-foreground",
      };
    case "Pending":
    case "Refunded":
    default:
      return {
        container: "border border-outline-default bg-page-tertiary text-content-secondary",
        icon: "text-content-secondary",
        text: "text-content-secondary",
      };
  }
};

export default function StatusBadge({
  children,
  variant = "Shipped",
  icons = defaultIcons,
  className,
  ...props
}: StatusBadgesProps) {
  const iconName = icons[variant] || defaultIcons[variant] || "lucide:shield";
  const styles = getBadgeStyles(variant);

  return (
    <div
      {...props}
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-[600] leading-none",
        styles.container,
        className,
      )}
    >
      <Icon
        icon={iconName}
        className={clsx("w-3.5 h-3.5 shrink-0", styles.icon)}
      />

      <span className={styles.text}>
        {children}
      </span>
    </div>
  );
}
