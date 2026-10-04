import React, { useState, useEffect } from "react";
import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import Typography from "@/components/atoms/typography/typography";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import type { UserRole } from "@/types/auth";

import ProfileHeader from "./components/ProfileHeader";
import AccountInfoCard from "./components/AccountInfoCard";
import TrustVerificationCard from "./components/TrustVerificationCard";
import AccountStats from "./components/AccountStats";
import RecentOrdersCard from "./components/RecentOrdersCard";
import RecentActivityCard from "./components/RecentActivityCard";
import EditProfileModal, {
  type UserProfileData,
} from "./components/EditProfileModal";
import { getProfileDataForRole } from "./profileData";

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeRole, setActiveRole] = useState<UserRole>(user?.role || "user");
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Sync active role with logged-in user when user loads
  useEffect(() => {
    if (user?.role) {
      setActiveRole(user.role);
    }
  }, [user?.role]);

  const roleData = getProfileDataForRole(activeRole, user?.name, user?.email);

  const [customEdits, setCustomEdits] = useState<
    Record<UserRole, Partial<UserProfileData>>
  >({
    user: {},
    seller: {},
    admin: {},
  });

  const profile: UserProfileData = {
    name: customEdits[activeRole]?.name || roleData.name,
    email: customEdits[activeRole]?.email || roleData.email,
    phone: customEdits[activeRole]?.phone || roleData.phone,
    address: customEdits[activeRole]?.address || roleData.address,
    memberSince: roleData.memberSince,
    role: activeRole,
    notificationsEnabled:
      customEdits[activeRole]?.notificationsEnabled ??
      roleData.notificationsEnabled,
  };

  const handleSaveProfile = (updated: Partial<UserProfileData>) => {
    setCustomEdits((prev) => ({
      ...prev,
      [activeRole]: { ...prev[activeRole], ...updated },
    }));
  };

  return (
    <div className="bg-page-secondary min-h-screen flex flex-col w-full overflow-x-hidden">
      <NavBar buttonLabel="+Sell" isAuth={true} />

      <main className="flex-1 w-full max-w-[1184px] mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-8 flex flex-col gap-5 sm:gap-6">
        {/* Breadcrumb & Role Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[13px] text-content-tertiary">
            <Link
              to="/"
              className="hover:text-content-primary transition-colors flex items-center gap-1"
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

          {/* Role Preview Switcher */}
          <div className="inline-flex items-center p-1 bg-surface-default border border-outline-subtle rounded-xl shadow-2xs self-start sm:self-auto">
            <span className="text-[11px] font-semibold text-content-tertiary uppercase tracking-wider px-2 hidden sm:inline">
              Role:
            </span>
            {(["user", "seller", "admin"] as UserRole[]).map((r) => {
              const isSelected = activeRole === r;
              const getRoleLabel = () => {
                switch (r) {
                  case "seller":
                    return "Seller";
                  case "admin":
                    return "Admin";
                  case "user":
                  default:
                    return "Buyer";
                }
              };
              const getRoleIcon = () => {
                switch (r) {
                  case "seller":
                    return "lucide:store";
                  case "admin":
                    return "lucide:shield-alert";
                  case "user":
                  default:
                    return "lucide:shopping-bag";
                }
              };
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setActiveRole(r)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-accent-default text-content-inverse shadow-xs"
                      : "text-content-secondary hover:text-content-primary hover:bg-page-secondary"
                  }`}
                >
                  <Icon icon={getRoleIcon()} className="w-3.5 h-3.5" />
                  {getRoleLabel()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          onEdit={() => setIsEditOpen(true)}
          avatar={roleData.avatar}
          roleTitle={roleData.roleTitle}
          roleBadge={roleData.roleBadge}
          badgeType={roleData.badgeType}
          quickActions={roleData.quickActions}
        />

        {/* Responsive Content Grid: 12-column on desktop, single-column on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column: Account Details, Trust & Timeline */}
          <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6 w-full">
            <AccountInfoCard
              profile={profile}
              onEdit={() => setIsEditOpen(true)}
              customFields={roleData.accountFields}
            />
            <TrustVerificationCard
              verifications={roleData.verifications}
              verificationLevel={roleData.verificationLevel}
            />
            <RecentActivityCard
              activities={roleData.activities}
              subtitle={roleData.activitySubtitle}
            />
          </div>

          {/* Right Column: Marketplace Stats & Recent Orders */}
          <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6 w-full">
            <AccountStats
              stats={roleData.stats}
              overviewTitle={roleData.statsOverviewTitle}
              subtitle={roleData.statsSubtitle}
              escrowNotice={roleData.escrowNotice}
            />
            <RecentOrdersCard
              title={roleData.recentOrdersTitle}
              subtitle={roleData.recentOrdersSubtitle}
              orders={roleData.orders}
              viewAllLink={roleData.ordersViewAllLink}
              viewAllLabel={roleData.ordersViewAllLabel}
              role={activeRole}
            />
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
