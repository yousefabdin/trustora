import { useState } from "react";
import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { Icon } from "@iconify/react";
import { showToast } from "@/components/molecules/toast/Toast";

interface PreferencesCardProps {
  initialNotificationsEnabled?: boolean;
  onUpdateNotifications?: (enabled: boolean) => void;
}

export default function PreferencesCard({
  initialNotificationsEnabled = true,
  onUpdateNotifications,
}: PreferencesCardProps) {
  const [escrowAlerts, setEscrowAlerts] = useState(initialNotificationsEnabled);
  const [shippingAlerts, setShippingAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("en");

  const handleSavePreferences = () => {
    if (onUpdateNotifications) {
      onUpdateNotifications(escrowAlerts);
    }
    showToast({
      variant: "success",
      message: "Preferences updated successfully!",
    });
  };

  return (
    <div className="w-full bg-surface-default border border-outline-subtle rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-outline-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-page-secondary flex items-center justify-center text-content-primary">
            <Icon icon="lucide:sliders" className="w-4.5 h-4.5" />
          </div>
          <div>
            <Typography
              variant="h3"
              className="text-[16px] font-bold text-content-primary leading-tight"
            >
              Preferences & Notifications
            </Typography>
            <Typography
              variant="caption"
              className="text-[12px] text-content-tertiary"
            >
              Control transaction alerts, marketplace updates, and regional settings
            </Typography>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={handleSavePreferences}
          className="rounded-lg! px-3.5 py-1.5 text-[12px] font-semibold shadow-2xs"
        >
          Save Settings
        </Button>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* Escrow alerts toggle */}
        <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-page-secondary/60 border border-outline-subtle cursor-pointer hover:bg-page-tertiary/30 transition-colors">
          <div className="flex items-start gap-3 min-w-0">
            <Icon icon="lucide:shield-alert" className="w-4.5 h-4.5 text-accent-default mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-content-primary">
                Escrow Status & Fund Alerts
              </span>
              <span className="text-[12px] text-content-tertiary">
                Receive instant notifications when buyer funds are locked, milestones are reached, or payouts are released.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={escrowAlerts}
            onChange={(e) => setEscrowAlerts(e.target.checked)}
            className="w-4.5 h-4.5 rounded text-accent-default border-outline-default focus:ring-accent-default mt-0.5 cursor-pointer"
          />
        </label>

        {/* Shipping notifications */}
        <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-page-secondary/60 border border-outline-subtle cursor-pointer hover:bg-page-tertiary/30 transition-colors">
          <div className="flex items-start gap-3 min-w-0">
            <Icon icon="lucide:truck" className="w-4.5 h-4.5 text-content-secondary mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-content-primary">
                Shipping & Delivery Tracking
              </span>
              <span className="text-[12px] text-content-tertiary">
                Real-time carrier milestone updates (Dispatched, In Transit, Delivered, Inspection Period).
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={shippingAlerts}
            onChange={(e) => setShippingAlerts(e.target.checked)}
            className="w-4.5 h-4.5 rounded text-accent-default border-outline-default focus:ring-accent-default mt-0.5 cursor-pointer"
          />
        </label>

        {/* Marketing emails */}
        <label className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-page-secondary/60 border border-outline-subtle cursor-pointer hover:bg-page-tertiary/30 transition-colors">
          <div className="flex items-start gap-3 min-w-0">
            <Icon icon="lucide:sparkles" className="w-4.5 h-4.5 text-content-secondary mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-content-primary">
                Marketplace Highlights & Rare Drops
              </span>
              <span className="text-[12px] text-content-tertiary">
                Occasional digest of newly listed vintage, luxury, and collectibles.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={marketingEmails}
            onChange={(e) => setMarketingEmails(e.target.checked)}
            className="w-4.5 h-4.5 rounded text-accent-default border-outline-default focus:ring-accent-default mt-0.5 cursor-pointer"
          />
        </label>

        {/* Regional settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-page-secondary/60 border border-outline-subtle flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-content-tertiary uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="lucide:dollar-sign" className="w-3.5 h-3.5" />
              Display Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-surface-default border border-outline-default rounded-lg px-2.5 py-1.5 text-[13px] text-content-primary font-medium focus:outline-none focus:ring-1 focus:ring-accent-default cursor-pointer"
            >
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-page-secondary/60 border border-outline-subtle flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-content-tertiary uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="lucide:globe" className="w-3.5 h-3.5" />
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-surface-default border border-outline-default rounded-lg px-2.5 py-1.5 text-[13px] text-content-primary font-medium focus:outline-none focus:ring-1 focus:ring-accent-default cursor-pointer"
            >
              <option value="en">English (United States)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
