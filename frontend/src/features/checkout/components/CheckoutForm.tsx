import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import DropDown from "@/components/molecules/inputs/DropDown";
import TextField from "@/components/molecules/inputs/TextField";
import { Icon } from "@iconify/react";

export default function CheckoutForm({ item, handleOrderPayment }) {
  const escrowFees = 12.45; // this should be in redux
  return (
    <div className="flex w-full px-[12px] flex-col ">
      <div className="block md:hidden bg-[#FEF3C7] p-[14px] ">
        <Typography
          variant={"h3"}
          className="flex gap-2 text-[13px]! font-medium! leading-4! text-[#714312]"
        >
          <Icon icon="akar-icons:lock-on"></Icon>
          Your payment will be held securely until you confirm delivery.
        </Typography>
      </div>
      <Typography variant="h3" className="hidden md:block">
        Checkout
      </Typography>
      <Typography
        variant="caption"
        className="text-[#787875] text-[14px] hidden md:block py-2 pb-4"
      >
        Verify your details to secure this high-value transaction in escrow.
      </Typography>
      <div className="flex items-center gap-2 py-4">
        <span className="hidden md:flex items-center justify-center bg-page-tertiary w-[20px] h-[20px] rounded-full text-[12px]">
          1
        </span>
        <Typography variant={"h3"} className="text-[16px]! font-semibold!">
          Shipping Details
        </Typography>
      </div>
      <div>
        <form
          action=""
          className="flex flex-col gap-2 md:gap-5 "
          onSubmit={handleOrderPayment}
          id="checkout-form"
        >
          <TextField
            type={"text"}
            placeholder={"Sarah jenkins"}
            label={"Full Name"}
            required={true}
          ></TextField>
          <TextField
            type={"text"}
            placeholder={"1042 Market Street"}
            label={"Address Line"}
            required={true}
          ></TextField>
          <TextField
            type={"text"}
            placeholder={"Suite 400"}
            label={"Address Line 2 (Optional)"}
            required={true}
          ></TextField>
          <div className=" flex justify-between gap-2">
            <div className="w-full">
              <TextField
                type={"text"}
                placeholder={"San Francisco"}
                label={"city"}
                required={true}
              ></TextField>
            </div>
            <div className="flex w-[200px]">
              <TextField
                type={"text"}
                placeholder={"CA"}
                label={"State"}
                required={true}
              ></TextField>
              <TextField
                type={"text"}
                placeholder={"94103"}
                label={"ZIP Code"}
                required={true}
              ></TextField>
            </div>
          </div>
          <DropDown label={"Country"}></DropDown>
          <div className="border-b pt-7 text-page-tertiary" />
          <div className="flex items-center gap-2 py-5">
            <span className="flex items-center justify-center bg-page-tertiary w-[20px] h-[20px] rounded-full text-[12px]">
              2
            </span>
            <Typography variant={"h3"} className="text-[16px]! font-semibold!">
              Secure Payment
            </Typography>
          </div>

          <TextField
            type={"number"}
            placeholder={"4242 4242 4242 4242"}
            label={"Card Number"}
            required={true}
          ></TextField>
          <div className="flex gap-4">
            <div className="w-full">
              <TextField
                type={"text"}
                placeholder={"Expiration Date"}
                label={"MM / YY"}
                required={true}
              ></TextField>
            </div>
            <div className="w-full">
              <TextField
                type={"number"}
                placeholder={"•••"}
                label={"CVC"}
                required={true}
              ></TextField>
            </div>
          </div>
          <Typography
            variant="caption"
            className="flex gap-2 items-center text-[12px]! font-[400] text-[#787875] py-2"
          >
            <Icon icon="bi:shield-check" className="text-success-icon"></Icon>
            Your data is encrypted natively using bank-grade AES-256 protocols.
          </Typography>
        </form>
      </div>
    </div>
  );
}
