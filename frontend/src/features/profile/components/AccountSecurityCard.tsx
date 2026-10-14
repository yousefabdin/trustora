import { useState } from "react";
import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import { showToast } from "@/components/molecules/toast/Toast";

export default function AccountSecurityCard() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast({ variant: "error", message: "Please enter your current password" });
      return;
    }
    if (newPassword.length < 8) {
      showToast({
        variant: "error",
        message: "New password must be at least 8 characters long",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast({ variant: "error", message: "New passwords do not match" });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast({
        variant: "success",
        message: "Password changed successfully!",
      });
    }, 400);
  };

  const handleToggle2FA = () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    showToast({
      variant: nextState ? "success" : "info",
      message: nextState
        ? "Two-Factor Authentication activated."
        : "Two-Factor Authentication disabled.",
    });
  };

  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-outline-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-escrow-surface flex items-center justify-center text-escrow-foreground">
            <Icon icon="lucide:lock" className="w-4.5 h-4.5" />
          </div>
          <div>
            <Typography
              variant="h3"
              className="text-[16px] font-bold text-content-primary leading-tight"
            >
              Account Security & Login
            </Typography>
            <Typography
              variant="caption"
              className="text-[12px] text-content-tertiary"
            >
              Manage your credentials, 2FA, and authorized device sessions
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Password Management */}
        <div className="p-4 rounded-xl bg-page-secondary/60 border border-outline-subtle flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-default border border-outline-subtle flex items-center justify-center text-content-secondary">
                <Icon icon="lucide:key-round" className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[13px] font-semibold text-content-primary block">
                  Account Password
                </span>
                <span className="text-[12px] text-content-tertiary">
                  Last updated 2 months ago
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="rounded-lg! px-3 py-1.5 text-[12px] font-semibold shadow-2xs"
            >
              {isChangingPassword ? "Cancel" : "Change Password"}
            </Button>
          </div>

          {/* Change Password Inline Form */}
          {isChangingPassword && (
            <form
              onSubmit={handlePasswordSubmit}
              className="mt-2 pt-3 border-t border-outline-subtle flex flex-col gap-3 animate-in fade-in duration-150"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-content-secondary">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-1.5 text-[13px] bg-surface-default border border-outline-default rounded-lg text-content-primary focus:outline-none focus:ring-1 focus:ring-accent-default"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-content-secondary">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-3 py-1.5 text-[13px] bg-surface-default border border-outline-default rounded-lg text-content-primary focus:outline-none focus:ring-1 focus:ring-accent-default"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-content-secondary">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-1.5 text-[13px] bg-surface-default border border-outline-default rounded-lg text-content-primary focus:outline-none focus:ring-1 focus:ring-accent-default"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="small"
                  loading={loading}
                  className="rounded-lg! px-4 text-[12px] font-semibold shadow-xs"
                >
                  Save New Password
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Two-Factor Authentication Toggle */}
        <div className="p-4 rounded-xl bg-page-secondary/60 border border-outline-subtle flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-success-surface flex items-center justify-center text-success-icon shrink-0">
              <Icon icon="lucide:shield-check" className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-semibold text-content-primary">
                  Two-Factor Authentication (2FA)
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    twoFactorEnabled
                      ? "bg-success-surface text-success-icon border border-success-outline"
                      : "bg-page-secondary text-content-tertiary border border-outline-subtle"
                  }`}
                >
                  {twoFactorEnabled ? "Active" : "Disabled"}
                </span>
              </div>
              <span className="text-[12px] text-content-tertiary">
                Requires SMS or Authenticator verification for escrow payouts and sensitive actions.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggle2FA}
            role="switch"
            aria-checked={twoFactorEnabled}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              twoFactorEnabled ? "bg-accent-default" : "bg-outline-default"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                twoFactorEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Active Session & Device */}
        <div className="p-4 rounded-xl bg-page-secondary/60 border border-outline-subtle flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-default border border-outline-subtle flex items-center justify-center text-content-secondary">
              <Icon icon="lucide:laptop" className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-content-primary">
                  Current Device (Windows · Chrome)
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-success-icon" />
              </div>
              <span className="text-[12px] text-content-tertiary">
                Active now · IP: 192.168.1.xxx (This Session)
              </span>
            </div>
          </div>

          <span className="text-[11px] font-medium text-success-icon bg-success-surface px-2 py-0.5 rounded border border-success-outline">
            Protected
          </span>
        </div>
      </div>
    </div>
  );
}
