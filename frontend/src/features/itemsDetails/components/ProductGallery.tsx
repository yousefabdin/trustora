import Button from "@/components/atoms/Button/Button";
import type { MarketplaceListing } from "@/utils/ItemsSeed";
import { useState } from "react";
import clsx from "clsx";
interface ItemGalleryProps {
  item: MarketplaceListing;
}
export default function ProductGallery({ item }: ItemGalleryProps) {
  const [selected, setSelected] = useState(item.images[0]);
  const handleClickImage = (imgUrl: string) => {
    setSelected(imgUrl);
  };
  return (
    <div className="w-full flex items-start flex-col gap-[16px]">
      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-outline-subtle bg-page-secondary">
        <img
          src={selected}
          alt={item.itemName}
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="w-full grid grid-cols-4 gap-3">
        {item.images.slice(0, 4).map((imgUrl, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "w-full aspect-[4/3] p-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-page-secondary",
              imgUrl === selected
                ? "border-accent-default shadow-xs"
                : "border-outline-subtle opacity-75 hover:opacity-100 hover:border-outline-strong",
            )}
            onClick={() => handleClickImage(imgUrl)}
          >
            <img
              src={imgUrl}
              alt=""
              className="w-full h-full object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
