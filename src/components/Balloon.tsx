import React, { useId } from 'react';
import { motion } from 'framer-motion';

export interface BalloonProps {
  /** Left position as a percentage string e.g. "15%" */
  left?: string;
  /** Color palette / theme for the balloon */
  color?: 'pink' | 'purple' | 'rose' | 'gold' | 'lavender' | 'blue' | 'magenta';
  /** Duration in seconds to reach top of screen */
  speed?: number;
  /** Initial delay before floating up in seconds */
  delay?: number;
  /** Scale factor (default ~0.8 to 1.3) */
  scale?: number;
  /** Maximum opacity for depth effect (e.g. 0.35 to 0.85) */
  opacity?: number;
  /** Balloon shape: round or romantic heart */
  shape?: 'round' | 'heart';
  /** Custom z-index layer */
  zIndex?: number;
}

// Color gradients for different balloon themes
const BALLOON_PALETTES = {
  pink: {
    gradientStart: '#ec4899',
    gradientEnd: '#be185d',
    highlight: '#fbcfe8',
    string: 'rgba(236, 72, 153, 0.4)',
    shadow: 'rgba(236, 72, 153, 0.3)',
  },
  purple: {
    gradientStart: '#c084fc',
    gradientEnd: '#7e22ce',
    highlight: '#f3e8ff',
    string: 'rgba(192, 132, 252, 0.4)',
    shadow: 'rgba(168, 85, 247, 0.3)',
  },
  rose: {
    gradientStart: '#fb7185',
    gradientEnd: '#e11d48',
    highlight: '#ffe4e6',
    string: 'rgba(251, 113, 133, 0.4)',
    shadow: 'rgba(244, 63, 94, 0.3)',
  },
  gold: {
    gradientStart: '#fde047',
    gradientEnd: '#d97706',
    highlight: '#fef9c3',
    string: 'rgba(251, 191, 36, 0.4)',
    shadow: 'rgba(245, 158, 11, 0.3)',
  },
  lavender: {
    gradientStart: '#e879f9',
    gradientEnd: '#a21caf',
    highlight: '#fae8ff',
    string: 'rgba(232, 121, 249, 0.4)',
    shadow: 'rgba(217, 70, 239, 0.3)',
  },
  blue: {
    gradientStart: '#38bdf8',
    gradientEnd: '#0284c7',
    highlight: '#e0f2fe',
    string: 'rgba(56, 189, 248, 0.4)',
    shadow: 'rgba(14, 165, 233, 0.3)',
  },
  magenta: {
    gradientStart: '#f43f5e',
    gradientEnd: '#881337',
    highlight: '#ffe4e6',
    string: 'rgba(244, 63, 94, 0.4)',
    shadow: 'rgba(225, 29, 72, 0.3)',
  },
};

export const Balloon: React.FC<BalloonProps> = ({
  left = '50%',
  color = 'pink',
  speed = 18,
  delay = 0,
  scale = 1,
  opacity = 0.7,
  shape = 'round',
  zIndex = 10,
}) => {
  const palette = BALLOON_PALETTES[color] || BALLOON_PALETTES.pink;
  const rawId = useId();
  const gradientId = `balloon-grad-${color}-${rawId.replace(/:/g, '')}`;
  const swayOffset = Math.round(((delay * 31 + speed * 17) % 30) + 20);

  return (
    <motion.div
      className="fixed pointer-events-auto cursor-pointer"
      style={{
        left,
        zIndex,
        bottom: '-180px',
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: [0, -1350],
        x: [0, swayOffset, -swayOffset, swayOffset / 2, 0],
        rotate: [-4, 6, -5, 4, -4],
        opacity: [0, opacity, opacity, opacity, 0],
      }}
      transition={{
        y: { duration: speed, repeat: Infinity, delay, ease: 'linear' },
        x: { duration: speed / 2, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        opacity: {
          duration: speed,
          repeat: Infinity,
          delay,
          times: [0, 0.08, 0.85, 0.95, 1],
        },
      }}
      whileHover={{ scale: scale * 1.15, rotate: 10 }}
      whileTap={{ scale: scale * 0.9 }}
    >
      <div
        style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}
        className="relative group"
      >
        <svg
          width="90"
          height="160"
          viewBox="0 0 90 160"
          className="filter drop-shadow-md transition-filter duration-300 group-hover:drop-shadow-[0_10px_20px_rgba(244,63,94,0.4)]"
        >
          <defs>
            <radialGradient id={gradientId} cx="35%" cy="30%" r="65%">
              <stop offset="0%" stopColor={palette.highlight} />
              <stop offset="30%" stopColor={palette.gradientStart} />
              <stop offset="100%" stopColor={palette.gradientEnd} />
            </radialGradient>
          </defs>

          {/* Balloon Body */}
          {shape === 'heart' ? (
            <path
              d="M45,75 C20,40 5,20 20,8 C35,-4 45,15 45,15 C45,15 55,-4 70,8 C85,20 70,40 45,75 Z"
              fill={`url(#${gradientId})`}
            />
          ) : (
            <path
              d="M45,5 C20,5 5,25 5,50 C5,75 25,88 45,88 C65,88 85,75 85,50 C85,25 70,5 45,5 Z"
              fill={`url(#${gradientId})`}
            />
          )}

          {/* 3D Curved Light Reflection Specular Highlight */}
          <ellipse cx="32" cy="28" rx="10" ry="16" fill="white" opacity="0.45" transform="rotate(-20 32 28)" />
          <circle cx="25" cy="18" r="3" fill="white" opacity="0.6" />

          {/* Balloon Knot */}
          <polygon points="41,88 49,88 45,95" fill={palette.gradientEnd} />

          {/* Hanging Ribbon String */}
          <motion.path
            d="M45,95 Q38,115 52,130 T42,160"
            fill="none"
            stroke={palette.string}
            strokeWidth="1.8"
            strokeLinecap="round"
            animate={{
              d: [
                'M45,95 Q38,115 52,130 T42,160',
                'M45,95 Q52,115 38,130 T48,160',
                'M45,95 Q38,115 52,130 T42,160',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </motion.div>
  );
};

const BALLOONS_CONFIG: BalloonProps[] = [
  { left: '6%', color: 'pink', speed: 22, delay: 0, scale: 0.8, opacity: 0.55, shape: 'round', zIndex: 5 },
  { left: '18%', color: 'purple', speed: 17, delay: 4, scale: 1.1, opacity: 0.75, shape: 'heart', zIndex: 12 },
  { left: '32%', color: 'gold', speed: 25, delay: 1, scale: 0.7, opacity: 0.45, shape: 'round', zIndex: 4 },
  { left: '48%', color: 'rose', speed: 19, delay: 7, scale: 0.95, opacity: 0.7, shape: 'heart', zIndex: 11 },
  { left: '62%', color: 'lavender', speed: 21, delay: 2, scale: 0.85, opacity: 0.6, shape: 'round', zIndex: 6 },
  { left: '76%', color: 'blue', speed: 16, delay: 5, scale: 1.05, opacity: 0.8, shape: 'round', zIndex: 13 },
  { left: '88%', color: 'magenta', speed: 23, delay: 9, scale: 0.75, opacity: 0.5, shape: 'heart', zIndex: 5 },
  { left: '25%', color: 'pink', speed: 20, delay: 11, scale: 0.9, opacity: 0.65, shape: 'round', zIndex: 8 },
  { left: '70%', color: 'gold', speed: 18, delay: 13, scale: 1.0, opacity: 0.7, shape: 'heart', zIndex: 10 },
];

export const FloatingBalloons: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {BALLOONS_CONFIG.map((config, index) => (
        <Balloon key={index} {...config} />
      ))}
    </div>
  );
};
