
import { MapPin, Trees, Droplets, Bird } from "lucide-react";

const Location = () => {
  return (
    <section id="location" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 text-center">
          Ubicación y Entorno
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Descubre lo increíble que es el Valle Las Trancas, un paraíso natural a los pies de la cordillera
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Mapa */}
          <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101642.12996031373!2d-71.53145371913551!3d-36.86035225613085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d30354addbf9%3A0xfee2d4459f4d9099!2sValle%20Las%20Trancas%2C%20Chile!5e0!3m2!1ses!2scl!4v1705543234507!5m2!1ses!2scl" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de ubicación"
            ></iframe>
          </div>
          
          {/* Información del Valle */}
          <div>
            <div className="flex items-start gap-4 mb-6">
              <MapPin className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Valle Las Trancas, Chile</h3>
                <p className="text-gray-600">
                  Ubicado a los pies del Volcán Chillán y rodeado de bosques nativos, nuestro glamping te ofrece una 
                  experiencia única en uno de los valles más hermosos de la Cordillera de Los Andes, a solo 1.5 horas 
                  de la ciudad de Chillán.
                </p>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Descubre los alrededores:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Trees className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Senderos Naturales</h4>
                  <p className="text-sm text-gray-600">Recorre bosques milenarios y cascadas escondidas.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Droplets className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Termas Naturales</h4>
                  <p className="text-sm text-gray-600">A solo 15 minutos de las mejores aguas termales de la región.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Bird className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Fauna Local</h4>
                  <p className="text-sm text-gray-600">Observa cóndores y otras especies autóctonas en su hábitat natural.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold">Centro de Ski</h4>
                  <p className="text-sm text-gray-600">A 20 minutos del centro de ski Nevados de Chillán.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
