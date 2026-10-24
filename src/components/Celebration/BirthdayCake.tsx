import React from 'react';
import { motion } from 'framer-motion';

interface BirthdayCakeProps {
  isBlown: boolean;
  onBlow: () => void;
  permissionError?: boolean;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ isBlown, onBlow, permissionError }) => {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-64 h-64 cursor-pointer" onClick={() => !isBlown && onBlow()}>
        {/* Pedestal */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-4 bg-warmGold-300 rounded-full shadow-md" />

        {/* Bottom Tier */}
        <motion.div
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="absolute bottom-4 left-1/2 -translate-x-1/2 w-56 h-24 bg-lavender-200 rounded-t-lg shadow-inner border-b-4 border-lavender-300"
        />

        {/* Top Tier */}
        <motion.div
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="absolute bottom-28 left-1/2 -translate-x-1/2 w-40 h-20 bg-blush-200 rounded-t-lg shadow-inner border-b-4 border-blush-300"
        />

        {/* Candles */}
        {[ -30, 0, 30 ].map((offset, i) => (
          <div key={i} className="absolute bottom-48 left-1/2" style={{ transform: `translateX(calc(-50% + ${offset}px))` }}>
             <div className="w-3 h-10 bg-warmGold-100 rounded-t-sm border-x border-warmGold-300" />
             {!isBlown && (
               <motion.div
                 animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                 transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                 className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-6 bg-orange-400 rounded-full blur-[2px]"
               >
                 <div className="absolute inset-0 bg-yellow-200 rounded-full scale-50" />
               </motion.div>
             )}
             {isBlown && (
               <motion.div
                 initial={{ opacity: 1, y: 0 }}
                 animate={{ opacity: 0, y: -20 }}
                 className="absolute -top-4 left-1/2 -translate-x-1/2 text-gray-400 font-bold"
               >
                 ~
               </motion.div>
             )}
          </div>
        ))}
      </div>

      {!isBlown && (
        <div className="flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-base md:text-lg font-medium text-lavender-500 animate-pulse text-center"
          >
            {permissionError ? '✨ Tap the cake to make a wish!' : '🌬️ Blow into the microphone or tap the cake!'}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onBlow}
            className="mt-4 px-6 py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-medium rounded-full shadow-md transition-all transform hover:scale-105 active:scale-95 text-sm flex items-center gap-2 cursor-pointer"
          >
            <span>🎂</span>
            <span>Make a Wish & Blow Candles</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};
