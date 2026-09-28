import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import DetailsSection from "./components/DetailsSection";
export default function OrderDetailsPage() {
  return (
    <div>
      <div className="hidden md:block">
        <NavBar buttonLabel={"Sell"} isAuth={true}></NavBar>
      </div>
      <DetailsSection></DetailsSection>
    </div>
  );
}
