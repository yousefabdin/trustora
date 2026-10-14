import { useRef, useState } from "react";
import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import type { UserProfileData } from "./EditProfileModal";
import { uploadImage } from "@/services/cloudinaryService";
import { showToast } from "@/components/molecules/toast/Toast";

interface ProfileHeaderProps {
  profile: UserProfileData;
  onEdit: () => void;
  avatar?: string;
  onAvatarChange?: (avatarUrl: string) => void;
  userRoles?: string[];
}

export default function ProfileHeader({
  profile,
  onEdit,
  avatar,
  onAvatarChange,
  userRoles = [],
}: ProfileHeaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayAvatar = avatar || profile.avatarUrl || "/assets/images/img.png";

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast({
        variant: "error",
        message: "Please select an image file (JPEG, PNG, WebP)",
      });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast({
        variant: "error",
        message: "File size must be under 8MB",
      });
      return;
    }

    try {
      setUploading(true);
      const res = await uploadImage(file);
      if (onAvatarChange) {
        onAvatarChange(res.secure_url);
      }
      showToast({
        variant: "success",
        message: "Profile picture updated successfully!",
      });
    } catch (err) {
      console.error("Avatar upload failed:", err);
      showToast({
        variant: "error",
        message: "Failed to upload image. Please try again.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isAdmin = userRoles.includes("admin") || profile.role === "admin";
  const isSeller = userRoles.includes("seller") || profile.role === "seller";

  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-2xl overflow-hidden shadow-xs">
      {/* Decorative Profile Banner Cover */}
      <div className="h-28 sm:h-36 w-full bg-gradient-to-r from-accent-default/90 via-accent-default to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/4 -top-10 w-36 h-36 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Main Profile Info Row */}
      <div className="px-5 sm:px-8 pb-6 pt-0 relative flex flex-col md:flex-row md:items-start justify-between gap-5">
        {/* Left: Avatar + Identity */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5 flex-1 min-w-0">
          {/* Avatar with Camera Overlay (only avatar overlaps banner) */}
          <div className="relative group shrink-0 -mt-12 sm:-mt-16 self-start">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarFile}
              className="hidden"
              disabled={uploading}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-surface-default shadow-md overflow-hidden bg-surface-raised cursor-pointer group-hover:ring-2 group-hover:ring-accent-default transition-all"
              title="Click to change profile picture"
            >
              <img
                src={displayAvatar}
                alt={profile.name}
                className="w-full h-full object-cover"
              />

              {/* Hover Overlay */}
              <div
                className={`absolute inset-0 bg-page-inverse/50 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-semibold gap-1 ${
                  uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {uploading ? (
                  <Icon icon="lucide:loader-2" className="w-6 h-6 animate-spin text-white" />
                ) : (
                  <>
                    <Icon icon="lucide:camera" className="w-5 h-5" />
                    <span>Change</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick Camera Badge Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-accent-default hover:bg-accent-hover text-content-inverse border-2 border-surface-default flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
              title="Upload new photo"
            >
              <Icon icon="lucide:camera" className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Details - positioned below the banner on the card surface */}
          <div className="flex flex-col gap-1.5 min-w-0 pt-2 sm:pt-3 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Typography
                variant="h2"
                className="text-[20px] sm:text-[24px] font-bold text-content-primary leading-tight truncate"
              >
                {profile.name}
              </Typography>

              {/* Verified Shield Badge */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success-surface text-success-icon border border-success-outline shadow-2xs">
                <Icon icon="lucide:shield-check" className="w-3.5 h-3.5" />
                Verified Member
              </span>

              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-danger-surface text-danger-icon border border-danger-outline shadow-2xs">
                  <Icon icon="lucide:shield-alert" className="w-3.5 h-3.5" />
                  Administrator
                </span>
              )}

              {isSeller && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-escrow-surface text-escrow-foreground border border-escrow-outline shadow-2xs">
                  <Icon icon="lucide:store" className="w-3.5 h-3.5" />
                  Merchant
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-content-secondary text-[12px] sm:text-[13px] flex-wrap">
              <span className="flex items-center gap-1.5 text-content-secondary font-medium">
                <Icon icon="lucide:mail" className="w-3.5 h-3.5 text-content-tertiary" />
                <span>{profile.email}</span>
              </span>

              <span className="text-content-tertiary">·</span>

              <span className="flex items-center gap-1.5 text-content-tertiary">
                <Icon icon="lucide:calendar" className="w-3.5 h-3.5" />
                Member since {profile.memberSince}
              </span>
            </div>

            {profile.bio && (
              <p className="text-[13px] text-content-secondary line-clamp-2 max-w-xl mt-0.5">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Right: Profile Actions */}
        <div className="flex items-center gap-2.5 pt-3 md:pt-4 border-t md:border-t-0 border-outline-subtle shrink-0">
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-xl! px-3.5 py-2 text-[13px] font-semibold flex items-center gap-1.5 shadow-2xs hover:bg-page-secondary cursor-pointer"
          >
            <Icon icon="lucide:camera" className="w-4 h-4 text-content-tertiary" />
            Change Photo
          </Button>

          <Button
            type="button"
            variant="primary"
            size="small"
            onClick={onEdit}
            className="rounded-xl! px-4 py-2 text-[13px] font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Icon icon="lucide:pencil" className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
