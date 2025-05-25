import React from 'react';
import { ReservationDemo } from '@/components/ReservationDemo';
import { Helmet } from 'react-helmet-async';

export const ReservationTest = () => {
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Demo Sistema de Reservas - Domos Treepod</title>
        <meta name="description" content="Demo del sistema de reservas de Domos Treepod" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Demo del Sistema de Reservas
        </h1>
        
        <div className="prose prose-lg mx-auto mb-8">
          <p>
            Esta es una demostración del nuevo sistema de reservas que incluye:
          </p>
          <ul>
            <li>Verificación de disponibilidad en tiempo real</li>
            <li>Bloqueo temporal de fechas</li>
            <li>Sistema de cola para reservas simultáneas</li>
            <li>Transacciones atómicas</li>
            <li>Validación de fechas y capacidad</li>
          </ul>
        </div>

        <ReservationDemo />
      </div>
    </div>
  );
}; 