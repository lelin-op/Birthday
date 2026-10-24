import React from 'react';
import { motion } from 'framer-motion';

export const FairyLights: React.FC = () => {
  const bulbs = Array.from({ length: 14 });
  const colors = ['#f43f5e', '#a855f7', '#ec4899', '#c084fc', '#fbbf24', '#e879f9', '#38bdf8'];

  return (
    <div className="absolute top-0 left-0 w-full h-16 pointer-events-none z-10 overflow-hidden">
      <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none">
        <path
          d="M0,10 Q50,40 100,10 T200,10 T300,10 T400,10 T500,10 T600,10 T700,10 T800,10 T900,10 T1000,10 T1100,10 T1200,10"
          fill="none"
          stroke="rgba(244, 114, 182, 0.4)"
          strokeWidth="1.2"
        />
        {bulbs.map((_, i) => (
          <motion.circle
            key={i}
            cx={50 + i * 100}
            cy={25}
            r="6"
            fill={colors[i % colors.length]}
            animate={{
              opacity: [0.4, 1, 0.4],
              filter: [
                `drop-shadow(0 0 2px ${colors[i % colors.length]})`,
                `drop-shadow(0 0 8px ${colors[i % colors.length]})`,
                `drop-shadow(0 0 2px ${colors[i % colors.length]})`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </svg>
    </div>
  );
};

export const CuteCat: React.FC<{ className?: string; pose?: 'sitting' | 'sleeping' }> = ({ className, pose = 'sitting' }) => {
  return (
    <motion.div
      className={className}
      animate={pose === 'sitting' ? { scale: [1, 1.02, 1] } : { opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="120" height="120" viewBox="0 0 200 200">
        {/* Simple Vector Cat implementation */}
        <circle cx="100" cy="110" r="50" fill="#f3f4f6" /> {/* Body */}
        <circle cx="100" cy="70" r="40" fill="#f3f4f6" />  {/* Head */}
        <path d="M70,40 L90,60 L60,70 Z" fill="#f3f4f6" />   {/* Left Ear */}
        <path d="M130,40 L110,60 L140,70 Z" fill="#f3f4f6" /> {/* Right Ear */}
        <circle cx="85" cy="70" r="4" fill="#334155" />     {/* Left Eye */}
        <circle cx="115" cy="70" r="4" fill="#334155" />    {/* Right Eye */}
        <path d="M95,85 Q100,95 105,85" fill="none" stroke="#f87171" strokeWidth="2" /> {/* Mouth */}
        <motion.path
           d="M150,110 Q180,100 170,140"
           fill="none"
           stroke="#f3f4f6"
           strokeWidth="8"
           strokeLinecap="round"
           animate={{ rotate: [-5, 5, -5] }}
           transition={{ duration: 2, repeat: Infinity }}
        /> {/* Tail */}
        {/* Flower Crown */}
        <circle cx="80" cy="45" r="5" fill="#fca5a5" />
        <circle cx="100" cy="40" r="5" fill="#c4b5fd" />
        <circle cx="120" cy="45" r="5" fill="#fde68a" />
      </svg>
    </motion.div>
  );
};

export const Butterfly: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const initialY = (delay * 97 + 130) % 350 + 50;
  const y1 = (delay * 131 + 210) % 400 + 50;
  const y2 = (delay * 73 + 80) % 400 + 50;
  const y3 = (delay * 179 + 320) % 400 + 50;

  return (
    <motion.div
      initial={{ x: -100, y: initialY, opacity: 0 }}
      animate={{
        x: [null, 400, 800, 1300],
        y: [null, y1, y2, y3],
        opacity: [0, 1, 1, 0]
      }}
      transition={{ duration: 15, repeat: Infinity, delay, ease: "linear" }}
      className="absolute z-0 pointer-events-none"
    >
      <motion.svg
        width="40" height="40" viewBox="0 0 100 100"
        animate={{ rotate: [-20, 20, -20] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.path
          d="M50,50 Q20,10 10,50 Q20,90 50,50 Q80,10 90,50 Q80,90 50,50"
          fill="#f472b6"
          animate={{ scaleX: [1, 0.3, 1] }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
      </motion.svg>
    </motion.div>
  );
};
