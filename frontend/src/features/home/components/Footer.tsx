import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";

export default function footer() {
  return (
    <div className="w-full justify-between bg-page-inverse p-[32px] gap-[40px] md:pt-[80px] md:px-[50px] lg:px-[60px] md:pb-[40px] md:gap-[64px]">
      <div className="flex justify-center pb-10 md:justify-between border-b md:border-0  border-[#292927]">
        <div className="hidden  md:flex flex-col items-start justify-center  gap-2">
          <div className="flex items-center  ">
            <img
              src="assets/images/trustoraLogo.png  "
              alt=""
              className=" w-[50px] h-[50px]"
            />
            <Typography
              variant="label"
              className="text-neutral-white text-[18px] font-extrabold"
            >
              Trustora
            </Typography>
          </div>
          <div className="px-4 max-w-[280px]">
            <Typography
              variant="caption"
              className="leading-[150%] text-content-tertiary text-[14px] font-normal"
            >
              The modern standard for secure online peer-to-peer and marketplace
              transactions.
            </Typography>
          </div>
        </div>
        <div className="flex gap-15 lg:gap-30">
          <div className="flex flex-col items-start gap-5">
            <Typography
              variant="label"
              className="text-[12px] text-neutral-white uppercase"
            >
              product
            </Typography>
            <Typography variant="label" className="text-[14px] text-[#787875]">
              Browse
            </Typography>
            <Typography
              variant="label"
              className="text-[14px] text-content-tertiary"
            >
              Sell
            </Typography>
            <Typography
              variant="label"
              className="text-[14px] text-content-tertiary"
            >
              Pricing
            </Typography>
            <Typography
              variant="label"
              className="text-[14px] text-content-tertiary"
            >
              How It Works
            </Typography>
          </div>
          <div className="flex flex-col items-start gap-5">
            <Typography
              variant="label"
              className=" text-[12px] text-neutral-white uppercase"
            >
              support
            </Typography>
            <Typography
              variant="label"
              className="text-[14px] text-content-tertiary"
            >
              Help Center
            </Typography>
            <Typography
              variant="label"
              className="text-[14px] text-content-tertiary"
            >
              Disputes
            </Typography>
            <Typography
              variant="label"
              className="text-[14px] text-content-tertiary"
            >
              Contact
            </Typography>
            <Typography
              variant="label"
              className=" text-[14px] text-content-tertiary"
            >
              Status
            </Typography>
          </div>
          <div className="flex flex-col items-start gap-5">
            <Typography
              variant="label"
              className="text-[12px] text-neutral-white uppercase"
            >
              Legal
            </Typography>
            <Typography
              variant="label"
              className=" text-[14px] text-content-tertiary"
            >
              Terms
            </Typography>
            <Typography
              variant="label"
              className="text-[14px] text-content-tertiary"
            >
              Privacy
            </Typography>
            <Typography
              variant="label"
              className="text-[14px] text-content-tertiary"
            >
              Cookies
            </Typography>
            <Typography
              variant="label"
              className="text-[14px] text-content-tertiary"
            >
              License
            </Typography>
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-10 md:pt-30 items-end">
        <Typography
          variant="caption"
          className="text-[14px] text-content-tertiary"
        >
          ©2026 Trustora Inc. All rights reserved.
        </Typography>
        <div className="mb-3 flex gap-6">
          <Icon
            icon="akar-icons:linkedin-fill"
            className=" text-content-tertiary"
          ></Icon>
          <Icon
            icon="akar-icons:github-outline-fill"
            className="text-content-tertiary"
          ></Icon>
          <Icon
            icon="basil:twitter-outline"
            className="text-content-tertiary"
          ></Icon>
        </div>
      </div>
    </div>
  );
}
