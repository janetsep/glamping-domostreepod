
import React from "react";

const OurStorySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-primary mb-6">
              Nuestra Historia
            </h2>
            <p className="text-gray-700 mb-4">
              Domos Treepod nació en 2019 de la visión de Carolina Mendoza y Sebastián Torres, dos aventureros apasionados por la naturaleza y el turismo sostenible. Después de años trabajando en el sector turístico convencional, decidieron crear algo diferente: una experiencia de hospedaje que conectara profundamente a las personas con la naturaleza sin renunciar a la comodidad.
            </p>
            <p className="text-gray-700 mb-4">
              El Valle Las Trancas, con su impresionante bosque nativo y sus paisajes montañosos, fue el lugar perfecto para materializar este sueño. Inspirados por la arquitectura geodésica y sus beneficios ecológicos, decidieron construir domos que se integraran armónicamente con el entorno natural.
            </p>
            <p className="text-gray-700">
              Hoy, Domos Treepod es un referente en glamping sustentable en Chile, ofreciendo una experiencia única que combina lujo, confort y respeto por el medio ambiente.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Sebastián Torres, co-fundador" 
                className="rounded-lg shadow-lg h-64 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Carolina Mendoza, co-fundadora" 
                className="rounded-lg shadow-lg h-64 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Valle Las Trancas" 
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
