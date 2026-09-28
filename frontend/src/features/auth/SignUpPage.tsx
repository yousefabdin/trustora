import BrandPanelSection from "./components/BrandPanelSection";
import SignUpForm from "./components/SignUpFrom";

export default function SignUpPage() {
  return (
    <div className="flex  h-screen ">
      <BrandPanelSection></BrandPanelSection>
      <SignUpForm></SignUpForm>
    </div>
  );
}
