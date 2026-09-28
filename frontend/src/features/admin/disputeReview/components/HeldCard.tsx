import Typography from "@/components/atoms/typography/typography";
import { type Dispute } from "@/utils/disputedSeed";

interface EscrowCardProps {
  dispute?: Dispute;
  statusText?: string;
  heldSince?: string;
}

export default function EscrowCard({
  dispute,
  statusText = "HELD",
  heldSince = "Aug 5, 2026",
}: EscrowCardProps) {
  const amount = dispute?.amount || "$1,245.00";
  const daysHeld = dispute?.daysopen ? dispute.daysopen : "5 Days";

  return (
    <div className="w-full p-[20px] gap-[16px] flex flex-col bg-escrow-surface border border-escrow-outline rounded-[6px] shadow-xs">
      <div className="flex items-center justify-between w-full">
        <Typography
          variant="caption"
          className="text-escrow-icon font-semibold! tracking-wider uppercase text-[13px]"
        >
          ESCROW SECURED
        </Typography>
        <Typography
          variant="caption"
          className="text-escrow-icon font-semibold! tracking-wider uppercase text-[12px]!"
        >
          {statusText}
        </Typography>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <Typography
          variant="caption"
          className="text-escrow-icon font-[400]! text-[12px]"
        >
          Amount Held
        </Typography>
        <Typography
          variant="currencyLarge"
          className="text-page-inverse font-bold!  text-[28px]! leading-[36px]"
        >
          {amount}
        </Typography>
      </div>

      <div className="grid grid-cols-2 w-full pt-3 border-t border-escrow-outline/60 items-center">
        <div className="flex flex-col gap-.5">
          <Typography
            variant="caption"
            className="text-escrow-icon font-bold tracking-wider uppercase text-[10px]"
          >
            HELD SINCE
          </Typography>
          <Typography
            variant="body"
            className="text-content-primary font-semibold! text-[13px]"
          >
            {heldSince}
          </Typography>
        </div>

        <div className="flex flex-col">
          <Typography
            variant="caption"
            className="text-escrow-icon font-bold tracking-wider uppercase text-[10px]"
          >
            DAYS HELD
          </Typography>
          <Typography
            variant="body"
            className="text-content-primary font-bold! text-[13px]"
          >
            {daysHeld}
          </Typography>
        </div>
      </div>
    </div>
  );
}
