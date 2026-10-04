import Button from "@/components/atoms/Button/Button";
import Typography from "@/components/atoms/typography/typography";
import { useState, useRef } from "react";
import { showToast } from "@/components/molecules/toast/Toast";
import TextArea from "@/components/molecules/inputs/TextArea";
import DropDown from "@/components/molecules/inputs/DropDown";
import TextField from "@/components/molecules/inputs/TextField";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router";
import { formatPrice, formatSeller } from "@/components/molecules/cards/OrderCard";
import { shipOrder } from "@/services/orderService";
import { useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "@/apis/axios";
import { useAuth } from "@/context/AuthContext";

interface OrderConfirmationCardProps {
  roles?: "seller" | "buyer" | "Admin";
  order?: any;
  orderId?: string;
  handleOpenDisputed?: (reason: string, description: string, evidenceFiles?: string[]) => void | Promise<void>;
  setMode?: (mode: string) => void;
  mode?: string;
  onConfirmReceipt?: () => void | Promise<void>;
}

const CARRIER_OPTIONS = [
  { code: "FedEx", name: "FedEx Express / Ground" },
  { code: "DHL", name: "DHL Express" },
  { code: "UPS", name: "UPS Worldwide" },
  { code: "USPS", name: "USPS Priority Mail" },
  { code: "Royal Mail", name: "Royal Mail Tracked" },
  { code: "Standard Courier", name: "Standard Insured Courier" },
];

export default function OrderConfirmationCard({
  roles = "buyer",
  order,
  orderId,
  handleOpenDisputed,
  setMode,
  mode = "default",
  onConfirmReceipt,
}: OrderConfirmationCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Buyer dispute states
  const [option, setOption] = useState<string>("");
  const [description, setDescription] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Seller shipping states
  const [selectedCarrier, setSelectedCarrier] = useState<string>("FedEx");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [shippingNotes, setShippingNotes] = useState<string>("");
  const [isShipping, setIsShipping] = useState<boolean>(false);

  // Strict role verification: A buyer can NEVER be treated as a seller
  const isBuyer = Boolean(
    order?.isBuyer ??
      order?.permissions?.isBuyer ??
      (user &&
        (user.id === order?.buyerId ||
          (order?.buyerEmail &&
            user.email?.toLowerCase() === order.buyerEmail.toLowerCase())))
  );

  const isSeller = Boolean(
    !isBuyer &&
      (order?.isSeller ??
        order?.permissions?.isSeller ??
        (user &&
          (user.id === order?.sellerId ||
            (order?.sellerEmail &&
              user.email?.toLowerCase() === order.sellerEmail.toLowerCase()))))
  );

  // Strict barrier: If the user is the buyer on this order, effectiveRole is ALWAYS "buyer"
  const effectiveRole: "seller" | "buyer" = isSeller && roles === "seller" ? "seller" : "buyer";

  const canDispute = Boolean(
    order?.permissions?.canDispute ?? (isBuyer && (order?.rawStatus === "paid_held" || order?.rawStatus === "shipped"))
  );
  const canConfirmReceipt = Boolean(
    order?.permissions?.canConfirmReceipt ?? (isBuyer && (order?.rawStatus === "shipped" || order?.status === "Shipped"))
  );
  const canShip = Boolean(order?.permissions?.canShip && isSeller);

  const isShipped = order?.rawStatus === "shipped" || order?.status === "Shipped";
  const isDelivered = order?.rawStatus === "delivered" || order?.status === "Delivered";
  const isCompleted = order?.rawStatus === "released" || order?.status === "Completed" || order?.status === "Funds Released";
  const isDisputed = order?.rawStatus === "disputed" || order?.status === "Disputed";

  const disputeReasons = [
    { code: "damaged_goods", name: "Item Arrived Damaged or Broken" },
    { code: "not_as_described", name: "Significantly Not as Described in Listing" },
    { code: "item_not_received", name: "Item Not Received / Non-Delivery" },
    { code: "counterfeit", name: "Suspected Counterfeit or Unauthentic Item" },
    { code: "missing_parts", name: "Missing Parts, Accessories, or Quantity" },
    { code: "wrong_item", name: "Incorrect Item Delivered" },
    { code: "defective_unusable", name: "Item is Defective or Non-Functional" },
  ];

  const handleConfirmReceiptClick = () => {
    if (!canConfirmReceipt) {
      showToast({
        variant: "error",
        message: "Receipt confirmation is not available for this order status",
      });
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmReceiptExecute = async () => {
    setIsConfirming(true);
    try {
      if (onConfirmReceipt) {
        await onConfirmReceipt();
      }
      setMode?.("receiptConfirmed");
      setShowConfirmModal(false);
    } catch {
      setShowConfirmModal(false);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleClickDisputed = () => {
    if (!canDispute) {
      showToast({
        variant: "error",
        message: "You do not have permission to open a dispute for this order",
      });
      return;
    }
    setMode?.("disputed");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setEvidenceFiles((prev) => [...prev, ...selected].slice(0, 5));
    }
  };

  const handleRemoveFile = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDisputeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canDispute) {
      showToast({
        variant: "error",
        message: "You do not have permission to open a dispute for this order",
      });
      return;
    }
    if (!option) {
      showToast({
        variant: "error",
        message: "Please select a reason for the dispute",
      });
      return;
    }
    if (!description.trim()) {
      showToast({
        variant: "error",
        message: "Please describe the issue in detail",
      });
      return;
    }

    setIsSubmittingDispute(true);
    try {
      const fileNames = evidenceFiles.map((f) => f.name);
      await handleOpenDisputed?.(option, description, fileNames);
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  const handleShipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSeller || !canShip) {
      showToast({
        variant: "error",
        message: "You are not authorized to fulfill or ship this order",
      });
      return;
    }

    const cleanTracking = trackingNumber.trim();
    if (!cleanTracking) {
      showToast({
        variant: "error",
        message: "Please enter a valid tracking number",
      });
      return;
    }

    const targetOrderId = orderId || order?.id;
    if (!targetOrderId) return;

    try {
      setIsShipping(true);
      const trackingPayload = `${selectedCarrier || "FedEx"}: ${cleanTracking}${
        shippingNotes.trim() ? ` (${shippingNotes.trim()})` : ""
      }`;

      await shipOrder(targetOrderId, trackingPayload);

      showToast({
        variant: "success",
        message: "Shipment confirmed! Tracking info sent to buyer.",
      });

      queryClient.invalidateQueries({ queryKey: ["order", targetOrderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (err) {
      showToast({
        variant: "error",
        message: getApiErrorMessage(err, "Failed to confirm shipment"),
      });
    } finally {
      setIsShipping(false);
    }
  };

  const formattedAmount = formatPrice(
    order?.amountCents ? order.amountCents / 100 : order?.totalPrice || 0,
  );
  const buyerDisplayName = formatSeller(order?.buyerName || order?.buyer || "Buyer");

  const cardRole = {
    // ----------------------------------------------------
    // BUYER ROLE
    // ----------------------------------------------------
    buyer: (
      <>
        {mode === "default" && (
          <div className="flex flex-col md:w-[360px] lg:w-[500px] bg-page-tertiary p-[24px] gap-[20px] rounded-[12px] border border-escrow-outline">
            {!isShipped && !isDelivered && !isCompleted && !isDisputed ? (
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                    <Icon icon="lucide:shield-check" className="w-5 h-5" />
                  </div>
                  <div>
                    <Typography
                      variant="h2"
                      className="text-[16px]! font-[600]! text-content-primary"
                    >
                      Payment Secured in Escrow
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-[12px]! font-[500]! text-indigo-700"
                    >
                      Awaiting Seller Shipment
                    </Typography>
                  </div>
                </div>

                <Typography
                  variant="caption"
                  className="text-[13.5px]! font-[400]! text-content-secondary leading-relaxed"
                >
                  Your payment of <strong className="text-content-primary">{formattedAmount}</strong> is protected in Trustora Escrow. We have notified {formatSeller(order?.sellerName || "the seller")} to prepare and ship your item.
                </Typography>

                <div className="bg-page-secondary/80 rounded-[8px] p-3 border border-outline-subtle flex flex-col gap-1.5 text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="text-content-secondary">Escrow Protection</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <Icon icon="lucide:lock" className="w-3.5 h-3.5" /> Active & Locked
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-content-secondary">Fulfillment Status</span>
                    <span className="font-semibold text-amber-700">Awaiting Dispatch</span>
                  </div>
                </div>

                <Typography
                  variant="caption"
                  className="text-[12px]! text-content-tertiary leading-relaxed pt-1"
                >
                  You will be able to track the package and confirm receipt once the seller provides carrier tracking details.
                </Typography>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Typography
                  variant="h2"
                  className="text-[16px]! font-[600]! text-escrow-icon"
                >
                  Your item has arrived?
                </Typography>
                <Typography
                  variant="caption"
                  className="text-[14px]! font-[400]! text-content-secondary"
                >
                  Please confirm you received the item in the condition described.
                  This will release {formattedAmount} to the seller.
                </Typography>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white rounded-[8px]! font-semibold"
                  onClick={handleConfirmReceiptClick}
                  disabled={!canConfirmReceipt}
                  size="large"
                >
                  Confirm Receipt
                </Button>
              </div>
            )}

            {canDispute ? (
              <Typography
                variant="caption"
                children="Something wrong? Open a dispute"
                className="text-center text-content-tertiary hover:text-content-primary text-[13px] font-[500]! underline cursor-pointer"
                onClick={handleClickDisputed}
              />
            ) : (
              <Typography
                variant="caption"
                children="Dispute unavailable for current status"
                className="text-center text-content-tertiary text-[12px]! font-[400]!"
              />
            )}

            <Typography
              variant="caption"
              children="Funds remain securely held in escrow until confirmation"
              className="text-center text-content-tertiary text-[12px]! font-[400]!"
            />
          </div>
        )}

        {mode === "disputeRefunded" && (
          <div className="flex flex-col md:w-[360px] lg:w-[500px] bg-surface-default p-6 gap-4 rounded-[12px] border border-emerald-200 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Icon icon="lucide:check-circle-2" className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <Typography
                  variant="h3"
                  className="text-[16px]! font-bold! text-content-primary leading-tight"
                >
                  Dispute Resolved & Refunded
                </Typography>
                <Typography
                  variant="caption"
                  className="text-[12px]! text-content-secondary pt-0.5"
                >
                  Trustora arbitration ruled in favor of buyer
                </Typography>
              </div>
            </div>

            <div className="bg-page-secondary/60 rounded-[8px] p-3.5 border border-outline-subtle flex flex-col gap-2 text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-content-secondary">Refunded Amount</span>
                <span className="font-jetbrains font-bold text-emerald-700">
                  {formattedAmount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-content-secondary">Status</span>
                <span className="font-semibold text-emerald-700">
                  Refund Completed
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-outline-subtle">
                <span className="text-content-secondary">Arbitration</span>
                <span className="flex items-center gap-1 text-[12px] font-medium text-emerald-700">
                  <Icon icon="lucide:shield-check" className="w-4 h-4" />
                  Trustora Resolution Finalized
                </span>
              </div>
            </div>

            <Typography
              variant="caption"
              className="text-[13px]! text-content-secondary leading-relaxed"
            >
              {isBuyer
                ? "Trustora administration reviewed the dispute and issued a full refund to your payment method."
                : "Trustora administration reviewed the dispute claim and issued a full refund to the buyer."}
            </Typography>

            <Button
              variant="secondary"
              onClick={() => navigate("/myorders")}
              className="w-full py-2.5 rounded-[8px]! text-[13px] font-semibold border-outline-strong"
            >
              Back to My Orders
            </Button>
          </div>
        )}

        {mode === "disputeReleased" && (
          <div className="flex flex-col md:w-[360px] lg:w-[500px] bg-surface-default p-6 gap-4 rounded-[12px] border border-blue-200 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                <Icon icon="lucide:scale" className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <Typography
                  variant="h3"
                  className="text-[16px]! font-bold! text-content-primary leading-tight"
                >
                  Dispute Resolved & Funds Released
                </Typography>
                <Typography
                  variant="caption"
                  className="text-[12px]! text-content-secondary pt-0.5"
                >
                  Trustora arbitration ruled to release escrow
                </Typography>
              </div>
            </div>

            <div className="bg-page-secondary/60 rounded-[8px] p-3.5 border border-outline-subtle flex flex-col gap-2 text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-content-secondary">Released Amount</span>
                <span className="font-jetbrains font-bold text-content-primary">
                  {formattedAmount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-content-secondary">Transferred To</span>
                <span className="font-medium text-content-primary truncate max-w-[200px]">
                  {formatSeller(order?.sellerName || "Seller")}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-outline-subtle">
                <span className="text-content-secondary">Arbitration</span>
                <span className="flex items-center gap-1 text-[12px] font-medium text-blue-700">
                  <Icon icon="lucide:shield-check" className="w-4 h-4" />
                  Trustora Resolution Finalized
                </span>
              </div>
            </div>

            <Typography
              variant="caption"
              className="text-[13px]! text-content-secondary leading-relaxed"
            >
              {isBuyer
                ? "Trustora administration reviewed the dispute claim and ruled in favor of releasing escrow funds to the seller."
                : "Trustora administration reviewed the dispute claim and released the escrow funds to your seller balance."}
            </Typography>

            <Button
              variant="secondary"
              onClick={() => navigate("/myorders")}
              className="w-full py-2.5 rounded-[8px]! text-[13px] font-semibold border-outline-strong"
            >
              Back to My Orders
            </Button>
          </div>
        )}

        {mode === "receiptConfirmed" && (
          <div className="flex flex-col md:w-[360px] lg:w-[500px] bg-surface-default p-6 gap-4 rounded-[12px] border border-success-outline/50 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-success-surface border border-success-outline/60 flex items-center justify-center text-success-foreground shrink-0">
                <Icon icon="lucide:check-circle-2" className="w-6 h-6 text-success-foreground" />
              </div>
              <div className="flex flex-col">
                <Typography
                  variant="h3"
                  className="text-[16px]! font-bold! text-content-primary leading-tight"
                >
                  Receipt Confirmed & Funds Released
                </Typography>
                <Typography
                  variant="caption"
                  className="text-[12px]! text-content-secondary pt-0.5"
                >
                  Escrow transaction completed successfully
                </Typography>
              </div>
            </div>

            <div className="bg-page-secondary/60 rounded-[8px] p-3.5 border border-outline-subtle flex flex-col gap-2 text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-content-secondary">Released Amount</span>
                <span className="font-jetbrains font-bold text-content-primary">
                  {formattedAmount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-content-secondary">Transferred To</span>
                <span className="font-medium text-content-primary truncate max-w-[200px]">
                  {formatSeller(order?.sellerName || "Seller")}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-outline-subtle">
                <span className="text-content-secondary">Protection</span>
                <span className="flex items-center gap-1 text-[12px] font-medium text-success-foreground">
                  <Icon icon="lucide:shield-check" className="w-4 h-4" />
                  Trustora Escrow Finalized
                </span>
              </div>
            </div>

            <Typography
              variant="caption"
              className="text-[13px]! text-content-secondary leading-relaxed"
            >
              You have confirmed delivery and inspected the item. Funds have been released to the seller.
            </Typography>

            <Button
              variant="secondary"
              onClick={() => navigate("/myorders")}
              className="w-full py-2.5 rounded-[8px]! text-[13px] font-semibold border-outline-strong"
            >
              Back to My Orders
            </Button>
          </div>
        )}

        {mode === "disputed" && (
          <div className="flex flex-col md:w-[360px] lg:w-[500px] bg-page-primary p-[24px] gap-[20px] rounded-[12px] border border-page-tertiary shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1.5">
                <Typography
                  variant="h2"
                  className="text-[16px]! font-[600]! text-content-primary"
                >
                  Report an issue
                </Typography>
                <Typography
                  variant="caption"
                  className="text-[13px]! font-[400]! text-content-secondary leading-relaxed"
                >
                  Open an escrow dispute. Funds remain locked until the issue is resolved by Trustora arbitration.
                </Typography>
              </div>
              <Icon
                icon="lucide:x"
                className="w-5 h-5 text-content-tertiary hover:text-content-primary cursor-pointer shrink-0"
                onClick={() => setMode?.("default")}
              />
            </div>

            <form className="flex flex-col gap-[16px]" onSubmit={handleDisputeSubmit}>
              <DropDown
                label="Reason for dispute"
                options={disputeReasons}
                placeholder="Select dispute reason"
                value={option}
                onChange={setOption}
              />

              <TextArea
                label="Description & Details"
                maxLength={500}
                placeholder="Provide a detailed explanation of the issue (e.g. condition discrepancies, missing components, transit damage)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-content-secondary">
                  Attach Evidence Files (Photos, Inspection slips, Unboxing clips)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  accept="image/*,.pdf,.zip"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 px-3 border border-dashed border-outline-strong rounded-lg bg-page-secondary hover:bg-page-tertiary text-content-secondary text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Icon icon="lucide:upload-cloud" className="w-4 h-4 text-accent-default" />
                  <span>Choose files to upload (Max 5 files)</span>
                </button>

                {evidenceFiles.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1.5">
                    {evidenceFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1 px-2 bg-page-tertiary rounded text-content-primary border border-outline-subtle"
                      >
                        <span className="truncate max-w-[280px] font-mono">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-danger-icon hover:text-red-700 ml-2 cursor-pointer"
                        >
                          <Icon icon="lucide:x" className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setMode?.("default")}
                  className="w-1/3 py-2.5 rounded-[8px]! text-[13px]"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="w-2/3 py-2.5 rounded-[8px]! bg-danger-icon! hover:bg-red-700! text-white font-[600] text-[13px]"
                  type="submit"
                  disabled={!canDispute || !option || isSubmittingDispute}
                  loading={isSubmittingDispute}
                >
                  Submit Dispute
                </Button>
              </div>
            </form>
          </div>
        )}

        {mode === "disputeOpened" && (
          <div className="flex flex-col md:w-[360px] lg:w-[500px] bg-danger-surface border-danger-icon p-[24px] gap-[16px] rounded-[12px] border">
            <div className="flex flex-col gap-[8px]">
              <Typography
                variant="h2"
                className="text-[16px]! font-[600]! text-danger-icon"
              >
                Dispute Under Investigation
              </Typography>
              <Typography
                variant="caption"
                className="text-[14px]! font-[400]! text-content-secondary leading-relaxed"
              >
                Trustora admins are currently reviewing submitted evidence.
                Funds will remain locked securely until a resolution is
                finalized.
              </Typography>
            </div>

            <div className="flex items-center gap-2 bg-neutral-white px-3 py-2 rounded-[8px] border border-outline-default/50">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <Typography
                variant="caption"
                className="text-[13px]! font-[600]! text-content-primary"
              >
                Pending Admin Arbitrage
              </Typography>
            </div>
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-surface-default border border-outline-default rounded-xl p-6 max-w-[420px] w-full flex flex-col gap-4 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0">
                  <Icon icon="lucide:alert-triangle" className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex flex-col">
                  <Typography variant="h3" className="text-[17px] font-bold text-content-primary">
                    Confirm Receipt & Release Funds?
                  </Typography>
                  <Typography variant="caption" className="text-[13px] text-content-secondary pt-1 leading-relaxed">
                    Are you sure you want to confirm receipt? This action will permanently release{" "}
                    <strong className="text-content-primary">{formattedAmount}</strong> to{" "}
                    <strong className="text-content-primary">{formatSeller(order?.sellerName || "the seller")}</strong>.
                    Once confirmed, this transaction cannot be reversed or disputed.
                  </Typography>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isConfirming}
                  className="rounded-[8px]! text-[13px]"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmReceiptExecute}
                  loading={isConfirming}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-[8px]! text-[13px] font-semibold"
                >
                  Yes, Release Funds
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    ),

    // ----------------------------------------------------
    // SELLER ROLE — SELLER FULFILLMENT HUB
    // ----------------------------------------------------
    seller: (
      <div className="flex flex-col md:w-[360px] lg:w-[500px] gap-4">
        {/* 1. Escrow Assurance Header Banner */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
            <Icon icon="lucide:shield-check" className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-emerald-950 text-sm">
                Escrow Secured: {formattedAmount}
              </h4>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-200/70 text-emerald-800 rounded">
                HELD
              </span>
            </div>
            <p className="text-xs text-emerald-800/90 leading-relaxed mt-0.5">
              Buyer's payment is safely locked in Trustora Escrow. You are guaranteed payout upon confirmed delivery.
            </p>
          </div>
        </div>

        {/* 2. Buyer Delivery Information Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-jetbrains">
              Delivery Destination
            </span>
            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
              <Icon icon="lucide:user-check" className="w-3.5 h-3.5" />
              Verified Buyer
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
              {buyerDisplayName[0]?.toUpperCase() || "B"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">
                {buyerDisplayName}
              </span>
              <span className="text-xs text-gray-500 font-mono truncate">
                {order?.buyerEmail || "buyer@trustora.com"}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200/70 text-xs text-gray-700 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-semibold text-gray-800">
              <Icon icon="lucide:map-pin" className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Shipping Address</span>
            </div>
            <p className="text-gray-600 leading-relaxed pl-5">
              1424 Market St, Suite 500
              <br />
              San Francisco, CA 94102, United States
            </p>
          </div>
        </div>

        {/* 3. Action State: Awaiting Shipment */}
        {canShip && !isShipped && !isDelivered && !isCompleted && !isDisputed && (
          <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <Icon icon="lucide:package-check" className="w-5 h-5 text-indigo-600" />
                  Ship Item to Buyer
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Package the item securely and provide carrier tracking below.
                </p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-50 text-amber-700 border border-amber-200 font-jetbrains">
                Action Required
              </span>
            </div>

            <form onSubmit={handleShipSubmit} className="flex flex-col gap-3.5">
              <DropDown
                label="Shipping Carrier"
                options={CARRIER_OPTIONS}
                value={selectedCarrier}
                onChange={setSelectedCarrier}
                placeholder="Select carrier"
              />

              <TextField
                label="Tracking Number"
                type="text"
                required
                placeholder="e.g. FDX-98234123901"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />

              <TextField
                label="Fulfillment Note (Optional)"
                type="text"
                placeholder="e.g. Dispatched via Express Air with Signature Required"
                value={shippingNotes}
                onChange={(e) => setShippingNotes(e.target.value)}
              />

              <Button
                type="submit"
                variant="primary"
                disabled={isShipping || !trackingNumber.trim()}
                loading={isShipping}
                className="w-full py-3 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow-sm transition-colors flex items-center justify-center gap-2 mt-1"
              >
                <Icon icon="lucide:truck" className="w-4 h-4" />
                Confirm Shipment & Provide Tracking
              </Button>
            </form>
          </div>
        )}

        {/* 4. Action State: Shipped / In Transit */}
        {isShipped && !isDelivered && !isCompleted && !isDisputed && (
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Icon icon="lucide:truck" className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">
                  Item Shipped & In Transit
                </h4>
                <p className="text-xs text-gray-500">
                  Carrier: <strong className="text-gray-800">{order?.shippingMethod || selectedCarrier}</strong>
                </p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-indigo-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Tracking Number:</span>
              <span className="font-mono font-bold text-indigo-600 underline">
                {order?.trackingNumber || trackingNumber || "TRK-VERIFIED"}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              The buyer has been notified with tracking details. Once the buyer confirms delivery, {formattedAmount} will be immediately released to your balance.
            </p>
          </div>
        )}

        {/* 5. Action State: Completed / Funds Released */}
        {isCompleted && (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Icon icon="lucide:check-circle-2" className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">
                  Payout Released
                </h4>
                <p className="text-xs text-emerald-800">
                  Transaction completed successfully
                </p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-lg border border-emerald-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Total Payout Deposited:</span>
              <span className="font-jetbrains font-bold text-emerald-700 text-sm">
                {formattedAmount}
              </span>
            </div>

            <Button
              variant="secondary"
              onClick={() => navigate("/seller/dashboard")}
              className="w-full py-2.5 rounded-lg text-xs font-semibold"
            >
              Back to My Inventory
            </Button>
          </div>
        )}

        {/* 6. Action State: Disputed */}
        {isDisputed && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Icon icon="lucide:alert-triangle" className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-amber-950 text-sm">
                  Order Under Dispute Review
                </h4>
                <p className="text-xs text-amber-800">
                  Trustora admin arbitration active
                </p>
              </div>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              A dispute was filed for this transaction. Funds remain secured in Escrow. An administrator is reviewing submitted evidence to issue a resolution.
            </p>
          </div>
        )}
      </div>
    ),

    Admin: null,
  };

  return (
    <div className="w-full">
      {!isSeller && roles === "seller" && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 flex items-center gap-2.5 shadow-xs">
          <Icon icon="lucide:shield-alert" className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Access Restricted:</strong> You are viewing this order as a Buyer. Seller fulfillment controls (carrier selection, dispatch confirmation) are restricted to the seller.
          </span>
        </div>
      )}
      {cardRole[effectiveRole] || cardRole.buyer}
    </div>
  );
}
