import { useState } from "react";
import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

import ProfileHeader from "./components/ProfileHeader";
import AccountInfoCard from "./components/AccountInfoCard";
import TrustVerificationCard from "./components/TrustVerificationCard";
import AccountSecurityCard from "./components/AccountSecurityCard";
import PreferencesCard from "./components/PreferencesCard";
import EditProfileModal, {
  type UserProfileData,
} from "./components/EditProfileModal";

type ProfileTab = "all" | "personal" | "security" | "preferences";

export default function ProfilePage() {
  const { user, updateProfile, updateAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>("all");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const profile: UserProfileData = {
    name: user?.name || "User",
    email: user?.email || "user@trustora.com",
    phone: user?.phone || "+1 (555) 234-5678",
    address: user?.address || "742 Evergreen Terrace, Springfield, VA 22150",
    bio: user?.bio || "Active Trustora buyer & verified marketplace trader.",
    avatarUrl: user?.avatarUrl,
    memberSince: user?.memberSince || "March 2026",
    role: user?.role || "user",
    notificationsEnabled: true,
  };

  const handleSaveProfile = async (updated: Partial<UserProfileData>) => {
    try {
      await updateProfile({
        name: updated.name,
        phone: updated.phone,
        address: updated.address,
        bio: updated.bio,
        avatarUrl: updated.avatarUrl,
      });
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleAvatarChange = async (newAvatarUrl: string) => {
    try {
      await updateAvatar(newAvatarUrl);
    } catch (err) {
      console.error("Failed to update avatar:", err);
    }
  };

  return (
    <div className="bg-page-secondary min-h-screen flex flex-col w-full overflow-x-hidden">
      <NavBar buttonLabel="+Sell" isAuth={true} />

      <main className="flex-1 w-full max-w-[1184px] mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-8 flex flex-col gap-6">
        {/* Breadcrumb & Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] text-content-tertiary">
            <Link
              to="/"
              className="hover:text-content-primary transition-colors flex items-center gap-1.5"
            >
              <Icon icon="lucide:home" className="w-3.5 h-3.5" />
              Home
            </Link>
            <Icon
              icon="lucide:chevron-right"
              className="w-3.5 h-3.5 opacity-60"
            />
            <span className="text-content-primary font-medium">My Profile</span>
          </div>

          {/* Quick Shortcuts to Orders or Seller Dashboard based on user role */}
          <div className="flex items-center gap-2">
            <Link
              to="/myorders"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-default border border-outline-subtle text-[12px] font-semibold text-content-secondary hover:text-content-primary hover:border-outline-default shadow-2xs transition-colors"
            >
              <Icon icon="lucide:package" className="w-3.5 h-3.5" />
              My Orders
            </Link>

            {user?.roles?.includes("seller") && (
              <Link
                to="/seller/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-default border border-outline-subtle text-[12px] font-semibold text-content-secondary hover:text-content-primary hover:border-outline-default shadow-2xs transition-colors"
              >
                <Icon icon="lucide:store" className="w-3.5 h-3.5 text-accent-default" />
                Seller Dashboard
              </Link>
            )}

            {user?.roles?.includes("admin") && (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-default border border-outline-subtle text-[12px] font-semibold text-danger-icon hover:bg-danger-surface shadow-2xs transition-colors"
              >
                <Icon icon="lucide:shield-alert" className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* Profile Hero Header with Interactive Avatar Upload */}
        <ProfileHeader
          profile={profile}
          onEdit={() => setIsEditOpen(true)}
          avatar={user?.avatarUrl}
          onAvatarChange={handleAvatarChange}
          userRoles={user?.roles || []}
        />

        {/* Navigation Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-default border border-outline-subtle rounded-xl self-start overflow-x-auto max-w-full shadow-2xs">
          {[
            { id: "all", label: "All Details", icon: "lucide:layout-grid" },
            { id: "personal", label: "Personal Information", icon: "lucide:user" },
            { id: "security", label: "Trust & Security", icon: "lucide:shield-check" },
            { id: "preferences", label: "Preferences & Alerts", icon: "lucide:sliders" },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as ProfileTab)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-accent-default text-content-inverse shadow-xs"
                    : "text-content-secondary hover:text-content-primary hover:bg-page-secondary"
                }`}
              >
                <Icon icon={tab.icon} className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Personal Information & Preferences */}
          {(activeTab === "all" || activeTab === "personal" || activeTab === "preferences") && (
            <div
              className={`flex flex-col gap-6 w-full ${
                activeTab === "all" ? "lg:col-span-7" : "lg:col-span-12"
              }`}
            >
              {(activeTab === "all" || activeTab === "personal") && (
                <AccountInfoCard
                  profile={profile}
                  onEdit={() => setIsEditOpen(true)}
                />
              )}

              {(activeTab === "all" || activeTab === "preferences") && (
                <PreferencesCard
                  initialNotificationsEnabled={profile.notificationsEnabled}
                  onUpdateNotifications={(enabled) =>
                    handleSaveProfile({ notificationsEnabled: enabled })
                  }
                />
              )}
            </div>
          )}

          {/* Right Column: Trust Verification & Security */}
          {(activeTab === "all" || activeTab === "security") && (
            <div
              className={`flex flex-col gap-6 w-full ${
                activeTab === "all" ? "lg:col-span-5" : "lg:col-span-12"
              }`}
            >
              <TrustVerificationCard verificationLevel="Level 2 Verified" />
              <AccountSecurityCard />
            </div>
          )}
        </div>
      </main>

      {/* Edit Profile Modal (Includes Avatar Upload & Personal Info Editing) */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
