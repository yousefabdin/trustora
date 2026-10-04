import { Icon } from "@iconify/react";
import Button from "../atoms/Button/Button";
import { Link } from "react-router";
interface EmptyStateProps {
  placeholder: string;
  description: string;
  buttonLabel: string;
  buttonLink?: string;
  onAction?: () => void;
  img?: string;
}
export default function EmptyState({
  placeholder,
  description,
  buttonLabel,
  buttonLink = "#",
  onAction,
  img,
}: EmptyStateProps) {
  return (
    <div className="w-full h-full min-h-[320px] flex flex-col items-center justify-center gap-6 rounded-xl border border-outline-subtle bg-surface-default p-8 sm:p-12 text-center">
      {img && (
        <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-page-tertiary">
          <img
            src={img.startsWith("/") ? img : `/${img}`}
            alt=""
            className="w-12 h-12 object-contain"
          />
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-2 w-full max-w-[480px]">
        <div className="font-semibold text-[18px] md:text-[20px] text-content-primary">
          {placeholder}
        </div>
        <p className="font-normal text-content-secondary text-[13px] md:text-[14px] text-center leading-relaxed">
          {description}
        </p>
        <div className="pt-2">
          {onAction ? (
            <Button
              variant="primary"
              onClick={onAction}
              className="py-2.5 px-5 rounded-[6px]! inline-flex items-center text-sm font-medium"
            >
              <Icon icon="akar-icons:arrow-cycle" className="mr-2 w-4 h-4" />
              {buttonLabel}
            </Button>
          ) : (
            <Link to={buttonLink}>
              <Button
                variant="primary"
                className="py-2.5 px-5 rounded-[6px]! inline-flex items-center text-sm font-medium"
              >
                <Icon icon="akar-icons:arrow-cycle" className="mr-2 w-4 h-4" />
                {buttonLabel}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
