
import { Section } from "@/components/ui/Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { birthdayDetailContent } from "@/data/content/celebrations";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Skeleton } from "@/components/ui/skeleton";

const BirthdaySection = () => {
  return (
    <Section
      title={birthdayDetailContent.title}
      subtitle={birthdayDetailContent.subtitle}
      centered
      className="pt-8 pb-12"
    >
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="que-incluye" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8">
            {birthdayDetailContent.tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs md:text-sm">
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {birthdayDetailContent.tabs.map((tab) => (
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
                        {tab.content}
                      </CardDescription>
                      
                      <div className="mt-6 flex justify-center lg:justify-start">
                        <Button className="bg-gradient-to-r from-primary to-pink-500 text-white hover:from-primary/90 hover:to-pink-500/90">
                          Reservar Cumpleaños
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
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Section>
  );
};

export default BirthdaySection;
