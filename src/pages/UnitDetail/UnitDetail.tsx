
// src/pages/UnitDetail/UnitDetail.tsx
import React from 'react';
import { useUnitDetailController } from './hooks/useUnitDetailController';
import { GuestSelector } from '../../components/unit-detail/GuestSelector';

export const UnitDetail: React.FC = () => {
  const {
    checkInDate,
    checkOutDate,
    guests,
    requiredDomos,
    availableDomos,
    isLoading,
    setCheckInDate,
    setCheckOutDate,
    handleGuestsChange,
    handleReservation
  } = useUnitDetailController();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Detalle de la Unidad</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información de la unidad */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Información del Domo</h2>
          <p>Capacidad máxima: 4 huéspedes por domo</p>
          <p>Domos disponibles: {availableDomos}</p>
        </div>
        
        {/* Formulario de reserva */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Hacer Reserva</h2>
          
          {/* Selector de fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de entrada
              </label>
              <input
                type="date"
                value={checkInDate ? checkInDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setCheckInDate(e.target.value ? new Date(e.target.value) : null)}
                className="w-full p-2 border border-gray-300 rounded-md"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de salida
              </label>
              <input
                type="date"
                value={checkOutDate ? checkOutDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setCheckOutDate(e.target.value ? new Date(e.target.value) : null)}
                className="w-full p-2 border border-gray-300 rounded-md"
                min={checkInDate ? new Date(checkInDate.getTime() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          {/* Selector de huéspedes - COMPONENTE CLAVE */}
          <GuestSelector
            value={guests}
            onChange={handleGuestsChange}
            maxGuests={16}
            availableDomos={availableDomos}
            label="Número de huéspedes"
            required
          />
          
          {/* Información adicional */}
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Resumen:</strong> {guests} huéspedes requieren {requiredDomos} {requiredDomos === 1 ? 'domo' : 'domos'}
            </p>
          </div>
          
          {/* Botón de reserva */}
          <button
            onClick={handleReservation}
            disabled={isLoading || !checkInDate || !checkOutDate || guests < 1}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Procesando...' : 'Verificar Disponibilidad'}
          </button>
        </div>
      </div>
      
      {/* Debugging info (remover en producción) */}
      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <pre className="text-xs">
          {JSON.stringify({
            guests,
            requiredDomos,
            availableDomos,
            checkInDate: checkInDate?.toISOString(),
            checkOutDate: checkOutDate?.toISOString()
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default UnitDetail;
