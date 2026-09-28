import Typography from "@/components/atoms/typography/typography";
import Cards from "@/components/molecules/cards/Cards";
import { Icon } from "@iconify/react";
export default function CardSummarySection({ item }) {
  const escrowFees = 12.45; // this should be in redux

  return (
    <div>
      <div className="flex justify-between items-center gap-2 md:hidden bg-page-tertiary mt-[-25px] mx-[-10px] border border-[#EBEBE9]  p-[12px] ">
        <div className="flex gap-2 items-center ">
          <Icon
            icon="lets-icons:basket-alt-3-light"
            className="text-accent-default"
          ></Icon>
          <Typography
            variant={"caption"}
            className="text-[14px]! text-[#3F3F3C] font-medium font-inter"
          >
            Show order summary
          </Typography>
          <Icon icon="akar-icons:chevron-down" className="h-3"></Icon>
        </div>
        <Typography
          className="text-[15px] font-mono font-semibold text-heading "
          variant="currencySmall"
        >
          ${item.itemPrice + escrowFees}
        </Typography>
      </div>
      <Cards
        variant="orderSummaryCard"
        className="hidden md:block"
        price={item.itemPrice}
        itemName={item.itemName}
        itemImg={item.img}
        listPrice={item.itemPrice}
        sellerHandle={item.sellerName}
      ></Cards>
    </div>
  );
}
