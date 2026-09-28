import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import { Link } from "react-router";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  to?: string;
}

function Button({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled,
  className,
  formId,
  formType,
  to,
  onClick,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={formType}
      form={formId}
      onClick={onClick}
      disabled={isDisabled}
      className={clsx(
        "inline-flex items-center justify-center px-4",
        "rounded-sm",
        "font-small font-inter",
        "transition-colors duration-150",
        "focus:outline-none",
        "disabled:cursor-not-allowed",
        "disabled:bg-neutral-200 disabled:text-neutral-400",

        {
          "min-h-[32px] min-w-[69px] px-3 text-[14px]": size === "small",
          "min-h-[32px] min-w-[69px] min-w-[110px] px-4 text-[14px]":
            size === "medium",
          "h-10 min-w-[93px] px-5 text-[14px]": size === "large",
        },
        {
          "bg-accent-default text-content-inverse hover:bg-accent-hover active:bg-indigo-800 ":
            variant === "primary",

          "border border-accent-default bg-surface-default text-accent-default hover:bg-page-secondary active:bg-neutral-200 disabled:border-0 ":
            variant === "secondary",

          "bg-transparent text-accent-default hover:bg-accent-subtle active:bg-indigo-100 ":
            variant === "ghost",

          "bg-danger-icon text-content-inverse hover:bg-red-700 active:bg-danger-foreground":
            variant === "destructive",
        },

        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4s w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
