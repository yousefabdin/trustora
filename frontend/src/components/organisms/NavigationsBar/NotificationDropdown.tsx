import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  useNotifications,
  type AppNotification,
} from "@/services/notificationService";

interface NotificationDropdownProps {
  isAdmin?: boolean;
  className?: string;
}

export default function NotificationDropdown({
  isAdmin = false,
  className,
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && typeof window !== "undefined" && window.innerWidth < 640) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  const handleNotificationClick = (notification: AppNotification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    } else if (notification.orderId) {
      navigate(
        isAdmin
          ? `/admin/disputes/${notification.orderId}`
          : `/myorder/${notification.orderId}`,
      );
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "unread") return !item.isRead;
    if (isAdmin) {
      if (filter === "disputes")
        return item.type === "dispute_opened" || item.role === "admin";
      return true;
    }
    if (filter === "buying") return item.role === "buyer";
    if (filter === "selling") return item.role === "seller";
    return true;
  });

  const getIconForType = (type: AppNotification["type"]) => {
    switch (type) {
      case "item_sold":
        return {
          icon: "lucide:shopping-bag",
          bg: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        };
      case "order_held":
        return {
          icon: "lucide:shield-check",
          bg: "bg-blue-50 text-blue-600 border border-blue-200",
        };
      case "item_shipped":
      case "order_shipped":
        return {
          icon: "lucide:truck",
          bg: "bg-indigo-50 text-indigo-600 border border-indigo-200",
        };
      case "funds_released":
        return {
          icon: "lucide:badge-dollar-sign",
          bg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        };
      case "dispute_opened":
        return {
          icon: "lucide:alert-triangle",
          bg: "bg-amber-50 text-amber-600 border border-amber-200",
        };
      default:
        return {
          icon: "lucide:bell",
          bg: "bg-gray-100 text-gray-600 border border-gray-200",
        };
    }
  };

  const disputesCount = notifications.filter(
    (n) => n.type === "dispute_opened" || n.role === "admin",
  ).length;

  return (
    <div className={clsx("relative inline-block", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "relative w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer active:scale-95 focus:outline-hidden",
          isOpen
            ? "bg-page-tertiary text-accent-default shadow-xs"
            : isAdmin
            ? "text-content-secondary hover:text-content-primary hover:bg-page-tertiary"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
        )}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Icon icon="lucide:bell" className="w-5 h-5 sm:w-4.5 sm:h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-[#4F46E5] rounded-full shadow-xs animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs z-[90] sm:hidden transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-x-0 bottom-0 z-[100] max-h-[85vh] bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 flex flex-col animate-in slide-in-from-bottom-6 duration-200 sm:inset-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 sm:w-[380px] sm:max-h-[520px] sm:rounded-xl sm:border sm:border-gray-200 sm:shadow-xl sm:animate-in sm:fade-in sm:zoom-in-95 sm:duration-100 overflow-hidden">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/70 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-sm">
                  {isAdmin ? "Dispute Notifications" : "Notifications"}
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer py-1 px-1.5"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="sm:hidden p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Close notifications"
                >
                  <Icon icon="lucide:x" className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex px-3 sm:px-4 pt-2.5 pb-2 gap-1.5 border-b border-gray-100 bg-white overflow-x-auto no-scrollbar shrink-0">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={clsx(
                  "px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0",
                  filter === "all"
                    ? "bg-gray-100 text-gray-900 font-bold"
                    : "text-gray-500 hover:text-gray-800",
                )}
              >
                All ({notifications.length})
              </button>

              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => setFilter("disputes")}
                  className={clsx(
                    "px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0",
                    filter === "disputes"
                      ? "bg-amber-100 text-amber-800 font-bold"
                      : "text-gray-500 hover:text-gray-800",
                  )}
                >
                  Disputes ({disputesCount})
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setFilter("buying")}
                    className={clsx(
                      "px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0",
                      filter === "buying"
                        ? "bg-indigo-100 text-indigo-800 font-bold"
                        : "text-gray-500 hover:text-gray-800",
                    )}
                  >
                    Buying (
                    {notifications.filter((n) => n.role === "buyer").length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilter("selling")}
                    className={clsx(
                      "px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0",
                      filter === "selling"
                        ? "bg-emerald-100 text-emerald-800 font-bold"
                        : "text-gray-500 hover:text-gray-800",
                    )}
                  >
                    Selling (
                    {notifications.filter((n) => n.role === "seller").length})
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={clsx(
                  "px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0",
                  filter === "unread"
                    ? "bg-indigo-100 text-indigo-800 font-bold"
                    : "text-gray-500 hover:text-gray-800",
                )}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <div className="max-h-[55vh] sm:max-h-[360px] overflow-y-auto divide-y divide-gray-100 overscroll-contain">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-2">
                    <Icon icon="lucide:bell-off" className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-500">
                    {filter === "unread"
                      ? "No unread notifications!"
                      : isAdmin
                      ? "No dispute notifications found."
                      : filter === "buying"
                      ? "No buying notifications found."
                      : filter === "selling"
                      ? "No selling notifications found."
                      : "No notifications yet. You're all caught up!"}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const style = getIconForType(notif.type);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={clsx(
                        "px-4 py-3 flex items-start gap-3 transition-colors cursor-pointer text-left relative",
                        notif.isRead
                          ? "bg-white hover:bg-gray-50 active:bg-gray-100"
                          : "bg-indigo-50/30 hover:bg-indigo-50/50 active:bg-indigo-50/70",
                      )}
                    >
                      <div
                        className={clsx(
                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                          style.bg,
                        )}
                      >
                        <Icon icon={style.icon} className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0 pr-1 sm:pr-2">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4
                            className={clsx(
                              "text-xs leading-snug truncate",
                              notif.isRead
                                ? "font-semibold text-gray-800"
                                : "font-bold text-gray-900",
                            )}
                          >
                            {notif.title}
                          </h4>
                          <span
                            className={clsx(
                              "text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border shrink-0",
                              notif.role === "admin"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : notif.role === "seller"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-indigo-50 text-indigo-700 border-indigo-200",
                            )}
                          >
                            {notif.role === "admin"
                              ? "Admin"
                              : notif.role === "seller"
                              ? "Seller"
                              : "Buyer"}
                          </span>
                        </div>
                        <p className="text-[12px] text-gray-600 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-gray-400 font-medium block mt-1">
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          ·{" "}
                          {new Date(notif.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#4F46E5] shrink-0 mt-2"></span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2.5 bg-gray-50/90 border-t border-gray-100 text-center pb-safe">
              <span className="text-[11px] text-gray-400 font-medium">
                {isAdmin
                  ? "Trustora Dispute Adjudication"
                  : "Trustora Escrow Notifications"}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
