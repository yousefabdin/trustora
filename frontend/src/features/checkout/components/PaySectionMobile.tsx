import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Link } from "react-router";
export default function PaySectionMobile({ item }) {
  const escrowFees = 12.45;
  return (
    <div className=" md:hidden border-t border-outline-subtle p-[16px]">
      <div className="flex justify-around gap-[16px]">
        <div className=" flex flex-col  px-2">
          <Typography
            variant={"label"}
            className="w-full text-content-tertiary text-[11px]! font-[400] text-nowrap"
          >
            TOTAL IN ESCROW
          </Typography>
          <Typography
            variant={"currencySmall"}
            className="w-full text-[18px] font-mono font-bold! text-heading text-center"
          >
            ${item.itemPrice + escrowFees}
          </Typography>
        </div>

        <Button
          variant="primary"
          children={"Pay Securely"}
          className="w-full rounded-[6px]!"
          type="submit"
          form="checkout-form"
        ></Button>
      </div>
    </div>
  );
}
