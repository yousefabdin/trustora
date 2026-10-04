import OrderHeaderSection from "./OrderHeaderSection";
import OrderInfoSection from "./OrderInfoSection";
import { useParams } from "react-router";
import { getOrderById, confirmReceipt } from "@/services/orderService";
import { Icon } from "@iconify/react";
import Typography from "@/components/atoms/typography/typography";
import StatusBadge from "@/components/molecules/statusBadges/StatusBadges";
import { useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatOrderNumber } from "@/components/molecules/cards/OrderCard";
import { useState, useEffect } from "react";
import { showToast } from "@/components/molecules/toast/Toast";
import { openDispute } from "@/services/disputeService";
import { getApiErrorMessage } from "@/apis/axios";

export default function DetailsSection() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<string>("default");
  const { orderId } = useParams();
  const {
    data: order = null,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId!),
  });

  useEffect(() => {
    const isDisputeRefund =
      order?.events?.some?.((e: any) => e.type === "dispute_resolved_refund") ||
      order?.rawStatus === "refunded" ||
      order?.status === "Refunded";
    const isDisputeRelease =
      order?.events?.some?.((e: any) => e.type === "dispute_resolved_release");

    if (isDisputeRefund) {
      setMode("disputeRefunded");
    } else if (isDisputeRelease) {
      setMode("disputeReleased");
    } else if (order?.rawStatus === "released" || order?.status === "Completed") {
      setMode("receiptConfirmed");
    } else if (order?.rawStatus === "disputed" || order?.status === "Disputed") {
      setMode("disputeOpened");
    }
  }, [order?.rawStatus, order?.status, order?.events]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-content-secondary font-medium">
          <Icon icon="lucide:loader-2" className="w-6 h-6 animate-spin text-indigo-600" />
          <span>Loading order details...</span>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 text-amber-600">
          <Icon icon="lucide:shield-alert" className="w-8 h-8" />
        </div>
        <Typography variant="h2" className="text-xl font-bold text-gray-900 mb-2">
          Order Not Found or Access Restricted
        </Typography>
        <Typography variant="caption" className="text-sm text-gray-600 max-w-md mb-6 leading-relaxed">
          You may not have permission to view this transaction, or it does not exist. Only authorized buyers, sellers, and administrators can view order details.
        </Typography>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/myorders")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Go to My Orders
          </button>
          <button
            type="button"
            onClick={() => navigate("/browse")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  const handleConfirmReceipt = async () => {
    if (!orderId) return;
    try {
      await confirmReceipt(orderId);
      setMode("receiptConfirmed");
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      showToast({
        variant: "success",
        message: "Receipt confirmed! Funds have been released to the seller.",
      });
    } catch (err) {
      showToast({ variant: "error", message: getApiErrorMessage(err) });
    }
  };

  const handleOpenDisputed = async (
    reason: string,
    description: string,
    evidenceFiles?: string[]
  ) => {
    try {
      await openDispute({ orderId: orderId!, reason, description, evidenceFiles });
      setMode("disputeOpened");
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      showToast({ variant: "success", message: "Dispute Opened Successfully" });
    } catch (err) {
      showToast({ variant: "error", message: getApiErrorMessage(err) });
    }
  };
  return (
    <>
      <div className="flex justify-between md:hidden bg-natural-white! border-b border-page-tertiary py-[12px] px-[16px] items-center">
        <div className="flex items-center gap-2">
          <Icon
            icon={"akar-icons:chevron-left"}
            className="text-page-inverse "
            onClick={() => navigate(-1)}
          ></Icon>
          <div className="flex flex-col">
            <Typography
              variant={"h3"}
              className="text-[16px]! font-bold! text-page-inverse"
            >
              Order {formatOrderNumber(orderId)}
            </Typography>
            <Typography
              variant={"caption"}
              className="text-[12px]! font-[400]! text-[#9C9C99]"
            >
              Secure Escrow Payment
            </Typography>
          </div>
        </div>
        <StatusBadge
          children={order.status}
          variant={order.status}
          className="h-full"
        ></StatusBadge>
      </div>
      <div className="flex flex-col gap-[12px] md:gap-[24px] p-[16px] md:px-[48px] md:pt-[48px] md:pb-[64px] bg-[#F5F5F4]">
        <OrderHeaderSection
          order={order}
          orderId={orderId!}
          mode={mode}
          setMode={setMode}
          handleOpenDisputed={handleOpenDisputed}
          handleConfirmReceipt={handleConfirmReceipt}
        />
        <OrderInfoSection
          handleOpenDisputed={handleOpenDisputed}
          handleConfirmReceipt={handleConfirmReceipt}
          order={order}
          orderId={orderId!}
          mode={mode}
          setMode={setMode}
        />
      </div>
    </>
  );
}
