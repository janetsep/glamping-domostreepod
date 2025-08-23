import { SimpleHero } from "@/components/landing/SimpleHero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionPackages } from "@/components/landing/SolutionPackages";
import { HighlightedPackages } from "@/components/landing/HighlightedPackages";
import { BenefitsShowcase } from "@/components/landing/BenefitsShowcase";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { UrgencySection } from "@/components/landing/UrgencySection";
import { LocationSection } from "@/components/landing/LocationSection";
import { FinalCTA } from "@/components/landing/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* 1. Hero Simple con CTA claro */}
      <SimpleHero />
      
      {/* 2. Problema que resolvemos */}
      <ProblemSection />
      
      {/* 3. Nuestros paquetes como solución */}
      <SolutionPackages />
      
      {/* 4. Destacados del mes */}
      <HighlightedPackages />
      
      {/* 5. Beneficios clave */}
      <BenefitsShowcase />
      
      {/* 6. Prueba social */}
      <SocialProofSection />
      
      {/* 7. Urgencia y escasez */}
      <UrgencySection />
      
      {/* 8. Ubicación */}
      <LocationSection />
      
      {/* 9. CTA final */}
      <FinalCTA />
    </div>
  );
};

export default Index;