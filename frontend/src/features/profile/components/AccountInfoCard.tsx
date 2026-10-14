import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import type { UserProfileData } from "./EditProfileModal";

interface AccountInfoCardProps {
  profile: UserProfileData;
  onEdit: () => void;
}

export default function AccountInfoCard({
  profile,
  onEdit,
}: AccountInfoCardProps) {
  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-outline-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center text-accent-default">
            <Icon icon="lucide:user" className="w-4.5 h-4.5" />
          </div>
          <div>
            <Typography
              variant="h3"
              className="text-[16px] font-bold text-content-primary leading-tight"
            >
              Personal & Contact Information
            </Typography>
            <Typography
              variant="caption"
              className="text-[12px] text-content-tertiary"
            >
              Your personal details and verified marketplace contact
            </Typography>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-accent-default hover:bg-accent-subtle transition-colors cursor-pointer"
        >
          <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
          Edit
        </button>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="p-3.5 rounded-xl bg-page-secondary/60 border border-outline-subtle/80 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-content-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <Icon icon="lucide:user" className="w-3.5 h-3.5" />
            Full Name
          </span>
          <span className="text-[14px] font-semibold text-content-primary mt-0.5">
            {profile.name}
          </span>
        </div>

        {/* Email Address */}
        <div className="p-3.5 rounded-xl bg-page-secondary/60 border border-outline-subtle/80 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-content-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <Icon icon="lucide:mail" className="w-3.5 h-3.5" />
            Email Address
          </span>
          <div className="flex items-center justify-between gap-2 flex-wrap mt-0.5">
            <span className="text-[14px] font-semibold text-content-primary truncate">
              {profile.email}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-success-surface text-success-icon border border-success-outline">
              <Icon icon="lucide:check" className="w-2.5 h-2.5 stroke-[3]" />
              Verified
            </span>
          </div>
        </div>

        {/* Phone Number */}
        <div className="p-3.5 rounded-xl bg-page-secondary/60 border border-outline-subtle/80 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-content-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <Icon icon="lucide:phone" className="w-3.5 h-3.5" />
            Phone Number
          </span>
          <div className="flex items-center justify-between gap-2 flex-wrap mt-0.5">
            <span className="text-[14px] font-semibold text-content-primary">
              {profile.phone || "Not set"}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-success-surface text-success-icon border border-success-outline">
              <Icon icon="lucide:check" className="w-2.5 h-2.5 stroke-[3]" />
              SMS Verified
            </span>
          </div>
        </div>

        {/* Member Since */}
        <div className="p-3.5 rounded-xl bg-page-secondary/60 border border-outline-subtle/80 flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-content-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <Icon icon="lucide:calendar" className="w-3.5 h-3.5" />
            Member Since
          </span>
          <span className="text-[14px] font-semibold text-content-primary mt-0.5">
            {profile.memberSince || "March 2026"}
          </span>
        </div>

        {/* Delivery Address */}
        <div className="p-3.5 rounded-xl bg-page-secondary/60 border border-outline-subtle/80 flex flex-col gap-1 sm:col-span-2">
          <span className="text-[11px] font-semibold text-content-tertiary uppercase tracking-wider flex items-center gap-1.5">
            <Icon icon="lucide:map-pin" className="w-3.5 h-3.5" />
            Primary Delivery & Billing Address
          </span>
          <span className="text-[14px] font-semibold text-content-primary mt-0.5">
            {profile.address || "No address provided yet"}
          </span>
        </div>

        {/* Bio / Notes */}
        {profile.bio && (
          <div className="p-3.5 rounded-xl bg-page-secondary/60 border border-outline-subtle/80 flex flex-col gap-1 sm:col-span-2">
            <span className="text-[11px] font-semibold text-content-tertiary uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="lucide:quote" className="w-3.5 h-3.5" />
              Bio / About Me
            </span>
            <p className="text-[13px] text-content-secondary mt-0.5 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
