import { useState } from 'react';

interface useTimerProps {
  duration: number;
}

const useTimer = ({ duration }: useTimerProps) => {
  const now = new Date();
  const [date, setDate] = useState(now.setSeconds((now.getSeconds() + duration)));
  const intervalTimer = setInterval(() => {

  }, 1000);
};

export default useTimer;
