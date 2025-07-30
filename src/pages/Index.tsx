
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import Packages from "@/components/Packages";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import Location from "@/components/Location";
import SimplifiedContact from "@/components/SimplifiedContact";
import CultureSection from "@/components/CultureSection";
import Celebrations from "@/components/Celebrations";
import { useGlampingUnits } from "@/hooks/reservations/useGlampingUnits";

const Index = () => {
  const { data: units = [], isLoading } = useGlampingUnits();

  return (
    <div className="min-h-screen">
      <Hero />
      <CultureSection />
      <Gallery />
      <Packages units={units} isLoading={isLoading} />
      <Benefits />
      <Celebrations />
      <Testimonials />
      <Location />
      <SimplifiedContact />
    </div>
  );
};

export default Index;
