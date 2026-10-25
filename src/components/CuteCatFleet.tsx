import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../utils/soundEffects';

interface CatProps {
  name: string;
  phrase: string;
  positionClass: string;
  colorTheme: 'white' | 'ginger' | 'tuxedo' | 'cloud';
}

const InteractiveCat: React.FC<CatProps> = ({
  name,
  phrase,
  positionClass,
  colorTheme,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  const [petCount, setPetCount] = useState(0);

  const triggerPurrAndHeart = () => {
    sounds.playCatPurr();
    setPetCount((prev) => prev + 1);

    const heartSymbols = ['♥', '💖', '✨', '🐾', '💕'];
    const randomSymbol = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];

    const newHeart = {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 40,
      y: -20 - Math.random() * 25,
      text: randomSymbol,
    };

    setHearts((prev) => [...prev.slice(-5), newHeart]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1300);
  };

  // Trigger sound & particle on hover start
  const handleMouseEnter = () => {
    setIsHovered(true);
    triggerPurrAndHeart();
  };

  // Re-trigger purr sound periodically if user continues hovering
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isHovered) {
      interval = setInterval(() => {
        sounds.playCatPurr();
      }, 1400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered]);

  return (
    <div
      className={`fixed ${positionClass} z-30 select-none group cursor-pointer`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      onClick={triggerPurrAndHeart}
      title={`Hover or click to pet ${name}!`}
    >
      {/* Soft Purring Radiance Glow Ring behind Cat when hovered */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{
              opacity: [0.6, 0.9, 0.6],
              scale: [0.95, 1.2, 0.95],
            }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-3 rounded-full bg-gradient-to-r from-pink-400/40 via-purple-400/30 to-rose-400/40 blur-lg pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* Speech & Purring Bubble on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.85 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-lg border border-pink-300 pointer-events-none flex items-center gap-1.5 z-40"
          >
            <span className="text-pink-500 animate-pulse">Purrrrr~</span>
            <span className="text-slate-700">{phrase}</span>
            {petCount > 0 && (
              <span className="text-rose-500 font-extrabold bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-200">
                {petCount}♥
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Love Hearts and Paw Particles */}
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          initial={{ opacity: 1, y: 0, scale: 0.7, x: 0 }}
          animate={{ opacity: 0, y: -45, scale: 1.5, x: h.x }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-rose-500 font-bold text-base pointer-events-none z-50 select-none drop-shadow-sm"
        >
          {h.text}
        </motion.span>
      ))}

      {/* Framer Motion Vector Cat Body with Realistic Purring Micro-Vibrations */}
      <motion.div
        animate={
          isHovered
            ? {
                scale: [1.07, 1.12, 1.08, 1.13, 1.09],
                x: [0, -1.8, 1.8, -1.2, 1.2, -0.6, 0],
                y: [-5, -6.5, -4.5, -6, -5],
                rotate: [0, -1.5, 1.5, -1, 1, 0],
              }
            : {
                scale: [1, 1.03, 1],
                x: 0,
                y: [0, -3, 0],
                rotate: 0,
              }
        }
        transition={{
          duration: isHovered ? 0.35 : 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10"
      >
        {/* Soft Shadow under Cat */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/15 rounded-full blur-[3px]" />

        {colorTheme === 'white' && (
          /* Snow White Princess Cat with Flower Crown */
          <svg width="86" height="86" viewBox="0 0 100 100" className="drop-shadow-md">
            {/* Body */}
            <ellipse cx="50" cy="68" rx="26" ry="22" fill="#ffffff" stroke="#f1f5f9" strokeWidth="1.5" />
            {/* Chest Fur */}
            <path d="M42,60 Q50,68 58,60" fill="none" stroke="#fecdd3" strokeWidth="2.5" />
            {/* Head */}
            <circle cx="50" cy="42" r="22" fill="#ffffff" stroke="#f1f5f9" strokeWidth="1.5" />
            {/* Ears (Ears twitch slightly when purring) */}
            <motion.polygon
              points="32,28 42,16 46,30"
              fill="#ffffff"
              stroke="#f1f5f9"
              strokeWidth="1.5"
              animate={isHovered ? { rotate: [-3, 3, -3] } : {}}
              transition={{ duration: 0.25, repeat: Infinity }}
            />
            <polygon points="34,26 40,19 44,28" fill="#fecdd3" />
            <motion.polygon
              points="68,28 58,16 54,30"
              fill="#ffffff"
              stroke="#f1f5f9"
              strokeWidth="1.5"
              animate={isHovered ? { rotate: [3, -3, 3] } : {}}
              transition={{ duration: 0.25, repeat: Infinity }}
            />
            <polygon points="66,26 60,19 56,28" fill="#fecdd3" />
            {/* Purring Eyes: Blinking Happy Closed Eyes when Purring */}
            {isHovered ? (
              <>
                <path d="M37,42 Q42,36 47,42" fill="none" stroke="#be185d" strokeWidth="3" strokeLinecap="round" />
                <path d="M53,42 Q58,36 63,42" fill="none" stroke="#be185d" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="42" cy="41" r="3.2" fill="#334155" />
                <circle cx="43" cy="40" r="1.2" fill="#ffffff" />
                <circle cx="58" cy="41" r="3.2" fill="#334155" />
                <circle cx="59" cy="40" r="1.2" fill="#ffffff" />
              </>
            )}
            {/* Pink Nose & Cute Mouth */}
            <polygon points="50,47 48,45 52,45" fill="#f43f5e" />
            <path d="M47,49 Q50,52 50,47 Q50,52 53,49" fill="none" stroke="#475569" strokeWidth="1.5" />
            {/* Whiskers */}
            <line x1="28" y1="44" x2="36" y2="45" stroke="#cbd5e1" strokeWidth="1.2" />
            <line x1="27" y1="49" x2="36" y2="48" stroke="#cbd5e1" strokeWidth="1.2" />
            <line x1="72" y1="44" x2="64" y2="45" stroke="#cbd5e1" strokeWidth="1.2" />
            <line x1="73" y1="49" x2="64" y2="48" stroke="#cbd5e1" strokeWidth="1.2" />
            {/* Flower Crown */}
            <circle cx="40" cy="24" r="3.5" fill="#f472b6" />
            <circle cx="50" cy="22" r="4" fill="#fbbf24" />
            <circle cx="60" cy="24" r="3.5" fill="#c084fc" />
            {/* Swishing Tail */}
            <motion.path
              d="M74,70 Q88,60 84,48"
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
              animate={isHovered ? { rotate: [0, 25, -15, 0] } : { rotate: [0, 6, 0] }}
              transition={{ duration: isHovered ? 0.6 : 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        )}

        {colorTheme === 'ginger' && (
          /* Mochi - Ginger Tabby with Birthday Party Hat */
          <svg width="86" height="86" viewBox="0 0 100 100" className="drop-shadow-md">
            {/* Body */}
            <ellipse cx="50" cy="68" rx="26" ry="22" fill="#fb923c" />
            <ellipse cx="50" cy="70" rx="18" ry="14" fill="#ffedd5" />
            {/* Head */}
            <circle cx="50" cy="42" r="22" fill="#fb923c" />
            {/* Tabby Stripes */}
            <path d="M46,26 L50,33 L54,26" fill="none" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" />
            {/* Ears */}
            <motion.polygon
              points="32,28 42,16 46,30"
              fill="#fb923c"
              animate={isHovered ? { rotate: [-4, 4, -4] } : {}}
              transition={{ duration: 0.25, repeat: Infinity }}
            />
            <polygon points="34,26 40,19 44,28" fill="#fed7aa" />
            <motion.polygon
              points="68,28 58,16 54,30"
              fill="#fb923c"
              animate={isHovered ? { rotate: [4, -4, 4] } : {}}
              transition={{ duration: 0.25, repeat: Infinity }}
            />
            <polygon points="66,26 60,19 56,28" fill="#fed7aa" />
            {/* Party Hat */}
            <polygon points="50,6 42,24 58,24" fill="#f43f5e" />
            <circle cx="50" cy="5" r="3" fill="#fbbf24" />
            <circle cx="46" cy="18" r="1.5" fill="#ffffff" />
            <circle cx="52" cy="14" r="1.5" fill="#38bdf8" />
            {/* Purring Eyes */}
            {isHovered ? (
              <>
                <path d="M37,42 Q42,36 47,42" fill="none" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
                <path d="M53,42 Q58,36 63,42" fill="none" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="42" cy="41" r="3.2" fill="#1e293b" />
                <circle cx="43" cy="40" r="1.2" fill="#ffffff" />
                <circle cx="58" cy="41" r="3.2" fill="#1e293b" />
                <circle cx="59" cy="40" r="1.2" fill="#ffffff" />
              </>
            )}
            {/* Nose & Mouth */}
            <polygon points="50,47 48,45 52,45" fill="#ea580c" />
            <path d="M47,49 Q50,52 50,47 Q50,52 53,49" fill="none" stroke="#431407" strokeWidth="1.5" />
            {/* Rosy Cheeks */}
            <circle cx="36" cy="46" r="3.5" fill="#fda4af" opacity="0.75" />
            <circle cx="64" cy="46" r="3.5" fill="#fda4af" opacity="0.75" />
            {/* Paws */}
            <circle cx="40" cy="84" r="5" fill="#ffedd5" />
            <circle cx="60" cy="84" r="5" fill="#ffedd5" />
          </svg>
        )}

        {colorTheme === 'cloud' && (
          /* Boba - Drifting Kitten on a Dreamy Cloud */
          <svg width="82" height="82" viewBox="0 0 100 100" className="drop-shadow-md">
            {/* Soft Fluffy Cloud Base */}
            <path
              d="M20,70 Q10,70 15,60 Q12,50 25,48 Q30,35 48,36 Q62,32 72,44 Q85,42 85,55 Q92,65 80,72 Z"
              fill="#ffffff"
              opacity="0.95"
              stroke="#e2e8f0"
              strokeWidth="1.5"
            />
            {/* Chibi Gray Cat inside Cloud */}
            <circle cx="50" cy="40" r="18" fill="#94a3b8" />
            <polygon points="36,30 42,18 46,28" fill="#94a3b8" />
            <polygon points="64,30 58,18 54,28" fill="#94a3b8" />
            {isHovered ? (
              <>
                <path d="M40,38 Q44,34 48,38" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M52,38 Q56,34 60,38" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="44" cy="38" r="2.8" fill="#0f172a" />
                <circle cx="56" cy="38" r="2.8" fill="#0f172a" />
              </>
            )}
            <polygon points="50,43 48,41 52,41" fill="#f472b6" />
            <path d="M47,45 Q50,47 53,45" fill="none" stroke="#0f172a" strokeWidth="1.2" />
            {/* Tiny Heart Balloon */}
            <path
              d="M72,20 C72,12 60,12 60,20 C60,26 72,32 72,32 C72,32 84,26 84,20 C84,12 72,12 72,20 Z"
              fill="#fb7185"
            />
            <path d="M72,32 L68,48" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
          </svg>
        )}

        {colorTheme === 'tuxedo' && (
          /* Tuxedo Cat with Red Bowtie */
          <svg width="84" height="84" viewBox="0 0 100 100" className="drop-shadow-md">
            {/* Body */}
            <ellipse cx="50" cy="68" rx="26" ry="22" fill="#1e293b" />
            {/* White Tuxedo Chest */}
            <polygon points="50,56 40,78 60,78" fill="#ffffff" />
            {/* Head */}
            <circle cx="50" cy="42" r="22" fill="#1e293b" />
            <polygon points="50,48 45,36 55,36" fill="#ffffff" />
            {/* Ears */}
            <polygon points="32,28 42,16 46,30" fill="#1e293b" />
            <polygon points="68,28 58,16 54,30" fill="#1e293b" />
            {/* Red Bowtie */}
            <polygon points="44,56 50,60 44,64" fill="#e11d48" />
            <polygon points="56,56 50,60 56,64" fill="#e11d48" />
            <circle cx="50" cy="60" r="2" fill="#be123c" />
            {/* Purring Eyes */}
            {isHovered ? (
              <>
                <path d="M37,42 Q42,36 47,42" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
                <path d="M53,42 Q58,36 63,42" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="42" cy="41" r="3.2" fill="#facc15" />
                <circle cx="42" cy="41" r="1.5" fill="#0f172a" />
                <circle cx="58" cy="41" r="3.2" fill="#facc15" />
                <circle cx="58" cy="41" r="1.5" fill="#0f172a" />
              </>
            )}
          </svg>
        )}
      </motion.div>
    </div>
  );
};

export const CuteCatFleet: React.FC = () => {
  return (
    <>
      {/* 1. Luna: Snow White Princess Cat on Bottom-Left */}
      <InteractiveCat
        name="Luna"
        phrase="Happy Birthday! 💕"
        positionClass="bottom-4 left-4 sm:bottom-6 sm:left-8"
        colorTheme="white"
      />

      {/* 2. Mochi: Ginger Party Tabby on Bottom-Right */}
      <InteractiveCat
        name="Mochi"
        phrase="Party time! 🎂"
        positionClass="bottom-4 right-4 sm:bottom-6 sm:right-8"
        colorTheme="ginger"
      />

      {/* 3. Boba: Floating Dream Cloud Cat on Top-Right */}
      <InteractiveCat
        name="Boba"
        phrase="Floating with love! ✨"
        positionClass="top-24 right-4 sm:top-28 sm:right-10 hidden md:block"
        colorTheme="cloud"
      />

      {/* 4. Pip: Curious Tuxedo Cat Peeking on Left Edge */}
      <InteractiveCat
        name="Pip"
        phrase="You're the best! 🐾"
        positionClass="top-1/2 -translate-y-1/2 left-2 sm:left-4 hidden lg:block"
        colorTheme="tuxedo"
      />
    </>
  );
};
