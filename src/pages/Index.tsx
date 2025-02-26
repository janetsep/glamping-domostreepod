
import { useReservations } from "@/hooks/useReservations";
import { useEffect, useState } from "react";
import type { GlampingUnit } from "@/lib/supabase";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import GlampingUnits from "@/components/GlampingUnits";
import Features from "@/components/Features";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const { fetchGlampingUnits } = useReservations();
  
  const { data: units = [], isLoading } = useQuery({
    queryKey: ['glamping-units'],
    queryFn: fetchGlampingUnits,
  });

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
