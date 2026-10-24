import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BirthdayCakeProps {
  isBlown: boolean;
  onBlow: () => void;
  permissionError?: boolean;
  soundEnabled?: boolean;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  isBlown,
  onBlow,
  permissionError = false,
}) => {
  const [blownCandles, setBlownCandles] = useState<boolean[]>([false, false, false]);
  const [imageError, setImageError] = useState(false);

  const allCandlesExtinguished = isBlown || blownCandles.every(Boolean);

  const handleCandleClick = (index: number) => {
    const updated = [...blownCandles];
    updated[index] = !updated[index];
    setBlownCandles(updated);

    if (updated.every(Boolean) && !isBlown) {
      onBlow();
    }
  };

  const handleBlowAll = () => {
    setBlownCandles([true, true, true]);
    onBlow();
  };

  // Candle flame coordinates matching the realistic cake photograph candles
  const candles = [
    { id: 0, leftPercent: '43.2%', topPercent: '13.2%', delay: 0 },
    { id: 1, leftPercent: '50.3%', topPercent: '11.8%', delay: 0.2 },
    { id: 2, leftPercent: '57.4%', topPercent: '13.2%', delay: 0.1 },
  ];

  return (
    <div className="relative flex flex-col items-center select-none py-2 px-2 max-w-xl mx-auto">
      {/* Ambient Warm Golden Aura around cake top */}
      {!allCandlesExtinguished && (
        <motion.div
          animate={{
            scale: [1, 1.08, 0.98, 1.05, 1],
            opacity: [0.35, 0.55, 0.4, 0.5, 0.35],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-4 w-72 h-44 rounded-full pointer-events-none blur-3xl bg-radial from-amber-300/60 via-orange-300/30 to-transparent z-10"
        />
      )}

      {/* Realistic Gourmet Patisserie Cake Display */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-80 sm:w-96 aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white/50 backdrop-blur-xs group"
      >
        {!imageError ? (
          <img
            src="/src/assets/images/gourmet_birthday_cake_1792835376065.jpg"
            alt="Artisanal luxury birthday cake with glowing candles"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          /* High-fidelity Fallback */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-rose-100 to-amber-50 p-6 text-center">
            <span className="text-7xl mb-2">🎂</span>
            <span className="text-lg font-script text-rose-600 font-bold">Happy Birthday!</span>
          </div>
        )}

        {/* Soft vignette scrim for maximum realism */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* INTERACTIVE CANDLE FLAMES & SMOKE OVERLAYS */}
        {candles.map((c, i) => {
          const isExtinguished = isBlown || blownCandles[i];

          return (
            <div
              key={c.id}
              onClick={() => handleCandleClick(i)}
              style={{ left: c.leftPercent, top: c.topPercent }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-10 h-14 cursor-pointer z-30 flex items-center justify-center group/candle"
              title={isExtinguished ? 'Click to relight candle' : 'Click to blow out this candle'}
            >
              <AnimatePresence mode="wait">
                {!isExtinguished ? (
                  <motion.div
                    key="flame"
                    initial={{ scale: 0 }}
                    animate={{
                      scale: [1, 1.18, 0.96, 1.1, 1],
                      rotate: [-2, 3, -1, 2, -2],
                      y: [0, -1, 0.5, -1, 0],
                    }}
                    exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      delay: c.delay,
                      ease: 'easeInOut',
                    }}
                    className="relative w-5 h-8 flex flex-col items-center origin-bottom"
                  >
                    {/* Outer Ambient Flame Glow */}
                    <div className="absolute inset-0 rounded-full blur-[4px] bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 opacity-90 scale-150 pointer-events-none" />

                    {/* Mid Teardrop Flame Body */}
                    <div className="relative w-4 h-7 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_15px_rgba(251,191,36,1)] flex items-center justify-center">
                      {/* Bright White Incandescent Core */}
                      <div className="w-2 h-4 rounded-full bg-white opacity-95 blur-[0.4px] -mb-1" />
                      {/* Blue base of candle fire */}
                      <div className="absolute bottom-0 w-2.5 h-1.5 rounded-b-full bg-cyan-400/90 blur-[0.5px]" />
                    </div>

                    {/* Ascending fire sparkle */}
                    <motion.div
                      animate={{
                        y: [-2, -20],
                        opacity: [1, 0],
                        scale: [1, 0.2],
                      }}
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        delay: c.delay,
                        ease: 'easeOut',
                      }}
                      className="absolute top-0 w-1 h-1 bg-yellow-100 rounded-full blur-[0.2px]"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="smoke"
                    initial={{ opacity: 0, scale: 0.5, y: 0 }}
                    animate={{
                      opacity: [0.9, 0.5, 0],
                      scale: [0.8, 2.2, 3],
                      y: [0, -30, -55],
                      x: [0, i === 0 ? -6 : i === 2 ? 6 : 2, i === 0 ? -12 : i === 2 ? 12 : 4],
                    }}
                    transition={{ duration: 1.6, ease: 'easeOut' }}
                    className="absolute pointer-events-none flex flex-col items-center"
                  >
                    {/* Glowing ember on wick */}
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500/80 blur-[0.8px] animate-pulse" />
                    {/* Ethereal smoke puff */}
                    <div className="w-4 h-6 rounded-full bg-slate-300/40 blur-[2.5px] -mt-2" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      {/* Interactive Controls & Status Feedback */}
      <div className="mt-5 flex flex-col items-center gap-3 z-30">
        <div className="text-center">
          <p className="text-base sm:text-lg font-medium text-slate-800 tracking-tight">
            {!allCandlesExtinguished ? (
              <span>
                {permissionError
                  ? '✨ Tap the glowing candles or cake to blow them out!'
                  : '🌬️ Blow into your microphone or tap candles to make a wish!'}
              </span>
            ) : (
              <span className="text-rose-600 font-script text-2xl sm:text-3xl font-bold drop-shadow-xs">
                Your birthday wish is set in the stars! ✨
              </span>
            )}
          </p>
          {!allCandlesExtinguished && (
            <div className="mt-1 flex items-center justify-center gap-2 text-xs text-slate-500">
              <span>{blownCandles.filter((b) => !b).length} of 3 candles glowing</span>
              <span aria-hidden="true">·</span>
              <span>Tap each candle or blow all at once</span>
            </div>
          )}
        </div>

        {/* Primary Make a Wish CTA */}
        {!allCandlesExtinguished ? (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleBlowAll}
            className="px-7 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-xl shadow-pink-500/25 transition-all text-sm sm:text-base flex items-center gap-2.5 cursor-pointer border border-white/40"
          >
            <span>🎂</span>
            <span>Make a Wish & Blow All Candles</span>
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setBlownCandles([false, false, false])}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white/90 hover:bg-white rounded-xl border border-slate-200 shadow-xs transition-colors cursor-pointer"
          >
            Relight All Candles
          </motion.button>
        )}
      </div>
    </div>
  );
};
