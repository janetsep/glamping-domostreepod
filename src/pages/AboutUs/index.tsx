
import React from "react";
import Footer from "@/components/footer";
import HeroSection from "./components/HeroSection";
import OurStorySection from "./components/OurStorySection";
import MissionAndValues from "./components/MissionAndValues";
import SustainabilitySection from "./components/SustainabilitySection";
import ReforestationProject from "./components/ReforestationProject";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <OurStorySection />
      <MissionAndValues />
      <SustainabilitySection />
      <ReforestationProject />
      <Footer />
    </div>
  );
};

export default AboutUs;
