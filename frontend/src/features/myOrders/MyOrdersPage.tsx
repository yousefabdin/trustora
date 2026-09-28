import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import OrdersSection from "./components/OrdersSection";

export default function MyOrderPage() {
  return (
    <div className="bg-page-secondary min-h-screen flex flex-col">
      <NavBar buttonLabel="+Sell" isAuth={true} />
      <main className="flex-1">
        <OrdersSection />
      </main>
    </div>
  );
}
