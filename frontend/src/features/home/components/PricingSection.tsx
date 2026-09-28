import Typography from "@/components/atoms/typography/typography";
import Cards from "@/components/molecules/cards/Cards";

export default function PriceingSection() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[424px] md:h-full lg:h-[766px] bg-surface-raised px-[20px] py-[64px] md:p-[80px]">
      <div className="flex flex-col items-center justify-center md:pt-30 ">
        <Typography
          variant="label"
          className="hidden md:block text-accent-default text-[14px] font-[600] uppercases"
        >
          Transparent fees
        </Typography>
        <Typography
          variant="h1"
          py-20
          className="hidden md:block text-page-inverse text-[36px] font-extrabold uppercase py-2 "
        >
          Simple, predictable pricing
        </Typography>
        <Typography
          variant="h1"
          py-20
          className="block md:hidden text-page-inverse text-[36px] font-extrabold uppercase py-10"
        >
          Simple pricing
        </Typography>
      </div>
      <div className="flex justify-center items-start flex-wrap lg:flex-nowrap gap-10 md:py-20 mb-10 md:mb-1">
        <Cards variant="buyerCard" className=""></Cards>
        <Cards variant="sellerCard"></Cards>
      </div>
    </div>
  );
}
