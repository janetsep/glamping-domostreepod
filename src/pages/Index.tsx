
import { useReservations } from "@/hooks/useReservations";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import Location from "@/components/Location";
import Packages from "@/components/Packages";
import SimplifiedContact from "@/components/SimplifiedContact";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  const { fetchGlampingUnits } = useReservations();
  
  const { data: units = [], isLoading } = useQuery({
    queryKey: ['glamping-units'],
    queryFn: fetchGlampingUnits,
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    // Mostrar toast para confirmar que estamos en la página principal
    toast.success("¡Bienvenido a Domos Treepod!", {
      description: "Estás en la página principal"
    });
    
    console.log("Index page loaded successfully");
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Benefits />
      <Testimonials />
      <Location />
      <Packages units={units} isLoading={isLoading} />
      <SimplifiedContact />
      <Footer />
    </div>
  );
};

export default Index;
