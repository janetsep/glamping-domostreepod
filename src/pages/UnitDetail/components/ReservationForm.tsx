
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateSelector } from '@/components/unit-detail/DateSelector';
import { GuestSelector } from '@/components/unit-detail/GuestSelector';
import { Activity, ThemedPackage } from '@/types';
import { ReservationTabs } from '../ReservationTabs';
import { AlternativeDates } from '@/components/unit-detail/AlternativeDates';

interface ReservationFormProps {
  unitId: string;
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  guests: number;
  setGuests: (guests: number) => void;
  requiredDomos?: number;
  setRequiredDomos?: (domos: number) => void;
  isAvailable: boolean | null;
  onReservation: () => void;
  selectedActivities: Activity[];
  selectedPackages: ThemedPackage[];
  onActivityToggle: (activity: Activity) => void;
  onPackageToggle: (pkg: ThemedPackage) => void;
  activitiesTotal: number;
  packagesTotal: number;
  reservationTab: string;
  setReservationTab: (tab: string) => void;
  isPartialAvailability?: boolean;
  availableDomos?: number;
  alternativeDates?: {startDate: Date, endDate: Date}[];
  handleCalendarDateSelect?: (date: Date) => void;
  handleAlternativeDateSelect?: (start: Date, end: Date) => void;
}

export const ReservationForm = ({
  unitId,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  guests,
  setGuests,
  requiredDomos = 1,
  setRequiredDomos = () => {},
  isAvailable,
  onReservation,
  selectedActivities,
  selectedPackages,
  onActivityToggle,
  onPackageToggle,
  activitiesTotal,
  packagesTotal,
  reservationTab,
  setReservationTab,
  isPartialAvailability = false,
  availableDomos = 0,
  alternativeDates = [],
  handleCalendarDateSelect,
  handleAlternativeDateSelect
}: ReservationFormProps) => {
  // Arrays con las actividades y paquetes (esto eventualmente vendrá de una API)
  // Simulación de datos para actividades
  const activities: Activity[] = [
    { 
      id: '1', 
      name: 'Trekking guiado', 
      description: 'Recorrido de 4 horas por senderos naturales', 
      price: 25000,
      image_url: '/placeholder.svg'
    },
    { 
      id: '2', 
      name: 'Tour astronómico', 
      description: 'Observación de estrellas con guía especializado', 
      price: 35000,
      image_url: '/placeholder.svg'
    },
    { 
      id: '3', 
      name: 'Clase de yoga', 
      description: 'Sesión de 90 minutos en medio del bosque', 
      price: 18000,
      image_url: '/placeholder.svg'
    },
    { 
      id: '4', 
      name: 'Pase a termas', 
      description: 'Entrada a termas naturales cercanas', 
      price: 30000,
      image_url: '/placeholder.svg'
    }
  ];

  // Simulación de datos para paquetes temáticos
  const packages: ThemedPackage[] = [
    { 
      id: '1', 
      title: 'Romántico', 
      description: 'Champagne, pétalos de rosa y cena especial', 
      price: 50000, 
      image: '/placeholder.svg',
      detailedDescription: 'Un paquete especial para parejas'
    },
    { 
      id: '2', 
      title: 'Aventura', 
      description: 'Equipamiento para trekking y pack de supervivencia', 
      price: 40000,
      image: '/placeholder.svg',
      detailedDescription: 'Para los amantes de la aventura'
    },
    { 
      id: '3', 
      title: 'Relax Total', 
      description: 'Sales de baño, aromaterapia y masajes', 
      price: 60000,
      image: '/placeholder.svg',
      detailedDescription: 'Disfruta de una experiencia de relajación completa'
    }
  ];

  // Modal state for calendar
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  return (
    <ReservationTabs
      tab={reservationTab}
      onTabChange={setReservationTab}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      maxGuests={16} // Maximum capacity
      guests={guests}
      onGuestsChange={setGuests}
      maxDomos={4} // Máximo 4 domos disponibles
      requiredDomos={requiredDomos}
      onDomosChange={setRequiredDomos}
      isAvailable={isAvailable}
      selectedActivities={selectedActivities}
      onActivityToggle={onActivityToggle}
      activitiesTotal={activitiesTotal}
      selectedPackages={selectedPackages}
      onPackageToggle={onPackageToggle}
      packagesTotal={packagesTotal}
      unitId={unitId}
      activities={activities}
    />
  );
};
