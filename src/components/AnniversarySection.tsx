
import { Section } from "@/components/ui/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { anniversaryDetailContent } from "@/data/content/celebrations";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AnniversarySection = () => {
  const navigate = useNavigate();

  const handleBackToCelebrations = () => {
    navigate('/#celebrations');
    setTimeout(() => {
      const celebrationsElement = document.getElementById('celebrations');
      if (celebrationsElement) {
        celebrationsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <Section
      title={anniversaryDetailContent.title}
      subtitle={anniversaryDetailContent.subtitle}
      centered
      className="pt-8 pb-12"
    >
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="que-incluye" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-r from-primary to-pink-500 p-1">
            {anniversaryDetailContent.tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="text-white data-[state=active]:bg-white data-[state=active]:text-primary font-medium"
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {anniversaryDetailContent.tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl md:text-3xl font-display text-primary mb-2">
                    {tab.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="order-2 lg:order-1">
                      <CardDescription className="text-base md:text-lg text-gray-700 leading-relaxed">
                        {Array.isArray(tab.content) ? (
                          <div className="space-y-2">
                            {tab.content.map((item, index) => {
                              if (item === "") return <div key={index} className="mb-3" />;
                              if (item.startsWith("###")) return <h4 key={index} className="font-semibold text-lg text-primary mt-4 mb-2">{item.replace("### ", "")}</h4>;
                              if (item.startsWith("**") && item.endsWith("**")) return <p key={index} className="font-semibold mb-1">{item.slice(2, -2)}</p>;
                              if (item.startsWith("•")) return <p key={index} className="ml-4 mb-1">{item}</p>;
                              return <p key={index} className="mb-1">{item}</p>;
                            })}
                          </div>
                        ) : (
                          tab.content
                        )}
                      </CardDescription>
                      
                      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button className="bg-gradient-to-r from-primary to-pink-500 text-white hover:from-primary/90 hover:to-pink-500/90">
                          Reservar Aniversario
                        </Button>
                      </div>
                    </div>
                    
                    <div className="order-1 lg:order-2 relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-md">
                      <LazyLoadImage
                        src={tab.image}
                        alt={tab.title}
                        effect="opacity"
                        threshold={200}
                        className="w-full h-full object-cover"
                        placeholder={<Skeleton className="w-full h-full" />}
                        wrapperClassName="w-full h-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleBackToCelebrations}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Celebraciones
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Section>
  );
};

export default AnniversarySection;
