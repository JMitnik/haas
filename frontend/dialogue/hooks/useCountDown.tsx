import { useState, useRef, useEffect, useCallback } from 'react';
export function useCountDown(miliseconds = 5000) {
  const [timeLeft, setTimeLeft] = useState(miliseconds);
  const intervalRef = useRef<NodeJS.Timer>(); // Add a ref to store the interval id

  const resetTimer = useCallback(() => {
    setTimeLeft(miliseconds);
  }, [setTimeLeft, miliseconds]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = () => {
    resetTimer();

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => t - 100);
    }, 100);
  }

  useEffect(() => {
    if (timeLeft <= 0) {
      stop();
    }
  }, [timeLeft, stop]);

  return {
    timeLeft,
    start,
    stop,
  };
}
