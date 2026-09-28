import Button from "@/components/atoms/Button/Button";
import type { MarketplaceListing } from "@/utils/ItemsSeed";
import { useState } from "react";
import clsx from "clsx";
interface ItemGalleryProps {
  item: MarketplaceListing;
}
export default function ProductGallery({ item }: ItemGalleryProps) {
  const [selected, setSelected] = useState(item.images[0]);
  const handleClickImage = (imgUrl) => {
    setSelected(imgUrl);
    console.log(imgUrl);
  };
  return (
    <div className="flex items-start flex-col gap-[12px]">
      <div className="">
        <img
          src={selected}
          alt={item.itemName}
          className="min-w-[656px] h-[492px] rounded-lg object-cover"
        />
      </div>

      <div className="w-full flex items-start justify-between gap-2">
        {item.images.map((imgUrl, index) => (
          <Button
            variant="ghost"
            className="h-[116px] p-0! cursor-pointer hover:bg-none"
            onClick={() => handleClickImage(imgUrl)}
          >
            <img
              key={index}
              src={imgUrl}
              className={clsx(
                "h-[116px] w-full rounded-[6px] object-cover border border-page-tertiary hover:border-accent-default",
                { "border-2 border-accent-default! ": imgUrl === selected },
              )}
            />
          </Button>
        ))}
      </div>
    </div>
  );
}
