
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Leaf, Users, Award, Heart, Recycle, TreePine } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
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
      
      {/* Our Story Section */}
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
      
      {/* Mission and Values */}
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
      
      {/* Sustainability Section */}
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
      
      {/* Reforestation Project */}
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
      
      <Footer />
    </div>
  );
};

export default AboutUs;
