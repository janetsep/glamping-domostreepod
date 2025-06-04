
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Features from "@/components/Features";
import GlampingUnits from "@/components/GlampingUnits";
import Gallery from "@/components/Gallery";
import TravelerTypes from "@/components/TravelerTypes";
import Packages from "@/components/Packages";
import Testimonials from "@/components/Testimonials";
import Location from "@/components/Location";
import SimplifiedContact from "@/components/SimplifiedContact";
import Footer from "@/components/footer";
import CultureSection from "@/components/CultureSection";
import Celebrations from "@/components/Celebrations";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Benefits />
      <Features />
      <CultureSection />
      <GlampingUnits />
      <Gallery />
      <TravelerTypes />
      <Packages />
      <Celebrations />
      <Testimonials />
      <Location />
      <SimplifiedContact />
      <Footer />
    </div>
  );
};

export default Index;
