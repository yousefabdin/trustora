import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";

export default function CtaBanner() {
  return (
    <div className="bg-accent-default w-full flex items-center justify-center p-[32px] gap-[24px] md:p-[80px] md:gap-[32px] ">
      <div className="flex flex-col items-center gap-2 md:gap-8">
        <div className="flex flex-col items-center gap-2">
          <Typography
            variant="display"
            className="hidden md:block text-content-inverse text-[36px]! font-extrabold"
          >
            Ready to trade with confidence?
          </Typography>
          <Typography
            variant="display"
            className="block md:hidden text-content-inverse text-[24px]! font-extrabold"
          >
            Ready to trade?
          </Typography>
          <Typography
            variant="caption"
            className="hidden md:block text-content-inverse text-[16px] font-normal page-tertiary"
          >
            Join thousands of smart buyers and sellers protecting their commerce
            with Holdline.
          </Typography>
        </div>
        <div>
          <Button
            variant="secondary"
            className="rounded-[8px]! font-semibold"
            size="large"
          >
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  );
}
