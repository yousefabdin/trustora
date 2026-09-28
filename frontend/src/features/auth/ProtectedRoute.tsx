import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/components/molecules/toast/Toast";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    showToast({
      variant: "info",
      message: "This Action needs for login , Please Login before you move on",
    });
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
