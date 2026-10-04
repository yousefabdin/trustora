import React from "react";
import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import type { UserProfileData } from "./EditProfileModal";
import type { RoleProfileData } from "../profileData";

interface ProfileHeaderProps {
  profile: UserProfileData;
  onEdit: () => void;
  avatar?: string;
  roleTitle?: string;
  roleBadge?: string;
  badgeType?: "buyer" | "seller" | "admin";
  quickActions?: RoleProfileData["quickActions"];
}

export default function ProfileHeader({
  profile,
  onEdit,
  avatar = "/assets/images/img.png",
  roleTitle = "Verified Buyer",
  roleBadge = "Buyer · Escrow Protected",
  badgeType = "buyer",
  quickActions = [],
}: ProfileHeaderProps) {
  const getBadgeStyle = () => {
    switch (badgeType) {
      case "seller":
        return {
          icon: "lucide:store",
          text: "Verified Merchant",
          className: "bg-escrow-surface text-escrow-foreground border border-escrow-outline",
          pill1: "SELLER · MERCHANT",
          pill2: "Escrow Payee · Instant Payouts",
        };
      case "admin":
        return {
          icon: "lucide:shield-alert",
          text: "Platform Administrator",
          className: "bg-danger-surface text-danger-icon border border-danger-outline",
          pill1: "ADMIN · SUPERUSER",
          pill2: "Arbitration Clearance · Level 4",
        };
      case "buyer":
      default:
        return {
          icon: "lucide:shield-check",
          text: "Verified Buyer",
          className: "bg-success-surface text-success-icon border border-success-outline",
          pill1: "BUYER · TRADER",
          pill2: "100% Escrow Protected",
        };
    }
  };

  const badgeConfig = getBadgeStyle();

  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
      <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 flex-1 min-w-0">
        <div className="relative shrink-0">
          <img
            src={avatar || "/assets/images/img.png"}
            alt={profile.name}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-outline-default shadow-xs"
          />
          <span
            className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-success-surface border-2 border-surface-default flex items-center justify-center text-success-icon shadow-xs"
            title="Verified Account"
          >
            <Icon icon="lucide:check" className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        </div>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Typography
              variant="h2"
              className="text-[18px] sm:text-[22px] md:text-[24px] font-bold text-content-primary leading-tight truncate"
            >
              {profile.name}
            </Typography>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeConfig.className}`}
            >
              <Icon icon={badgeConfig.icon} className="w-3.5 h-3.5" />
              {badgeConfig.text}
            </span>
          </div>

          <div className="flex items-center gap-2 text-content-secondary text-[12px] sm:text-[13px] flex-wrap">
            <span className="flex items-center gap-1 truncate">
              <Icon
                icon="lucide:mail"
                className="w-3.5 h-3.5 text-content-tertiary shrink-0"
              />
              <span className="truncate">{profile.email}</span>
            </span>
            <span className="text-content-tertiary hidden sm:inline">·</span>
            <span className="flex items-center gap-1 text-content-tertiary text-[11px] sm:text-[12px]">
              <Icon icon="lucide:calendar" className="w-3.5 h-3.5 shrink-0" />
              Member since {profile.memberSince}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-page-secondary text-content-secondary border border-outline-subtle">
              {badgeConfig.pill1}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-escrow-surface text-escrow-foreground border border-escrow-outline">
              {badgeConfig.pill2}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-outline-subtle flex-wrap shrink-0">
        {quickActions.map((action) => (
          <Link key={action.label} to={action.href}>
            <Button
              variant={action.variant}
              size="small"
              className="rounded-lg! px-3 sm:px-3.5 py-1.5 text-[12px] sm:text-[13px] font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Icon icon={action.icon} className="w-3.5 h-3.5" />
              {action.label}
            </Button>
          </Link>
        ))}

        <Button
          variant="secondary"
          size="small"
          onClick={onEdit}
          className="rounded-lg! px-3 sm:px-3.5 py-1.5 text-[12px] sm:text-[13px] font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-page-secondary"
        >
          <Icon icon="lucide:pencil" className="w-3.5 h-3.5" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
