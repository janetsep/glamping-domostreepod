
import { useReservations } from "@/hooks/reservations";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import Location from "@/components/Location";
import Packages from "@/components/Packages";
import Gallery from "@/components/Gallery";
import Celebrations from "@/components/Celebrations";
import SimplifiedContact from "@/components/SimplifiedContact";
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
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Mostrar toast más sutil para la experiencia minimalista
    toast.success("Bienvenido a Domos Treepod", {
      description: "Descubre una experiencia única en la naturaleza",
      duration: 3000
    });
    
    console.log("Index page loaded successfully");
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <div id="benefits" className="my-4 md:my-8">
        <Benefits />
      </div>
      <div className="my-4 md:my-8 bg-gray-50 py-8">
        <Testimonials />
      </div>
      <div className="my-4 md:my-8">
        <Location />
      </div>
      <div id="packages" className="my-4 md:my-8">
        <Packages units={units} isLoading={isLoading} />
      </div>
      <div id="celebrations" className="my-4 md:my-8 bg-gray-50 py-8">
        <Celebrations />
      </div>
      <div className="my-4 md:my-8">
        <Gallery />
      </div>
      <div className="mt-4 md:mt-8 bg-gradient-to-r from-gray-50 to-white py-8">
        <SimplifiedContact />
      </div>
    </div>
  );
};

export default Index;
