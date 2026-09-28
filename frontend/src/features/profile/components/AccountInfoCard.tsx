import React from "react";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import type { UserProfileData } from "./EditProfileModal";

interface AccountInfoCardProps {
  profile: UserProfileData;
  onEdit: () => void;
}

export default function AccountInfoCard({ profile, onEdit }: AccountInfoCardProps) {
  const fields = [
    {
      label: "Full Name",
      value: profile.name,
      icon: "lucide:user",
      badge: null,
    },
    {
      label: "Email Address",
      value: profile.email,
      icon: "lucide:mail",
      badge: {
        text: "Verified",
        icon: "lucide:check",
        className: "bg-success-surface text-success-icon border border-success-outline",
      },
    },
    {
      label: "Phone Number",
      value: profile.phone,
      icon: "lucide:phone",
      badge: {
        text: "SMS Verified",
        icon: "lucide:check",
        className: "bg-success-surface text-success-icon border border-success-outline",
      },
    },
    {
      label: "Primary Delivery Address",
      value: profile.address,
      icon: "lucide:map-pin",
      badge: null,
    },
    {
      label: "Member Since",
      value: profile.memberSince,
      icon: "lucide:calendar",
      badge: null,
    },
    {
      label: "Account Type",
      value: `${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} & Marketplace Trader`,
      icon: "lucide:shield",
      badge: null,
    },
  ];

  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-outline-subtle">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:id-card" className="w-4.5 h-4.5 text-accent-default" />
          <Typography
            variant="h3"
            className="text-[16px] font-bold text-content-primary leading-tight"
          >
            Account Information
          </Typography>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="text-[12px] font-semibold text-content-link hover:underline cursor-pointer"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div
            key={field.label}
            className="p-3 rounded-lg bg-page-secondary/60 border border-outline-subtle/80 flex flex-col gap-1"
          >
            <span className="text-[11px] font-medium text-content-tertiary uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon={field.icon} className="w-3.5 h-3.5" />
              {field.label}
            </span>

            <div className="flex items-center justify-between gap-2 flex-wrap mt-0.5">
              <span className="text-[13px] font-semibold text-content-primary">
                {field.value}
              </span>

              {field.badge && (
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold leading-none ${field.badge.className}`}
                >
                  <Icon icon={field.badge.icon} className="w-2.5 h-2.5 stroke-[3]" />
                  {field.badge.text}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
