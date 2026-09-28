import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import { useState } from "react";
import TextFieldInput from "../inputs/TextField";
import TextArea from "../inputs/TextArea";

interface CardProps {
  variant:
    | "feedbackCard"
    | "featureCard"
    | "buyerCard"
    | "sellerCard"
    | "itemDetailcard"
    | "sellerDetailsCard"
    | "makeOfferCard"
    | "orderSummaryCard";
  icon?: string;
  className?: React.ReactNode;
  children: React.ReactNode;
  heading?: string;
  username?: string;
  userRole?: string;
  category?: string;
  condition?: string;
  sellerRating?: number;
  sellerAvatar?: string;
  price?: number;
  onBuyNow?: () => void;
  onMakeOffer?: () => void;
  itemName?: string;
  listPrice?: number | string;
  onCloseModal?: () => void;
  onSubmitOffer?: (data: { offerAmount: string; message: string }) => void;
  itemImg?: string;
  sellerHandle?: string;
  subtotal?: number;
  escrowFee?: number;
  shippingFee?: number | string;
  onPay?: () => void;
  type: string;
  formType: string;
}
const buyerBenefits = [
  "No hidden buyer fees",
  "Full protection guarantee",
  "Standard support included",
];
const sellerBenefits = [
  "Full fraud & chargeback indemnity",
  "Automated tracking verification",
  "Stripe-backed instant payouts",
  "Priority merchant support",
];
export default function Cards({
  variant,
  className,
  icon,
  children,
  heading,
  username,
  userRole,
  category = "Cameras & Photography",
  condition = "Excellent — minor wear",
  sellerRating = 4.9,
  sellerAvatar,
  price = 12.45,
  onBuyNow,
  onMakeOffer,
  itemName = "Vintage Leica M6",
  listPrice = "1,245.00",
  onCloseModal,
  onSubmitOffer,
  itemImg = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
  sellerHandle = "@timekeeper_luxury",

  escrowFee = 12.45,
  shippingFee = "FREE",
  onPay,
  type = "submit",
  formType = "checkout-form",
}: CardProps) {
  const [offerAmount, setOfferAmount] = useState("1,150.00");
  const [offerMessage, setOfferMessage] = useState(
    "Hi, I can complete payment immediately. Looking forward to hearing from you.",
  );

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitOffer?.({ offerAmount, message: offerMessage });
  };
  const calculatedTotal =
    price + escrowFee + (typeof shippingFee === "number" ? shippingFee : 0);
  const cardVariant = {
    orderSummaryCard: (
      <div
        className={`w-[440px] p-[24px] rounded-[6px] border border-[#EBEBE9] bg-[#F5F5F4] flex flex-col gap-[20px] ${
          className ?? ""
        }`}
      >
        <Typography
          variant="h2"
          className="text-[20px] font-bold text-heading leading-tight pb-5"
        >
          Order Summary
        </Typography>
        <div className="flex items-center justify-between gap-3 pb-10">
          <div className="flex items-center gap-3">
            <img
              src={itemImg}
              alt={itemName}
              className="w-[64px] h-[64px] rounded-[8px] object-cover flex-shrink-0 border border-outline-subtle"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-bold text-heading leading-snug">
                {itemName}
              </span>
              <span className="text-xs text-content-tertiary">
                Seller: @{sellerHandle}
              </span>
            </div>
          </div>
          <span className="text-[15px] font-mono font-semibold text-heading flex-shrink-0">
            ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-start gap-[10px] p-[14px] bg-[#FEF9C3] border border-[#FEF08A] text-[#854D0E] rounded-[6px] py-[20px]">
          <Icon
            icon="heroicons:lock-closed-20-solid"
            className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#A16207]"
          />

          <span className="text-xs font-medium leading-relaxed">
            Your payment will be held securely until you confirm delivery.
          </span>
        </div>
        <hr className="border-t border-[#EBEBE9]" />
        <div className="flex flex-col gap-4 text-sm py-[20px]">
          <hr className="border-b border-[#EBEBE9] " />

          <div className="flex justify-between items-center">
            <span className="text-content-secondary">Subtotal</span>
            <span className="font-mono text-content-primary">
              ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-content-secondary">
              <span>Escrow Protection Fee</span>
              <Icon
                icon="heroicons:question-mark-circle-20-solid"
                className="w-4 h-4 text-content-tertiary cursor-pointer hover:text-content-secondary"
              />
            </div>
            <span className="font-mono text-content-primary">
              ${escrowFee.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-content-secondary">Shipping</span>
            <span className="font-bold text-emerald-600 text-xs tracking-wide">
              {shippingFee}
            </span>
          </div>
        </div>
        <hr className="border-t border-[#EBEBE9]" />
        <div className="flex justify-between items-center py-4">
          <span className="text-[16px] font-bold text-heading">Total Held</span>
          <span className="text-[22px] font-mono font-bold text-[#4F46E5]">
            $
            {calculatedTotal.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
        <Button
          type="submit"
          variant="primary"
          form="checkout-form"
          className="w-full py-3.5 rounded-[6px] font-semibold text-[15px] bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-sm transition-colors"
        >
          Pay $
          {calculatedTotal.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </Button>

        <div className="flex flex-col gap-4 text-xs text-content-secondary pt-5">
          <div className="flex items-center gap-2">
            <Icon
              icon="heroicons:shield-check-20-solid"
              className="w-4 h-4 text-content-tertiary flex-shrink-0"
            />
            <span>Secure Payment (SSL Encrypted)</span>
          </div>

          <div className="flex items-center gap-2">
            <Icon
              icon="heroicons:lock-closed-20-solid"
              className="w-4 h-4 text-content-tertiary flex-shrink-0"
            />
            <span>Escrow Protected: Release only upon receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <Icon
              icon="heroicons:check-badge-20-solid"
              className="w-4 h-4 text-content-tertiary flex-shrink-0"
            />
            <span>Buyer Guarantee: Refund if item isn't as described</span>
          </div>
        </div>
      </div>
    ),
    makeOfferCard: (
      <div
        style={{
          boxShadow: "0px 12px 32px 0px #00000010",
        }}
        className={`p-[32px] rounded-[6px] border border-[#EBEBE9] bg-surface-default flex flex-col justify-between gap-[24px] ${
          className ?? ""
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <Typography
              variant="h2"
              className="text-[20px] font-bold text-heading leading-tight"
            >
              Make an Offer
            </Typography>
            <span className="text-sm text-content-tertiary">
              {itemName} • listed at ${listPrice}
            </span>
          </div>

          <button
            onClick={onCloseModal}
            type="button"
            className="text-content-tertiary hover:text-content-primary transition-colors p-1 rounded-full"
          >
            <Icon icon="ic:outline-cancel" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleOfferSubmit} className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-content-primary"></label>
            <TextFieldInput
              label="Your Offer Amount"
              type="text"
              value={`$ ${offerAmount}`}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setOfferAmount(e.target.value.replace("$ ", ""))
              }
              className=" text-lg font-mono font-semibold py-2.5 px-4 rounded-[6px] border border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-accent-default"
            />
            <span className="text-xs text-content-tertiary">
              Offer is binding once accepted. Payment is secured by Holdline
              Escrow.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-content-primary">
              Add a message to the seller (optional)
            </label>
            <TextArea
              rows={3}
              value={offerMessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setOfferMessage(e.target.value)
              }
              className="text-sm py-2.5 px-4 rounded-[6px] border border-outline-subtle focus:outline-none focus:ring-1 focus:ring-accent-default resize-none"
            />
          </div>

          <div className="flex items-center gap-3 p-2 bg-[#F5F5F4] rounded-[6px] max-w-[480px]">
            <Icon
              icon="heroicons:shield-check-20-solid"
              className="w-5 h-5 text-content-secondary flex-shrink-0 mt-0.5"
            />
            <Typography
              variant="label"
              className="text-[12px] font-[400]! text-content-secondary leading-normal"
            >
              Funds are only transferred to the seller once you receive and
              verify the {itemName.split(" ")[1] || "item"}.
            </Typography>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={onCloseModal}
              className="w-1/2 py-3 rounded-[6px] font-semibold text-sm border border-outline-subtle text-content-primary hover:bg-neutral-50"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              className="w-1/2 py-3 rounded-[6px] font-semibold text-sm bg-[#4F46E5] hover:bg-[#4338CA] text-white"
            >
              Submit Offer
            </Button>
          </div>
        </form>
      </div>
    ),
    itemDetailcard: (
      <>
        <div
          className={`w-full max-w-[480px] h-full  bg-page-primary p-6 md:p-8 border border-outline-subtle rounded-[16px] flex flex-col gap-5 ${
            className ?? ""
          }`}
        >
          <div className="flex flex-col gap-2">
            <span className="self-start px-3 py-1 bg-[#F4F4F5] text-content-secondary text-[12px] font-semibold rounded-md">
              {category}
            </span>
            <Typography
              variant="h1"
              className="text-[24px] font-semibold text-heading leading-tight"
            >
              {heading ?? "Vintage Leica M6"}
            </Typography>
            <div className="flex items-center gap-1.5 text-[14px] font-[400] text-content-secondary">
              <span>Condition:</span>
              <span className="font-semibold text-content-primary">
                {condition}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#4F46E5] text-white font-[500s] flex items-center justify-center text-[14px] overflow-hidden flex-shrink-0">
              {sellerAvatar ? (
                <img
                  src={sellerAvatar}
                  alt={username ?? "Seller"}
                  className="w-full h-full object-cover"
                />
              ) : (
                (username?.[1] || username?.[0] || "C").toUpperCase()
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-content-primary">
                Listed by @{username ?? "@camera_collector"}
              </span>
              <div className="flex items-center gap-1 text-xs text-content-primary font-semibold">
                <Icon
                  icon="iconamoon:star-bold"
                  className="w-3.5 h-3.5 text-amber-500"
                />
                <span>{sellerRating}</span>
              </div>
            </div>
          </div>

          <hr className="border-t border-outline-subtle my-1" />

          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-[500] text-content-tertiary uppercase tracking-wider">
              LIST PRICE
            </span>
            <Typography
              variant="currencyLarge"
              className="text-[28px] font-[700] text-heading tracking-tight"
            >
              ${typeof price === "number" ? price.toLocaleString() : price}
            </Typography>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-escrow-surface text-escrow-foreground text-xs font-semibold rounded-lg">
            <Icon
              icon="heroicons:lock-closed-20-solid"
              className="w-4 h-4 flex-shrink-0"
            />
            <span>Payment held in escrow until confirmed</span>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <Button
              variant="primary"
              onClick={onBuyNow}
              className="w-full py-3 rounded-lg font-semibold text-[15px] bg-accent-default hover:bg-[#4338CA] text-white"
            >
              Buy Now
            </Button>
            <Button
              variant="ghost"
              onClick={onMakeOffer}
              className="w-full py-3 rounded-lg font-semibold text-sm border border-accent-default text-accent-default hover:bg-indigo-50"
            >
              Make Offer
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-content-secondary pt-1">
            <Icon
              icon="heroicons:shield-check-20-solid"
              className="w-4 h-4 text-emerald-600 flex-shrink-0"
            />
            <span>Holdline Buyer Protection included on this listing</span>
          </div>
        </div>
      </>
    ),
    featureCard: (
      <>
        <div
          className={`min-h-[197px] w-full flex flex-col gap-3 bg-page-primary  p-[24px] border border-outline-subtle
         rounded-[12px] `}
        >
          {icon && (
            <span className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-outline-subtle rounded-[8px]">
              <Icon
                icon={icon}
                className="text-accent-default w-[18px] h-[18px]"
              ></Icon>
            </span>
          )}
          <span>
            <Typography
              variant="h2"
              className="mb-2 text-2xl  tracking-tight text-heading leading-8 text-[18px] font-semibold"
            >
              {heading}
            </Typography>
            <Typography
              variant="body"
              className="text-content-secondary leading-[150%] font-[400] text-[14px]"
            >
              {children}
            </Typography>
          </span>
        </div>
      </>
    ),
    feedbackCard: (
      <>
        <div
          className={`h-[224px] w-[357px] flex flex-col gap-2 bg-page-primary p-[32px] border border-page-tertiary
         rounded-[16px] `}
        >
          <span>
            <Typography
              variant="body"
              className="text-content-secondary leading-[150%] font-[400] text-[14px] py-2 italic"
            >
              {children}
            </Typography>
          </span>
          {icon && (
            <>
              <div className="flex items-center justify-start py-8">
                <span className="">
                  <img
                    className="flex items-center flex-nowrap  w-[40px] h-[40px] bg-outline-subtle rounded-full"
                    src={icon}
                    alt=""
                  />
                </span>
                <div className="flex flex-col items-start justify-center ">
                  <Typography variant="label" className="px-4 text-[14px]">
                    {username}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="px-4 py-1 text-content-tertiary"
                  >
                    {userRole}
                  </Typography>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    ),
    buyerCard: (
      <>
        <div
          className={`hidden md:flex h-[334px] w-[480px] flex-col gap-2 bg-page-pr *:imary p-[40px] gap-[32px] border border-outline-subtle
         rounded-[16px] `}
        >
          <span>
            <Typography
              variant="h3"
              className="mb-1 tracking-tight text-heading leading-8 text-[20px] font-[700]"
            >
              Buyers
            </Typography>
            <Typography
              variant="caption"
              className="text-content-secondary leading-[150%] font-[400] text-[14px]"
            >
              For individuals purchasing items securely.
            </Typography>
          </span>
          <span>
            <Typography
              variant="h1"
              className="mb-1 text-[48px] tracking-tight text-heading  font-extrabold"
            >
              Free
            </Typography>
            <ul className="py-5">
              {buyerBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 ">
                  <div className="flex w-[22px] h-[22px] bg-page-primary rounded-full items-center justify-center ">
                    <Icon
                      icon="clarity:success-line"
                      className="h-[12px] w-[20px] text-success-icon "
                    />
                  </div>

                  <Typography
                    variant="body"
                    className="text-[#3F3F3C] md:py-2 text-[14px] "
                  >
                    {benefit}
                  </Typography>
                </li>
              ))}
            </ul>
          </span>
        </div>
      </>
    ),
    sellerCard: (
      <>
        <div
          className={`min-w-[350px]   md:w-[480px] flex flex-col gap-[16px] md:gap-[32px] bg-page-primary p-[24px]  md:p-[40px] border-2 border-accent-default
         rounded-[16px] shadow-[0px_16px_32px_0px_#4F46E510] `}
        >
          <span>
            <span className="flex justify-start items-center ">
              <Typography
                variant="h2"
                className="hidden md:block mb-1 tracking-tight text-[20px] font-bold"
              >
                Sellers
              </Typography>
              <Typography
                variant="h2"
                className="block md:hidden mb-[-10px] tracking-tight text-[18px] font-bold text-page-inverse"
              >
                Sellers Pay
              </Typography>
              <span className="hidden md:flex ml-30 items-center justify-center w-[69px] h-[21px] rounded-full bg-page-tertiary">
                <Typography
                  variant="label"
                  className="text-[11px] text-accent-default font-[600] uppercase "
                >
                  popular
                </Typography>
              </span>
            </span>
            <Typography
              variant="caption"
              className="hidden md:block text-content-secondary leading-[150%] font-[400] text-[14px]"
            >
              For individuals purchasing items securely.
            </Typography>
          </span>

          <div className="flex items-center md:items-end ">
            <Typography
              variant="display"
              className="text-[32px]! md:text-[48px] font-extrabold"
            >
              3.5%
            </Typography>
            <Typography
              variant="caption"
              className=" text-[32px] font-extrabold! md:text-[20px] md:font-[600] md:text-content-tertiary md:py-1 md:px-1"
            >
              +$0.30
            </Typography>
            <Typography
              variant="caption"
              className="hidden md:block text-[14px] text-content-tertiary "
            >
              / transaction
            </Typography>
          </div>
          <Typography
            variant="caption"
            className="block md:hidden  text-[13px] font-[400] text-content-tertiary"
          >
            Escrow protection included. Free for buyers always.
          </Typography>
          <ul className="hidden md:block">
            {sellerBenefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 ">
                <div className="hidden md:flex w-[22px] h-[22px] bg-page-primary rounded-full items-center justify-center ">
                  <Icon
                    icon="clarity:success-line"
                    className="h-[12px] w-[22px] text-accent-default "
                  />
                </div>

                <Typography
                  variant="body"
                  className="text-[#3F3F3C] py-1 text-[14px] "
                >
                  {benefit}
                </Typography>
              </li>
            ))}
          </ul>

          <div className="w-[123px] h-[41px] md:w-[137px] md:h-[46px]">
            <Button variant="primary" className="w-full h-full rounded-[8px]!">
              Start Selling
            </Button>
          </div>
        </div>
      </>
    ),
    sellerDetailsCard: (
      <>
        <div
          className={`w-full bg-page-primary p-6 md:py-[20px] px-[20px] border border-outline-subtle rounded-[16px] flex flex-col gap-5 ${
            className ?? ""
          }`}
        >
          <Typography
            variant="h3"
            className="text-[18px] font-bold text-heading"
          >
            About the Seller
          </Typography>

          <div className="flex items-center justify-start gap-3">
            <div className="w-12 h-12 rounded-full bg-[#4F46E5] text-white font-bold flex items-center justify-between text-lg overflow-hidden ">
              {sellerAvatar ? (
                <img
                  src={sellerAvatar}
                  alt={username}
                  className="w-full h-full object-cover"
                />
              ) : (
                username?.toUpperCase()
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[17px] font-bold text-heading">
                {username}
              </span>
              <span className="text-sm text-content-tertiary">
                Member since 2018
              </span>
            </div>
          </div>

          <hr className="border-t border-outline-subtle" />

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-content-tertiary uppercase tracking-wider">
                COMPLETED ESCROWS
              </span>
            </div>

            <div className="flex flex-col gap-1 items-end">
              <span className="text-xs px-2 font-semibold text-content-tertiary uppercase tracking-wider">
                TRUST RATING
              </span>
              <div className="flex items-center gap-1.5">
                <Icon
                  icon="iconamoon:star-bold"
                  className="w-5 h-5 text-amber-500"
                />
                <span className="text-lg font-bold text-heading">
                  {sellerRating} / 5.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    ),
  };
  return <>{cardVariant[variant]}</>;
}
