
import { HeroPersonalized } from "@/components/landing/HeroPersonalized";
import { BuyerPersonaSection } from "@/components/landing/BuyerPersonaSection";
import { PackagesByType } from "@/components/landing/PackagesByType";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import Gallery from "@/components/Gallery";
import Benefits from "@/components/Benefits";
import Location from "@/components/Location";
import SimplifiedContact from "@/components/SimplifiedContact";
import CultureSection from "@/components/CultureSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroPersonalized />
      <BuyerPersonaSection />
      <PackagesByType />
      <SocialProofSection />
      <CultureSection />
      <Gallery />
      <Benefits />
      <Location />
      <SimplifiedContact />
    </div>
  );
};

export default Index;
