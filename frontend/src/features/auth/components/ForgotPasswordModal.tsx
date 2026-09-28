import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import TextField from "@/components/molecules/inputs/TextField";
import { Icon } from "@iconify/react";

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export default function ForgotPasswordModal({
  onClose,
}: ForgotPasswordModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F5F4] backdrop-blur-3xl"
      onClick={onClose}
    >
      <div
        className="bg-page-primary rounded-[12px] shadow-xl w-full max-w-[400px] mx-4 p-[32px] flex flex-col gap-[24px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center bg-accent-default rounded-[6px] w-[28px] h-[28px]">
            <img
              src="assets/images/trustoraLogoLight.png"
              alt="Trustora logo"
              className="w-[32px] h-[32px]"
            />
          </div>
          <Typography
            variant="label"
            className="text-[18px] font-[700]! text-page-inverse"
          >
            Trustora
          </Typography>
          <Typography
            variant="label"
            className="text-[10px]! font-[700]! text-accent-default font-jetbrains bg-page-tertiary px-[3px] rounded-[4px]"
          >
            ESCROW
          </Typography>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <Typography
              variant="h2"
              className="text-[20px]! font-[700]! text-page-inverse"
            >
              Reset password
            </Typography>
            <Typography
              variant="h2"
              className="text-[13px]! font-[400]! text-content-secondary leading-[140%]"
            >
              Enter the email address associated with your account and we will
              email you a secure link to reset your credentials.
            </Typography>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-page-inverse text-[13px] font-[600]">
              Email address
            </label>
            <TextField
              type="email"
              placeholder="you@example.com"
              label=""
              required={true}
              confirmation={false}
              password=""
            />
          </div>

          <Button
            variant="primary"
            size="large"
            className="text-[14px]! font-semiBold px-[16px] rounded-[6px]! w-full"
          >
            Send Reset Link
          </Button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center gap-1 text-accent-default text-[13px] font-[500] hover:underline"
        >
          <Icon icon="mdi:arrow-left" className="w-[16px] h-[16px]" />
          Back to login
        </button>

        <Typography
          variant="caption"
          className="text-[12px]! text-content-secondary text-center"
        >
          Need assistance?
          <span className="font-[600] text-page-inverse cursor-pointer">
            Contact Trustora Support
          </span>
        </Typography>
      </div>
    </div>
  );
}
