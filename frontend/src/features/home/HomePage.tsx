import Typography from "@/components/atoms/typography/typography";
import NavBar from "@/components/organisms/NavigationsBar/NavBar";
import { Icon } from "@iconify/react";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import HowWorks from "./components/HowWorks";
import Cards from "@/components/molecules/cards/Cards";
import FeatureCardsSection from "./components/FeatureCardsSection";
import BenefitsSection from "./components/BenefitsSection";
import UserFeedbackSection from "./components/UserFeedbackSection";
import PricingSection from "./components/PricingSection";
import FaqSection from "./components/FaqSection";
import CtaBanner from "./components/CtaBanner";
import Footer from "./components/Footer";

import { useAuth } from "@/context/AuthContext";
export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col">
      <NavBar buttonLabel="Get Started" isAuth={isAuthenticated}></NavBar>
      <HeroSection></HeroSection>
      <StatsSection></StatsSection>
      <HowWorks></HowWorks>
      <FeatureCardsSection></FeatureCardsSection>
      <BenefitsSection></BenefitsSection>
      <UserFeedbackSection></UserFeedbackSection>
      <PricingSection></PricingSection>
      <FaqSection></FaqSection>
      <CtaBanner></CtaBanner>
      <Footer></Footer>
    </div>
  );
}
