
import { useReservations } from "@/hooks/useReservations";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import Location from "@/components/Location";
import Packages from "@/components/Packages";
import Blog from "@/components/Blog";
import SimplifiedContact from "@/components/SimplifiedContact";
import Footer from "@/components/footer";
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
      <div className="my-8 md:my-16">
        <Benefits />
      </div>
      <div className="my-8 md:my-16 bg-gray-50 py-12">
        <Testimonials />
      </div>
      <div className="my-8 md:my-16">
        <Location />
      </div>
      <div id="packages" className="my-8 md:my-16">
        <Packages units={units} isLoading={isLoading} />
      </div>
      <div className="my-8 md:my-16">
        <Blog />
      </div>
      <div className="mt-8 md:mt-16 bg-gradient-to-r from-gray-50 to-white py-12">
        <SimplifiedContact />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
