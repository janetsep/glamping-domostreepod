
import React from "react";
import { TreePine, Leaf, Recycle, Award } from "lucide-react";

const SustainabilitySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-primary mb-4">
            Nuestro Compromiso con la Sostenibilidad
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            La sostenibilidad no es solo una palabra para nosotros, es el núcleo de nuestra operación diaria.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Bosque nativo en Valle Las Trancas" 
              className="rounded-lg shadow-lg w-full h-[500px] object-cover"
            />
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-2">
                <TreePine className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                <h3 className="text-xl font-display font-bold">Construcción Sostenible</h3>
              </div>
              <p className="text-gray-700 pl-8">
                Nuestros domos están construidos con materiales de bajo impacto ambiental y diseñados para minimizar el consumo energético. La estructura geodésica proporciona eficiencia térmica natural y requiere menos materiales que las construcciones tradicionales.
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Leaf className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                <h3 className="text-xl font-display font-bold">Energía Renovable</h3>
              </div>
              <p className="text-gray-700 pl-8">
                El 80% de nuestra energía proviene de paneles solares instalados en nuestra propiedad. Trabajamos para alcanzar la autonomía energética completa en los próximos años.
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Recycle className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                <h3 className="text-xl font-display font-bold">Gestión de Residuos</h3>
              </div>
              <p className="text-gray-700 pl-8">
                Implementamos un riguroso sistema de separación y reciclaje. Composteamos todos los residuos orgánicos para usarlos en nuestro huerto, que proporciona parte de los alimentos para nuestros desayunos.
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Award className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
                <h3 className="text-xl font-display font-bold">Certificaciones y Reconocimientos</h3>
              </div>
              <div className="pl-8">
                <p className="text-gray-700 mb-4">
                  Nos enorgullece contar con las siguientes certificaciones que avalan nuestro compromiso con la sostenibilidad:
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-secondary/30 px-3 py-1 rounded-full text-sm">Sello S de Turismo Sustentable</span>
                  <span className="bg-secondary/30 px-3 py-1 rounded-full text-sm">Miembro de Chile Sustentable</span>
                  <span className="bg-secondary/30 px-3 py-1 rounded-full text-sm">Certificación Green Leaders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
