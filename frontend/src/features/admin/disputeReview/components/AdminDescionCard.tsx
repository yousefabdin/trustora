import React, { useState } from "react";
import Typography from "@/components/atoms/typography/typography";
import Button from "@/components/atoms/Button/Button";
import RadioButton from "@/components/molecules/inputs/RadioButton";
import TextArea from "@/components/molecules/inputs/TextArea";
import { useResolveDispute } from "@/services/disputeService";
import type { Order } from "@/utils/orderSeed";
import { getApiErrorMessage } from "@/apis/axios";
import { toast } from "sonner";

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
  hideSubmitButtonOnMobile?: boolean;
}

export default function AdminDecisionCard({
  disputeOrder,
  onSubmitResolution,
  hideSubmitButtonOnMobile = true,
}: AdminDecisionCardProps) {
  const [selectedOption, setSelectedOption] =
    useState<DecisionOption>("partial_refund");
  const [partialAmount, setPartialAmount] = useState<string>("600.00");
  const [resolutionNotes, setResolutionNotes] = useState<string>(
    "Proposed cleaning offset.",
  );

  const resolveMutation = useResolveDispute();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            toast.success("Dispute resolution submitted successfully");
          },
          onError: (err) => {
            toast.error(getApiErrorMessage(err, "Failed to submit resolution"));
          },
        },
      );
    }
  };

  return (
    <div className="w-full p-4 md:p-[20px] gap-3 md:gap-[16px] flex flex-col bg-surface-default border border-accent-default border-l-4 rounded-[6px] shadow-xs">
      <div className="flex flex-col w-full">
        <Typography
          variant="h3"
          className="text-content-primary text-[15px]! font-bold"
        >
          Admin Decision
        </Typography>
        <Typography
          variant="bodySmall"
          className="text-content-tertiary text-[12px]! hidden md:block"
        >
          Select the appropriate outcome to resolve escrow hold
        </Typography>
      </div>

      <form
        id="admin-decision-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-[10px] w-full"
      >
        <label className="flex items-center gap-2.5 cursor-pointer">
          <RadioButton
            name="decision"
            value="full_refund"
            checked={selectedOption === "full_refund"}
            onChange={() => setSelectedOption("full_refund")}
            radioButtonLabel={"Full refund to buyer"}
          />
        </label>

        <div className="flex flex-col gap-2 w-full">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <RadioButton
              name="decision"
              value="partial_refund"
              checked={selectedOption === "partial_refund"}
              onChange={() => setSelectedOption("partial_refund")}
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
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 text-sm font-mono font-bold text-content-primary bg-surface-default border border-outline-focus rounded-[6px] focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <TextArea
                rows={2}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full p-2.5 text-xs text-content-secondary bg-surface-default border border-outline-default rounded-[6px] focus:outline-none focus:border-outline-focus resize-none leading-relaxed"
                placeholder="Proposed cleaning offset."
                label={""}
              />
            </div>
          )}
        </div>

        <div className="hidden md:flex flex-col gap-[10px]">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <RadioButton
              name="decision"
              value="release_seller"
              checked={selectedOption === "release_seller"}
              onChange={() => setSelectedOption("release_seller")}
              radioButtonLabel={"Release funds to seller"}
            />
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <RadioButton
              name="decision"
              value="request_evidence"
              checked={selectedOption === "request_evidence"}
              onChange={() => setSelectedOption("request_evidence")}
              radioButtonLabel={"Request more evidence"}
            />
          </label>
        </div>

        <div className="hidden md:block pt-2 w-full">
          <Button
            type="submit"
            variant="primary"
            disabled={resolveMutation.isPending}
            className="w-full py-2.5 bg-accent-default hover:bg-accent-hover text-content-inverse font-semibold text-sm rounded-[6px]! transition-colors cursor-pointer"
          >
            {resolveMutation.isPending ? "Submitting..." : "Submit Resolution"}
          </Button>
        </div>
      </form>
    </div>
  );
}
