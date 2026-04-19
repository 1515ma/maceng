import { HeroSection } from "./sections/hero";
import { ModulesSection } from "./sections/modules";
import { HowItWorksSection } from "./sections/how-it-works";
import { EngineeringAreasSection } from "./sections/engineering-areas";
import { PricingSection } from "./sections/pricing";
import { FaqSection } from "./sections/faq";
import { CtaSection } from "./sections/cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ModulesSection />
      <HowItWorksSection />
      <EngineeringAreasSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
