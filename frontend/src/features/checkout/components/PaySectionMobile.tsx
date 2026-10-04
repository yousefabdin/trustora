import Button from "@/components/atoms/button/Button";
import Typography from "@/components/atoms/typography/Typography";

interface PaySectionMobileProps {
  item?: {
    itemPrice?: number | string;
  };
  isSubmitting?: boolean;
}

export default function PaySectionMobile({
  item,
  isSubmitting = false,
}: PaySectionMobileProps) {
  const escrowFees = 12.45;
  const price =
    typeof item?.itemPrice === "number"
      ? item.itemPrice
      : Number(item?.itemPrice) || 25.88;
  const total = price + escrowFees;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-page-primary md:hidden border-t border-outline-subtle p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <Typography
            variant="label"
            className="text-content-tertiary text-[11px]! font-semibold tracking-wider uppercase text-nowrap"
          >
            TOTAL IN ESCROW
          </Typography>
          <Typography
            variant="currencySmall"
            className="text-[20px] font-mono font-bold! text-heading leading-tight"
          >
            $
            {total.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </div>

        <Button
          variant="primary"
          className="flex-1 max-w-[220px] rounded-[6px] py-2.5 font-semibold text-[14px]"
          type="submit"
          form="checkout-form"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Pay Securely"}
        </Button>
      </div>
    </div>
  );
}
