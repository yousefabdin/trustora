import React, { useState } from "react";
import Typography from "@/components/atoms/typography/typography"; // Adjust path as needed
import Button from "@/components/atoms/Button/Button"; // Adjust path as needed
import RadioButton from "@/components/molecules/inputs/RadioButton";
import { TextField } from "@mui/material";
import TextArea from "@/components/molecules/inputs/TextArea";

type DecisionOption =
  | "full_refund"
  | "partial_refund"
  | "release_seller"
  | "request_evidence";

interface AdminDecisionCardProps {
  onSubmitResolution?: (decision: {
    type: DecisionOption;
    partialAmount?: string;
    notes: string;
  }) => void;
}

export default function AdminDecisionCard({
  onSubmitResolution,
}: AdminDecisionCardProps) {
  const [selectedOption, setSelectedOption] =
    useState<DecisionOption>("partial_refund");
  const [partialAmount, setPartialAmount] = useState<string>("600.00");
  const [resolutionNotes, setResolutionNotes] = useState<string>(
    "Partial refund of $600 proposed to cover professional cleaning of the internal optics at an authorized Leica workshop. Remaining $645 to be released to the seller.",
  );

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
  };

  return (
    <div className="w-full p-[20px] gap-[16px] flex flex-col bg-surface-default border border-accent-default border-l-4 rounded-[6px] shadow-xs">
      <div className="flex flex-col  w-full">
        <Typography
          variant="h3"
          className="text-content-primary text-[15px]! font-bold"
        >
          Admin Decision
        </Typography>
        <Typography
          variant="bodySmall"
          className="text-content-tertiary text-[12px]!"
        >
          Select the appropriate outcome to resolve escrow hold
        </Typography>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[10px] w-full">
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
              radioButtonLabel={"Partial refund (specify amount)"}
            />
          </label>

          {selectedOption === "partial_refund" && (
            <div className="relative w-full pl-6">
              <span className="absolute left-9 top-1/2 -translate-y-1/2 text-content-tertiary font-mono text-sm">
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
          )}
        </div>

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

        <div className="flex flex-col gap-1.5 pt-2 w-full">
          <Typography
            variant="caption"
            className="text-content-tertiary font-[500]! tracking-wider uppercase text-[12px] "
          >
            RESOLUTION NOTES
          </Typography>
          <TextArea
            rows={3}
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            className="w-full p-2.5 text-xs text-content-secondary bg-surface-default border border-outline-default rounded-[6px] focus:outline-none focus:border-outline-focus resize-none leading-relaxed"
            placeholder="Provide reasoning for this decision..."
            label={""}
          />
        </div>

        <div className="pt-2 w-full">
          <Button
            type="submit"
            variant="primary"
            className="w-full py-2.5 bg-accent-default hover:bg-accent-hover text-content-inverse font-semibold text-sm rounded-[6px]! transition-colors cursor-pointer"
          >
            Submit Resolution
          </Button>
        </div>
      </form>
    </div>
  );
}
