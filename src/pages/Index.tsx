import { SimpleHero } from "@/components/landing/SimpleHero";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { SolutionPackages } from "@/components/landing/SolutionPackages";
import { HighlightedPackages } from "@/components/landing/HighlightedPackages";
import { LeadMagnetSection } from "@/components/landing/LeadMagnetSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { BenefitsShowcase } from "@/components/landing/BenefitsShowcase";
import { UrgencySection } from "@/components/landing/UrgencySection";
import { LocationSection } from "@/components/landing/LocationSection";
import { FinalCTA } from "@/components/landing/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* 1. Hero Section - Impacto inicial y CTA principal */}
      <SimpleHero />
      
      {/* 2. Social Proof - Credibilidad inmediata */}
      <SocialProofSection />
      
      {/* 3. Experiencias - Mostrar el valor y despertar deseo */}
      <SolutionPackages />
      <HighlightedPackages />
      
      {/* 4. Lead Magnet - Capturar leads con valor */}
      <LeadMagnetSection />
      
      {/* 5. Beneficios clave - Reforzar el valor */}
      <BenefitsShowcase />
      
      {/* 6. FAQ - Eliminar objeciones */}
      <FAQSection />
      
      {/* 7. Urgencia y escasez - Crear necesidad de actuar */}
      <UrgencySection />
      
      {/* 8. Ubicación - Información práctica */}
      <LocationSection />
      
      {/* 9. CTA final - Última oportunidad de conversión */}
      <FinalCTA />
    </div>
  );
};

export default Index;