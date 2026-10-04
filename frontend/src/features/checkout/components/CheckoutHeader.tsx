import Typography from "@/components/atoms/typography/Typography";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-30 w-full h-[64px] bg-[#FFFFFF] border-b border-[#EBEBE9]">
      <div className="w-full h-[64px] px-4 md:px-6 lg:px-[64px] flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-2.5 transition-opacity hover:opacity-90"
        >
          <img
            src="/assets/images/trustoraLogo.png"
            alt="Trustora"
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
          />
          <Typography
            variant="h3"
            as="span"
            className="text-[17px] sm:text-[18px] font-bold text-content-primary tracking-tight font-sans"
          >
            Trustora
          </Typography>
          <span className="bg-page-tertiary text-content-tertiary text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-[4px] leading-tight select-none">
            ESCROW
          </span>
        </Link>

        <div className="flex items-center gap-1.5 text-content-secondary">
          <Icon
            icon="heroicons:lock-closed-20-solid"
            className="w-4 h-4 text-content-tertiary shrink-0"
          />
          <Typography
            variant="bodySmall"
            className="text-[13px] sm:text-[14px] font-medium text-content-secondary select-none"
          >
            Secure Checkout
          </Typography>
        </div>
      </div>
    </header>
  );
}
