
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative h-[50vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="container relative z-10 mx-auto h-full flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white text-shadow mb-4">
          Nuestra Historia y Compromiso
        </h1>
        <p className="text-xl text-white text-shadow max-w-3xl">
          Conoce a las personas detrás de Domos Treepod y nuestra pasión por la naturaleza y la sustentabilidad.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
