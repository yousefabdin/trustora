import React from "react";
import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import type { UserProfileData } from "./EditProfileModal";

interface ProfileHeaderProps {
  profile: UserProfileData;
  onEdit: () => void;
}

export default function ProfileHeader({ profile, onEdit }: ProfileHeaderProps) {
  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div className="flex items-start sm:items-center gap-4 sm:gap-5">
        <div className="relative shrink-0">
          <img
            src="assets/images/img.png"
            alt={profile.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-outline-default shadow-xs"
          />
          <span
            className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-success-surface border-2 border-surface-default flex items-center justify-center text-success-icon shadow-xs"
            title="Verified Account"
          >
            <Icon icon="lucide:check" className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Typography
              variant="h2"
              className="text-[20px] sm:text-[24px] font-bold text-content-primary leading-tight truncate"
            >
              {profile.name}
            </Typography>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success-surface text-success-icon border border-success-outline">
              <Icon icon="lucide:shield-check" className="w-3.5 h-3.5" />
              Verified Trader
            </span>
          </div>

          <div className="flex items-center gap-2 text-content-secondary text-[13px] flex-wrap">
            <span className="flex items-center gap-1">
              <Icon
                icon="lucide:mail"
                className="w-3.5 h-3.5 text-content-tertiary"
              />
              {profile.email}
            </span>
            <span className="text-content-tertiary hidden sm:inline">·</span>
            <span className="flex items-center gap-1 text-content-tertiary text-[12px]">
              <Icon icon="lucide:calendar" className="w-3.5 h-3.5" />
              Member since {profile.memberSince}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-page-secondary text-content-secondary border border-outline-subtle">
              {profile.role.toUpperCase()}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-escrow-surface text-escrow-foreground border border-escrow-outline">
              100% Escrow Protected
            </span>
          </div>
        </div>
      </div>

      {/* Right: Action Button */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-outline-subtle shrink-0">
        <Button
          variant="secondary"
          size="small"
          onClick={onEdit}
          className="rounded-lg! px-3.5 py-1.5 text-[13px] font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-page-secondary"
        >
          <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
