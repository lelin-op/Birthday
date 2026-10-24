import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '../../utils/soundEffects';

interface BirthdayCakeProps {
  isBlown: boolean;
  onBlow: () => void;
  permissionError?: boolean;
  soundEnabled?: boolean;
  recipientName?: string;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  isBlown,
  onBlow,
  permissionError = false,
  recipientName = 'My Love',
}) => {
  const [blownCandles, setBlownCandles] = useState<boolean[]>([false, false, false]);

  const allCandlesExtinguished = isBlown || blownCandles.every(Boolean);

  const handleCandleClick = (index: number) => {
    sounds.playBlowing();
    const updated = [...blownCandles];
    updated[index] = !updated[index];
    setBlownCandles(updated);

    if (updated.every(Boolean) && !isBlown) {
      onBlow();
    }
  };

  const handleBlowAll = () => {
    sounds.playBlowing();
    setBlownCandles([true, true, true]);
    onBlow();
  };

  // Candle coordinates on top deck of the pink butterfly cake
  const candleData = [
    { id: 0, x: 135, y: 85, delay: 0 },
    { id: 1, x: 180, y: 75, delay: 0.15 },
    { id: 2, x: 225, y: 85, delay: 0.3 },
  ];

  return (
    <div className="relative flex flex-col items-center select-none py-2 px-4 max-w-lg mx-auto">
      {/* Ambient Candlelight Warm Halo */}
      {!allCandlesExtinguished && (
        <motion.div
          animate={{
            scale: [1, 1.12, 0.98, 1.06, 1],
            opacity: [0.45, 0.65, 0.5, 0.6, 0.45],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-4 w-96 h-80 rounded-full pointer-events-none blur-3xl bg-radial from-pink-400/50 via-purple-400/25 to-transparent z-0"
        />
      )}

      {/* VECTOR PINK BUTTERFLY & PEARL CAKE (Based on Image 1) */}
      <motion.div
        animate={allCandlesExtinguished ? { y: [0, -12, 0], scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-80 sm:w-96 aspect-[360/320] z-10 flex items-center justify-center cursor-pointer"
        onClick={() => {
          if (!allCandlesExtinguished) handleBlowAll();
        }}
        title="Tap the cake to blow out candles!"
      >
        <svg
          viewBox="0 0 360 320"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Soft Pink Frosting Gradient */}
            <linearGradient id="pinkCakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="40%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>

            {/* Cake Top Surface Gradient */}
            <linearGradient id="cakeTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>

            {/* White Whipped Base Cream Gradient */}
            <linearGradient id="whiteCreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fce7f3" />
            </linearGradient>

            {/* Pearl Shimmer Gradient */}
            <radialGradient id="pearlGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#f472b6" />
            </radialGradient>

            {/* Candle Body Gradient */}
            <linearGradient id="pinkCandleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff1f2" />
              <stop offset="50%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>

            <filter id="pinkGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. WHITE CERAMIC CAKE BOARD / BASE */}
          <g id="cake-board">
            <ellipse cx="180" cy="275" rx="145" ry="20" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
            <ellipse cx="180" cy="278" rx="148" ry="8" fill="#000000" opacity="0.1" />
            <ellipse cx="180" cy="273" rx="138" ry="16" fill="none" stroke="#ffffff" strokeWidth="2" />
          </g>

          {/* 2. CAKE BODY (Single Tier Pink Frosting with Wave Grooves) */}
          <g id="cake-body">
            {/* Cake Cylinder Side */}
            <path
              d="M60,140 C60,140 60,250 60,250 C60,270 115,280 180,280 C245,280 300,270 300,250 L300,140 Z"
              fill="url(#pinkCakeGrad)"
              stroke="#be123c"
              strokeWidth="2"
            />

            {/* Base White Cream Swirl Border */}
            <path
              d="M60,245 C80,265 110,268 140,260 C170,268 200,268 230,260 C260,268 285,260 300,245 C300,255 245,280 180,280 C115,280 60,255 60,245 Z"
              fill="url(#whiteCreamGrad)"
              stroke="#f472b6"
              strokeWidth="1.2"
            />

            {/* Horizontal Frosting Wave Ridges (Textured Swirls from Photo) */}
            <path d="M60,170 C100,182 180,186 300,170" fill="none" stroke="#fbcfe8" strokeWidth="2.5" opacity="0.7" />
            <path d="M60,195 C100,207 180,211 300,195" fill="none" stroke="#fbcfe8" strokeWidth="2.5" opacity="0.7" />
            <path d="M60,220 C100,232 180,236 300,220" fill="none" stroke="#fbcfe8" strokeWidth="2.5" opacity="0.7" />

            {/* Cake Top Oval Surface */}
            <ellipse cx="180" cy="140" rx="120" ry="30" fill="url(#cakeTopGrad)" stroke="#be123c" strokeWidth="2" />

            {/* Spiral Frosting Texture on Top Deck */}
            <ellipse cx="180" cy="140" rx="95" ry="24" fill="none" stroke="#ffffff" strokeWidth="1.8" opacity="0.6" />
            <ellipse cx="180" cy="140" rx="70" ry="18" fill="none" stroke="#ffffff" strokeWidth="1.8" opacity="0.6" />
            <ellipse cx="180" cy="140" rx="45" ry="12" fill="none" stroke="#ffffff" strokeWidth="1.8" opacity="0.6" />

            {/* Handwritten Calligraphy Piping on Top Surface */}
            <text
              x="180"
              y="142"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="14"
              fontFamily="Dancing Script, cursive"
              fontWeight="bold"
              filter="url(#pinkGlow)"
            >
              Happy Birthday, {recipientName}!
            </text>
          </g>

          {/* 3. PEARL SPRINKLES (Glossy White Sugar Pearls) */}
          <g id="pearls">
            {/* Pearls along top rim */}
            <circle cx="95" cy="132" r="4.5" fill="url(#pearlGrad)" stroke="#f472b6" strokeWidth="0.8" />
            <circle cx="125" cy="122" r="3" fill="url(#pearlGrad)" />
            <circle cx="235" cy="122" r="3.5" fill="url(#pearlGrad)" />
            <circle cx="265" cy="132" r="4.5" fill="url(#pearlGrad)" stroke="#f472b6" strokeWidth="0.8" />

            {/* Pearls on top surface */}
            <circle cx="150" cy="128" r="2" fill="#ffffff" />
            <circle cx="210" cy="128" r="2.5" fill="#ffffff" />
            <circle cx="170" cy="154" r="2" fill="#ffffff" />
            <circle cx="195" cy="154" r="2" fill="#ffffff" />

            {/* Pearls around bottom white cream border */}
            <circle cx="105" cy="255" r="5" fill="url(#pearlGrad)" stroke="#f472b6" strokeWidth="0.8" />
            <circle cx="120" cy="258" r="3.5" fill="url(#pearlGrad)" />
            <circle cx="132" cy="260" r="2.5" fill="url(#pearlGrad)" />
            <circle cx="228" cy="260" r="2.5" fill="url(#pearlGrad)" />
            <circle cx="240" cy="258" r="3.5" fill="url(#pearlGrad)" />
            <circle cx="255" cy="255" r="5" fill="url(#pearlGrad)" stroke="#f472b6" strokeWidth="0.8" />
          </g>

          {/* 4. FLUTTERING PINK VECTOR BUTTERFLIES (Matching Photo) */}
          <g id="butterflies">
            {/* Butterfly 1: Large Bottom Left */}
            <motion.g
              animate={{ rotate: [-2, 3, -2], scaleX: [1, 0.85, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: '110px', originY: '210px' }}
            >
              <g transform="translate(85, 185) scale(0.9) rotate(-15)">
                {/* Wings */}
                <path d="M25,25 C5,0 -15,10 0,35 C-15,50 5,60 25,35 Z" fill="#f472b6" stroke="#9d174d" strokeWidth="1.8" />
                <path d="M25,25 C45,0 65,10 50,35 C65,50 45,60 25,35 Z" fill="#fb7185" stroke="#9d174d" strokeWidth="1.8" />
                {/* Wing Veins */}
                <path d="M25,25 Q10,18 2,32 M25,25 Q12,38 8,46" stroke="#831843" strokeWidth="1" fill="none" />
                <path d="M25,25 Q40,18 48,32 M25,25 Q38,38 42,46" stroke="#831843" strokeWidth="1" fill="none" />
                {/* Body & Antennae */}
                <ellipse cx="25" cy="30" rx="2.5" ry="12" fill="#831843" />
                <path d="M25,18 Q20,10 16,8 M25,18 Q30,10 34,8" stroke="#831843" strokeWidth="1.2" fill="none" />
              </g>
            </motion.g>

            {/* Butterfly 2: Medium Right Side */}
            <motion.g
              animate={{ rotate: [2, -3, 2], scaleX: [1, 0.88, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              style={{ originX: '260px', originY: '190px' }}
            >
              <g transform="translate(245, 170) scale(0.8) rotate(15)">
                <path d="M25,25 C5,0 -15,10 0,35 C-15,50 5,60 25,35 Z" fill="#fb7185" stroke="#9d174d" strokeWidth="1.8" />
                <path d="M25,25 C45,0 65,10 50,35 C65,50 45,60 25,35 Z" fill="#f472b6" stroke="#9d174d" strokeWidth="1.8" />
                <ellipse cx="25" cy="30" rx="2.5" ry="12" fill="#831843" />
                <path d="M25,18 Q20,10 16,8 M25,18 Q30,10 34,8" stroke="#831843" strokeWidth="1.2" fill="none" />
              </g>
            </motion.g>

            {/* Butterfly 3: Top Right Resting on Deck */}
            <motion.g
              animate={{ scaleY: [1, 0.8, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              style={{ originX: '220px', originY: '115px' }}
            >
              <g transform="translate(205, 100) scale(0.65) rotate(-25)">
                <path d="M25,25 C5,0 -15,10 0,35 C-15,50 5,60 25,35 Z" fill="#f472b6" stroke="#9d174d" strokeWidth="1.8" />
                <path d="M25,25 C45,0 65,10 50,35 C65,50 45,60 25,35 Z" fill="#fda4af" stroke="#9d174d" strokeWidth="1.8" />
                <ellipse cx="25" cy="30" rx="2.5" ry="12" fill="#831843" />
              </g>
            </motion.g>
          </g>

          {/* 5. VECTOR CANDLES & ANIMATED FLAMES */}
          {candleData.map((c, i) => {
            const isCandleExtinguished = isBlown || blownCandles[i];

            return (
              <g
                key={c.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCandleClick(i);
                }}
                className="cursor-pointer group"
              >
                {/* Candle Base Holder */}
                <ellipse cx={c.x} cy={c.y + 30} rx="5" ry="2" fill="#f472b6" stroke="#be123c" strokeWidth="1" />

                {/* Pink/White Striped Candle Body */}
                <rect
                  x={c.x - 3.5}
                  y={c.y}
                  width="7"
                  height="30"
                  rx="1.5"
                  fill="url(#pinkCandleGrad)"
                  stroke="#be123c"
                  strokeWidth="1"
                />

                {/* White Candle Stripes */}
                <line x1={c.x - 3.5} y1={c.y + 6} x2={c.x + 3.5} y2={c.y + 11} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                <line x1={c.x - 3.5} y1={c.y + 16} x2={c.x + 3.5} y2={c.y + 21} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

                {/* Candle Wick */}
                <line x1={c.x} y1={c.y} x2={c.x} y2={c.y - 5} stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />

                {/* CANDLE FLAME */}
                {!isCandleExtinguished ? (
                  <g>
                    {/* Outer Ambient Glow Aura */}
                    <circle cx={c.x} cy={c.y - 12} r="14" fill="#fbcfe8" opacity="0.5" filter="url(#pinkGlow)" />

                    {/* Animated Dancing Flame Teardrop */}
                    <motion.g
                      animate={{
                        scale: [1, 1.15, 0.95, 1.1, 1],
                        rotate: [-2, 3, -1, 2, -2],
                        y: [0, -1.5, 0.5, -1, 0],
                      }}
                      transition={{
                        duration: 0.65,
                        repeat: Infinity,
                        delay: c.delay,
                        ease: 'easeInOut',
                      }}
                      style={{ originX: `${c.x}px`, originY: `${c.y - 5}px` }}
                    >
                      {/* Outer Flame (Warm Pink-Orange) */}
                      <path
                        d={`M${c.x},${c.y - 22}
                            C${c.x - 7},${c.y - 13} ${c.x - 5},${c.y - 5} ${c.x},${c.y - 5}
                            C${c.x + 5},${c.y - 5} ${c.x + 7},${c.y - 13} ${c.x},${c.y - 22} Z`}
                        fill="#f43f5e"
                        stroke="#e11d48"
                        strokeWidth="0.8"
                      />

                      {/* Mid Flame (Bright Yellow) */}
                      <path
                        d={`M${c.x},${c.y - 18}
                            C${c.x - 4},${c.y - 11} ${c.x - 3},${c.y - 5} ${c.x},${c.y - 5}
                            C${c.x + 3},${c.y - 5} ${c.x + 4},${c.y - 11} ${c.x},${c.y - 18} Z`}
                        fill="#fde047"
                      />

                      {/* Inner Heat Core (White) */}
                      <path
                        d={`M${c.x},${c.y - 13}
                            C${c.x - 2},${c.y - 9} ${c.x - 1.5},${c.y - 5} ${c.x},${c.y - 5}
                            C${c.x + 1.5},${c.y - 5} ${c.x + 2},${c.y - 9} ${c.x},${c.y - 13} Z`}
                        fill="#ffffff"
                      />
                    </motion.g>
                  </g>
                ) : (
                  /* Cartoon Smoke Cloud when Blown */
                  <motion.g
                    initial={{ opacity: 0, scale: 0.4, y: 0 }}
                    animate={{
                      opacity: [0.9, 0.5, 0],
                      scale: [0.6, 1.8, 2.5],
                      y: [0, -25, -45],
                      x: [0, i === 0 ? -8 : i === 2 ? 8 : 2, i === 0 ? -16 : i === 2 ? 16 : 4],
                    }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    style={{ originX: `${c.x}px`, originY: `${c.y - 5}px` }}
                  >
                    <circle cx={c.x} cy={c.y - 5} r="1.5" fill="#f97316" />
                    <circle cx={c.x} cy={c.y - 12} r="5" fill="#f1f5f9" opacity="0.7" />
                    <circle cx={c.x + 2} cy={c.y - 18} r="7" fill="#e2e8f0" opacity="0.5" />
                  </motion.g>
                )}
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Interactive Controls & Status Feedback */}
      <div className="mt-3 flex flex-col items-center gap-3 z-30">
        <div className="text-center">
          <p className="text-base sm:text-lg font-medium text-slate-100 tracking-tight drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
            {!allCandlesExtinguished ? (
              <span>
                {permissionError
                  ? '✨ Tap the candles or cake to blow them out!'
                  : '🌬️ Blow into your mic, or tap candles to make a wish!'}
              </span>
            ) : (
              <span className="text-pink-400 font-script text-2xl sm:text-3xl font-bold drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]">
                Your birthday wish is set in the stars! ✨
              </span>
            )}
          </p>
          {!allCandlesExtinguished && (
            <div className="mt-1 flex items-center justify-center gap-2 text-xs text-purple-200/70">
              <span>{blownCandles.filter((b) => !b).length} of 3 candles glowing</span>
              <span aria-hidden="true">·</span>
              <span>Tap each candle or blow all at once</span>
            </div>
          )}
        </div>

        {/* Primary Action */}
        {!allCandlesExtinguished ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBlowAll}
            className="px-7 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all text-sm sm:text-base flex items-center gap-2.5 cursor-pointer border border-white/30"
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
            className="px-4 py-2 text-xs font-semibold text-pink-300 hover:text-white bg-slate-900/80 hover:bg-slate-900 rounded-xl border border-pink-500/40 shadow-xs transition-colors cursor-pointer"
          >
            Relight All Candles
          </motion.button>
        )}
      </div>
    </div>
  );
};
