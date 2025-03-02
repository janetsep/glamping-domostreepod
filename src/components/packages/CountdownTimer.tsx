
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  initialTimeLeft: {
    days: number;
    hours: number;
    minutes: number;
  };
}

const CountdownTimer = ({ initialTimeLeft }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(current => {
        if (current.minutes > 0) {
          return { ...current, minutes: current.minutes - 1 };
        } else if (current.hours > 0) {
          return { ...current, hours: current.hours - 1, minutes: 59 };
        } else if (current.days > 0) {
          return { ...current, days: current.days - 1, hours: 23, minutes: 59 };
        }
        return current;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-10 max-w-2xl mx-auto">
      <div className="text-center mb-2">
        <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded-full uppercase font-semibold mb-2">Oferta por tiempo limitado</span>
        <h3 className="text-lg font-semibold">¡Descuento de temporada baja termina en:</h3>
      </div>
      <div className="flex justify-center space-x-4 text-center">
        <div className="bg-gray-100 p-2 rounded-lg">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs text-gray-500">Días</div>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs text-gray-500">Horas</div>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs text-gray-500">Minutos</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
