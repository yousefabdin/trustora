import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import Button from "../../atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

interface SideBarProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
  buttonLabel?: string;
  isAuth?: boolean;
  user?: any;
  onLogout?: () => void;
}

export default function SideBar({
  items,
  isOpen,
  onClose,
  buttonLabel = "Get Started",
  isAuth = false,
  user,
  onLogout,
}: SideBarProps) {
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-neutral-950/45 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="relative z-10 w-[310px] max-w-[85vw] h-full bg-surface-default border-l border-outline-default shadow-2xl flex flex-col justify-between overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-outline-default">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-2.5 group"
            >
              <img
                src="/assets/images/trustoraLogo.png"
                alt="Trustora Logo"
                className="w-[36px] h-[36px] object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col gap-1 justify-center">
                <Typography
                  variant="h3"
                  className="text-accent-default font-bold text-[17px] leading-none tracking-tight pt-2"
                >
                  Trustora
                </Typography>
                <Typography
                  variant="caption"
                  className="text-[10px] text-content-tertiary font-medium tracking-wide mt-0.5"
                >
                  Escrow Marketplace
                </Typography>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="small"
              onClick={onClose}
              aria-label="Close menu"
              className="w-8! h-8! min-w-0! min-h-0! p-0! rounded-lg! text-content-secondary hover:text-content-primary hover:bg-page-secondary border border-outline-subtle transition-colors cursor-pointer flex items-center justify-center"
            >
              <Icon
                icon="iconoir:cancel"
                className="w-5 h-5 [&>path]:stroke-[2.5px]"
              />
            </Button>
          </div>

          {isAuth && (
            <div className="px-5 py-4 border-b border-outline-subtle bg-page-secondary/60">
              <div className="flex items-center justify-between">
                <Link
                  to="/profile"
                  onClick={onClose}
                  className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
                >
                  <div className="relative">
                    <img
                      src="/assets/images/img.png"
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full border border-outline-strong object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="flex flex-col">
                    <Typography
                      variant="label"
                      className="text-[14px] font-semibold text-content-primary group-hover:text-accent-default transition-colors"
                    >
                      {user?.name || "Yousef A."}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="flex items-center gap-1 text-[11px] text-success-icon font-medium"
                    >
                      <Icon
                        icon="lucide:shield-check"
                        className="w-3.5 h-3.5"
                      />
                      Verified Trader · View Profile
                    </Typography>
                  </div>
                </Link>

                <Link
                  to="/"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-page-secondary transition-colors"
                  aria-label="Notifications"
                >
                  <img
                    src="/assets/icons/notificationIcon.png"
                    alt="Notifications"
                    className="w-4 h-4.5 object-contain"
                  />
                </Link>
              </div>
            </div>
          )}

          <div className="px-3 py-4">
            <Typography
              variant="label"
              className="px-3 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary block mb-2"
            >
              Navigation
            </Typography>
            <nav className="flex flex-col gap-1">
              {items.map((item) => {
                const isActive = location.pathname === item.href;
                const defaultIcon = item.label.toLowerCase().includes("browse")
                  ? "lucide:compass"
                  : item.label.toLowerCase().includes("orders")
                    ? "lucide:package"
                    : item.label.toLowerCase().includes("listing")
                      ? "lucide:tag"
                      : item.label.toLowerCase().includes("dashboard")
                        ? "lucide:layout-dashboard"
                        : item.label.toLowerCase().includes("dispute")
                          ? "lucide:scale"
                          : "lucide:circle";

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-[14px] font-inter transition-all ${
                      isActive
                        ? "bg-accent-subtle text-accent-default font-semibold shadow-xs"
                        : "text-content-secondary hover:text-content-primary hover:bg-page-secondary font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        icon={item.icon || defaultIcon}
                        className={`w-4.5 h-4.5 ${
                          isActive
                            ? "text-accent-default"
                            : "text-content-tertiary"
                        }`}
                      />
                      <Typography
                        variant="body"
                        as="span"
                        className={
                          isActive
                            ? "text-accent-default font-semibold"
                            : "text-content-secondary"
                        }
                      >
                        {item.label}
                      </Typography>
                    </div>

                    <Icon
                      icon="lucide:chevron-right"
                      className={`w-4 h-4 transition-transform ${
                        isActive
                          ? "text-accent-default translate-x-0.5"
                          : "text-content-tertiary opacity-60"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-outline-default bg-surface-default flex flex-col gap-3">
          {!isAuth ? (
            <div className="flex flex-col gap-2">
              <Link to="/signup" onClick={onClose} className="w-full">
                <Button
                  variant="primary"
                  size="medium"
                  className="w-full rounded-lg! py-2.5 text-[14px] font-semibold shadow-sm"
                >
                  <Typography
                    variant="body"
                    as="span"
                    className="font-semibold text-content-inverse"
                  >
                    {buttonLabel || "Get Started"}
                  </Typography>
                </Button>
              </Link>
              <Link to="/login" onClick={onClose} className="w-full">
                <Button
                  variant="ghost"
                  size="small"
                  className="w-full text-[13px] text-content-secondary hover:text-content-primary"
                >
                  <Typography
                    variant="bodySmall"
                    as="span"
                    className="font-medium"
                  >
                    Log In
                  </Typography>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to={user?.role === "seller" ? "/seller/dashboard" : "/browse"}
                onClick={onClose}
                className="w-full"
              >
                <Button
                  variant="primary"
                  size="medium"
                  className="w-full rounded-lg! py-2.5 text-[14px] font-semibold shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Icon icon="lucide:plus" className="w-4 h-4" />
                  <Typography
                    variant="body"
                    as="span"
                    className="font-semibold text-content-inverse"
                  >
                    {user?.role === "seller" ? "My Listings" : "Sell Item"}
                  </Typography>
                </Button>
              </Link>
              {onLogout && (
                <Button
                  variant="ghost"
                  size="small"
                  className="w-full text-[13px] text-danger-icon hover:text-red-700 hover:bg-danger-surface/20 cursor-pointer"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                >
                  <Typography
                    variant="bodySmall"
                    as="span"
                    className="font-medium text-danger-icon"
                  >
                    Log Out
                  </Typography>
                </Button>
              )}
            </div>
          )}

          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-page-secondary border border-outline-subtle mt-1">
            <div className="p-1 rounded bg-success-surface text-success-icon mt-0.5">
              <Icon icon="lucide:shield-check" className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <Typography
                variant="label"
                className="text-[12px] font-semibold text-content-primary leading-tight"
              >
                100% Escrow Protected
              </Typography>
              <Typography
                variant="caption"
                className="text-[11px] text-content-tertiary leading-normal mt-0.5"
              >
                Funds are secured until delivery is confirmed by buyer.
              </Typography>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
