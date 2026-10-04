import Typography from "@/components/atoms/typography/typography";

interface LogisticsCardProps {
  order?: any;
}

export default function LogisticsCard({ order }: LogisticsCardProps) {
  const carrier = order?.shippingMethod || "Standard Insured Courier";
  const trackingNumber = order?.trackingNumber || "Pending Dispatch";
  const isPending = !order?.trackingNumber || order?.trackingNumber.includes("Pending") || order?.rawStatus === "paid_held";

  return (
    <div className="w-full flex flex-col bg-page-primary rounded-[8px] p-[12px] gap-[8px] border border-page-tertiary">
      <Typography
        variant={"caption"}
        children={"Courier Logistics"}
        className="text-[#9C9C99] text-[11px]! uppercase font-[700]!"
      ></Typography>
      <div className="flex justify-between items-center">
        <Typography
          variant={"caption"}
          children={"Carrier"}
          className="text-content-secondary text-[13px]! font-[400]!"
        ></Typography>
        <Typography
          variant={"caption"}
          children={carrier}
          className="text-page-inverse text-[13px]! uppercase font-[600]!"
        ></Typography>
      </div>
      <div className="flex justify-between items-center">
        <Typography
          variant={"caption"}
          children={"Tracking No."}
          className="text-content-secondary text-[13px]! font-[400]!"
        ></Typography>
        <Typography
          variant={"caption"}
          children={trackingNumber}
          className={
            isPending
              ? "text-amber-600 text-[12px]! font-semibold"
              : "text-accent-default text-[13px]! uppercase font-[700]! underline font-jetbrains"
          }
        ></Typography>
      </div>
    </div>
  );
}
