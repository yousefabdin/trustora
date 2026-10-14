import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import type { VerificationItem } from "../profileData";

interface TrustVerificationCardProps {
  verifications?: VerificationItem[];
  verificationLevel?: string;
}

export default function TrustVerificationCard({
  verifications: customVerifications,
  verificationLevel = "Level 2 Verified",
}: TrustVerificationCardProps) {
  const verifications = customVerifications || [
    {
      title: "Email Verified",
      description: "Confirmed on account creation",
      status: "Verified",
      isComplete: true,
      icon: "lucide:mail-check",
    },
    {
      title: "Phone Verified",
      description: "SMS authentication enabled for escrow security",
      status: "Verified",
      isComplete: true,
      icon: "lucide:phone-call",
    },
    {
      title: "2-Factor Authentication",
      description: "Active protection for payout releases",
      status: "Active",
      isComplete: true,
      icon: "lucide:shield-check",
    },
    {
      title: "Escrow Standing",
      description: "Zero dispute penalties · 100% on-time release record",
      status: "Good Standing",
      isComplete: true,
      icon: "lucide:award",
    },
    {
      title: "Government ID",
      description: "Optional Tier 2 verification for orders over $5,000",
      status: "Optional",
      isComplete: false,
      icon: "lucide:file-badge",
    },
  ];

  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3.5 border-b border-outline-subtle flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-success-surface text-success-icon flex items-center justify-center">
            <Icon icon="lucide:shield-check" className="w-4.5 h-4.5" />
          </div>
          <div>
            <Typography
              variant="h3"
              className="text-[16px] font-bold text-content-primary leading-tight"
            >
              Trust & Verification
            </Typography>
            <Typography
              variant="caption"
              className="text-[12px] text-content-tertiary"
            >
              Your verified identity & marketplace escrow reputation
            </Typography>
          </div>
        </div>

        <span className="text-[11px] sm:text-[12px] font-semibold text-success-icon bg-success-surface px-2.5 py-0.5 rounded-full border border-success-outline">
          {verificationLevel}
        </span>
      </div>

      {/* Trust Score Banner */}
      <div className="p-3.5 rounded-xl bg-escrow-surface/60 border border-escrow-outline flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-escrow-surface text-escrow-foreground flex items-center justify-center font-bold text-sm">
            99%
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-content-primary">
              Trustora Escrow Rating
            </span>
            <span className="text-[11px] text-content-tertiary">
              100% clean escrow history with zero dispute strikes
            </span>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-escrow-foreground bg-surface-default px-2 py-0.5 rounded border border-escrow-outline shadow-2xs">
          Tier 1 Trust
        </span>
      </div>

      <div className="flex flex-col divide-y divide-outline-subtle">
        {verifications.map((item) => (
          <div
            key={item.title}
            className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.isComplete
                    ? "bg-success-surface text-success-icon"
                    : "bg-page-secondary text-content-tertiary border border-outline-subtle"
                }`}
              >
                <Icon
                  icon={item.isComplete ? "lucide:check" : item.icon}
                  className="w-4 h-4 stroke-[2.5]"
                />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-semibold text-content-primary leading-tight truncate">
                  {item.title}
                </span>
                <span className="text-[12px] text-content-tertiary leading-snug truncate">
                  {item.description}
                </span>
              </div>
            </div>

            <span
              className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-md leading-none ${
                item.isComplete
                  ? "bg-success-surface text-success-icon border border-success-outline"
                  : "bg-page-secondary text-content-secondary border border-outline-subtle"
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
