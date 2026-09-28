import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import OrderPaid from "../components/OrderPaid";
import { useLocation } from "react-router";

export default function PaymentsuccessPage() {
  return (
    <div>
      <NavBar buttonLabel={"+Sell"} isAuth={true}></NavBar>
      <OrderPaid></OrderPaid>
    </div>
  );
}
