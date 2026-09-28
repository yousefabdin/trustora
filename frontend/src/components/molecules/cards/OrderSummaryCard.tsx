import Typography from "@/components/atoms/typography/typography";

interface OrderSummaryCardProps {
  itemName: string;
  itemDescription: string;
  itemSerial: string;
  itemImage: string;

  sellerName: string;
  sellerImage: string;

  shippingMethod: string;
  trackingNumber: string;

  itemPrice: number;
  platformFee: number;
  shippingFees: number;
  totalPrice: number;
}

export default function OrderSummaryCard({
  itemName,
  itemDescription,
  itemSerial,
  itemImage,
  sellerName,
  sellerImage,
  shippingMethod,
  trackingNumber,
  platformFee,
  itemPrice,
  shippingFees,
  totalPrice,
}: OrderSummaryCardProps) {
  return (
    <>
      <div
        className="
      hidden
        md:flex
        h-[full]
        w-full
        max-w-[700px]
        min-w-[350px]
        flex-col
        gap-[20px]
        rounded-[12px]
        border
        border-outline-default
        bg-surface-default
        p-[24px]
      "
      >
        <h2 className="font-inter text-[16px] font-semibold leading-[29px] text-content-primary font-600">
          Order Information
        </h2>

        <div className="flex items-start border-b border-outline-default pb-[20px]">
          <img
            src={itemImage}
            alt={itemName}
            className="h-[48px] w-[48px] shrink-0 rounded-lg border border-outline-subtle object-cover"
          />

          <div className="ml-[16px] min-w-0 flex-1">
            <h3 className="font-inter text-[14px] font-medium leading-[24px] text-content-primary">
              {itemName}
            </h3>

            <p className="mt-[4px] font-inter text-[12px] font-normal leading-[20px] text-neutral-500">
              {itemDescription} · Serial
            </p>
            <p className="mt-[4px] font-inter text-[12px] font-normal leading-[20px] text-neutral-500">
              {itemSerial}
            </p>
          </div>

          <span className=" shrink-0 whitespace-nowrap font-jetbrains text-[14px] mt-5 font-bold leading-[24px] text-content-primary">
            $
            {itemPrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-[24px] border-b border-outline-default pb-[20px]">
          <div>
            <p className="font-inter text-[12px] font-medium uppercase leading-[19px] text-neutral-500">
              Seller
            </p>

            <div className="mt-[10px] flex items-center">
              <img
                src={sellerImage}
                alt={sellerName}
                className="h-[24px] w-[24px] rounded-full object-cover"
              />

              <span className="ml-[10px] font-inter text-[12px] font-medium text-content-primary">
                {sellerName}
              </span>
            </div>
          </div>

          <div>
            <p className="font-inter text-[12px] font-medium uppercase leading-[19px] text-content-secondary">
              Shipping Method
            </p>

            <p className="mt-[10px] font-inter text-[15px] font-normal leading-[20px] text-content-primary">
              {shippingMethod}
            </p>

            <p className="mt-[8px] whitespace-nowrap font-inter text-[12px] font-normal leading-[20px] text-neutral-500">
              Tracking:
              <a
                href="#"
                className="text-accent-default underline underline-offset-2 ml-2 font-jetbrains text-[11px]"
              >
                {trackingNumber}
              </a>
            </p>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <span className="font-inter text-[14px] font-normal text-neutral-500">
              Item Subtotal
            </span>

            <span className="font-jetbrains text-[15px] font-medium text-content-primary">
              ${itemPrice?.toFixed(2)}
            </span>
          </div>

          <div className="mt-[10px] flex items-center justify-between">
            <span className="font-inter text-[14px] font-normal text-neutral-500">
              Platform Escrow Fee
            </span>

            <span className="font-jetbrains text-[16px] font-medium text-content-primary">
              ${platformFee?.toFixed(2)}
            </span>
          </div>

          <div className="mt-[10px] flex items-center justify-between">
            <span className="font-inter text-[14px] font-normal text-neutral-500">
              Shipping &amp; Handling
            </span>

            <span className="font-jetbrains text-[16px] font-medium text-content-primary">
              ${shippingFees?.toFixed(2)}
            </span>
          </div>

          <div className="my-[12px] border-t border-dashed border-outline-default" />

          <div className="flex items-center justify-between">
            <span className="font-inter text-[18px] font-semibold leading-[24px] text-content-primary">
              Total Held in Escrow
            </span>

            <span className="font-jetbrains text-[20px] font-semibold leading-[29px] text-accent-default">
              $
              {totalPrice?.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="flex md:hidden items-center gap-[12px] bg-page-primary p-[12px] rounded-[8px] border border-page-tertiary  w-full">
        <img
          src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=150&q=80"
          alt="Hasselblad 500C/M Medium Format Film Camera"
          className="w-16 h-16 rounded-[12px] object-cover shrink-0 bg-black"
        />
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <Typography
            variant="h3"
            className="text-[15px]! font-[600]! text-content-primary truncate"
          >
            Hasselblad 500C/M Medium Format Fil...
          </Typography>
          <Typography
            variant="currencySmall"
            className="text-[15px]! font-[600]! text-accent-default "
          >
            $2,450.00
          </Typography>
        </div>
      </div>
    </>
  );
}
