import Typography from "@/components/atoms/typography/typography";

export default function BrandPanelSection() {
  return (
    <div className="hidden md:flex flex-col h-screen items-start justify-around gap-[48px] w-[50%] bg-accent-default p-[60px]  ">
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-white rounded-[6px] w-[28px] h-[28px] ">
          <img
            src="assets/images/trustoraLogo.png"
            alt=""
            className="w-[32px] h-[32px]"
          />
        </div>
        <Typography
          variant={"label"}
          children={"Trustora"}
          className="text-[18px] font-[700]! text-page-primary"
        ></Typography>
        <Typography
          variant={"label"}
          children={"ESCROW"}
          className="text-[10px]! font-[700]! text-accent-default font-jetbrains bg-page-primary px-[3px]  rounded-[4px]"
        ></Typography>
      </div>
      <div className="flex flex-col gap-[48px]">
        <div className="flex flex-col gap-[24px]">
          <img
            src="assets/images/Frame.png"
            alt=""
            className="w-[64px] h-[64px]"
          />
          <Typography
            variant={"label"}
            children={"Your transactions, protected."}
            className="text-[32px]! font-[700]! text-page-primary leading-[125%]"
          ></Typography>
        </div>
        <div className="flex flex-col gap-[30px]">
          <div className="flex gap-[16px]">
            <img
              src="assets/images/Frame (2).png"
              alt=""
              className="w-[24px] h-[24px]"
            />
            <div className="flex flex-col gap-2">
              <Typography
                variant={"label"}
                children={"Double-Sided Escrow Security"}
                className="text-[15px] font-[600]! text-page-primary"
              ></Typography>
              <Typography
                variant={"caption"}
                children={
                  "Funds are only released once both buyer and seller verify complete satisfaction."
                }
                className="text-[13px]! font-[400]! text-page-tertiary leading-[140%]"
              ></Typography>
            </div>
          </div>
          <div className="flex gap-[16px]">
            <img
              src="assets/images/Frame (2).png"
              alt=""
              className="w-[24px] h-[24px]"
            />
            <div className="flex flex-col gap-2">
              <Typography
                variant={"label"}
                children={"Arbitration & Dispute Resolution"}
                className="text-[15px] font-[600]! text-page-primary"
              ></Typography>
              <Typography
                variant={"caption"}
                children={
                  "Our dedicated legal experts step in if parameters are not fully satisfied."
                }
                className="text-[13px]! font-[400]! text-page-tertiary leading-[140%]"
              ></Typography>
            </div>
          </div>
          <div className="flex gap-[16px]">
            <img
              src="assets/images/Frame (2).png"
              alt=""
              className="w-[24px] h-[24px]"
            />
            <div className="flex flex-col gap-2">
              <Typography
                variant={"label"}
                children={"Automated API Milestones"}
                className="text-[15px] font-[600]! text-page-primary"
              ></Typography>
              <Typography
                variant={"caption"}
                children={
                  "Integrate escrow tracking directly into your custom platform triggers."
                }
                className="text-[13px]! font-[400]! text-page-tertiary leading-[140%]"
              ></Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-[32px]">
        <div className="flex flex-col gap-[2px]">
          <Typography
            variant={"label"}
            children={"$4.2B+"}
            className="text-[18px] font-[700]! text-page-primary font-jetbrains"
          ></Typography>
          <Typography
            variant={"label"}
            children={"Volume Secured"}
            className="text-[11px] font-[400]! text-outline-default uppercase"
          ></Typography>
        </div>
        <div className="flex flex-col gap-[2px]">
          <Typography
            variant={"label"}
            children={"99.98%"}
            className="text-[18px] font-[700]! text-page-primary font-jetbrains"
          ></Typography>
          <Typography
            variant={"label"}
            children={"Dispute-Free Rate"}
            className="text-[11px] font-[400]! text-outline-default uppercase"
          ></Typography>
        </div>
      </div>
    </div>
  );
}
