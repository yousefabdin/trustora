import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import Button from "@/components/atoms/Button/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-page-primary ">
      <NavBar buttonLabel="Get Started" isAuth={false} />

      <main className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-8 sm:py-12 w-full max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 shadow-2xs mb-2">
          <Icon
            icon="solar:shield-warning-bold"
            className="w-3.5 h-3.5 text-amber-600 shrink-0"
          />
          <span className="text-[11px] font-bold tracking-wider uppercase leading-none">
            404 • NOT FOUND
          </span>
        </div>

        <div className="w-full flex items-center justify-center mb-2 select-none">
          <h1 className="font-jetbrains font-extrabold text-7xl sm:text-8xl md:text-9xl tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-indigo-600 via-indigo-500 to-indigo-400 leading-none">
            404
          </h1>
        </div>

        <h2 className="font-inter text-2xl sm:text-3xl font-bold text-content-primary mb-2">
          Listing or Page Not Found
        </h2>

        <p className="font-inter text-xs sm:text-sm text-content-secondary max-w-md mx-auto mb-6 leading-relaxed">
          The page or listing you are looking for may have been moved, sold, or
          never existed. Don't worry—your account and active escrow transactions
          remain completely secure.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Button
            variant="primary"
            size="medium"
            onClick={() => navigate("/")}
            className="rounded-lg! px-5 py-2 text-[14px] font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Icon icon="lucide:home" className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>

          <Link to="/browse">
            <Button
              variant="secondary"
              size="medium"
              className="rounded-lg! px-5 py-2 text-[14px] font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Icon
                icon="lucide:compass"
                className="w-4 h-4 text-accent-default"
              />
              <span>Browse Marketplace</span>
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="medium"
            onClick={() => navigate(-1)}
            className="rounded-lg! px-4 py-2 text-[14px] font-medium flex items-center gap-1.5 cursor-pointer text-content-secondary hover:text-content-primary"
          >
            <Icon icon="lucide:arrow-left" className="w-4 h-4" />
            <span>Go Back</span>
          </Button>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mb-6 text-left">
          <Link
            to="/browse"
            className="p-3 rounded-xl border border-outline-default bg-surface-default hover:border-accent-default hover:shadow-xs transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-accent-subtle text-accent-default flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Icon icon="lucide:shopping-bag" className="w-4 h-4" />
            </div>
            <h3 className="font-inter font-semibold text-[13px] text-content-primary mb-0.5">
              Browse Listings
            </h3>
            <p className="text-[11px] text-content-secondary leading-snug">
              Explore items protected by escrow.
            </p>
          </Link>

          <Link
            to="/myorders"
            className="p-3 rounded-xl border border-outline-default bg-surface-default hover:border-accent-default hover:shadow-xs transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Icon icon="lucide:package-check" className="w-4 h-4" />
            </div>
            <h3 className="font-inter font-semibold text-[13px] text-content-primary mb-0.5">
              Track Orders
            </h3>
            <p className="text-[11px] text-content-secondary leading-snug">
              Monitor status of active payments.
            </p>
          </Link>

          <Link
            to="/"
            className="p-3 rounded-xl border border-outline-default bg-surface-default hover:border-accent-default hover:shadow-xs transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Icon icon="lucide:shield-check" className="w-4 h-4" />
            </div>
            <h3 className="font-inter font-semibold text-[13px] text-content-primary mb-0.5">
              Escrow Guarantee
            </h3>
            <p className="text-[11px] text-content-secondary leading-snug">
              100% buyer and seller protection.
            </p>
          </Link>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-page-secondary border border-outline-subtle text-[11px] text-content-tertiary">
          <Icon icon="lucide:lock" className="w-3 h-3 text-accent-default" />
          <span>
            Trustora Escrow Protection active across all platform routes.
          </span>
        </div>
      </main>

      <footer className="w-full py-4 px-6 border-t border-outline-default bg-surface-default shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-content-tertiary">
          <div className="flex items-center gap-2">
            <img
              src="assets/images/trustoraLogo.png"
              alt="Trustora"
              className="w-5 h-5 object-contain"
            />
            <span className="font-semibold text-content-secondary">
              Trustora
            </span>
            <span>• © 2026 All rights reserved</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hover:text-content-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="hover:text-content-primary transition-colors"
            >
              Browse
            </Link>
            <Link
              to="/myorders"
              className="hover:text-content-primary transition-colors"
            >
              My Orders
            </Link>
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <Icon icon="lucide:shield-check" className="w-3.5 h-3.5" />
              Escrow Secured
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
