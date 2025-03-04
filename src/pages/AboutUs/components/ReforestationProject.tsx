
import React from "react";
import { TreePine } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ReforestationProject = () => {
  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3">
              <div className="bg-primary/10 p-4 rounded-full inline-block mb-4">
                <TreePine className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary mb-2">
                Proyecto de Reforestación
              </h3>
              <p className="text-gray-700">
                Por cada huésped que nos visita, plantamos un árbol nativo en las áreas deforestadas del Valle Las Trancas.
              </p>
            </div>
            
            <div className="md:w-2/3">
              <div className="bg-secondary/20 rounded-lg p-6">
                <div className="text-center mb-6">
                  <h4 className="text-xl font-display font-bold text-primary">Nuestro Impacto</h4>
                  <Separator className="my-4 mx-auto w-16 bg-primary" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-primary">1,200+</p>
                    <p className="text-gray-700">Árboles plantados</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">3</p>
                    <p className="text-gray-700">Hectáreas reforestadas</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">12</p>
                    <p className="text-gray-700">Especies nativas</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">4+</p>
                    <p className="text-gray-700">Años de proyecto</p>
                  </div>
                </div>
                
                <p className="text-center mt-6 text-gray-700">
                  ¿Quieres participar? Pregunta por nuestro tour de reforestación donde podrás plantar tu propio árbol.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReforestationProject;
