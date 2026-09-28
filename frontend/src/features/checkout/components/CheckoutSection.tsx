import CardSummarySection from "./CardSummarySection";
import CheckoutForm from "./CheckoutForm";
import { useLocation, useNavigate } from "react-router-dom";
import PaySectionMobile from "./PaySectionMobile";
import { useState, useRef } from "react";
import { createOrder } from "@/services/orderService";
import { getTodayDate } from "@/services/orderService";
export default function CheckoutSection() {
  const { state } = useLocation();
  const item = state.item;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createOrderNumber = useRef(2756);
  const navigate = useNavigate();
  const handleOrderPayment = async (e) => {
    e.preventDefault();
    const totalPrice = 12.45 + item.itemPrice;

    const orderDate = getTodayDate();
    createOrderNumber.current = createOrderNumber.current + 1;
    const shippingFees = item.itemPrice > 500 ? 0 : 30;
    const orderNumber = "#HDL-".concat(createOrderNumber.current.toString());
    setIsSubmitting(true);
    const newOrder = {
      id: crypto.randomUUID(),
      orderNumber: orderNumber,
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      totalPrice: totalPrice,
      orderDate: orderDate,
      status: "Captured",
      shippingFees: shippingFees,
      platformFee: 15,
      trackingNumber: "9400111899223847652" + createOrderNumber,
      statusHistory: [
        { status: "Captured", date: getTodayDate() },
        { status: "Held in Escrow", date: getTodayDate() },
      ],
      escrowInstructionSummary:
        "Funds held securely in escrow until buyer confirms inspection within 48 hours of delivery.",
      itemImg: item.img,
      sellerName: item.sellerName,
      sellerAvatar: item.sellerAvatar,
    };
    try {
      createOrder(newOrder);
      navigate(`/checkout/success/${newOrder.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex justify-center flex-col-reverse md:flex-row md:justify-between py-[20px] px-[12px] md:pt-[48px] md:px-[20px] lg:pb-[80px] lg:px-[64px] lg:gap-[64px] gap-[10px]">
        <CheckoutForm
          item={item}
          handleOrderPayment={handleOrderPayment}
        ></CheckoutForm>
        <CardSummarySection item={item}></CardSummarySection>
      </div>
      <PaySectionMobile item={item}></PaySectionMobile>
    </>
  );
}
