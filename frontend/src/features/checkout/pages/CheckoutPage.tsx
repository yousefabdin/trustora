import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import CheckoutSection from "../components/CheckoutSection";

export default function CheckoutPage() {
  return (
    <div>
      <NavBar buttonLabel="Get Started" isAuth={false}></NavBar>
      <CheckoutSection></CheckoutSection>
    </div>
  );
}
