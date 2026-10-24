import React from 'react';
import { motion } from 'framer-motion';

interface TimeCardProps {
  value: number;
  label: string;
}

const TimeCard: React.FC<TimeCardProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center">
      {/* 3D Glass & Gold Plated Time Unit Card */}
      <div className="w-18 h-22 sm:w-24 sm:h-28 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 shadow-[0_10px_25px_-5px_rgba(244,63,94,0.15),0_8px_10px_-6px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center relative overflow-hidden group hover:scale-105 transition-transform duration-200">
        {/* Soft Golden Top Glint */}
        <div className="absolute inset-x-2 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-80" />

        {/* Center Split Flap Horizon Line */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-rose-300/40 to-transparent" />

        {/* Numeric Counter with Motion Transition */}
        <motion.span
          key={value}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-3xl sm:text-5xl font-bold font-sans tracking-tight text-slate-800 tabular-nums drop-shadow-xs"
        >
          {value.toString().padStart(2, '0')}
        </motion.span>
      </div>

      {/* Clean Metadata Label */}
      <span className="mt-2.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </span>
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
    <div className="flex items-center justify-center gap-3 sm:gap-5 my-4">
      <TimeCard value={timeLeft.days} label="Days" />
      <span className="text-2xl font-bold text-rose-300 -mt-6 select-none sm:text-3xl">:</span>
      <TimeCard value={timeLeft.hours} label="Hours" />
      <span className="text-2xl font-bold text-rose-300 -mt-6 select-none sm:text-3xl">:</span>
      <TimeCard value={timeLeft.minutes} label="Mins" />
      <span className="text-2xl font-bold text-rose-300 -mt-6 select-none sm:text-3xl">:</span>
      <TimeCard value={timeLeft.seconds} label="Secs" />
    </div>
  );
};
