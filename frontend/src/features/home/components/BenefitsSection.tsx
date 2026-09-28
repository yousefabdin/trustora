import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
const buyerBenefits = [
  "Never lose money on undelivered items",
  "Inspect physical goods before releasing payment",
  "Get a full refund if the item doesn't match the listing",
  "24/7 priority dispute resolution support",
];
const sellerBenift = [
  "Disburse funds instantly upon delivery confirmation",
  "Complete protection against malicious chargebacks",
  "Lower processing fees than credit card alternatives",
  "Access to a comprehensive seller analytics dashboard",
];
export default function BenefitsSection() {
  return (
    <div className="flex flex-col md:flex-row md:h-[520px] ">
      <div className="bg-[#EBEBE9] flex-1 gap-[24px] md:gap-[40px] w-full px-[20px] py-[30px] md:p-[30px] lg:p-[64px] ">
        <div className=" md:py-15">
          <Typography
            variant="label"
            className="hidden md:block uppercase text-[14px] font-bold! font-inter text-accent-default "
          >
            Secure Purchasing
          </Typography>
          <Typography
            variant="h1"
            className="md:py-5 uppercase text-[24px]! md:text-[32px] font-extrabold! font-inter! text-[#171715]"
          >
            For Buyers
          </Typography>
          <ul className="py-2">
            {buyerBenefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-3 py-2 md:py-3"
              >
                <div className="hidden md:flex w-[22px] h-[22px] bg-page-primary rounded-full items-center justify-center ">
                  <Icon
                    icon="clarity:success-line"
                    className="h-[12px] w-[20px] text-accent-default "
                  />
                </div>
                <Icon
                  icon="clarity:success-line"
                  className="md:hidden h-[12px] w-[20px] text-accent-default "
                />
                <Typography
                  variant="body"
                  className="text-content-primary md:py-2 text-[15px] "
                >
                  {benefit}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-escrow-surface flex-1 gap-[24px] md:gap-[40px] w-full px-[20px] py-[30px] md:p-[30px] lg:p-[64px]">
        <div className="md:py-15">
          <Typography
            variant="label"
            className="hidden md:block uppercase text-[14px] font-bold! font-inter text-escrow-icon"
          >
            Protected Merchant Tools
          </Typography>
          <Typography
            variant="h1"
            className="md:py-5 uppercase text-[24px]! md:text-[32px]  font-extrabold! font-inter! text-[#171715]"
          >
            For Sellers
          </Typography>
          <ul className="py-1">
            {sellerBenift.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center py-2  gap-2 md:py-2"
              >
                <div className="hidden md:flex w-[22px] h-[22px] bg-page-primary rounded-full flex items-center justify-center text-accent-default">
                  <Icon
                    icon="clarity:success-line"
                    className="h-[12px] w-[20px] text-escrow-icon"
                    strokeWidth={10}
                  />
                </div>
                <Icon
                  icon="clarity:success-line"
                  className="block md:hidden h-[12px] w-[20px] text-accent-default "
                />
                <Typography
                  variant="body"
                  className="text-content-primary md:py-3 text-[15px] "
                >
                  {benefit}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
