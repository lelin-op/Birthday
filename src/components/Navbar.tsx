import React from 'react';
import type { AppState } from '../types';

interface NavbarProps {
  currentStage: AppState;
  onSelectStage: (stage: AppState) => void;
  isAdminOpen: boolean;
  onToggleAdmin: () => void;
  recipientName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onSelectStage,
  isAdminOpen,
  onToggleAdmin,
  recipientName,
}) => {
  const navItems: { id: AppState; label: string }[] = [
    { id: 'COUNTDOWN', label: 'Countdown' },
    { id: 'CAKE_BLOW', label: 'Birthday Cake' },
    { id: 'CANDLES_BLOWN', label: 'Envelope' },
    { id: 'LETTER_SHOW', label: 'Love Letter' },
  ];

  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4 z-40 relative">
      {/* Zone 1: Single text wordmark */}
      <div
        onClick={() => {
          if (isAdminOpen) onToggleAdmin();
          onSelectStage('COUNTDOWN');
        }}
        className="cursor-pointer flex items-center gap-2 shrink-0 select-none"
      >
        <span className="font-script text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
          For {recipientName || 'You'} 💕
        </span>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
        {navItems.map((item) => {
          const isActive = !isAdminOpen && currentStage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (isAdminOpen) onToggleAdmin();
                onSelectStage(item.id);
              }}
              className={`whitespace-nowrap transition-colors cursor-pointer pb-0.5 ${
                isActive
                  ? 'text-rose-600 font-semibold border-b-2 border-rose-500'
                  : 'hover:text-rose-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleAdmin}
          className={`px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
            isAdminOpen
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
              : 'bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 backdrop-blur-md shadow-xs'
          }`}
        >
          <span>{isAdminOpen ? '✕' : '⚙️'}</span>
          <span>{isAdminOpen ? 'Back to Celebration' : 'Customize / Admin'}</span>
        </button>
      </div>
    </header>
  );
};
