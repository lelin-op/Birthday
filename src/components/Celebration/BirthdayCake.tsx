import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '../../utils/soundEffects';

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

  const candleData = [
    { id: 0, x: 120, y: 70, delay: 0 },
    { id: 1, x: 180, y: 60, delay: 0.15 },
    { id: 2, x: 240, y: 70, delay: 0.3 },
  ];

  return (
    <div className="relative flex flex-col items-center select-none py-2 px-4 max-w-lg mx-auto">
      {/* Ambient Candlelight Warm Halo in Vector Stage */}
      {!allCandlesExtinguished && (
        <motion.div
          animate={{
            scale: [1, 1.12, 0.98, 1.06, 1],
            opacity: [0.45, 0.65, 0.5, 0.6, 0.45],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-6 w-96 h-80 rounded-full pointer-events-none blur-3xl bg-radial from-amber-300/50 via-rose-300/30 to-transparent z-0"
        />
      )}

      {/* VECTOR ILLUSTRATION CAKE (Pure SVG Vector Art with Rich Animation) */}
      <motion.div
        animate={allCandlesExtinguished ? { y: [0, -12, 0], scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-80 sm:w-96 aspect-[360/340] z-10 flex items-center justify-center cursor-pointer"
        onClick={() => {
          if (!allCandlesExtinguished) handleBlowAll();
        }}
        title="Tap the cake to blow out candles!"
      >
        <svg
          viewBox="0 0 360 340"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Gradients for Vector Cake */}
            <linearGradient id="plateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            <linearGradient id="standGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            <linearGradient id="bottomTierGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="40%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>

            <linearGradient id="topTierGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f5d0fe" />
              <stop offset="50%" stopColor="#e879f9" />
              <stop offset="100%" stopColor="#a21caf" />
            </linearGradient>

            <linearGradient id="icingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffe4e6" />
            </linearGradient>

            <linearGradient id="candleGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. PEDESTAL CAKE STAND (Victorian Ornate Gold Stand) */}
          <g id="cake-stand">
            {/* Stand Base */}
            <ellipse cx="180" cy="315" rx="75" ry="12" fill="url(#standGrad)" stroke="#a16207" strokeWidth="2" />
            <ellipse cx="180" cy="318" rx="85" ry="6" fill="#000000" opacity="0.12" />

            {/* Stand Pillar Stem */}
            <path d="M165,280 Q162,295 155,315 L205,315 Q198,295 195,280 Z" fill="url(#standGrad)" stroke="#a16207" strokeWidth="2" />
            <path d="M172,295 L188,295" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />

            {/* Plate Rim Support Underneath */}
            <ellipse cx="180" cy="275" rx="140" ry="16" fill="#ca8a04" />
            {/* Main Gold Plate */}
            <ellipse cx="180" cy="270" rx="145" ry="16" fill="url(#plateGrad)" stroke="#a16207" strokeWidth="2.5" />
            {/* Plate Bevel Highlight */}
            <ellipse cx="180" cy="268" rx="138" ry="12" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />

            {/* Decorative Scallops around plate edge */}
            {Array.from({ length: 15 }).map((_, i) => {
              const angle = (i / 15) * Math.PI;
              const cx = 180 + Math.cos(angle + Math.PI) * 140;
              const cy = 270 + Math.sin(angle + Math.PI) * 14;
              return (
                <circle key={i} cx={cx} cy={cy} r="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
              );
            })}
          </g>

          {/* 2. BOTTOM TIER (Rose Chiffon Sponge) */}
          <g id="bottom-tier">
            {/* Bottom Cylinder Body */}
            <path
              d="M55,190 C55,190 55,250 55,250 C55,268 110,278 180,278 C250,278 305,268 305,250 L305,190 Z"
              fill="url(#bottomTierGrad)"
              stroke="#9f1239"
              strokeWidth="2.5"
            />

            {/* Middle Cream Layer Stripe */}
            <path
              d="M55,225 C95,238 180,242 305,225 C305,232 250,242 180,242 C110,242 55,232 55,225 Z"
              fill="#fff1f2"
              opacity="0.8"
            />

            {/* Bottom Tier Top Surface */}
            <ellipse cx="180" cy="190" rx="125" ry="24" fill="#fda4af" stroke="#9f1239" strokeWidth="2.5" />

            {/* Dripping Vanilla/Strawberry Glaze Scallops on Bottom Tier */}
            <path
              d="M55,190
                 C70,218 85,215 95,195
                 C105,225 125,230 135,195
                 C145,220 165,224 175,195
                 C185,228 205,230 215,195
                 C225,222 245,224 255,195
                 C265,226 285,220 295,195
                 L305,190
                 C305,205 250,215 180,215
                 C110,215 55,205 55,190 Z"
              fill="url(#icingGrad)"
              stroke="#f43f5e"
              strokeWidth="1.5"
            />

            {/* Bottom Tier Pearls & Sprinkles */}
            <circle cx="85" cy="245" r="4" fill="#ffffff" stroke="#f43f5e" strokeWidth="1" />
            <circle cx="120" cy="255" r="3.5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="160" cy="260" r="4" fill="#ffffff" stroke="#f43f5e" strokeWidth="1" />
            <circle cx="200" cy="260" r="3.5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="240" cy="255" r="4" fill="#ffffff" stroke="#f43f5e" strokeWidth="1" />
            <circle cx="275" cy="245" r="3.5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />

            {/* Piped Shell Rosettes at Bottom Base */}
            {Array.from({ length: 9 }).map((_, i) => (
              <circle
                key={i}
                cx={75 + i * 26}
                cy={255 + Math.sin((i / 8) * Math.PI) * 12}
                r="7"
                fill="#ffffff"
                stroke="#fda4af"
                strokeWidth="1.5"
              />
            ))}
          </g>

          {/* 3. TOP TIER (Lavender Velvet Cake) */}
          <g id="top-tier">
            {/* Top Cylinder Body */}
            <path
              d="M95,115 C95,115 95,175 95,175 C95,190 135,200 180,200 C225,200 265,190 265,175 L265,115 Z"
              fill="url(#topTierGrad)"
              stroke="#86198f"
              strokeWidth="2.5"
            />

            {/* Top Tier Cream Stripe */}
            <path
              d="M95,145 C125,155 180,160 265,145 C265,152 225,160 180,160 C135,160 95,152 95,145 Z"
              fill="#fdf4ff"
              opacity="0.8"
            />

            {/* Top Tier Top Surface */}
            <ellipse cx="180" cy="115" rx="85" ry="18" fill="#f5d0fe" stroke="#86198f" strokeWidth="2.5" />

            {/* Dripping Glaze on Top Tier */}
            <path
              d="M95,115
                 C108,138 120,135 128,118
                 C138,142 152,145 160,118
                 C170,140 188,142 198,118
                 C208,144 222,142 232,118
                 C242,138 255,134 265,115
                 C265,128 225,136 180,136
                 C135,136 95,128 95,115 Z"
              fill="url(#icingGrad)"
              stroke="#d946ef"
              strokeWidth="1.5"
            />

            {/* Golden Star Sprinkles on Top Tier */}
            <path d="M125,155 L127,159 L131,160 L128,163 L129,167 L125,165 L121,167 L122,163 L119,160 L123,159 Z" fill="#fde047" />
            <path d="M225,155 L227,159 L231,160 L228,163 L229,167 L225,165 L221,167 L222,163 L219,160 L223,159 Z" fill="#fde047" />
            <circle cx="150" cy="168" r="3" fill="#ffffff" />
            <circle cx="205" cy="168" r="3" fill="#ffffff" />

            {/* Vector Cherries & Strawberries on Top Deck */}
            {/* Left Strawberry */}
            <g transform="translate(130, 95) rotate(-10)">
              <path d="M0,0 C-8,-5 -12,12 0,18 C12,12 8,-5 0,0 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.2" />
              <circle cx="-3" cy="6" r="0.8" fill="#fef08a" />
              <circle cx="3" cy="8" r="0.8" fill="#fef08a" />
              <path d="M0,0 L-4,-4 M0,0 L4,-4 M0,0 L0,-5" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Right Strawberry */}
            <g transform="translate(230, 95) rotate(10)">
              <path d="M0,0 C-8,-5 -12,12 0,18 C12,12 8,-5 0,0 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.2" />
              <circle cx="-3" cy="6" r="0.8" fill="#fef08a" />
              <circle cx="3" cy="8" r="0.8" fill="#fef08a" />
              <path d="M0,0 L-4,-4 M0,0 L4,-4 M0,0 L0,-5" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Center Happy Birthday Plaque */}
            <rect x="135" y="142" width="90" height="24" rx="12" fill="#ffffff" stroke="#f43f5e" strokeWidth="1.5" filter="url(#glowFilter)" />
            <text x="180" y="158" textAnchor="middle" fill="#e11d48" fontSize="12" fontFamily="Dancing Script, cursive" fontWeight="bold">
              Happy Birthday! ♥
            </text>
          </g>

          {/* 4. VECTOR BIRTHDAY CANDLES */}
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
                {/* Candle Stand / Holder */}
                <ellipse cx={c.x} cy={c.y + 36} rx="6" ry="2.5" fill="#ca8a04" stroke="#a16207" strokeWidth="1" />

                {/* Candle Cylinder Body */}
                <rect
                  x={c.x - 4}
                  y={c.y}
                  width="8"
                  height="36"
                  rx="2"
                  fill="url(#candleGrad1)"
                  stroke="#b45309"
                  strokeWidth="1.2"
                />

                {/* Festive Spiral Stripes on Candle */}
                <line x1={c.x - 4} y1={c.y + 8} x2={c.x + 4} y2={c.y + 14} stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
                <line x1={c.x - 4} y1={c.y + 20} x2={c.x + 4} y2={c.y + 26} stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

                {/* Candle Wick */}
                <line x1={c.x} y1={c.y} x2={c.x} y2={c.y - 6} stroke="#334155" strokeWidth="1.8" strokeLinecap="round" />

                {/* CANDLE FLAME (Interactive & Animated) */}
                {!isCandleExtinguished ? (
                  <g>
                    {/* Outer Ambient Glow Aura */}
                    <circle cx={c.x} cy={c.y - 14} r="16" fill="#fef08a" opacity="0.4" filter="url(#glowFilter)" />

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
                      style={{ originX: `${c.x}px`, originY: `${c.y - 6}px` }}
                    >
                      {/* Outer Flame (Orange-Gold) */}
                      <path
                        d={`M${c.x},${c.y - 25}
                            C${c.x - 8},${c.y - 15} ${c.x - 6},${c.y - 6} ${c.x},${c.y - 6}
                            C${c.x + 6},${c.y - 6} ${c.x + 8},${c.y - 15} ${c.x},${c.y - 25} Z`}
                        fill="#f97316"
                        stroke="#ea580c"
                        strokeWidth="0.8"
                      />

                      {/* Mid Flame (Vibrant Yellow) */}
                      <path
                        d={`M${c.x},${c.y - 21}
                            C${c.x - 5},${c.y - 13} ${c.x - 4},${c.y - 6} ${c.x},${c.y - 6}
                            C${c.x + 4},${c.y - 6} ${c.x + 5},${c.y - 13} ${c.x},${c.y - 21} Z`}
                        fill="#fde047"
                      />

                      {/* Inner Core (White Heat) */}
                      <path
                        d={`M${c.x},${c.y - 15}
                            C${c.x - 2.5},${c.y - 10} ${c.x - 2},${c.y - 6} ${c.x},${c.y - 6}
                            C${c.x + 2},${c.y - 6} ${c.x + 2.5},${c.y - 10} ${c.x},${c.y - 15} Z`}
                        fill="#ffffff"
                      />

                      {/* Blue Base Oxygen Core */}
                      <ellipse cx={c.x} cy={c.y - 6} rx="2.5" ry="1.2" fill="#38bdf8" opacity="0.8" />
                    </motion.g>
                  </g>
                ) : (
                  /* Animated Smoke Cloud when Candle is Blown */
                  <motion.g
                    initial={{ opacity: 0, scale: 0.4, y: 0 }}
                    animate={{
                      opacity: [0.9, 0.5, 0],
                      scale: [0.6, 1.8, 2.5],
                      y: [0, -25, -45],
                      x: [0, i === 0 ? -8 : i === 2 ? 8 : 2, i === 0 ? -16 : i === 2 ? 16 : 4],
                    }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    style={{ originX: `${c.x}px`, originY: `${c.y - 6}px` }}
                  >
                    {/* Cooling red ember on wick */}
                    <circle cx={c.x} cy={c.y - 6} r="1.5" fill="#f97316" />
                    {/* Smoke puffs */}
                    <circle cx={c.x} cy={c.y - 14} r="5" fill="#e2e8f0" opacity="0.6" />
                    <circle cx={c.x + 2} cy={c.y - 20} r="7" fill="#cbd5e1" opacity="0.4" />
                  </motion.g>
                )}
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Interactive Controls & Status Feedback */}
      <div className="mt-4 flex flex-col items-center gap-3 z-30">
        <div className="text-center">
          <p className="text-base sm:text-lg font-medium text-slate-800 tracking-tight">
            {!allCandlesExtinguished ? (
              <span>
                {permissionError
                  ? '✨ Tap the candles or cake to blow them out!'
                  : '🌬️ Blow into your mic, or tap candles to make a wish!'}
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

        {/* Primary Make a Wish CTA Button */}
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
