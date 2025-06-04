
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import TravelerTypes from "@/components/TravelerTypes";
import Packages from "@/components/Packages";
import Testimonials from "@/components/Testimonials";
import Location from "@/components/Location";
import SimplifiedContact from "@/components/SimplifiedContact";
import Footer from "@/components/footer";
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
      <TravelerTypes />
      <Packages units={units} isLoading={isLoading} />
      <Celebrations />
      <Testimonials />
      <Location />
      <SimplifiedContact />
      <Footer />
    </div>
  );
};

export default Index;
