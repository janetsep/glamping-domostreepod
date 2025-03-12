import { useState, useEffect } from "react";
interface CountdownTimerProps {
  initialTimeLeft: {
    days: number;
    hours: number;
    minutes: number;
  };
}
const CountdownTimer = ({
  initialTimeLeft
}: CountdownTimerProps) => {
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
  return;
};
export default CountdownTimer;