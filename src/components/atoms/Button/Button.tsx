import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "small" | "medium" | "large";
  loading?: boolean;
}

function Button({
  children,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={clsx(
        "inline-flex items-center justify-center",
        "rounded-sm",
        "font-medium",
        "transition-colors duration-150",
        "focus:outline-none",
        "disabled:cursor-not-allowed",

        {
          "h-9 px-4 text-sm": size === "small",
          "h-10 px-5 text-sm": size === "medium",
          "h-11 px-6 text-base": size === "large",
        },

        {
          "bg-[#4F46E5] text-white hover:bg-[#4338CA] active:bg-[#3730A3] disabled:bg-[#4F46E5]":
            variant === "primary",

          "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 active:bg-gray-200 disabled:bg-white disabled:text-gray-400":
            variant === "secondary",

          "bg-transparent text-[#4F46E5] hover:bg-[#EEF2FF] active:bg-[#E0E7FF] disabled:text-gray-400":
            variant === "ghost",

          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300":
            variant === "destructive",
        },

        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
