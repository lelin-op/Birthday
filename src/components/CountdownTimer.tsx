import React from 'react';
import { motion } from 'framer-motion';

interface TimeCardProps {
  value: number;
  label: string;
}

const TimeCard: React.FC<TimeCardProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-20 md:w-24 md:h-28 glass-card rounded-2xl flex items-center justify-center shadow-lg mb-2 relative overflow-hidden">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-5xl font-bold text-blush-500"
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
        <div className="absolute inset-x-0 top-1/2 border-b border-pink-100/30 w-full" />
      </div>
      <span className="text-xs md:text-sm font-semibold text-lavender-400 uppercase tracking-widest">{label}</span>
    </div>
  );
};

interface CountdownTimerProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeLeft }) => {
  return (
    <div className="flex gap-3 md:gap-6">
      <TimeCard value={timeLeft.days} label="Days" />
      <TimeCard value={timeLeft.hours} label="Hours" />
      <TimeCard value={timeLeft.minutes} label="Mins" />
      <TimeCard value={timeLeft.seconds} label="Secs" />
    </div>
  );
};
