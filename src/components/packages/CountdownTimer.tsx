import { useState, useEffect } from 'react';

export interface CountdownTimerProps {
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
          return {
            ...current,
            minutes: current.minutes - 1
          };
        } else if (current.hours > 0) {
          return {
            ...current,
            hours: current.hours - 1,
            minutes: 59
          };
        } else if (current.days > 0) {
          return {
            ...current,
            days: current.days - 1,
            hours: 23,
            minutes: 59
          };
        }
        return current;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full mt-8 mb-6 bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
      <div className="flex flex-col items-center">
        <p className="text-cyan-700 dark:text-cyan-400 mb-3 text-lg font-medium">¡Oferta por tiempo limitado!</p>
        <div className="flex space-x-4 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-cyan-600 dark:text-cyan-400">{timeLeft.days}</span>
            <span className="text-xs uppercase mt-1 text-cyan-700 dark:text-cyan-500">Días</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-cyan-600 dark:text-cyan-400">{timeLeft.hours}</span>
            <span className="text-xs uppercase mt-1 text-cyan-700 dark:text-cyan-500">Horas</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-bold text-cyan-600 dark:text-cyan-400">{timeLeft.minutes}</span>
            <span className="text-xs uppercase mt-1 text-cyan-700 dark:text-cyan-500">Minutos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
