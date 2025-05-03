import React from "react";
import { aboutUsContent } from "../data/content/aboutUs";

const OurStorySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Historia principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-display font-bold text-primary mb-6">
              {aboutUsContent.storyTitle}
            </h2>
            <p className="text-gray-700 mb-4">
              {aboutUsContent.storyText}
            </p>
            <p className="text-gray-700 mb-4">
              {aboutUsContent.storyText2}
            </p>
            <p className="text-gray-700">
              {aboutUsContent.storyText3}
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

        {/* Sección de Turismo Regenerativo */}
        <div className="mt-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-6 text-center">
            {aboutUsContent.regenerativeTitle}
          </h2>
          <p className="text-gray-700 mb-6 max-w-4xl mx-auto text-center">
            {aboutUsContent.regenerativeText1}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Flora 100% Nativa
              </h3>
              <p className="text-gray-700">
                No introducimos especies ajenas al ecosistema local. Permitimos que la naturaleza siga su ritmo, lo que ha favorecido la multiplicación natural de lupinos y añañucas, flores propias de la zona que embellecen nuestro entorno sin intervención artificial.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Jardinería de No-Intervención
              </h3>
              <p className="text-gray-700">
                A diferencia de otros alojamientos, no utilizamos agua para regar jardines ornamentales. Todo lo que ves en nuestro entorno es producto de los ciclos naturales de lluvia y crecimiento propios del Valle Las Trancas.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Agricultura Regenerativa
              </h3>
              <p className="text-gray-700">
                Nuestro invernadero opera sin pesticidas y aprovecha únicamente el agua de lluvia, respetando los ciclos naturales y creando un espacio productivo que no extrae recursos del ecosistema local.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-3">
                Conservación de Hábitat Natural
              </h3>
              <p className="text-gray-700">
                Preservamos conscientemente los árboles antiguos del bosque que rodea nuestros domos, reconociendo su valor como hábitat vital para pájaros carpinteros y otras especies que dependen de esta madera para su supervivencia.
              </p>
            </div>
          </div>

          <p className="text-gray-700 mt-8 max-w-4xl mx-auto text-center">
            {aboutUsContent.regenerativeText2}
          </p>
          <p className="text-gray-700 mt-4 max-w-4xl mx-auto text-center">
            {aboutUsContent.regenerativeText3}
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;