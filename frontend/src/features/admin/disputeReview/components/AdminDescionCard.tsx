import React, { useState, useEffect } from "react";
import Typography from "@/components/atoms/typography/typography";
import Button from "@/components/atoms/Button/Button";
import RadioButton from "@/components/molecules/inputs/RadioButton";
import TextArea from "@/components/molecules/inputs/TextArea";
import { useResolveDispute } from "@/services/disputeService";
import type { Order } from "@/utils/orderSeed";
import { getApiErrorMessage } from "@/apis/axios";
import { isDisputeResolved } from "@/utils/disputeUtils";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { clsx } from "clsx";

type DecisionOption =
  | "full_refund"
  | "partial_refund"
  | "release_seller"
  | "request_evidence";

interface AdminDecisionCardProps {
  disputeOrder?: Order;
  onSubmitResolution?: (decision: {
    type: DecisionOption;
    partialAmount?: string;
    notes: string;
  }) => void;
  onResolveSuccess?: () => void;
  hideSubmitButtonOnMobile?: boolean;
}

export default function AdminDecisionCard({
  disputeOrder,
  onSubmitResolution,
  onResolveSuccess,
  hideSubmitButtonOnMobile = true,
}: AdminDecisionCardProps) {
  const isOrderResolved = disputeOrder ? isDisputeResolved(disputeOrder) : false;
  const [isLocallySubmitted, setIsLocallySubmitted] = useState(false);
  const isLocked = isOrderResolved || isLocallySubmitted;

  const [selectedOption, setSelectedOption] = useState<DecisionOption>(() => {
    if (
      disputeOrder?.rawStatus === "released" ||
      disputeOrder?.status === "Completed"
    ) {
      return "release_seller";
    }
    return "full_refund";
  });

  const [partialAmount, setPartialAmount] = useState<string>(() =>
    disputeOrder?.totalPrice
      ? (disputeOrder.totalPrice * 0.5).toFixed(2)
      : "600.00",
  );

  const [resolutionNotes, setResolutionNotes] = useState<string>(
    "Inspection review completed. Settlement authorized.",
  );

  const resolveMutation = useResolveDispute();

  useEffect(() => {
    if (disputeOrder) {
      if (
        disputeOrder.rawStatus === "refunded" ||
        disputeOrder.status === "Refunded"
      ) {
        setSelectedOption("full_refund");
      } else if (
        disputeOrder.rawStatus === "released" ||
        disputeOrder.status === "Completed"
      ) {
        setSelectedOption("release_seller");
      }
    }
  }, [disputeOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || resolveMutation.isPending) return;

    if (onSubmitResolution) {
      onSubmitResolution({
        type: selectedOption,
        partialAmount:
          selectedOption === "partial_refund" ? partialAmount : undefined,
        notes: resolutionNotes,
      });
    }

    if (disputeOrder?.id) {
      const resolution =
        selectedOption === "release_seller" ? "release" : "refund";
      resolveMutation.mutate(
        { orderId: disputeOrder.id, resolution },
        {
          onSuccess: () => {
            setIsLocallySubmitted(true);
            onResolveSuccess?.();
            toast.success("Dispute resolution submitted successfully");
          },
          onError: (err) => {
            toast.error(getApiErrorMessage(err, "Failed to submit resolution"));
          },
        },
      );
    } else {
      setIsLocallySubmitted(true);
      onResolveSuccess?.();
      toast.success("Dispute resolution submitted successfully");
    }
  };

  return (
    <div
      className={clsx(
        "w-full p-4 md:p-[20px] gap-3 md:gap-[16px] flex flex-col bg-surface-default border border-l-4 rounded-[6px] shadow-xs transition-colors",
        isLocked
          ? "border-emerald-500/40 border-l-emerald-600 bg-surface-default"
          : "border-accent-default border-l-accent-default",
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <Typography
              variant="h3"
              className="text-content-primary text-[15px]! font-bold"
            >
              Admin Decision
            </Typography>
            {isLocked && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Icon icon="lucide:lock" className="w-3 h-3 text-emerald-700" />
                Decision Locked
              </span>
            )}
          </div>
          <Typography
            variant="bodySmall"
            className="text-content-tertiary text-[12px]! hidden md:block"
          >
            {isLocked
              ? "This dispute has been adjudicated. Escrow disposition is permanently finalized."
              : "Select the appropriate outcome to resolve escrow hold"}
          </Typography>
        </div>
      </div>

      {isLocked && (
        <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-[8px] flex items-start gap-3 text-xs text-emerald-950 shadow-2xs">
          <div className="w-7 h-7 rounded-full bg-emerald-200/80 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
            <Icon icon="lucide:shield-check" className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-bold text-[13px] text-emerald-950">
              {selectedOption === "release_seller"
                ? "Escrow Funds Released to Seller"
                : selectedOption === "partial_refund"
                  ? `Partial Refund Issued ($${partialAmount})`
                  : "Full Refund Issued to Buyer"}
            </span>
            <span className="text-emerald-800 text-[12px] leading-relaxed">
              Resolution has been processed. The escrow hold is settled and this decision card is locked against any further modifications.
            </span>
          </div>
        </div>
      )}

      <form
        id="admin-decision-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-[10px] w-full"
      >
        <label className={clsx("flex items-center gap-2.5", isLocked ? "cursor-not-allowed opacity-75" : "cursor-pointer")}>
          <RadioButton
            name="decision"
            value="full_refund"
            checked={selectedOption === "full_refund"}
            disabled={isLocked}
            onChange={() => !isLocked && setSelectedOption("full_refund")}
            radioButtonLabel={"Full refund to buyer"}
          />
        </label>

        <div className="flex flex-col gap-2 w-full">
          <label className={clsx("flex items-center gap-2.5", isLocked ? "cursor-not-allowed opacity-75" : "cursor-pointer")}>
            <RadioButton
              name="decision"
              value="partial_refund"
              checked={selectedOption === "partial_refund"}
              disabled={isLocked}
              onChange={() => !isLocked && setSelectedOption("partial_refund")}
              radioButtonLabel={"Partial refund"}
            />
          </label>

          {selectedOption === "partial_refund" && (
            <div className="flex flex-col gap-2 w-full pl-6">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary font-mono text-sm">
                  $
                </span>
                <input
                  type="number"
                  value={partialAmount}
                  disabled={isLocked}
                  readOnly={isLocked}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className={clsx(
                    "w-full pl-7 pr-3 py-1.5 text-sm font-mono font-bold text-content-primary border rounded-[6px] focus:outline-none",
                    isLocked
                      ? "bg-gray-100 border-outline-default cursor-not-allowed opacity-80"
                      : "bg-surface-default border-outline-focus",
                  )}
                  placeholder="0.00"
                />
              </div>

              <TextArea
                rows={2}
                value={resolutionNotes}
                disabled={isLocked}
                readOnly={isLocked}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className={clsx(
                  "w-full p-2.5 text-xs text-content-secondary border rounded-[6px] focus:outline-none resize-none leading-relaxed",
                  isLocked
                    ? "bg-gray-100 border-outline-default cursor-not-allowed opacity-80"
                    : "bg-surface-default border-outline-default focus:border-outline-focus",
                )}
                placeholder="Proposed resolution rationale."
                label={""}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-[10px]">
          <label className={clsx("flex items-center gap-2.5", isLocked ? "cursor-not-allowed opacity-75" : "cursor-pointer")}>
            <RadioButton
              name="decision"
              value="release_seller"
              checked={selectedOption === "release_seller"}
              disabled={isLocked}
              onChange={() => !isLocked && setSelectedOption("release_seller")}
              radioButtonLabel={"Release funds to seller"}
            />
          </label>

          <label className={clsx("flex items-center gap-2.5", isLocked ? "cursor-not-allowed opacity-75" : "cursor-pointer")}>
            <RadioButton
              name="decision"
              value="request_evidence"
              checked={selectedOption === "request_evidence"}
              disabled={isLocked}
              onChange={() => !isLocked && setSelectedOption("request_evidence")}
              radioButtonLabel={"Request more evidence"}
            />
          </label>
        </div>

        <div className="hidden md:block pt-2 w-full">
          {isLocked ? (
            <Button
              type="button"
              variant="secondary"
              disabled
              className="w-full py-2.5 bg-gray-100! hover:bg-gray-100! text-content-tertiary! border border-outline-default font-semibold text-sm rounded-[6px]! cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Icon icon="lucide:lock" className="w-4 h-4 text-content-tertiary" />
              Decision Locked
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              disabled={resolveMutation.isPending}
              className="w-full py-2.5 bg-accent-default hover:bg-accent-hover text-content-inverse font-semibold text-sm rounded-[6px]! transition-colors cursor-pointer"
            >
              {resolveMutation.isPending ? "Submitting..." : "Submit Resolution"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
