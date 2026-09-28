import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";

export default function StatsSection() {
  return (
    <section className="w-full md:h-auto py-[30px] px-[20px] md:px-[40px] lg:px-[80px] bg-page-secondary border-t border-b border-outline-subtle">
      <div className="w-full h-full flex flex-col lg:flex-row flex-wrap items-center justify-center lg:justify-between gap-10 py-2">
        <div className="flex items-center gap-[16px]">
          <span className="flex items-center justify-center w-[48px] h-[48px] bg-content-inverse border border-outline-subtle rounded-[10px] ">
            <Icon
              icon="bi:currency-dollar"
              x-12
              className="w-[20px] h-[20px] text-accent-default  "
            ></Icon>
          </span>
          <span className="flex flex-col">
            <Typography variant="h1" className="text-[24px]! font-extrabold">
              $12M+
            </Typography>
            <Typography
              variant="label"
              className=" text-content-tertiary uppercase"
            >
              Protected Funds
            </Typography>
          </span>
        </div>
        <div className="flex items-center gap-[16px]">
          <span className=" flex items-center justify-center w-[48px] h-[48px] bg-content-inverse border border-outline-subtle rounded-[10px] ">
            <Icon
              icon="griddy-icons:check-circle-alt-03"
              className="w-[20px] h-[20px] text-accent-default  "
            ></Icon>
          </span>
          <span className="flex flex-col ">
            <Typography
              variant="h1"
              className="text-page-inverse text-[24px]! font-extrabold"
            >
              24,000+
            </Typography>
            <Typography
              variant="label"
              className="text-content-tertiary uppercase"
            >
              Completed Orders
            </Typography>
          </span>
        </div>
        <div className="flex items-center gap-[16px]">
          <span className="flex items-center justify-center w-[48px] h-[48px] bg-content-inverse border border-outline-subtle rounded-[10px]  ">
            <Icon
              icon="heroicons:scale"
              className="w-[20px] h-[20px] text-accent-default  "
            ></Icon>
          </span>
          <span className="flex flex-col">
            <Typography
              variant="h1"
              className="text-page-inverse text-[24px]! font-extrabold"
            >
              99.2%
            </Typography>
            <Typography
              variant="label"
              className="text-content-tertiary uppercase"
            >
              Successful Resolutions
            </Typography>
          </span>
        </div>
        <div className="flex items-center gap-[16px]">
          <span className="flex items-center justify-center w-[48px] h-[48px] bg-content-inverse border border-outline-subtle rounded-[10px] ">
            <Icon
              icon="akar-icons:star"
              className="w-[20px] h-[20px] text-accent-default  "
            ></Icon>
          </span>
          <span className="flex flex-col">
            <Typography
              variant="h1"
              className="text-page-inverse text-[24px]! font-extrabold"
            >
              4.9 ★
            </Typography>
            <Typography
              variant="label"
              className="text-content-tertiary uppercase"
            >
              Customer Rating
            </Typography>
          </span>
        </div>
      </div>
    </section>
  );
}
