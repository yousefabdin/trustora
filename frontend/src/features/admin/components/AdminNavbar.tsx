import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import clsx from "clsx";

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: "lucide:layout-dashboard",
      isActive: location.pathname === "/admin/dashboard",
    },
    {
      label: "Disputes",
      href: "/admin/disputes",
      icon: "lucide:scale",
      isActive:
        location.pathname === "/admin/disputes" ||
        location.pathname.startsWith("/admin/disputes/"),
    },
  ];

  return (
    <>
      <header className="w-full bg-surface-default border-b border-outline-subtle">
        <div className="flex md:hidden h-[52px] px-4 items-center justify-between w-full">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            <img
              src="/assets/images/trustoraLogo.png"
              alt="Trustora"
              className="w-8 h-8 object-contain"
            />
            <span className="text-accent-default font-bold text-[16px] tracking-tight">
              Trustora
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="bg-danger-surface text-danger-icon font-bold text-[11px] tracking-wider uppercase px-2 py-0.5 rounded-[4px]">
              ADMIN
            </span>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="w-8 h-8 flex items-center justify-center text-content-primary hover:text-content-secondary transition-colors cursor-pointer"
            >
              <Icon
                icon={isOpen ? "iconoir:cancel" : "lucide:menu"}
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>

        <div className="hidden md:flex w-full px-6 lg:px-[90px] h-14 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <img
                src="/assets/images/trustoraLogo.png"
                alt="Trustora"
                className="w-10 h-12 object-contain"
              />
              <span className="text-accent-default font-bold text-[16px] tracking-tight">
                Trustora
              </span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={clsx(
                    "px-3 py-1.5 text-[14px] rounded-[6px] transition-colors",
                    item.isActive
                      ? "bg-page-tertiary text-accent-default font-semibold"
                      : "text-content-secondary hover:text-content-primary font-medium",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="border border-accent-default rounded-full px-3 py-0.5 flex items-center justify-center">
              <span className="text-accent-default font-bold text-[11px] tracking-wider uppercase whitespace-nowrap">
                ADMIN VIEW
              </span>
            </div>

            <Link to="/profile">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/images/img.png"
                  alt="ops_lead"
                  className="w-7 h-7 rounded-full object-cover border border-outline-subtle"
                />
                <span className="text-content-primary font-medium text-[14px] whitespace-nowrap">
                  ops_lead
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-page-inverse/45 backdrop-blur-[2px] transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <aside
            className="relative z-10 w-[290px] max-w-[82vw] h-full bg-surface-default border-l border-outline-default shadow-2xl flex flex-col justify-between overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Admin Navigation"
          >
            <div>
              <div className="flex items-center justify-between px-5 py-4 border-b border-outline-default">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/images/trustoraLogo.png"
                    alt="Trustora"
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-accent-default font-bold text-[16px] tracking-tight">
                    Trustora
                  </span>
                  <span className="bg-danger-surface text-danger-icon font-bold text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded-[4px] ml-1">
                    ADMIN
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-content-secondary hover:text-content-primary hover:bg-page-secondary border border-outline-subtle transition-colors cursor-pointer"
                >
                  <Icon
                    icon="iconoir:cancel"
                    className="w-5 h-5 [&>path]:stroke-[2.5px]"
                  />
                </button>
              </div>

              <div className="px-5 py-4 border-b border-outline-subtle bg-page-secondary/60">
                <div className="flex items-center gap-3">
                  <Link to="/profile" title="View Profile">
                    <img
                      src="/assets/images/img.png"
                      alt="ops_lead"
                      className="w-10 h-10 rounded-full border border-outline-strong object-cover"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-content-primary">
                      ops_lead
                    </span>
                    <span className="text-[11px] text-content-tertiary font-medium">
                      Admin Console
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-3 py-4">
                <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-content-tertiary block mb-2">
                  Admin Navigation
                </span>
                <nav className="flex flex-col gap-1.5">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={clsx(
                        "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[14px] transition-all",
                        item.isActive
                          ? "bg-accent-subtle text-accent-default font-semibold shadow-xs"
                          : "text-content-secondary hover:text-content-primary hover:bg-page-secondary font-medium",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          icon={item.icon}
                          className={clsx(
                            "w-4.5 h-4.5",
                            item.isActive
                              ? "text-accent-default"
                              : "text-content-tertiary",
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                      <Icon
                        icon="lucide:chevron-right"
                        className={clsx(
                          "w-4 h-4",
                          item.isActive
                            ? "text-accent-default"
                            : "text-content-tertiary opacity-60",
                        )}
                      />
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            <div className="p-4 border-t border-outline-default bg-surface-default flex flex-col gap-2">
              <div className="border border-accent-default rounded-lg py-2 flex items-center justify-center">
                <span className="text-accent-default font-bold text-[11px] tracking-wider uppercase">
                  ADMIN VIEW ACTIVE
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
