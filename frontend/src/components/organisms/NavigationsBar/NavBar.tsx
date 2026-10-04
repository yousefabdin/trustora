import { useState } from "react";
import Button from "../../atoms/Button/Button";
import { Icon } from "@iconify/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import Typography from "@/components/atoms/typography/typography";
import { useAuth } from "@/context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

const userNavItems = [
  {
    label: "Home",
    href: "/",
    className: "font-inter font-normal text-[14px] text-content-secondary",
  },
  {
    label: "Browse",
    href: "/browse",
    className: "font-inter font-normal text-[14px] text-content-secondary",
  },
  {
    label: "My Orders",
    href: "/myorders",
    className: "font-inter font-normal text-[14px] text-content-secondary",
  },
  {
    label: "My Listings",
    href: "/seller/dashboard",
    className: "font-inter font-normal text-[14px] text-content-secondary",
  },
];

const guestNavItems = [
  {
    label: "Home",
    href: "/",
    className: "font-inter font-normal text-[14px] text-content-secondary",
  },
  {
    label: "Browse",
    href: "/browse",
    className: "font-inter font-normal text-[14px] text-content-secondary",
  },
];

const adminNavItems = [
  {
    label: "Browse",
    href: "/browse",
    className: "font-inter font-normal text-[14px] text-content-secondary",
  },
  {
    label: "My Orders",
    href: "/myorders",
    className: "font-inter font-normal text-[14px] text-content-secondary",
  },
  {
    label: "My Listings",
    href: "/seller/dashboard",
    className: "font-inter font-normal text-[14px] text-content-secondary",
  },
  {
    label: "Disputes",
    href: "/admin/disputes",
    className: "font-inter font-normal text-[14px] text-content-secondary",
  },
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    className: "font-inter font-normal text-[14px] text-content-secondary",
  },
];

const navItems = {
  guest: guestNavItems,
  user: userNavItems,
  seller: userNavItems,
  admin: adminNavItems,
};

interface NavBarProps {
  buttonLabel?: string;
  isAuth?: boolean;
}

export default function NavBar({
  buttonLabel = "Get Started",
  isAuth: propIsAuth,
}: NavBarProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated: contextIsAuth, logout, user } = useAuth();
  const isAuthenticated = propIsAuth ?? contextIsAuth;

  const items = user ? navItems[user.role] : userNavItems;
  console.log(items);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    navigate("/");
    logout();
  };
  return (
    <>
      <div className="w-full flex justify-between items-center">
        <nav className="hidden md:flex w-full justify-between items-center border-b border-outline-default px-4 lg:px-8">
          <div className="gap-4 ml-2">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/assets/images/trustoraLogo.png"
                alt=""
                className="w-[50px] h-[50px]  "
              />
              <Typography
                variant="h3"
                as="span"
                className="text-accent-default font-bold text-[18px] "
              >
                Trustora
              </Typography>
            </Link>
          </div>
          <div className="">
            <ul className="flex justify-between gap-8">
              {items.map((item) => {
                const isCurrent =
                  location.pathname === item.href ||
                  (item.href !== "/" &&
                    location.pathname.startsWith(item.href));
                return (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className={
                        isCurrent
                          ? " font-inter text-[14px] text-content-link font-[600] border-b-2 py-[15px]"
                          : item.className
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex justify-between items-center gap-4 mx-5 ">
            {!isAuthenticated && (
              <>
                <Link to="/login">
                  <Typography
                    variant="label"
                    className="w-[50px] h-[32px] whitespace- rounded-xl text-[14px] text-content-secondary font-[500]"
                  >
                    Log In
                  </Typography>
                </Link>
                <Link to={"/signup"}>
                  <Button
                    variant="primary"
                    size="large"
                    to="/signup"
                    className="w-[133px] h-[40px]  whitespace-nowrap rounded-[8px]! text-[15px] font-[600] p-4"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            {isAuthenticated && (
              <>
                <Link to="/seller/dashboard">
                  <Button
                    variant="primary"
                    size="small"
                    className="whitespace-nowrap rounded-[8px]! text-[14px] font-[600] px-3.5 py-1.5 flex items-center gap-1.5"
                  >
                    <Icon icon="lucide:plus" className="w-4 h-4" />
                    Sell
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="small"
                  className="whitespace-nowrap rounded-[8px]! text-[14px] font-[500] text-content-secondary hover:text-content-primary"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <NotificationDropdown isAdmin={user?.role === "admin"} />
                <Link to="/profile" title="View Profile">
                  <img
                    src="/assets/images/img.png"
                    alt="Profile"
                    className="rounded-full w-[32px] h-[32px] hover:ring-2 hover:ring-accent-default transition-all"
                  />
                </Link>
              </>
            )}
          </div>
        </nav>

        <div
          className={
            isOpen
              ? "flex md:hidden justify-between mt-2 px-3 flex-wrap w-full items-center"
              : "flex w-full md:hidden items-center justify-between mt-2 px-3 flex-wrap border border-outline-default rounded-xl px-[16px] py-1"
          }
        >
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/assets/images/trustoraLogo.png"
                alt=""
                className="w-[50px] h-[50px]"
              />
              <Link to="/">
                <Typography
                  variant="h3"
                  as="span"
                  className="text-accent-default font-bold text-[18px]"
                >
                  Trustora
                </Typography>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <NotificationDropdown isAdmin={user?.role === "admin"} />
            )}
            <div className="cursor-pointer">
              {isOpen ? (
                <Icon
                  onClick={handleClick}
                  icon="iconoir:cancel"
                  className="w-6 h-6 [&>path]:stroke-[3px] ml-auto text-content-primary"
                />
              ) : (
                <img
                  src="/assets/icons/hamIcon.png"
                  alt="Menu"
                  onClick={handleClick}
                  className="w-6 h-6 cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <SideBar
        items={items}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isAuth={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        buttonLabel={isAuthenticated ? "+ Sell" : "Get Started"}
      />
    </>
  );
}
