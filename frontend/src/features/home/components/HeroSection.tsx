import Typography from "@/components/atoms/typography/typography";
import HeroSectionListing from "./HeroSectionListing";
import { Icon } from "@iconify/react";

export default function HeroSection() {
  return (
    <>
      <HeroSectionListing
        className="py-8 w-full"
        badge={
          <span className="inline-flex items-center rounded-full bg-escrow-surface  ">
            <Typography
              variant="label"
              className=" flex h-[27px] w-[233px] text-escrow-icon items-center justify-center gap-2"
            >
              <Icon
                icon="solar:shield-check-linear"
                className="h-[15px] w-[15px] text-escrow-icon "
              />
              Double-Sided Escrow Protection
            </Typography>
          </span>
        }
        title="Buy and sell with confidence"
        description="Every transaction protected by secure escrow. Payment is captured at checkout but held safely until the buyer inspects and confirms delivery."
        actions={[
          {
            label: "Start Buying",
            variant: "primary",
            onClick: () => {},
          },
          {
            label: "Start Selling",
            variant: "secondary",
            onClick: () => {},
          },
        ]}
        visual={
          <div className=" flex h-[360px] w-full max-w-[480px] flex-col items-center justify-center rounded-[16px] border border-slate-100 bg-page-tertiary mt-2">
            <div className="mb-2 flex h-[96px] w-[96px] items-center justify-center rounded-full bg-white shadow-sm">
              <Icon
                icon="solar:shield-check-linear"
                className="h-10 w-[31px] text-indigo-500 "
              />
            </div>

            <Typography
              variant="label"
              className="font-[600] text-[16px] text-page-inverse mt-2"
            >
              Payment Secured in Escrow
            </Typography>

            <Typography
              variant="caption"
              className="mt-0.5 text-[13px] text-content-tertiary font-[400] mt-1"
            >
              Pending buyer confirmation of delivery
            </Typography>
          </div>
        }
      />
    </>
  );
}
