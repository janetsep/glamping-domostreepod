import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getTravelerTypeById } from "@/data/content/travelerTypes";
import { ArrowLeft, Calendar, Users, Star } from "lucide-react";
import { Helmet } from "react-helmet-async";

const TravelerType = () => {
  const { typeId } = useParams<{ typeId: string }>();
  const navigate = useNavigate();

  if (!typeId) {
    navigate("/");
    return null;
  }

  const travelerType = getTravelerTypeById(typeId);

  if (!travelerType) {
    navigate("/");
    return null;
  }

  const handleReserveClick = () => {
    // Navigate to the main unit for reservation
    navigate("/unit/1");
  };

  const handleBackClick = () => {
    navigate("/#buyer-personas");
  };

  return (
    <>
      <Helmet>
        <title>{travelerType.title} - TreePod Glamping</title>
        <meta name="description" content={travelerType.description} />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={travelerType.image}
            alt={travelerType.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
                {travelerType.name}
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                {travelerType.description}
              </p>
            </div>
          </div>
          
          {/* Back Button */}
          <Button
            variant="outline"
            className="absolute top-6 left-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            onClick={handleBackClick}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Image */}
            <div className="relative">
              <img 
                src={travelerType.secondaryImage || travelerType.image}
                alt={`Experiencia ${travelerType.name}`}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {travelerType.title}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {travelerType.detailedDescription}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Lo que incluye tu experiencia
                </h3>
                <div className="space-y-4">
                  {travelerType.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-primary mt-3 mr-4 flex-shrink-0" />
                      <p className="text-gray-600">{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 bg-gray-50 rounded-xl p-6">
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-gray-900">Hasta 4 personas</div>
                  <div className="text-sm text-gray-600">Por domo</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-gray-900">2-3 noches</div>
                  <div className="text-sm text-gray-600">Recomendado</div>
                </div>
                <div className="text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-gray-900">4.9/5</div>
                  <div className="text-sm text-gray-600">Calificación</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  variant="highlight"
                  className="flex-1"
                  onClick={handleReserveClick}
                >
                  Reservar Experiencia
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/")}
                >
                  Ver Otros Paquetes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TravelerType;