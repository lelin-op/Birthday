import { useState, useEffect, useCallback } from 'react';

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

export const getCountdownTime = (targetDateISO: string): CountdownTime => {
  const target = new Date(targetDateISO).getTime();
  const now = Date.now();
  const difference = target - now;

  if (isNaN(target) || difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isCompleted: false,
  };
};

export const useCountdown = (targetDateISO: string): CountdownTime => {
  const calculate = useCallback(() => getCountdownTime(targetDateISO), [targetDateISO]);
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(() => calculate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculate());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculate]);

  return timeLeft;
};
