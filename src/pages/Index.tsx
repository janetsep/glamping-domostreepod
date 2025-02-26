
import { useReservations } from "@/hooks/useReservations";
import { useEffect, useState } from "react";
import type { GlampingUnit } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import GlampingUnits from "@/components/GlampingUnits";
import Features from "@/components/Features";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  const { fetchGlampingUnits, isLoading } = useReservations();
  const [units, setUnits] = useState<GlampingUnit[]>([]);

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const data = await fetchGlampingUnits();
        setUnits(data || []);
      } catch (error) {
        console.error('Error cargando unidades:', error);
      }
    };
    
    loadUnits();
  }, [fetchGlampingUnits]);

  if (!units && isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <GlampingUnits units={units} isLoading={isLoading} />
      <Features />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
