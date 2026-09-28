import BrandPanelSection from "./components/BrandPanelSection";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex">
      <BrandPanelSection></BrandPanelSection>
      <LoginForm></LoginForm>
    </div>
  );
}
