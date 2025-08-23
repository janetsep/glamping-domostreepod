import { SimpleHero } from "@/components/landing/SimpleHero";
import { DynamicSocialProof } from "@/components/landing/DynamicSocialProof";
import { QuickBookingSection } from "@/components/landing/QuickBookingSection";
import { HighlightedPackages } from "@/components/landing/HighlightedPackages";
import { FAQSection } from "@/components/landing/FAQSection";
import { LocationSection } from "@/components/landing/LocationSection";
import { FinalCTA } from "@/components/landing/FinalCTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* 1. Hero Section - Impacto inicial y CTA principal */}
      <SimpleHero />
      
      {/* 2. Prueba Social Dinámica - Credibilidad con datos reales */}
      <DynamicSocialProof />
      
      {/* 3. Reserva Rápida - Conversión directa con urgencia */}
      <QuickBookingSection />
      
      {/* 4. Paquetes Destacados - Solo los mejores para no confundir */}
      <HighlightedPackages />
      
      {/* 5. FAQ - Solo las preguntas más importantes */}
      <FAQSection />
      
      {/* 6. Ubicación - Info práctica esencial */}
      <LocationSection />
      
      {/* 7. CTA final - Última oportunidad de conversión */}
      <FinalCTA />
    </div>
  );
};

export default Index;