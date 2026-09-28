import HomePage from "@/features/home/HomePage";
import MarketBrowsePage from "@/features/marketBrowse/MarketBrowsePage";
import CheckoutPage from "@/features/checkout/pages/CheckoutPage";
import ItemDetailsPage from "@/features/itemsDetails/ItemDetailsPage";
import { createBrowserRouter } from "react-router-dom";
import PaymentSuccessPage from "@/features/checkout/pages/PaymentSuccessPage";
import MyOrderPage from "@/features/myOrders/MyOrdersPage";
import NotFoundPage from "@/features/notFound/NotFoundPage";
import OrderDetailsPage from "@/features/orderDetails/OrderDetailsPage";
import SignUpPage from "@/features/auth/SignUpPage";
import LoginPage from "@/features/auth/LoginPage";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import RoleRoute from "@/features/auth/RoleRoute";
import MyListingPage from "@/features/myListing/MyListingPage";
import DisputePage from "@/features/admin/disputeQueue/DisputePage";
import DisputeReviewPage from "@/features/admin/disputeReview/DisputeReviewPage";
import AdminDashboardPage from "@/features/admin/disputeDashboard/AdminDashboardPage";
import ProfilePage from "@/features/profile/ProfilePage";

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={["user", "seller", "admin"]} />,
        children: [
          {
            path: "/profile",
            element: <ProfilePage />,
          },
        ],
      },
      {
        element: <RoleRoute allowedRoles={["user", "seller"]} />,
        children: [
          {
            path: "/myorders",
            element: <MyOrderPage />,
          },
          {
            path: "/myorder/:orderId",
            element: <OrderDetailsPage />,
          },
          {
            path: "/checkout/:id",
            element: <CheckoutPage />,
          },
          {
            path: "/checkout/success/:orderId",
            element: <PaymentSuccessPage />,
          },
          {
            path: "/browse",
            element: <MarketBrowsePage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={["seller"]} />,
        children: [
          {
            path: "/seller/dashboard",
            element: <MyListingPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "/admin/disputes",
            element: <DisputePage />,
          },
          {
            path: "/admin/disputes/:disputeId",
            element: <DisputeReviewPage />,
          },
          {
            path: "/admin/dashboard",
            element: <AdminDashboardPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/item/:id",
    element: <ItemDetailsPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
