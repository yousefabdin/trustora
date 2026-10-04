import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import OrderPaid from "../components/OrderPaid";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-page-primary flex flex-col">
      <NavBar buttonLabel="+Sell" isAuth={true} />
      <main className="flex-1 w-full">
        <OrderPaid />
      </main>
    </div>
  );
}
