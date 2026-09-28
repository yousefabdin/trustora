import { toast } from "sonner";
import clsx from "clsx";
import { Icon } from "@iconify/react";

export type ToastVariant = "success" | "error" | "info" | "escrow";

interface ToastProps {
  className?: string;
  variant: ToastVariant;
  message: string;
}

const toastConfig = {
  success: {
    icon: "mdi:success",
    backgroundColor:
      "bg-success-surface border border-success-outline rounded-md",
    text: "text-success-foreground text-[14px]",
    iconColor: "text-success-icon",
  },
  error: {
    icon: "wordpress:error",
    backgroundColor: "bg-danger-surface border border-danger-outline",
    text: "text-danger-foreground text-[14px]",
    iconColor: "text-danger-icon",
  },
  escrow: {
    icon: "mynaui:lock",
    backgroundColor: "bg-escrow-surface border border-escrow-outline",
    text: "text-escrow-foreground text-[14px]",
    iconColor: "text-escrow-icon",
  },
  info: {
    icon: "material-symbols:info-outline-rounded",
    backgroundColor: "bg-info-surface border border-info-outline",
    text: "text-info-foreground text-[14px]",
    iconColor: "text-info-icon",
  },
};

export const showToast = ({ variant, message, className }: ToastProps) => {
  const config = toastConfig[variant];

  toast.custom((id) => (
    <div className="w-[calc(100vw-32px)] md:w-100">
      <div
        className={clsx(
          "flex items-center justify-between rounded-lg border py-2 gap-4 shadow-lg px-3",
          config.backgroundColor,
          className,
        )}
      >
        <div className="flex items-center gap-3">
          <Icon
            icon={config.icon}
            className={clsx("h-5 w-5", config.iconColor)}
          />

          <span className={clsx("text-sm font-medium", config.text)}>
            {message}
          </span>
        </div>

        <button onClick={() => toast.dismiss(id)}>
          <Icon
            icon="solar:close-circle-bold"
            className={clsx("h-5 w-5", config.iconColor)}
          />
        </button>
      </div>
    </div>
  ));
};
