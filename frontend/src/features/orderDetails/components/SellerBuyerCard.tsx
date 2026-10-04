import Typography from "@/components/atoms/typography/typography";
import { formatSeller } from "@/components/molecules/cards/OrderCard";

interface SellerBuyerCardProps {
  order?: any;
}

export default function SellerBuyerCard({ order }: SellerBuyerCardProps) {
  if (!order) return null;

  const sellerName = formatSeller(order.sellerName || order.seller || "Seller");
  const buyerName = formatSeller(order.buyerName || order.buyer || "Buyer");

  return (
    <div className="flex flex-col h-full bg-page-primary border border-page-tertiary p-[12px] gap-[8px] rounded-[8px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={order.sellerAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${sellerName}`}
            alt={sellerName}
            className="rounded-[14px] w-[28px] h-[28px] object-cover"
          />
          <div className="flex flex-col">
            <Typography
              variant={"caption"}
              children={"Seller"}
              className="text-[#9C9C99] text-[11px]! uppercase font-semibold"
            ></Typography>
            <Typography
              variant={"label"}
              children={sellerName}
              className="text-xs font-bold text-gray-900"
            ></Typography>
          </div>
        </div>
        <Typography
          variant={"caption"}
          className="flex items-center gap-1 text-content-secondary font-[700]! text-[12px]! uppercase"
        >
          <span className="text-amber-500">★</span> 4.9
        </Typography>
      </div>

      <hr className="border-t border-page-tertiary my-1" />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img
            src={order.buyerAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${buyerName}`}
            alt={buyerName}
            className="rounded-[14px] w-[28px] h-[28px] object-cover"
          />
          <div className="flex flex-col">
            <Typography
              variant={"caption"}
              children={"Buyer"}
              className="text-[#9C9C99] text-[11px]! uppercase font-semibold"
            ></Typography>
            <Typography
              variant={"label"}
              children={buyerName}
              className="text-xs font-bold text-gray-900"
            ></Typography>
          </div>
        </div>
        <Typography
          variant={"caption"}
          className="flex items-center gap-1 text-content-secondary font-[700]! text-[12px]! uppercase"
        >
          <span className="text-amber-500">★</span> 5.0
        </Typography>
      </div>
    </div>
  );
}
