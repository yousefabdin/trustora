import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { useState } from "react";
import { showToast } from "@/components/molecules/toast/Toast";
import TextArea from "@/components/molecules/inputs/TextArea";
interface OrderConfirmationCardProps {
  roles: "seller" | "buyer" | "Admin";
}
export default function OrderConfirmationCard({
  roles,
}: OrderConfirmationCardProps) {
  const [mode, setMode] = useState("default");
  const handleClickButton = () => {
    setMode("receiptConfirmed");
    showToast({
      variant: "success",
      message: "Order Confirmed Successfully",
    });
  };
  const handleClickDisputed = () => {
    setMode("disputed");
  };
  const handleOpenDisputed = (e) => {
    setMode("disputeOpened");
    showToast({
      variant: "success",
      message: "Disputed Opened Successfully",
    });
  };
  const cardRole = {
    buyer: (
      <>
        {mode === "default" && (
          <div className="flex flex-col md:w-[360px] lg:w-[500px] bg-page-tertiary p-[24px] gap-[20px] rounded-[12px] border border-escrow-outline">
            <div className="flex flex-col gap-3">
              <Typography
                variant="h2"
                className="text-[16px]! font-[600]! text-escrow-icon"
              >
                Your item has arrived
              </Typography>
              <Typography
                variant="caption"
                className="text-[14px]! font-[400]! text-content-secondary"
              >
                Please confirm you received the item in the condition described.
                This will release $1,245.00 to the seller.
              </Typography>
              <Button
                className="bg-green-600 rounded-[8px]!"
                onClick={handleClickButton}
              >
                Confirm Receipt
              </Button>
            </div>
            <Typography
              variant={"caption"}
              children={"Something wrong? Open a dispute"}
              className="hidden md:block text-center text-content-tertiary text-[13px] font-[500]! underline cursor-pointer"
              onClick={handleClickDisputed}
            ></Typography>
            <Typography
              variant={"caption"}
              children={"Open Dispute"}
              className="block md:hidden text-center text-danger-icon text-[12px] font-[600]! underline cursor-pointer"
              onClick={handleClickDisputed}
            ></Typography>
            <Typography
              variant={"caption"}
              children={"You have 7 days to confirm or dispute"}
              className="hidden md:block text-center text-content-tertiary text-[12px]! font-[400]!"
            ></Typography>
          </div>
        )}
        {mode === "receiptConfirmed" && (
          <div className="flex flex-col md:w-[340px] lg:w-[450px]  p-[24px] gap-[20px] rounded-[12px] border border-escrow-outline">
            <div className="flex flex-col gap-3">
              <Typography
                variant="h2"
                className="text-[16px]! font-[600]! text-escrow-icon"
              >
                Your item has arrived
              </Typography>
              <Typography
                variant="caption"
                className="text-[14px]! font-[400]! text-content-secondary"
              >
                Please confirm you received the item in the condition described.
                This will release $1,245.00 to the seller.
              </Typography>
              <Button
                className="bg-green-600 rounded-[8px]!"
                onClick={handleClickButton}
              >
                Confirm Receipt
              </Button>
            </div>
            <Typography
              variant={"caption"}
              children={"Something wrong? Open a dispute"}
              className="text-center text-content-tertiary text-[13px] font-[500]! underline cursor-pointer"
              onClick={handleClickDisputed}
            ></Typography>
            <Typography
              variant={"caption"}
              children={"You have 7 days to confirm or dispute"}
              className="text-center text-content-tertiary text-[12px]! font-[400]!"
            ></Typography>
          </div>
        )}
        {mode === "disputed" && (
          <div className="flex flex-col md:w-[360px] lg:w-[500px] bg-page-primary p-[24px] gap-[20px] rounded-[12px] border border-page-tertiary">
            <div className="flex flex-col gap-1.5">
              <Typography
                variant="h2"
                className="text-[16px]! font-[600]! text-content-primary"
              >
                Report an issue
              </Typography>
              <Typography
                variant="caption"
                className="text-[14px]! font-[400]! text-content-secondary leading-relaxed"
              >
                Is the item damaged, not as described, or missing parts? Detail
                your dispute below to hold funds in escrow.
              </Typography>
            </div>

            <div className="flex flex-col gap-2">
              <form
                action=""
                id="confirm-dispute"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleOpenDisputed(e);
                }}
              >
                <label className="text-[12px] font-[600] uppercase tracking-wider text-content-tertiary">
                  REASON FOR DISPUTE:
                </label>
                <TextArea
                  required={true}
                  maxLength={200}
                  placeholder={"Describe the issue in detail..."}
                  label={""}
                ></TextArea>
              </form>
            </div>

            <Button
              variant="ghost"
              className="w-full py-2.5 rounded-[8px]! border border-danger-icon! text-danger-icon! font-[600]"
              type="submit"
              form="confirm-dispute"
            >
              Open Dispute
            </Button>
          </div>
        )}
        {mode === "disputeOpened" && (
          <div className="flex flex-col md:w-[360px] lg:w-[500px] bg-danger-surface border-danger-icon p-[24px] gap-[16px] rounded-[12px] border">
            <div className="flex flex-col gap-[8px]">
              <Typography
                variant="h2"
                className="text-[16px]! font-[600]! text-danger-icon"
              >
                Dispute Under Investigation
              </Typography>
              <Typography
                variant="caption"
                className="text-[14px]! font-[400]! text-content-secondary leading-relaxed"
              >
                Holdline admins are currently reviewing submitted evidence.
                Funds will remain locked securely until a resolution is
                finalized.
              </Typography>
            </div>

            <div className="flex items-center gap-2 bg-neutral-white px-3 py-2 rounded-[8px] border border-outline-default/50">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <Typography
                variant="caption"
                className="text-[13px]! font-[600]! text-content-primary"
              >
                Pending Admin Arbitrage
              </Typography>
            </div>
          </div>
        )}
      </>
    ),
  };
  return <div className="w-full">{cardRole[roles]}</div>;
}
