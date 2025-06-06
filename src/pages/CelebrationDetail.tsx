
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCelebrationById } from "@/data/content/celebrations";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import WomenRelaxSection from "@/components/WomenRelaxSection";
import BirthdaySection from "@/components/BirthdaySection";
import FamilyPartySection from "@/components/FamilyPartySection";
import AnniversarySection from "@/components/AnniversarySection";

const CelebrationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  // Early return if no ID
  if (!id) {
    useEffect(() => {
      navigate('/');
    }, [navigate]);
    return null;
  }

  const handleBackToCelebrations = () => {
    // Navigate to home page and then scroll to celebrations section
    navigate('/', { replace: true });
    
    // Use setTimeout to ensure navigation completes before scrolling
    setTimeout(() => {
      const celebrationsElement = document.getElementById('celebrations');
      if (celebrationsElement) {
        celebrationsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Si es la celebración de mujeres, mostrar la sección detallada
  if (id === "mujeres-relax") {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToCelebrations}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Celebraciones
          </Button>
        </div>
        <WomenRelaxSection />
      </div>
    );
  }

  // Si es la celebración de cumpleaños, mostrar la sección detallada
  if (id === "cumpleanos") {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToCelebrations}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Celebraciones
          </Button>
        </div>
        <BirthdaySection />
      </div>
    );
  }

  // Si es la celebración de fiesta familiar, mostrar la sección detallada
  if (id === "fiesta-familiar") {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToCelebrations}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Celebraciones
          </Button>
        </div>
        <FamilyPartySection />
      </div>
    );
  }

  // Si es la celebración de aniversarios, mostrar la sección detallada
  if (id === "aniversarios") {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToCelebrations}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Celebraciones
          </Button>
        </div>
        <AnniversarySection />
      </div>
    );
  }

  const celebration = getCelebrationById(id);
  
  // Use useEffect for navigation instead of during render
  useEffect(() => {
    if (!celebration) {
      navigate('/');
    }
  }, [celebration, navigate]);

  if (!celebration) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20">
      <Section className="py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToCelebrations}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Celebraciones
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h1 className="text-4xl font-display font-bold text-primary mb-6">
                {celebration.name}
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                {celebration.description}
              </p>
              
              <div className="mt-8">
                <Button className="bg-gradient-to-r from-primary to-pink-500 text-white hover:from-primary/90 hover:to-pink-500/90">
                  Reservar Ahora
                </Button>
              </div>
            </div>
            
            <div className="relative h-96 lg:h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
              <img
                src={celebration.image}
                alt={celebration.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default CelebrationDetail;
