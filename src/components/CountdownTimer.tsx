import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeCardProps {
  value: number;
  label: string;
  maxUnit: number;
}

const CoolTimeCard: React.FC<TimeCardProps> = ({ value, label, maxUnit }) => {
  const progress = Math.min(1, Math.max(0, value / maxUnit));
  const strokeDashoffset = 260 - 260 * progress;

  return (
    <div className="flex flex-col items-center group">
      {/* 3D Glowing Neon Glass Card */}
      <div className="relative w-20 h-26 sm:w-28 sm:h-34 rounded-3xl bg-slate-950/80 backdrop-blur-xl border border-pink-500/30 shadow-[0_0_25px_rgba(236,72,153,0.25),inset_0_0_15px_rgba(168,85,247,0.2)] flex flex-col items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-pink-400/60 group-hover:shadow-[0_0_35px_rgba(236,72,153,0.45)]">
        {/* Animated Radial Ambient Glow in background */}
        <div className="absolute inset-0 bg-radial from-pink-500/20 via-purple-600/10 to-transparent pointer-events-none" />

        {/* Circular Progress Arc Frame */}
        <svg className="absolute inset-0 w-full h-full p-1 -rotate-90 pointer-events-none">
          <circle
            cx="50%"
            cy="50%"
            r="42%"
            fill="none"
            stroke="rgba(168, 85, 247, 0.15)"
            strokeWidth="2"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="42%"
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="2.5"
            strokeDasharray="260"
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Top Metallic Bevel Highlight */}
        <div className="absolute inset-x-3 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-70" />

        {/* Center Split Horizontal Crease */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

        {/* 3D Digit Flip Motion with Neon Text Glow */}
        <div className="relative z-20 overflow-hidden py-1">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              initial={{ y: 18, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -18, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="block text-3xl sm:text-5xl font-black font-sans tracking-tight text-white drop-shadow-[0_0_12px_rgba(244,63,94,0.7)] tabular-nums will-change-transform transform-gpu"
            >
              {value.toString().padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Subtle Bottom Light Accent */}
        <div className="absolute bottom-1 inset-x-6 h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
      </div>

      {/* Modern Neon Subtitle Label */}
      <span className="mt-3 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-pink-300/80 drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]">
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
    isCompleted?: boolean;
  };
  onProceed?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeLeft, onProceed }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center gap-2 sm:gap-4 my-6 select-none">
        <CoolTimeCard value={timeLeft.days} label="Days" maxUnit={365} />

        {/* Pulsing Neon Colons */}
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col gap-2 -mt-7 sm:-mt-9 text-pink-400 font-bold text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]"
        >
          <span>•</span>
          <span>•</span>
        </motion.div>

        <CoolTimeCard value={timeLeft.hours} label="Hours" maxUnit={24} />

        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          className="flex flex-col gap-2 -mt-7 sm:-mt-9 text-pink-400 font-bold text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]"
        >
          <span>•</span>
          <span>•</span>
        </motion.div>

        <CoolTimeCard value={timeLeft.minutes} label="Mins" maxUnit={60} />

        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          className="flex flex-col gap-2 -mt-7 sm:-mt-9 text-pink-400 font-bold text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]"
        >
          <span>•</span>
          <span>•</span>
        </motion.div>

        <CoolTimeCard value={timeLeft.seconds} label="Secs" maxUnit={60} />
      </div>

      {timeLeft.isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-4 flex flex-col items-center"
        >
          <div className="px-5 py-2.5 bg-pink-500/20 backdrop-blur-md border border-pink-400/40 rounded-full text-pink-200 text-sm font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-pulse">
            <span className="text-base">🎉</span>
            <span>The countdown is complete! Entering cake celebration...</span>
          </div>

          {onProceed && (
            <button
              onClick={onProceed}
              className="mt-3 text-xs text-pink-300 hover:text-white underline font-semibold transition-colors cursor-pointer"
            >
              Click here if not redirected automatically
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
};
