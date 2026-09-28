import React, { useState } from "react";
import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import Typography from "@/components/atoms/typography/typography";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

import ProfileHeader from "./components/ProfileHeader";
import AccountInfoCard from "./components/AccountInfoCard";
import TrustVerificationCard from "./components/TrustVerificationCard";
import AccountStats from "./components/AccountStats";
import RecentOrdersCard from "./components/RecentOrdersCard";
import RecentActivityCard from "./components/RecentActivityCard";
import EditProfileModal, { type UserProfileData } from "./components/EditProfileModal";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Initialize with authenticated user or fallback
  const [profile, setProfile] = useState<UserProfileData>({
    name: user?.name || "Yousef Abdin",
    email: user?.email || "yousef@trustora.com",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Springfield, VA 22150",
    memberSince: "March 2026",
    role: user?.role || "user",
    notificationsEnabled: true,
  });

  const handleSaveProfile = (updated: Partial<UserProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="bg-page-secondary min-h-screen flex flex-col">
      <NavBar buttonLabel="+Sell" isAuth={true} />

      <main className="flex-1 w-full max-w-[1184px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 flex flex-col gap-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[13px] text-content-tertiary">
          <Link
            to="/"
            className="hover:text-content-primary transition-colors flex items-center gap-1"
          >
            <Icon icon="lucide:home" className="w-3.5 h-3.5" />
            Home
          </Link>
          <Icon icon="lucide:chevron-right" className="w-3.5 h-3.5 opacity-60" />
          <span className="text-content-primary font-medium">My Profile</span>
        </div>

        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          onEdit={() => setIsEditOpen(true)}
        />

        {/* Responsive Content Grid: 12-column on desktop, single-column on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Account Details, Trust & Timeline */}
          <div className="lg:col-span-7 flex flex-col gap-6 w-full">
            <AccountInfoCard
              profile={profile}
              onEdit={() => setIsEditOpen(true)}
            />
            <TrustVerificationCard />
            <RecentActivityCard />
          </div>

          {/* Right Column: Marketplace Stats & Recent Orders */}
          <div className="lg:col-span-5 flex flex-col gap-6 w-full">
            <AccountStats />
            <RecentOrdersCard limit={4} />
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
