
import React from 'react';
import { useUnitDetailController } from './hooks/useUnitDetailController';
// Corregir la importación usando rutas relativas en lugar de alias
import { GuestSelector } from '../../components/unit-detail/GuestSelector';
import { DateSelector } from '../../components/unit-detail/DateSelector';
import { Button } from '../../components/ui/button';
import { CalendarIcon } from 'lucide-react';

export const UnitDetail: React.FC = () => {
  const {
    checkInDate,
    checkOutDate,
    guests,
    handleGuestsChange,
    requiredDomos,
    availableDomos,
    isLoading,
    setCheckInDate: handleCheckInChange,
    setCheckOutDate: handleCheckOutChange,
    handleReservation
  } = useUnitDetailController();

  // 🐛 DEBUG: Log del estado en cada render
  console.log('🔍 UnitDetail render con:', {
    guests,
    handleGuestsChange: typeof handleGuestsChange,
    availableDomos
  });

  // 🐛 DEBUG: Función wrapper para debugging
  const debugHandleGuestsChange = (newGuests: number) => {
    console.log('🔍 UnitDetail: debugHandleGuestsChange llamado con:', newGuests);
    handleGuestsChange(newGuests);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Detalle de la Unidad</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Información del Domo</h2>
          <p>Capacidad máxima: 4 huéspedes por domo</p>
          <p>Domos disponibles: {availableDomos}</p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Hacer Reserva</h2>
          
          {/* Selector de fechas */}
          {checkInDate && checkOutDate ? (
            <div className="flex gap-2 items-center mb-4">
              <span className="text-sm">{checkInDate.toLocaleDateString()} - {checkOutDate.toLocaleDateString()}</span>
              <Button variant="outline" size="sm" onClick={() => {handleCheckInChange(null); handleCheckOutChange(null);}}>
                Cambiar fechas
              </Button>
            </div>
          ) : (
            <DateSelector 
              startDate={checkInDate || undefined}
              endDate={checkOutDate || undefined}
              onStartDateChange={(date) => handleCheckInChange(date || null)}
              onEndDateChange={(date) => handleCheckOutChange(date || null)}
              unitId="domos"
              requiredDomos={requiredDomos}
            />
          )}
          
          <GuestSelector
            value={guests}
            onChange={debugHandleGuestsChange}
            maxGuests={16}
            availableDomos={availableDomos}
            label="Número de huéspedes"
            required
          />
          
          <Button 
            onClick={handleReservation}
            disabled={!checkInDate || !checkOutDate || guests === 0 || isLoading}
            className="w-full mt-4"
          >
            {isLoading ? 'Procesando...' : 'Reservar ahora'}
          </Button>
          
          {/* 🐛 DEBUG: Mostrar valores en tiempo real */}
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
            <h4 className="font-bold">🐛 DEBUG INFO (remover en producción):</h4>
            <p>Guests actual: {guests}</p>
            <p>Tipo de handleGuestsChange: {typeof handleGuestsChange}</p>
            <p>Available Domos: {availableDomos}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
