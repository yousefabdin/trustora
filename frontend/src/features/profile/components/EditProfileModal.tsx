import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import { showToast } from "@/components/molecules/toast/Toast";
import { uploadImage } from "@/services/cloudinaryService";

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio?: string;
  avatarUrl?: string;
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
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile.notificationsEnabled,
  );
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setPhone(profile.phone);
      setAddress(profile.address);
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatarUrl || "");
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

  const handleAvatarFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast({
        variant: "error",
        message: "Please select a valid image file (PNG, JPG, WEBP)",
      });
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast({
        variant: "error",
        message: "Image must be under 8MB",
      });
      return;
    }

    try {
      setUploadingAvatar(true);
      const res = await uploadImage(file);
      setAvatarUrl(res.secure_url);
      showToast({
        variant: "success",
        message: "Profile picture uploaded!",
      });
    } catch (err) {
      console.error(err);
      showToast({
        variant: "error",
        message: "Failed to upload image. Please try again.",
      });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      onSave({
        name: name.trim() || profile.name,
        phone: phone.trim() || profile.phone,
        address: address.trim() || profile.address,
        bio: bio.trim(),
        avatarUrl,
        notificationsEnabled,
      });
      setLoading(false);
      showToast({
        variant: "success",
        message: "Profile updated successfully",
      });
      onClose();
    }, 200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-page-inverse/45 backdrop-blur-[2px] transition-opacity overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[540px] my-auto bg-surface-default border border-outline-default rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-outline-subtle bg-surface-raised">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-subtle flex items-center justify-center text-accent-default shadow-2xs">
              <Icon icon="lucide:user-cog" className="w-5 h-5" />
            </div>
            <div>
              <Typography
                variant="h3"
                id="edit-profile-title"
                className="text-[17px] font-bold text-content-primary leading-tight"
              >
                Edit Profile
              </Typography>
              <Typography
                variant="caption"
                className="text-[12px] text-content-tertiary"
              >
                Update your avatar, personal details, and delivery information
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
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4.5 max-h-[78vh] overflow-y-auto">
          {/* Profile Picture Upload Section */}
          <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-page-secondary/60 border border-outline-subtle">
            <label className="text-[13px] font-semibold text-content-primary">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={avatarUrl || "/assets/images/img.png"}
                  alt={name || "Profile"}
                  className="w-16 h-16 rounded-full object-cover border-2 border-outline-default shadow-xs"
                />
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-page-inverse/60 rounded-full flex items-center justify-center text-content-inverse">
                    <Icon icon="lucide:loader-2" className="w-5 h-5 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="rounded-lg! px-3 py-1.5 text-[12px] font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Icon icon="lucide:camera" className="w-3.5 h-3.5" />
                    {uploadingAvatar ? "Uploading..." : "Change Photo"}
                  </Button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="text-[12px] font-medium text-danger-icon hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <span className="text-[11px] text-content-tertiary">
                  Recommended: Square JPG, PNG, or WebP. Max 8MB.
                </span>
              </div>
            </div>
          </div>

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

          {/* Email (Read-only) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="profile-email"
                className="text-[13px] font-semibold text-content-primary"
              >
                Email Address
              </label>
              <span className="text-[11px] text-success-icon bg-success-surface px-1.5 py-0.5 rounded border border-success-outline flex items-center gap-1">
                <Icon icon="lucide:check-circle-2" className="w-3 h-3" />
                Verified
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

          {/* Bio / About */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-bio"
              className="text-[13px] font-semibold text-content-primary"
            >
              About / Bio
            </label>
            <div className="relative flex items-start">
              <span className="absolute left-3 top-2.5 text-content-tertiary pointer-events-none">
                <Icon icon="lucide:quote" className="w-4 h-4" />
              </span>
              <textarea
                id="profile-bio"
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short note about yourself or your trading background"
                className="w-full pl-9 pr-3.5 py-2 text-[14px] bg-surface-default border border-outline-default rounded-lg text-content-primary placeholder:text-content-tertiary focus:outline-none focus:border-outline-focus focus:ring-1 focus:ring-accent-default transition-all resize-none"
              />
            </div>
          </div>

          {/* Primary Delivery Address */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-address"
              className="text-[13px] font-semibold text-content-primary"
            >
              Primary Delivery & Billing Address
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
          <label className="flex items-center gap-3 p-3 rounded-xl bg-page-secondary/80 border border-outline-subtle cursor-pointer hover:bg-page-tertiary/40 transition-colors">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-accent-default border-outline-default focus:ring-accent-default cursor-pointer"
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
              disabled={loading || uploadingAvatar}
              className="rounded-lg! px-4 text-[13px] font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="small"
              loading={loading}
              disabled={uploadingAvatar}
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
