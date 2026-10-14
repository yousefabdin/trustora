import CardSummarySection from "./CardSummarySection";
import CheckoutForm from "./CheckoutForm";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PaySectionMobile from "./PaySectionMobile";
import { useState, useEffect } from "react";
import { createOrder } from "@/services/orderService";
import { getListingById, type MarketplaceListing } from "@/services/itemsServices";
import { getOffersForListing } from "@/services/offerService";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/components/molecules/toast/Toast";
import { getApiErrorMessage } from "@/apis/axios";
import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/Typography";

export default function CheckoutSection() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const stateItem = state?.item as MarketplaceListing | undefined;
  const [item, setItem] = useState<MarketplaceListing | null>(stateItem || null);
  const [isLoading, setIsLoading] = useState(!stateItem && Boolean(id));
  const [appliedOffer, setAppliedOffer] = useState<{
    originalPrice: number;
    offerPrice: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadListingDetails() {
      if (!id) return;

      try {
        setIsLoading(true);
        const listing = await getListingById(id);
        if (!isMounted) return;

        const originalPrice = listing.itemPrice;
        let finalPrice = listing.itemPrice;
        let isOfferApplied = false;

        // 1. Check if offerPrice is provided in URL query params
        const offerPriceParam = searchParams.get("offerPrice");
        if (offerPriceParam) {
          const parsed = parseFloat(offerPriceParam);
          if (!isNaN(parsed) && parsed > 0) {
            finalPrice = parsed;
            isOfferApplied = true;
          }
        }

        // 2. If not in query params, check if current user has an accepted offer
        if (!isOfferApplied) {
          try {
            const offers = await getOffersForListing(id);
            const accepted = offers.find((o) => o.status === "accepted");
            if (accepted) {
              finalPrice = accepted.amountCents / 100;
              isOfferApplied = true;
            }
          } catch {
            // Non-blocking if offers check fails
          }
        }

        if (isOfferApplied && finalPrice !== originalPrice) {
          setAppliedOffer({ originalPrice, offerPrice: finalPrice });
        }

        setItem({
          ...listing,
          itemPrice: finalPrice,
        });
      } catch (err) {
        console.error("Failed to load listing for checkout:", err);
        showToast({
          variant: "error",
          message: "Failed to load listing for checkout.",
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadListingDetails();

    return () => {
      isMounted = false;
    };
  }, [id, searchParams]);

  // Prevent buying own listing
  useEffect(() => {
    if (
      user &&
      item &&
      (user.id === item.sellerId ||
        (item.sellerEmail &&
          user.email?.toLowerCase() === item.sellerEmail?.toLowerCase()) ||
        (item.sellerName &&
          user.email?.split("@")[0].toLowerCase() ===
            item.sellerName.replace(/^@/, "").toLowerCase()))
    ) {
      showToast({
        variant: "error",
        message: "You cannot purchase your own listing.",
      });
      navigate("/browse", { replace: true });
    }
  }, [user, item, navigate]);

  const handleOrderPayment = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (!item?.id) {
      showToast({
        variant: "error",
        message: "No valid listing found to purchase.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder = await createOrder(String(item.id));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate(`/checkout/success/${newOrder.id}`);
    } catch (err) {
      showToast({
        variant: "error",
        message: getApiErrorMessage(err),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3 py-20 bg-page-primary">
        <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin text-accent-default" />
        <Typography variant="body" className="text-content-secondary font-medium">
          Loading checkout details...
        </Typography>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4 py-20 px-4 text-center bg-page-primary">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
          <Icon icon="lucide:alert-circle" className="w-6 h-6" />
        </div>
        <Typography variant="h3" className="font-bold text-content-primary">
          Listing Not Found
        </Typography>
        <Typography variant="body" className="text-content-secondary max-w-md">
          The requested item could not be retrieved or has been removed.
        </Typography>
        <button
          onClick={() => navigate("/browse")}
          className="px-4 py-2 bg-accent-default text-white font-semibold rounded-lg text-sm hover:opacity-90 cursor-pointer"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-page-primary">
      {/* Accepted Offer Banner */}
      {appliedOffer && (
        <div className="w-full bg-emerald-50 border-b border-emerald-200 px-4 py-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-emerald-800 font-medium">
          <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Accepted Offer Applied!</strong> You are paying{" "}
            <strong>
              $
              {appliedOffer.offerPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>{" "}
            (negotiated from original asking price $
            {appliedOffer.originalPrice.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            ).
          </span>
        </div>
      )}

      <div className="block md:hidden w-full">
        <CardSummarySection item={item} mobileOnly />
      </div>

      <div className="w-full flex flex-col md:flex-row items-start py-5 px-4 md:px-6 lg:px-[64px] md:pt-[40px] lg:pb-[80px] gap-6 lg:gap-[64px]">
        <div className="w-full md:flex-[2] min-w-0">
          <CheckoutForm
            item={item}
            handleOrderPayment={handleOrderPayment}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="hidden md:block w-full md:flex-[1] md:min-w-[320px] lg:min-w-[360px] max-w-[480px]">
          <CardSummarySection item={item} desktopOnly />
        </div>
      </div>

      <PaySectionMobile item={item} isSubmitting={isSubmitting} />
    </div>
  );
}
