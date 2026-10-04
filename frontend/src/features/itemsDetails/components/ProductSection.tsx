import ProductGallery from "./ProductGallery";
import Cards from "@/components/molecules/cards/Cards";
import Modal from "@/components/organisms/Modal/Overlays";
import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/components/molecules/toast/Toast";

export default function ProductSection({ item }: { item?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mobilePhotoIndex, setMobilePhotoIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const displayItem = item || {
    id: 101,
    itemName: "Vintage Leica M6",
    itemPrice: 1245.0,
    sellerName: "camera_collector",
    sellerAvatar: "",
    condition: "Excellent — minor wear",
    rating: 4.9,
    category: "Cameras & Photography",
    img: "/assets/images/itemImg.png",
    images: ["/assets/images/itemImg.png"],
    firstDescription:
      "Classic German rangefinder camera body, manufactured circa 1992. robust mechanical and excellent cosmetic condition.",
    secondDescription:
      "Bright, clear viewfinder. Accurate shutter speeds and fully operational light meter.",
  };

  const defaultFallbackImages = [
    displayItem.images?.[0] || displayItem.img || "/assets/images/itemImg.png",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80",
  ];

  const imagesList: string[] =
    displayItem.images && displayItem.images.length > 1
      ? displayItem.images
      : displayItem.images && displayItem.images.length === 1
        ? [displayItem.images[0], ...defaultFallbackImages.slice(1)]
        : defaultFallbackImages;

  const handlePrevPhoto = () => {
    setMobilePhotoIndex((prev) =>
      prev === 0 ? imagesList.length - 1 : prev - 1,
    );
  };

  const handleNextPhoto = () => {
    setMobilePhotoIndex((prev) =>
      prev === imagesList.length - 1 ? 0 : prev + 1,
    );
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const isOwnListing = Boolean(
    user &&
      (user.id === displayItem.sellerId ||
        (displayItem.sellerEmail &&
          user.email?.toLowerCase() === displayItem.sellerEmail?.toLowerCase()) ||
        (displayItem.sellerName &&
          user.email?.split("@")[0].toLowerCase() ===
            displayItem.sellerName.replace(/^@/, "").toLowerCase()))
  );

  const isSold = displayItem.status === "sold";

  const handelClick = (id: number | string) => {
    if (isSold) {
      showToast({
        variant: "error",
        message: "This item has already been purchased.",
      });
      return;
    }
    if (isOwnListing) {
      showToast({
        variant: "error",
        message: "You cannot purchase your own listing.",
      });
      return;
    }
    navigate(`/checkout/${id}`, {
      state: { item: displayItem },
    });
  };

  const handleMakeOfferClick = () => {
    if (isSold) {
      showToast({
        variant: "error",
        message: "This item has already been purchased.",
      });
      return;
    }
    if (isOwnListing) {
      showToast({
        variant: "error",
        message: "You cannot make an offer on your own listing.",
      });
      return;
    }
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

          <Typography
            variant="h3"
            className="text-[17px] font-bold text-content-primary tracking-tight"
          >
            Listing Details
          </Typography>

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

        <div className="px-4 pt-4 pb-32 flex flex-col gap-3.5 bg-page-primary">
          <div>
            <Typography
              variant="caption"
              className="inline-block px-2.5 py-1 bg-page-secondary text-content-secondary text-[12px] font-medium rounded-[5px] tracking-tight"
            >
              {displayItem.category || "Cameras & Photography"}
            </Typography>
          </div>

          <Typography
            variant="h2"
            className="text-[22px] font-bold text-content-primary leading-tight tracking-tight"
          >
            {displayItem.itemName || "Vintage Leica M6"}
          </Typography>

          <div className="flex items-center gap-1.5 text-[14px]">
            <Typography variant="body" className="text-content-secondary font-normal">
              Condition:
            </Typography>
            <Typography variant="body" className="font-semibold text-content-primary">
              {conditionText}
            </Typography>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-2.5 bg-escrow-surface text-escrow-foreground rounded-xl">
            <Icon
              icon="heroicons:lock-closed-20-solid"
              className="w-4 h-4 text-escrow-icon shrink-0"
            />
            <Typography
              variant="bodySmall"
              className="text-[13px] font-semibold text-escrow-foreground leading-snug"
            >
              Payment held in escrow until confirmed
            </Typography>
          </div>

          <hr className="border-t border-outline-subtle my-0.5" />

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-default text-content-inverse font-bold flex items-center justify-center text-[15px] shrink-0 overflow-hidden">
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
                <Typography
                  variant="body"
                  className="text-[14.5px] font-bold text-content-primary leading-snug"
                >
                  @{sellerHandle}
                </Typography>
                <Typography
                  variant="caption"
                  className="text-[12px] text-content-tertiary font-normal leading-tight mt-0.5"
                >
                  148 completed escrows
                </Typography>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Icon
                icon="iconamoon:star-bold"
                className="w-4 h-4 text-escrow-icon shrink-0"
              />
              <Typography
                variant="body"
                className="text-[14px] font-bold text-content-primary leading-none"
              >
                {displayItem.rating
                  ? Number(displayItem.rating).toFixed(1)
                  : "4.9"}
              </Typography>
            </div>
          </div>

          <hr className="border-t border-outline-subtle my-0.5" />

          <div className="flex flex-col gap-1.5 pt-0.5 min-w-0 max-w-full">
            <Typography
              variant="h3"
              className="text-[15.5px] font-bold text-content-primary leading-tight"
            >
              Description
            </Typography>
            <Typography
              variant="body"
              className="text-[13px] leading-relaxed text-content-secondary font-normal break-words [overflow-wrap:anywhere] whitespace-pre-line"
            >
              {descriptionText}
            </Typography>
          </div>

          <hr className="border-t border-outline-subtle my-1" />

          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-center justify-between">
              <Typography
                variant="h3"
                className="text-[15.5px] font-bold text-content-primary leading-tight"
              >
                Item Photos
              </Typography>
              <Typography
                variant="caption"
                className="text-content-tertiary font-jetbrains text-[12px]"
              >
                {mobilePhotoIndex + 1} / {imagesList.length}
              </Typography>
            </div>

            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-page-secondary border border-outline-subtle shadow-xs">
              <img
                src={imagesList[mobilePhotoIndex]}
                alt={`${displayItem.itemName} photo ${mobilePhotoIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-200"
              />

              <button
                type="button"
                onClick={handlePrevPhoto}
                aria-label="Previous photo"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface-default/90 hover:bg-surface-default text-content-primary flex items-center justify-center shadow-md backdrop-blur-xs transition-transform active:scale-90 cursor-pointer border border-outline-subtle"
              >
                <Icon
                  icon="lucide:chevron-left"
                  className="w-5 h-5 stroke-[2.5]"
                />
              </button>

              <button
                type="button"
                onClick={handleNextPhoto}
                aria-label="Next photo"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-surface-default/90 hover:bg-surface-default text-content-primary flex items-center justify-center shadow-md backdrop-blur-xs transition-transform active:scale-90 cursor-pointer border border-outline-subtle"
              >
                <Icon
                  icon="lucide:chevron-right"
                  className="w-5 h-5 stroke-[2.5]"
                />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMobilePhotoIndex(idx)}
                  className={clsx(
                    "relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer",
                    idx === mobilePhotoIndex
                      ? "border-accent-default shadow-xs"
                      : "border-outline-subtle opacity-70 hover:opacity-100",
                  )}
                >
                  <img
                    src={imgUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="pt-2">
              <Button
                variant="secondary"
                size="large"
                className="w-full py-2.5 rounded-lg font-semibold text-[14px]"
                onClick={handleMakeOfferClick}
              >
                Make an Offer
              </Button>
            </div>
          </div>
        </div>

        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-page-primary border-t border-outline-default px-4 pb-6 pt-3 flex items-center justify-between shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col">
            <Typography
              variant="caption"
              className="text-[10.5px] font-semibold text-content-tertiary uppercase tracking-wider"
            >
              TOTAL PRICE
            </Typography>
            <Typography
              variant="currencyLarge"
              className="text-[20px] font-bold text-content-primary leading-tight mt-0.5"
            >
              ${priceFormatted}
            </Typography>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="medium"
              disabled={isOwnListing || isSold}
              onClick={handleMakeOfferClick}
              className={clsx(
                "rounded-lg text-[13px] font-semibold px-3.5 py-2",
                (isOwnListing || isSold) && "opacity-50! cursor-not-allowed!"
              )}
            >
              Make Offer
            </Button>
            <Button
              variant="primary"
              size="medium"
              disabled={isOwnListing || isSold}
              onClick={() => handelClick(displayItem.id)}
              className={clsx(
                "rounded-lg text-[13px] font-semibold px-5 py-2",
                (isOwnListing || isSold) && "bg-neutral-300! text-neutral-500! cursor-not-allowed hover:bg-neutral-300!"
              )}
            >
              {isOwnListing ? "Your Listing" : isSold ? "Item Sold" : "Buy Now"}
            </Button>
          </div>
        </footer>
      </div>

      <div className="hidden md:block w-full max-w-[1280px] mx-auto pt-[40px] px-6 lg:px-[80px] pb-[80px]">
        <nav className="flex items-center gap-2 text-[13px] md:text-[14px] text-content-tertiary mb-6">
          <Link to="/browse" className="hover:text-content-primary transition-colors">
            Marketplace
          </Link>
          <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5 text-content-tertiary" />
          <Link
            to={`/browse?category=${encodeURIComponent(displayItem.category?.toLowerCase() || "")}`}
            className="hover:text-content-primary transition-colors"
          >
            {displayItem.category || "Cameras & Photography"}
          </Link>
          <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5 text-content-tertiary" />
          <span className="font-semibold text-content-primary truncate max-w-[280px]">
            {displayItem.itemName || "Vintage Leica M6"}
          </span>
        </nav>

        <div className="w-full flex flex-col lg:flex-row items-start gap-[48px]">
          <div className="w-full lg:flex-1 flex flex-col gap-8 min-w-0">
            <ProductGallery item={displayItem} />

            <div className="flex flex-col gap-3 pt-2 min-w-0 max-w-full">
              <Typography variant="h2" className="text-[18px] md:text-[20px] font-bold text-content-primary">
                Listing Description
              </Typography>
              <div className="text-[14px] md:text-[15px] leading-relaxed text-content-secondary flex flex-col gap-4 font-normal min-w-0 max-w-full break-words [overflow-wrap:anywhere]">
                <p className="break-words [overflow-wrap:anywhere] whitespace-pre-line">
                  {displayItem.firstDescription ||
                    "Classic German rangefinder camera body, manufactured circa 1992. robust mechanical and excellent cosmetic condition. The viewfinder is bright, clear, and perfectly aligned. The shutter speeds are accurate to ear and testing. Light meter is fully operational and verified accurate."}
                </p>
                {displayItem.secondDescription && (
                  <p className="break-words [overflow-wrap:anywhere] whitespace-pre-line">
                    {displayItem.secondDescription}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[440px] xl:w-[460px] shrink-0 flex flex-col gap-6">
            <Cards
              variant="itemDetailcard"
              category={displayItem.category}
              condition={conditionText}
              sellerRating={displayItem.rating}
              sellerAvatar={displayItem.sellerAvatar}
              price={displayItem.itemPrice}
              heading={displayItem.itemName}
              username={sellerHandle}
              isOwnListing={isOwnListing}
              isSold={isSold}
              onBuyNow={() => handelClick(displayItem.id)}
              onMakeOffer={handleMakeOfferClick}
            />

            <Cards
              variant="sellerDetailsCard"
              sellerAvatar={displayItem.sellerAvatar}
              username={sellerHandle}
              sellerRating={displayItem.rating}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        header="Make An Offer"
        btn1Text="Cancel"
        btn2Text="Submit Offer"
        setIsOpen={setIsOpen}
      >
        <Cards
          variant="makeOfferCard"
          category={displayItem.category}
          condition={displayItem.condition}
          sellerRating={displayItem.rating}
          sellerAvatar={
            displayItem.sellerAvatar || "/assets/images/userFeedbackProfile3"
          }
          price={displayItem.itemPrice}
          heading={displayItem.itemName}
          onCloseModal={onClose}
        />
      </Modal>
    </div>
  );
}
