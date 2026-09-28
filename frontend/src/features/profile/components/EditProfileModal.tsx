import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import { showToast } from "@/components/molecules/toast/Toast";

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
  role: string;
  notificationsEnabled: boolean;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileData;
  onSave: (updated: Partial<UserProfileData>) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile.notificationsEnabled
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setPhone(profile.phone);
      setAddress(profile.address);
      setNotificationsEnabled(profile.notificationsEnabled);
    }
  }, [isOpen, profile]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      onSave({
        name: name.trim() || profile.name,
        phone: phone.trim() || profile.phone,
        address: address.trim() || profile.address,
        notificationsEnabled,
      });
      setLoading(false);
      showToast({
        variant: "success",
        message: "Profile updated successfully",
      });
      onClose();
    }, 250);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-page-inverse/45 backdrop-blur-[2px] transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] bg-surface-default border border-outline-default rounded-xl shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-subtle bg-surface-raised">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center text-accent-default">
              <Icon icon="lucide:user-cog" className="w-4.5 h-4.5" />
            </div>
            <div>
              <Typography
                variant="h3"
                id="edit-profile-title"
                className="text-[16px] font-bold text-content-primary leading-tight"
              >
                Edit Profile
              </Typography>
              <Typography
                variant="caption"
                className="text-[12px] text-content-tertiary"
              >
                Update your personal and delivery details
              </Typography>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-content-secondary hover:text-content-primary hover:bg-page-tertiary transition-colors cursor-pointer"
          >
            <Icon icon="iconoir:cancel" className="w-5 h-5 [&>path]:stroke-[2px]" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-name"
              className="text-[13px] font-semibold text-content-primary"
            >
              Full Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-content-tertiary pointer-events-none">
                <Icon icon="lucide:user" className="w-4 h-4" />
              </span>
              <input
                id="profile-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full pl-9 pr-3.5 py-2 text-[14px] bg-surface-default border border-outline-default rounded-lg text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-outline-focus focus:ring-1 focus:ring-accent-default transition-all"
              />
            </div>
          </div>

          {/* Email (Read-only for security) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="profile-email"
                className="text-[13px] font-semibold text-content-primary"
              >
                Email Address
              </label>
              <span className="text-[11px] text-content-tertiary flex items-center gap-1">
                <Icon icon="lucide:lock" className="w-3 h-3" />
                Linked to Auth
              </span>
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-content-tertiary pointer-events-none">
                <Icon icon="lucide:mail" className="w-4 h-4" />
              </span>
              <input
                id="profile-email"
                type="email"
                disabled
                value={profile.email}
                className="w-full pl-9 pr-3.5 py-2 text-[14px] bg-page-secondary border border-outline-subtle rounded-lg text-content-secondary cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-phone"
              className="text-[13px] font-semibold text-content-primary"
            >
              Phone Number
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-content-tertiary pointer-events-none">
                <Icon icon="lucide:phone" className="w-4 h-4" />
              </span>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-9 pr-3.5 py-2 text-[14px] bg-surface-default border border-outline-default rounded-lg text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-outline-focus focus:ring-1 focus:ring-accent-default transition-all"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-address"
              className="text-[13px] font-semibold text-content-primary"
            >
              Primary Delivery Address
            </label>
            <div className="relative flex items-start">
              <span className="absolute left-3 top-2.5 text-content-tertiary pointer-events-none">
                <Icon icon="lucide:map-pin" className="w-4 h-4" />
              </span>
              <textarea
                id="profile-address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, City, State, ZIP"
                className="w-full pl-9 pr-3.5 py-2 text-[14px] bg-surface-default border border-outline-default rounded-lg text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-outline-focus focus:ring-1 focus:ring-accent-default transition-all resize-none"
              />
            </div>
          </div>

          {/* Escrow Notification Preference */}
          <label className="flex items-center gap-3 p-3 rounded-lg bg-page-secondary border border-outline-subtle cursor-pointer hover:bg-page-tertiary/40 transition-colors">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-accent-default border-outline-default focus:ring-accent-default"
            />
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-content-primary leading-tight">
                Escrow Status SMS & Email Alerts
              </span>
              <span className="text-[11px] text-content-tertiary">
                Receive instant notifications when funds are locked or released.
              </span>
            </div>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-subtle mt-1">
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg! px-4 text-[13px] font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="small"
              loading={loading}
              className="rounded-lg! px-5 text-[13px] font-semibold shadow-xs"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
