import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '../../utils/soundEffects';
import type { CakeStyle } from '../../types';

interface BirthdayCakeProps {
  isBlown: boolean;
  onBlow: () => void;
  permissionError?: boolean;
  isListening?: boolean;
  micVolume?: number;
  enableMic?: () => void;
  soundEnabled?: boolean;
  recipientName?: string;
  cakeStyle?: CakeStyle;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  isBlown,
  onBlow,
  permissionError = false,
  isListening = false,
  micVolume = 0,
  enableMic,
  recipientName = 'My Love',
  cakeStyle = 'butterflyPink',
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

  // Candle placements tailored to cake tier geometry
  const candlePositions =
    cakeStyle === 'grandThreeTier'
      ? [
          { id: 0, x: 140, y: 55, delay: 0 },
          { id: 1, x: 180, y: 48, delay: 0.15 },
          { id: 2, x: 220, y: 55, delay: 0.3 },
        ]
      : cakeStyle === 'royalPurpleTwoTier'
      ? [
          { id: 0, x: 135, y: 65, delay: 0 },
          { id: 1, x: 180, y: 56, delay: 0.15 },
          { id: 2, x: 225, y: 65, delay: 0.3 },
        ]
      : [
          // butterflyPink
          { id: 0, x: 135, y: 85, delay: 0 },
          { id: 1, x: 180, y: 75, delay: 0.15 },
          { id: 2, x: 225, y: 85, delay: 0.3 },
        ];

  return (
    <div className="relative flex flex-col items-center select-none py-2 px-4 max-w-lg mx-auto">
      {/* Ambient Candlelight Glow */}
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

      {/* Mic Status & Wind Pulse Meter Bar */}
      {!allCandlesExtinguished && (
        <div className="mb-2 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-500/30 text-xs text-pink-200 shadow-md">
          <span className="relative flex h-2.5 w-2.5">
            {isListening ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            )}
          </span>
          <span className="font-medium">
            {isListening
              ? 'Mic active: Blow into mic now!'
              : permissionError
              ? 'Mic disabled: Tap candles below to blow'
              : 'Click mic button or blow into mic'}
          </span>
          {isListening && micVolume > 0 && (
            <div className="flex items-center gap-0.5 ml-1">
              <div
                className="h-2 bg-gradient-to-r from-pink-400 to-emerald-400 rounded-full transition-all duration-75"
                style={{ width: `${Math.min(45, Math.max(6, micVolume * 0.45))}px` }}
              />
            </div>
          )}
        </div>
      )}

      {/* VECTOR CAKE DISPLAY */}
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
            {/* Pink Gradients */}
            <linearGradient id="pinkCakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="40%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>

            <linearGradient id="cakeTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>

            {/* Purple Two-Tier Gradients */}
            <linearGradient id="purpleBottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#6b21a8" />
            </linearGradient>

            <linearGradient id="purpleTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e879f9" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>

            {/* Gold Stand Gradient */}
            <linearGradient id="goldStandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            <radialGradient id="pearlGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#f472b6" />
            </radialGradient>

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

          {/* CAKE BASE STAND */}
          <g id="cake-board">
            <ellipse cx="180" cy="280" rx="145" ry="18" fill="url(#goldStandGrad)" stroke="#a16207" strokeWidth="2" />
            <ellipse cx="180" cy="283" rx="148" ry="8" fill="#000000" opacity="0.12" />
          </g>

          {/* CAKE STYLE 1: BUTTERFLY PINK (1 TIER - USER FAVORITE) */}
          {cakeStyle === 'butterflyPink' && (
            <g id="style-butterfly-pink">
              {/* Cylinder Body */}
              <path
                d="M60,140 C60,140 60,250 60,250 C60,270 115,280 180,280 C245,280 300,270 300,250 L300,140 Z"
                fill="url(#pinkCakeGrad)"
                stroke="#be123c"
                strokeWidth="2"
              />

              {/* White Cream Base Swirl */}
              <path
                d="M60,245 C80,265 110,268 140,260 C170,268 200,268 230,260 C260,268 285,260 300,245 C300,255 245,280 180,280 C115,280 60,255 60,245 Z"
                fill="#ffffff"
                stroke="#f472b6"
                strokeWidth="1.2"
              />

              {/* Frosting Swirl Ridges */}
              <path d="M60,170 C100,182 180,186 300,170" fill="none" stroke="#fbcfe8" strokeWidth="2.5" opacity="0.7" />
              <path d="M60,195 C100,207 180,211 300,195" fill="none" stroke="#fbcfe8" strokeWidth="2.5" opacity="0.7" />
              <path d="M60,220 C100,232 180,236 300,220" fill="none" stroke="#fbcfe8" strokeWidth="2.5" opacity="0.7" />

              {/* Cake Top Oval */}
              <ellipse cx="180" cy="140" rx="120" ry="30" fill="url(#cakeTopGrad)" stroke="#be123c" strokeWidth="2" />
              <ellipse cx="180" cy="140" rx="95" ry="24" fill="none" stroke="#ffffff" strokeWidth="1.8" opacity="0.6" />

              {/* Handwritten Calligraphy Piping */}
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

              {/* Sugar Pearls */}
              <circle cx="95" cy="132" r="4.5" fill="url(#pearlGrad)" stroke="#f472b6" strokeWidth="0.8" />
              <circle cx="265" cy="132" r="4.5" fill="url(#pearlGrad)" stroke="#f472b6" strokeWidth="0.8" />
              <circle cx="105" cy="255" r="5" fill="url(#pearlGrad)" stroke="#f472b6" strokeWidth="0.8" />
              <circle cx="255" cy="255" r="5" fill="url(#pearlGrad)" stroke="#f472b6" strokeWidth="0.8" />

              {/* Pink Butterflies */}
              <g transform="translate(85, 185) scale(0.9) rotate(-15)">
                <path d="M25,25 C5,0 -15,10 0,35 C-15,50 5,60 25,35 Z" fill="#f472b6" stroke="#9d174d" strokeWidth="1.8" />
                <path d="M25,25 C45,0 65,10 50,35 C65,50 45,60 25,35 Z" fill="#fb7185" stroke="#9d174d" strokeWidth="1.8" />
                <ellipse cx="25" cy="30" rx="2.5" ry="12" fill="#831843" />
              </g>

              <g transform="translate(245, 170) scale(0.8) rotate(15)">
                <path d="M25,25 C5,0 -15,10 0,35 C-15,50 5,60 25,35 Z" fill="#fb7185" stroke="#9d174d" strokeWidth="1.8" />
                <path d="M25,25 C45,0 65,10 50,35 C65,50 45,60 25,35 Z" fill="#f472b6" stroke="#9d174d" strokeWidth="1.8" />
                <ellipse cx="25" cy="30" rx="2.5" ry="12" fill="#831843" />
              </g>
            </g>
          )}

          {/* CAKE STYLE 2: ROYAL PURPLE TWO-TIER */}
          {cakeStyle === 'royalPurpleTwoTier' && (
            <g id="style-purple-two-tier">
              {/* Bottom Tier */}
              <path
                d="M60,180 C60,180 60,255 60,255 C60,272 115,280 180,280 C245,280 300,272 300,255 L300,180 Z"
                fill="url(#purpleBottomGrad)"
                stroke="#581c87"
                strokeWidth="2"
              />
              <ellipse cx="180" cy="180" rx="120" ry="26" fill="#c084fc" stroke="#581c87" strokeWidth="2" />

              {/* Bottom Tier Rosettes */}
              {Array.from({ length: 9 }).map((_, i) => (
                <circle key={i} cx={75 + i * 26} cy={262} r="6" fill="#fdf4ff" stroke="#c084fc" strokeWidth="1.2" />
              ))}

              {/* Top Tier */}
              <path
                d="M95,115 C95,115 95,175 95,175 C95,190 135,198 180,198 C225,198 265,190 265,175 L265,115 Z"
                fill="url(#purpleTopGrad)"
                stroke="#581c87"
                strokeWidth="2"
              />
              <ellipse cx="180" cy="115" rx="85" ry="18" fill="#f5d0fe" stroke="#581c87" strokeWidth="2" />

              {/* Gold Plaque */}
              <rect x="135" y="142" width="90" height="22" rx="11" fill="#ffffff" stroke="#c084fc" strokeWidth="1.5" />
              <text x="180" y="157" textAnchor="middle" fill="#9333ea" fontSize="11" fontFamily="Dancing Script, cursive" fontWeight="bold">
                Happy Birthday!
              </text>
            </g>
          )}

          {/* CAKE STYLE 3: GRAND THREE-TIER */}
          {cakeStyle === 'grandThreeTier' && (
            <g id="style-grand-three-tier">
              {/* Bottom Tier */}
              <path d="M50,210 L50,260 C50,275 110,283 180,283 C250,283 310,275 310,260 L310,210 Z" fill="url(#pinkCakeGrad)" stroke="#be123c" strokeWidth="2" />
              <ellipse cx="180" cy="210" rx="130" ry="25" fill="#fbcfe8" stroke="#be123c" strokeWidth="2" />

              {/* Middle Tier */}
              <path d="M85,145 L85,195 C85,208 128,216 180,216 C232,216 275,208 275,195 L275,145 Z" fill="url(#purpleTopGrad)" stroke="#6b21a8" strokeWidth="2" />
              <ellipse cx="180" cy="145" rx="95" ry="20" fill="#f5d0fe" stroke="#6b21a8" strokeWidth="2" />

              {/* Top Tier */}
              <path d="M115,90 L115,130 C115,140 145,148 180,148 C215,148 245,140 245,130 L245,90 Z" fill="url(#pinkCakeGrad)" stroke="#be123c" strokeWidth="2" />
              <ellipse cx="180" cy="90" rx="65" ry="15" fill="#fbcfe8" stroke="#be123c" strokeWidth="2" />

              {/* Top Drip Icing */}
              <path d="M115,90 C130,105 145,102 155,90 C165,108 185,110 195,90 C205,106 225,104 245,90 Z" fill="#ffffff" opacity="0.9" />
            </g>
          )}

          {/* CANDLES & FLAMES */}
          {candlePositions.map((c, i) => {
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
                {/* Candle Stand */}
                <ellipse cx={c.x} cy={c.y + 30} rx="5" ry="2" fill="#f472b6" stroke="#be123c" strokeWidth="1" />

                {/* Candle Body */}
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

                {/* Candle Stripes */}
                <line x1={c.x - 3.5} y1={c.y + 6} x2={c.x + 3.5} y2={c.y + 11} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
                <line x1={c.x - 3.5} y1={c.y + 16} x2={c.x + 3.5} y2={c.y + 21} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

                {/* Wick */}
                <line x1={c.x} y1={c.y} x2={c.x} y2={c.y - 5} stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />

                {/* FLAME OR SMOKE */}
                {!isCandleExtinguished ? (
                  <g>
                    <circle cx={c.x} cy={c.y - 12} r="14" fill="#fbcfe8" opacity="0.5" filter="url(#pinkGlow)" />
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
                      <path
                        d={`M${c.x},${c.y - 22}
                            C${c.x - 7},${c.y - 13} ${c.x - 5},${c.y - 5} ${c.x},${c.y - 5}
                            C${c.x + 5},${c.y - 5} ${c.x + 7},${c.y - 13} ${c.x},${c.y - 22} Z`}
                        fill="#f43f5e"
                        stroke="#e11d48"
                        strokeWidth="0.8"
                      />
                      <path
                        d={`M${c.x},${c.y - 18}
                            C${c.x - 4},${c.y - 11} ${c.x - 3},${c.y - 5} ${c.x},${c.y - 5}
                            C${c.x + 3},${c.y - 5} ${c.x + 4},${c.y - 11} ${c.x},${c.y - 18} Z`}
                        fill="#fde047"
                      />
                      <path
                        d={`M${c.x},${c.y - 13}
                            C${c.x - 2},${c.y - 9} ${c.x - 1.5},${c.y - 5} ${c.x},${c.y - 5}
                            C${c.x + 1.5},${c.y - 5} ${c.x + 2},${c.y - 9} ${c.x},${c.y - 13} Z`}
                        fill="#ffffff"
                      />
                    </motion.g>
                  </g>
                ) : (
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
                  : '🌬️ Blow into your mic or tap candles to make a wish!'}
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

        {/* Primary Action Buttons */}
        {!allCandlesExtinguished ? (
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBlowAll}
              className="px-6 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all text-sm sm:text-base flex items-center gap-2 cursor-pointer border border-white/30"
            >
              <span>🎂</span>
              <span>Make a Wish & Blow All Candles</span>
            </motion.button>

            {enableMic && !isListening && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => enableMic()}
                className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-pink-300 font-semibold rounded-2xl shadow-md transition-all text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer border border-pink-500/30"
              >
                <span>🎤</span>
                <span>Enable Mic Blow</span>
              </motion.button>
            )}
          </div>
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
