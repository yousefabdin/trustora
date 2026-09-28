import Typography from "@/components/atoms/typography/typography";

export default function LogisticsCard() {
  return (
    <div className="w-full flex flex-col bg-page-primary rounded-[8px] p-[12px] gap-[8px]">
      <Typography
        variant={"caption"}
        children={"Courier Logistics"}
        className=" text-[#9C9C99] text-[11px]! uppercase font-[700]!"
      ></Typography>
      <div className="flex justify-between">
        <Typography
          variant={"caption"}
          children={"Carrier"}
          className=" text-content-secondary text-[13px]!  font-[400]!"
        ></Typography>
        <Typography
          variant={"caption"}
          children={"DHL Express"}
          className=" text-page-inverse text-[13px]! uppercase font-[600]!"
        ></Typography>
      </div>
      <div className="flex justify-between">
        <Typography
          variant={"caption"}
          children={"Tracking No."}
          className=" text-content-secondary text-[13px]!  font-[400]!"
        ></Typography>
        <Typography
          variant={"caption"}
          children={"DHL-9988220s"}
          className=" text-accent-default text-[13px]! uppercase font-[700]! underline font-jetbrains"
        ></Typography>
      </div>
    </div>
  );
}
