
import React from "react";
import { Heart, Users, Recycle } from "lucide-react";

const MissionAndValues = () => {
  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-4">
            Nuestra Misión y Valores
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            En Domos Treepod creemos en un turismo que respete y proteja los entornos naturales mientras crea experiencias memorables.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-display font-bold">Pasión por la Naturaleza</h3>
            </div>
            <p className="text-gray-700">
              Nuestro amor por los espacios naturales nos impulsa a protegerlos y a invitar a otros a apreciar su belleza y valor.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-display font-bold">Comunidad Local</h3>
            </div>
            <p className="text-gray-700">
              Trabajamos estrechamente con las comunidades locales, generando empleo y apoyando a productores y artesanos de la zona.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Recycle className="h-8 w-8 text-primary mr-3" />
              <h3 className="text-xl font-display font-bold">Innovación Sostenible</h3>
            </div>
            <p className="text-gray-700">
              Buscamos constantemente nuevas formas de reducir nuestro impacto ambiental sin comprometer la calidad de la experiencia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionAndValues;
