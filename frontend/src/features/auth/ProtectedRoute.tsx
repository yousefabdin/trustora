import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/components/molecules/toast/Toast";
import { useEffect, useRef } from "react";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasShownToast.current) {
      hasShownToast.current = true;
      showToast({
        id: "auth-required-toast",
        variant: "info",
        message: "This Action needs for login , Please Login before you move on",
      });
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
