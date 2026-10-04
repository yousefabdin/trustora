import { Icon } from "@iconify/react";
import clsx from "clsx";
interface ListingCardProps {
  id?: string;
  title: string;
  image: string;
  price: string | number;
  views: number;
  offersCount?: number;
  lastActive?: string;
  status: "ACTIVE" | "INACTIVE" | string;
  onEdit?: () => void;
}

export default function SellerListingCard({
  id = "H-104",
  title = "Leica M6 TTL Rangefinder (0.72x Black Chrome)",
  image,
  price = "$3,450.00",
  views = 142,
  offersCount = 5,
  lastActive = "Active 2h ago",
  status = "ACTIVE",
  onEdit,
}: ListingCardProps) {
  const formattedPrice =
    typeof price === "number"
      ? `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : typeof price === "string" && price.startsWith("$")
      ? price
      : `$${price}`;

  const statusUpper = (status || "ACTIVE").toUpperCase();
  const statusBadgeMobile =
    statusUpper === "SOLD"
      ? "bg-neutral-100 text-neutral-500 border border-neutral-200"
      : statusUpper === "DRAFT"
      ? "bg-amber-50 text-amber-600 border border-amber-200"
      : "bg-emerald-50 text-emerald-600 border border-emerald-100";

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors">
      <div className="hidden md:flex items-center justify-between gap-[20px] p-[16px] ">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-20 h-20 rounded-lg border border-gray-100 p-1  flex items-center justify-center bg-gray-50 flex-shrink-0">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-jetbrains text-xs text-gray-400 font-semibold mt-1">
                {id}
              </span>
              <h3 className="font-bold text-gray-900 text-base truncate ">
                {title}
              </h3>
            </div>

            <div className="flex items-center gap-[24px] text-xs text-gray-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Icon icon={"akar-icons:eye"}></Icon>
                {views} views
              </span>
              <span className="flex items-center gap-1.5">
                <Icon icon={"ic:outline-local-offer"}></Icon>
                {offersCount} offers
              </span>
              <span className="text-gray-400">• {lastActive}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-20 flex-shrink-0">
          <div className="flex items-start flex-col text-right ">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              Current Price
            </p>
            <p className="font-jetbrains font-bold text-lg text-gray-900">
              {formattedPrice}
            </p>
          </div>
          <div className="flex items-center gap-2 ">
            <span
              className={clsx(
                "px-3 py-1 text-[11px] font-jetbrains uppercase font-bold rounded-md tracking-wider border",
                statusUpper === "SOLD"
                  ? "bg-neutral-100 text-neutral-600 border-neutral-200"
                  : statusUpper === "DRAFT"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-600 border-emerald-100",
              )}
            >
              {statusUpper}
            </span>

            <button
              onClick={onEdit}
              className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Edit
              <Icon icon={"akar-icons:chevron-right"}></Icon>
            </button>
          </div>
        </div>
      </div>

      <div className="flex md:hidden flex-col gap-3 p-3.5">
        <div className="flex gap-3 items-center">
          <div className="w-16 h-16 rounded-lg border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center bg-gray-50 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-contain rounded-md"
            />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">
              {title}
            </h3>
            <p className="font-mono font-bold text-sm text-gray-900">
              {formattedPrice}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                "px-2 py-0.5 text-[10px] font-mono font-bold rounded tracking-wider uppercase",
                statusBadgeMobile,
              )}
            >
              {statusUpper}
            </span>
            <span className="font-mono text-xs text-gray-400">
              {views} views
            </span>
          </div>

          <button
            onClick={onEdit}
            className="flex items-center gap-0.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
          >
            Edit
            <Icon icon={"akar-icons:chevron-right"} className="w-3.5 h-3.5"></Icon>
          </button>
        </div>
      </div>
    </div>
  );
}
