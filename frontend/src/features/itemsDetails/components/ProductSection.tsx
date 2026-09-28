import ProductGallery from "./ProductGallery";
import Cards from "@/components/molecules/cards/Cards";
import Modal from "@/components/organisms/Modal/Overlays";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function ProductSection({ item }: { item?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const displayItem = item || {
    id: 101,
    itemName: "Vintage Leica M6",
    itemPrice: 1245.0,
    sellerName: "camera_collector",
    sellerAvatar: "",
    condition: "Excellent — minor wear",
    rating: 4.9,
    category: "Cameras & Photography",
    img: "assets/images/itemImg.png",
    images: ["assets/images/itemImg.png"],
    firstDescription:
      "Classic German rangefinder camera body, manufactured circa 1992. robust mechanical and excellent cosmetic condition.",
    secondDescription:
      "Bright, clear viewfinder. Accurate shutter speeds and fully operational light meter.",
  };

  const onClose = () => {
    setIsOpen(!isOpen);
  };
  const handelClick = (id: number | string) => {
    navigate(`/checkout/:${id}`, {
      state: { item: displayItem },
    });
  };
  const handleMakeOfferClick = () => {
    setIsOpen(true);
  };

  const sellerHandle = displayItem.sellerName
    ? displayItem.sellerName.replace(/^@/, "")
    : "camera_collector";
  const sellerInitial = (sellerHandle[0] || "C").toUpperCase();

  const conditionText =
    displayItem.condition && displayItem.condition.includes("—")
      ? displayItem.condition
      : displayItem.condition
        ? `${displayItem.condition} — minor wear`
        : "Excellent — minor wear";

  const descriptionText =
    displayItem.firstDescription && displayItem.secondDescription
      ? `${displayItem.firstDescription} ${displayItem.secondDescription}`
      : displayItem.firstDescription ||
        displayItem.secondDescription ||
        "Classic German rangefinder camera body, manufactured circa 1992. robust mechanical and excellent cosmetic condition. Bright, clear viewfinder. Accurate shutter speeds and fully operational light meter.";

  const priceFormatted =
    typeof displayItem.itemPrice === "number"
      ? displayItem.itemPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : displayItem.itemPrice || "1,245.00";

  const imageSrc =
    displayItem.images?.[0] || displayItem.img || "/assets/images/itemImg.png";

  return (
    <div className="w-full bg-page-primary">
      <div className="block md:hidden w-full bg-page-primary text-content-primary font-sans">
        <header className="sticky top-0 z-30 bg-page-primary border-b border-outline-subtle flex items-center justify-between px-4 h-12">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 text-content-primary hover:text-content-secondary transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <Icon icon="lucide:arrow-left" className="w-5 h-5 stroke-[2.2]" />
          </button>

          <h1 className="text-[17px] font-bold text-content-primary tracking-tight">
            Listing Details
          </h1>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: displayItem.itemName,
                    url: window.location.href,
                  })
                  .catch(() => {});
              }
            }}
            className="p-1 -mr-1 text-content-primary hover:text-content-secondary transition-colors cursor-pointer"
            aria-label="Share listing"
          >
            <Icon icon="lucide:share-2" className="w-5 h-5 stroke-[2]" />
          </button>
        </header>

        <div className="w-full bg-page-secondary overflow-hidden">
          <img
            src={imageSrc}
            alt={displayItem.itemName}
            className="w-full aspect-[4/3] object-cover object-center block"
          />
        </div>

        <div className="px-4 pt-4 pb-28 flex flex-col gap-3.5 bg-page-primary">
          <div>
            <span className="inline-block px-2.5 py-1 bg-page-secondary text-content-secondary text-[12px] font-medium rounded-[5px] tracking-tight">
              {displayItem.category || "Cameras & Photography"}
            </span>
          </div>

          <h2 className="text-[22px] font-bold text-content-primary leading-tight tracking-tight">
            {displayItem.itemName || "Vintage Leica M6"}
          </h2>

          <div className="flex items-center gap-1.5 text-[14px]">
            <span className="text-content-secondary font-normal">
              Condition:
            </span>
            <span className="font-semibold text-content-primary">
              {conditionText}
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-escrow-surface text-escrow-foreground rounded-xl">
            <Icon
              icon="heroicons:lock-closed-20-solid"
              className="w-4 h-4 text-escrow-icon flex-shrink-0"
            />
            <span className="text-[13px] font-semibold text-escrow-foreground leading-snug">
              Payment held in escrow until confirmed
            </span>
          </div>

          <hr className="border-t border-outline-subtle my-0.5" />

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-default text-content-inverse font-bold flex items-center justify-center text-[15px] flex-shrink-0 overflow-hidden">
                {displayItem.sellerAvatar ? (
                  <img
                    src={displayItem.sellerAvatar}
                    alt={sellerHandle}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  sellerInitial
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[14.5px] font-bold text-content-primary leading-snug">
                  @{sellerHandle}
                </span>
                <span className="text-[12px] text-content-tertiary font-normal leading-tight mt-0.5">
                  148 completed escrows
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Icon
                icon="iconamoon:star-bold"
                className="w-4 h-4 text-escrow-icon flex-shrink-0"
              />
              <span className="text-[14px] font-bold text-content-primary leading-none">
                {displayItem.rating
                  ? Number(displayItem.rating).toFixed(1)
                  : "4.9"}
              </span>
            </div>
          </div>

          <hr className="border-t border-outline-subtle my-0.5" />

          <div className="flex flex-col gap-1.5 pt-0.5">
            <h3 className="text-[15.5px] font-bold text-content-primary leading-tight">
              Description
            </h3>
            <p className="text-[13px] leading-relaxed text-content-secondary font-normal">
              {descriptionText}
            </p>
          </div>
        </div>

        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-page-primary border-t border-outline-default px-[16px] pb-[24px] pt-[12px] flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-[10px]">
            <span className="text-[10.5px] font-semibold text-content-tertiary uppercase tracking-wider">
              TOTAL PRICE
            </span>
            <span className="font-jetbrains text-[22px] font-bold text-content-primary tracking-tight leading-none mt-1">
              ${priceFormatted}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handelClick(displayItem.id)}
            className="bg-accent-default hover:bg-accent-hover active:scale-[0.98] text-content-inverse font-semibold text-[14.5px] px-8 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Buy Now
          </button>
        </footer>
      </div>

      <div className="hidden md:flex flex-col justify-center items-start lg:justify-around lg:flex-row py-10 px-[40px] gap-[60px]">
        <ProductGallery item={displayItem} />
        <Cards
          variant="itemDetailcard"
          category={displayItem.category}
          condition={displayItem.condition}
          sellerRating={displayItem.rating}
          sellerAvatar={displayItem.sellerAvatar}
          price={displayItem.itemPrice}
          heading={displayItem.itemName}
          username={displayItem.sellerName}
          onBuyNow={() => handelClick(displayItem.id)}
          onMakeOffer={handleMakeOfferClick}
          className="flex"
        ></Cards>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          header="Make An Offer"
          btn1Text="Cancel"
          btn2Text="Submit Offer"
        >
          <Cards
            variant="makeOfferCard"
            category="Home Items"
            condition="excelent"
            sellerRating={5}
            sellerAvatar={"/assets/images/userFeedbackProfile3"}
            price={21312}
            onCloseModal={onClose}
          ></Cards>
        </Modal>
      </div>
    </div>
  );
}
