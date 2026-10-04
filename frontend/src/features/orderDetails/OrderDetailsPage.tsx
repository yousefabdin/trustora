import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import DetailsSection from "./components/DetailsSection";
export default function OrderDetailsPage() {
  return (
    <div>
      <NavBar buttonLabel="Sell" isAuth={true} />
      <DetailsSection />
    </div>
  );
}
