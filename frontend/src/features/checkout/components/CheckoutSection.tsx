import CardSummarySection from "./CardSummarySection";
import CheckoutForm from "./CheckoutForm";
import { useLocation, useNavigate } from "react-router-dom";
import PaySectionMobile from "./PaySectionMobile";
import { useState, useEffect } from "react";
import { createOrder } from "@/services/orderService";
import { marketplaceListings } from "@/utils/ItemsSeed";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/components/molecules/toast/Toast";
import { getApiErrorMessage } from "@/apis/axios";

export default function CheckoutSection() {
  const { state } = useLocation();
  const item = state?.item || marketplaceListings[0];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (
      user &&
      item &&
      (user.id === item.sellerId ||
        (item.sellerEmail &&
          user.email?.toLowerCase() === item.sellerEmail?.toLowerCase()) ||
        (item.sellerName &&
          user.email?.split("@")[0].toLowerCase() ===
            item.sellerName.replace(/^@/, "").toLowerCase()))
    ) {
      showToast({
        variant: "error",
        message: "You cannot purchase your own listing.",
      });
      navigate("/browse", { replace: true });
    }
  }, [user, item, navigate]);

  const handleOrderPayment = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    setIsSubmitting(true);
    try {
      const newOrder = await createOrder(String(item.id));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate(`/checkout/success/${newOrder.id}`);
    } catch (err) {
      showToast({
        variant: "error",
        message: getApiErrorMessage(err),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-page-primary">
      <div className="block md:hidden w-full">
        <CardSummarySection item={item} mobileOnly />
      </div>

      <div className="w-full flex flex-col md:flex-row items-start py-5 px-4 md:px-6 lg:px-[64px] md:pt-[40px] lg:pb-[80px] gap-6 lg:gap-[64px]">
        <div className="w-full md:flex-[2] min-w-0">
          <CheckoutForm
            item={item}
            handleOrderPayment={handleOrderPayment}
            isSubmitting={isSubmitting}
          />
        </div>

        <div className="hidden md:block w-full md:flex-[1] md:min-w-[320px] lg:min-w-[360px] max-w-[480px]">
          <CardSummarySection item={item} desktopOnly />
        </div>
      </div>

      <PaySectionMobile item={item} isSubmitting={isSubmitting} />
    </div>
  );
}
