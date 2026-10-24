import React from 'react';
import type { AppState } from '../types';

interface NavbarProps {
  currentStage: AppState;
  onSelectStage: (stage: AppState) => void;
  recipientName: string;
  isDark?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onSelectStage,
  recipientName,
  isDark = true,
}) => {
  const navItems: { id: AppState; label: string }[] = [
    { id: 'COUNTDOWN', label: 'Countdown' },
    { id: 'CAKE_BLOW', label: 'Birthday Cake' },
    { id: 'CANDLES_BLOWN', label: 'Envelope' },
    { id: 'LETTER_SHOW', label: 'Love Letter' },
  ];

  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4 z-40 relative">
      {/* Brand Wordmark */}
      <div
        onClick={() => onSelectStage('COUNTDOWN')}
        className="cursor-pointer flex items-center gap-2 shrink-0 select-none"
      >
        <span className="font-script text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-300 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(244,63,94,0.3)]">
          For {recipientName || 'You'} 💕
        </span>
      </div>

      {/* Clean stage links */}
      <nav className={`hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium ${isDark ? 'text-purple-200/70' : 'text-slate-600'}`}>
        {navItems.map((item) => {
          const isActive = currentStage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectStage(item.id)}
              className={`whitespace-nowrap transition-colors cursor-pointer pb-0.5 ${
                isActive
                  ? 'text-pink-400 font-semibold border-b-2 border-pink-500 shadow-[0_2px_8px_rgba(244,63,94,0.4)]'
                  : 'hover:text-pink-300'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
