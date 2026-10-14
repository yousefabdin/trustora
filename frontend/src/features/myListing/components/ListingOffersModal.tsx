import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import Typography from "@/components/atoms/typography/typography";
import Button from "@/components/atoms/Button/Button";
import { showToast } from "@/components/molecules/toast/Toast";
import type { MarketplaceListing } from "@/services/itemsServices";
import {
  getOffersForListing,
  updateOfferStatus,
  type OfferRecord,
} from "@/services/offerService";

interface ListingOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: MarketplaceListing | null;
  onStatusChange?: () => void;
}

export default function ListingOffersModal({
  isOpen,
  onClose,
  listing,
  onStatusChange,
}: ListingOffersModalProps) {
  const [offers, setOffers] = useState<OfferRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "declined">("all");

  const loadOffers = useCallback(async () => {
    if (!listing?.id) return;
    try {
      setIsLoading(true);
      const data = await getOffersForListing(String(listing.id));
      setOffers(data);
    } catch (err: any) {
      console.error("Failed to load offers for listing:", err);
      showToast({
        variant: "error",
        message: err.response?.data?.message || "Failed to load offers",
      });
    } finally {
      setIsLoading(false);
    }
  }, [listing?.id]);

  useEffect(() => {
    if (isOpen && listing) {
      loadOffers();
    } else {
      setOffers([]);
    }
  }, [isOpen, listing, loadOffers]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !listing) return null;

  const handleUpdateStatus = async (
    offerId: string,
    status: "accepted" | "declined",
  ) => {
    try {
      setProcessingId(offerId);
      const updated = await updateOfferStatus(offerId, status);
      setOffers((prev) =>
        prev.map((off) => (off.id === offerId ? { ...off, status: updated.status } : off)),
      );
      showToast({
        variant: status === "accepted" ? "success" : "info",
        message:
          status === "accepted"
            ? "Offer approved! The buyer has been notified to complete payment."
            : "Offer declined.",
      });
      onStatusChange?.();
    } catch (err: any) {
      showToast({
        variant: "error",
        message: err.response?.data?.message || `Failed to ${status} offer`,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = offers.filter((o) => o.status === "pending").length;
  const acceptedCount = offers.filter((o) => o.status === "accepted").length;
  const declinedCount = offers.filter((o) => o.status === "declined").length;

  const filteredOffers = offers.filter((off) => {
    if (filter === "all") return true;
    return off.status === filter;
  });

  const listPriceCents = Math.round(listing.itemPrice * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-page-inverse/45 backdrop-blur-[2px] transition-opacity overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[620px] max-h-[90vh] my-auto bg-surface-default border border-outline-default rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offers-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-outline-subtle bg-surface-raised shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-subtle flex items-center justify-center text-accent-default shadow-2xs">
              <Icon icon="ic:outline-local-offer" className="w-5 h-5" />
            </div>
            <div>
              <Typography
                variant="h3"
                id="offers-modal-title"
                className="text-[17px] font-bold text-content-primary leading-tight"
              >
                Listing Offers
              </Typography>
              <Typography
                variant="caption"
                className="text-[12px] text-content-tertiary"
              >
                Review incoming buyer offers and approve or decline them
              </Typography>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-page-tertiary transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <Icon icon="lucide:x" className="w-5 h-5" />
          </button>
        </div>

        {/* Listing Summary Bar */}
        <div className="px-5 sm:px-6 py-3 bg-page-secondary border-b border-outline-subtle flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-lg border border-outline-subtle bg-surface-default p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
            <img
              src={listing.img}
              alt={listing.itemName}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-jetbrains text-[11px] text-content-tertiary font-semibold">
                #{String(listing.id).slice(0, 8)}
              </span>
              <h4 className="font-bold text-content-primary text-sm truncate">
                {listing.itemName}
              </h4>
            </div>
            <div className="flex items-center gap-2 text-xs text-content-secondary mt-0.5">
              <span>
                List Price:{" "}
                <strong className="text-content-primary font-jetbrains">
                  ${listing.itemPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </span>
              <span>•</span>
              <span className="capitalize">{listing.status || "active"}</span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <span
              className={clsx(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                pendingCount > 0
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-surface-default text-content-secondary border-outline-subtle",
              )}
            >
              <Icon icon="ic:outline-local-offer" className="w-3.5 h-3.5" />
              {offers.length} {offers.length === 1 ? "offer" : "offers"}
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-outline-subtle bg-surface-default flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={clsx(
              "px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0",
              filter === "all"
                ? "bg-page-tertiary text-content-primary font-bold shadow-2xs"
                : "text-content-secondary hover:text-content-primary hover:bg-page-secondary",
            )}
          >
            All ({offers.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={clsx(
              "px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0 flex items-center gap-1.5",
              filter === "pending"
                ? "bg-amber-100 text-amber-900 font-bold"
                : "text-content-secondary hover:text-content-primary hover:bg-page-secondary",
            )}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-amber-500 text-white rounded-full font-bold">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFilter("accepted")}
            className={clsx(
              "px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0",
              filter === "accepted"
                ? "bg-emerald-100 text-emerald-800 font-bold"
                : "text-content-secondary hover:text-content-primary hover:bg-page-secondary",
            )}
          >
            Approved ({acceptedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("declined")}
            className={clsx(
              "px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0",
              filter === "declined"
                ? "bg-rose-100 text-rose-800 font-bold"
                : "text-content-secondary hover:text-content-primary hover:bg-page-secondary",
            )}
          >
            Declined ({declinedCount})
          </button>
        </div>

        {/* Offers List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 overscroll-contain">
          {isLoading ? (
            <div className="py-12 text-center text-content-secondary flex flex-col items-center gap-2">
              <Icon icon="lucide:loader-2" className="w-6 h-6 animate-spin text-accent-default" />
              <p className="text-sm">Loading offers...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-page-secondary text-content-tertiary mx-auto flex items-center justify-center mb-3">
                <Icon icon="ic:outline-local-offer" className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-content-primary text-sm mb-1">
                {filter === "all"
                  ? "No offers yet"
                  : `No ${filter} offers`}
              </h4>
              <p className="text-xs text-content-secondary max-w-sm mx-auto">
                {filter === "all"
                  ? "When buyers make an offer on this item, it will show up here for you to review, approve, or decline."
                  : `There are currently no offers with status "${filter}".`}
              </p>
            </div>
          ) : (
            filteredOffers.map((offer) => {
              const offerAmount = offer.amountCents / 100;
              const formattedOffer = `$${offerAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`;

              const diffCents = offer.amountCents - listPriceCents;
              const diffAmount = Math.abs(diffCents) / 100;
              const diffPct =
                listPriceCents > 0
                  ? ((diffCents / listPriceCents) * 100).toFixed(1)
                  : "0";

              const buyerHandle = offer.buyerEmail
                ? offer.buyerEmail.split("@")[0]
                : "buyer";
              const buyerInitial = (buyerHandle[0] || "B").toUpperCase();

              const isUpdating = processingId === offer.id;

              return (
                <div
                  key={offer.id}
                  className={clsx(
                    "p-4 rounded-xl border transition-all text-left flex flex-col gap-3",
                    offer.status === "pending"
                      ? "bg-surface-default border-indigo-100 hover:border-indigo-200 shadow-xs"
                      : offer.status === "accepted"
                        ? "bg-emerald-50/20 border-emerald-200"
                        : "bg-gray-50/60 border-outline-subtle opacity-75",
                  )}
                >
                  {/* Top row: Buyer info & status pill */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-accent-default text-content-inverse font-bold text-xs flex items-center justify-center shrink-0">
                        {buyerInitial}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-content-primary text-sm truncate block">
                          @{buyerHandle}
                        </span>
                        <span className="text-[11px] text-content-tertiary font-mono">
                          {new Date(offer.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {offer.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Pending Review
                        </span>
                      )}
                      {offer.status === "accepted" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Icon icon="lucide:check-circle-2" className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      )}
                      {offer.status === "declined" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <Icon icon="lucide:x-circle" className="w-3.5 h-3.5" />
                          Declined
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & comparison */}
                  <div className="flex items-baseline justify-between pt-1 border-t border-outline-subtle/60">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-content-tertiary uppercase font-semibold">
                        Offered:
                      </span>
                      <span className="font-jetbrains font-bold text-lg text-content-primary">
                        {formattedOffer}
                      </span>
                    </div>

                    <div className="text-right">
                      {diffCents === 0 ? (
                        <span className="text-xs font-semibold text-content-secondary">
                          At asking price
                        </span>
                      ) : diffCents < 0 ? (
                        <span className="text-xs font-semibold text-amber-600 font-jetbrains">
                          -${diffAmount.toFixed(2)} ({diffPct}%)
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600 font-jetbrains">
                          +${diffAmount.toFixed(2)} (+{diffPct}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buyer message if provided */}
                  {offer.message && (
                    <div className="p-2.5 rounded-lg bg-page-secondary border border-outline-subtle text-xs text-content-secondary flex items-start gap-2">
                      <Icon
                        icon="lucide:message-square"
                        className="w-3.5 h-3.5 text-content-tertiary shrink-0 mt-0.5"
                      />
                      <p className="italic leading-relaxed break-words [overflow-wrap:anywhere]">
                        "{offer.message}"
                      </p>
                    </div>
                  )}

                  {/* Action buttons (only for pending) */}
                  {offer.status === "pending" && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-subtle">
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(offer.id, "declined")}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                        Decline
                      </button>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(offer.id, "accepted")}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        {isUpdating ? (
                          <Icon icon="lucide:loader-2" className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Icon icon="lucide:check" className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                        Approve Offer
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-6 py-3 border-t border-outline-subtle bg-surface-raised flex items-center justify-between shrink-0">
          <span className="text-xs text-content-tertiary">
            Trustora Escrow Protection
          </span>
          <Button
            variant="secondary"
            size="small"
            onClick={onClose}
            className="text-xs font-semibold"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
