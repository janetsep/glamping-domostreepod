import React from "react";

const OurStorySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-primary mb-6">
              De Visión a Realidad: Nuestra Historia
            </h2>
            <p className="text-gray-700 mb-4">
              Domos Treepod nació en 2019 de la visión de Janet Mariel Sepúlveda Correa y Jaime Antonio Echeverría Migryk, quienes tras años de experiencia en hospitalidad y gestión turística, decidieron crear un concepto que trascendiera el turismo tradicional en Valle Las Trancas, evolucionando hacia un modelo regenerativo que impacta positivamente en el entorno.
            </p>
            <p className="text-gray-700 mb-4">
              El Valle Las Trancas, con su impresionante bosque nativo en la cordillera de los Andes, fue el escenario perfecto para materializar este sueño. Inspirados por la arquitectura geodésica y sus beneficios para el ecosistema, establecimos domos que no solo minimizaran su huella ambiental, sino que contribuyeran activamente a la regeneración del entorno natural.
            </p>
            <p className="text-gray-700">
              Hoy, Domos Treepod se ha convertido en un referente de turismo regenerativo en la Región de Ñuble, ofreciendo experiencias auténticas que conectan a nuestros huéspedes con la naturaleza mientras apoyamos la conservación del bosque nativo y fortalecemos la comunidad local a través de prácticas que van más allá de la sustentabilidad.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="/images/founders/jaime-echeverria.jpg" 
                alt="Jaime Antonio Echeverría Migryk, co-fundador" 
                className="rounded-lg shadow-lg h-64 object-cover"
              />
              <img 
                src="/images/founders/janet-sepulveda.jpg" 
                alt="Janet Mariel Sepúlveda Correa, co-fundadora" 
                className="rounded-lg shadow-lg h-64 object-cover"
              />
              <img 
                src="/images/locations/valle-las-trancas.jpg" 
                alt="Valle Las Trancas, bosque nativo" 
                className="rounded-lg shadow-lg h-64 object-cover col-span-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;
