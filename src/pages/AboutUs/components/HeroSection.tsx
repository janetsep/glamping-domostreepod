
import React from "react";
import { aboutUsContent } from "@/data/content/aboutUs";

const HeroSection = () => {
  return (
    <section className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: "url('/images/locations/valle-las-trancas.jpg')" }}>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container relative z-10 mx-auto h-full flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-shadow mb-4">
          {aboutUsContent.heroTitle}
        </h1>
        <p className="text-xl text-white text-shadow max-w-3xl">
          {aboutUsContent.heroSubtitle}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
