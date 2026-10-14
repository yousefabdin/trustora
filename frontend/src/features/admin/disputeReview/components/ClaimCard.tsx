import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/typography";
import { formatActivityDate } from "@/utils/dateUtils";
import type { Order } from "@/utils/orderSeed";

interface EvidenceFile {
  name: string;
  url?: string;
}

interface ClaimCardProps {
  variant: "buyer" | "seller";
  disputeOrder?: Order;
  evidenceFiles?: EvidenceFile[];
  onMoreClick?: () => void;
}

export default function ClaimCard({
  variant,
  disputeOrder,
  evidenceFiles,
  onMoreClick,
}: ClaimCardProps) {
  const isBuyer = variant === "buyer";
  const [isOpen, setIsOpen] = useState(isBuyer);
  const [selectedImage, setSelectedImage] = useState<EvidenceFile | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  const buyerHandle = disputeOrder?.buyerName
    ? disputeOrder.buyerName.startsWith("@")
      ? disputeOrder.buyerName
      : `@${disputeOrder.buyerName}`
    : "@vintage_buyer";

  const sellerHandle = disputeOrder?.sellerName
    ? disputeOrder.sellerName.startsWith("@")
      ? disputeOrder.sellerName
      : `@${disputeOrder.sellerName}`
    : "@camera_collector";

  const buyerDisplayName = disputeOrder?.buyerName
    ? disputeOrder.buyerName
        .replace("@", "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Vintage Buyer";

  const sellerDisplayName = disputeOrder?.sellerName
    ? disputeOrder.sellerName
        .replace("@", "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Camera Collector";

  const buyerInitials = disputeOrder?.buyerName
    ? disputeOrder.buyerName.replace("@", "").slice(0, 2).toUpperCase()
    : "VB";

  const sellerInitials = disputeOrder?.sellerName
    ? disputeOrder.sellerName.replace("@", "").slice(0, 2).toUpperCase()
    : "CC";

  const disputeEvent = disputeOrder?.statusHistory?.find(
    (h) =>
      h.status === "Disputed" || h.title?.toLowerCase().includes("dispute"),
  );
  const shippedEvent = disputeOrder?.statusHistory?.find(
    (h) =>
      h.status === "Shipped" ||
      h.title?.toLowerCase().includes("shipped") ||
      h.title?.toLowerCase().includes("seller"),
  );

  const buyerDateStr =
    disputeEvent?.date || disputeOrder?.createdAt || disputeOrder?.orderDate;
  const sellerDateStr =
    shippedEvent?.date || disputeOrder?.orderDate || disputeOrder?.createdAt;

  const buyerActionText = buyerDateStr
    ? formatActivityDate(buyerDateStr)
    : "Aug 7, 2:15 PM";
  const sellerActionText = sellerDateStr
    ? formatActivityDate(sellerDateStr)
    : "Aug 8, 11:30 AM";

  const buyerDescription =
    disputeOrder?.disputeNote ||
    disputeOrder?.disputeReason ||
    "The buyer reported an issue with the delivered item.";

  const sellerDescription =
    "The seller fulfilled the order with tracked shipment. Awaiting administrative adjudication of the dispute claim.";

  const rawEvidence = isBuyer
    ? (evidenceFiles && evidenceFiles.length > 0
        ? evidenceFiles
        : disputeOrder?.evidenceFiles && disputeOrder.evidenceFiles.length > 0
          ? disputeOrder.evidenceFiles
          : [])
    : (evidenceFiles && evidenceFiles.length > 0
        ? evidenceFiles
        : []);

  const activeEvidence = rawEvidence.map((file: any, idx: number) => {
    if (typeof file === "string") {
      const isImg = file.startsWith("data:") || file.startsWith("http");
      return {
        name: isImg ? `Evidence Image ${idx + 1}` : file,
        url: isImg ? file : undefined,
      };
    }
    return {
      name: file.name || `Evidence ${idx + 1}`,
      url: file.url || file.data || undefined,
    };
  });

  return (
    <div className="w-full p-4 md:p-[20px] gap-3 md:gap-[16px] flex flex-col bg-surface-default border border-outline-default rounded-[6px] shadow-xs transition-all">
      <div
        className="flex items-center justify-between w-full cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Typography
          variant="h3"
          className="text-content-primary font-bold text-[15px]!"
        >
          {isBuyer ? "Buyer's Claim" : "Seller's Response"}
        </Typography>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="text-content-tertiary hover:text-content-primary transition-colors cursor-pointer p-1"
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            <Icon
              icon={isOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
              className="w-4 h-4 text-content-secondary"
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          <div className="flex items-center gap-3 w-full">
            <div className="w-9 h-9 rounded-full bg-surface-raised border border-outline-subtle flex items-center justify-center text-xs font-bold text-content-primary font-mono shrink-0">
              {isBuyer ? buyerInitials : sellerInitials}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Typography
                  variant="body"
                  className="text-content-primary font-bold leading-tight text-[14px]! font-[600]!"
                >
                  {isBuyer ? buyerDisplayName : sellerDisplayName}
                </Typography>
                <Typography
                  variant="bodySmall"
                  className="text-content-secondary font-[400] leading-tight text-[12px]!"
                >
                  {isBuyer ? buyerHandle : sellerHandle}
                </Typography>
              </div>
              <Typography
                variant="caption"
                className="text-content-tertiary text-[12px] leading-tight pt-0.5"
              >
                {isBuyer ? buyerActionText : sellerActionText}
              </Typography>
            </div>
          </div>

          <Typography
            variant="body"
            className="text-content-secondary leading-[20px] text-[13px] md:text-[14px]"
          >
            {isBuyer ? buyerDescription : sellerDescription}
          </Typography>

          {activeEvidence.length > 0 ? (
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[12px] font-semibold text-content-secondary">
                Submitted Evidence ({activeEvidence.length})
              </span>
              <div className="flex items-center gap-3 flex-wrap">
                {activeEvidence.map((file, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(file)}
                    className="group relative w-[110px] h-[95px] rounded-[8px] bg-neutral-100 border border-outline-subtle hover:border-accent-default overflow-hidden flex flex-col transition-all cursor-pointer shadow-2xs hover:shadow-xs"
                    title={`Click to view ${file.name}`}
                  >
                    {file.url ? (
                      <div className="relative w-full h-[65px] bg-neutral-200 overflow-hidden flex items-center justify-center">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Icon
                            icon="lucide:zoom-in"
                            className="w-5 h-5 text-white drop-shadow"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-[65px] bg-[#F5F5F4] flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
                        <Icon
                          icon="lucide:file-text"
                          className="w-6 h-6 text-content-tertiary group-hover:text-content-primary"
                        />
                      </div>
                    )}
                    <div className="px-1.5 py-1 bg-white border-t border-outline-subtle flex items-center justify-between">
                      <Typography
                        variant="caption"
                        className="text-content-secondary font-medium text-[11px] truncate w-full text-center group-hover:text-accent-default transition-colors"
                      >
                        {file.name}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-1">
              <span className="text-[12px] text-content-tertiary italic">
                {isBuyer ? "No evidence files attached" : "No evidence files submitted"}
              </span>
            </div>
          )}
        </>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-surface-default rounded-xl shadow-2xl overflow-hidden flex flex-col border border-outline-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-default bg-page-secondary/80">
              <div className="flex items-center gap-2 truncate">
                <Icon
                  icon="lucide:image"
                  className="w-4 h-4 text-accent-default shrink-0"
                />
                <span className="font-semibold text-sm text-content-primary truncate">
                  {selectedImage.name}
                </span>
                <span className="text-xs text-content-tertiary font-mono">
                  ({isBuyer ? "Buyer Evidence" : "Seller Evidence"})
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selectedImage.url && (
                  <a
                    href={selectedImage.url}
                    target="_blank"
                    rel="noreferrer"
                    download={selectedImage.name}
                    className="p-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-page-tertiary transition-colors"
                    title="Open full size / Download"
                  >
                    <Icon icon="lucide:external-link" className="w-4 h-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 rounded-lg text-content-secondary hover:text-content-primary hover:bg-page-tertiary transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <Icon icon="lucide:x" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-neutral-950 flex items-center justify-center overflow-auto max-h-[calc(90vh-100px)] min-h-[300px]">
              {selectedImage.url ? (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="max-h-[75vh] max-w-full object-contain rounded"
                />
              ) : (
                <div className="text-white text-sm flex flex-col items-center gap-2">
                  <Icon icon="lucide:file-text" className="w-12 h-12 text-gray-400" />
                  <span>{selectedImage.name} (No image preview available)</span>
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 bg-page-secondary/60 border-t border-outline-default flex items-center justify-between text-xs text-content-secondary">
              <span>Attached to dispute claim</span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="px-3 py-1 bg-white hover:bg-gray-100 border border-outline-strong rounded-md text-xs font-semibold text-content-primary transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
