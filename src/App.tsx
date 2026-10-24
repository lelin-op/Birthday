import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CountdownTimer } from './components/CountdownTimer';
import { useCountdown } from './hooks/useCountdown';
import { BirthdayCake } from './components/Celebration/BirthdayCake';
import { useBlowDetection } from './hooks/useBlowDetection';
import { Envelope } from './components/Letter/Envelope';
import { LetterView } from './components/Letter/LetterView';
import { FairyLights, Butterfly } from './components/VisualAssets';
import { CuteCatFleet } from './components/CuteCatFleet';
import { PetalCanvas } from './components/PetalCanvas';
import { Navbar } from './components/Navbar';
import { AdminPanel } from './components/Admin/AdminPanel';
import { sounds } from './utils/soundEffects';
import type { AppState, AppConfig } from './types';
import { DEFAULT_CONFIG } from './types';
import confetti from 'canvas-confetti';

export default function App() {
  const [appState, setAppState] = useState<AppState>('COUNTDOWN');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      return path.includes('admin') || hash.includes('admin') || search.includes('admin');
    }
    return false;
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('birthday_app_config');
        if (saved) return JSON.parse(saved);
      } catch {
        // use default
      }
    }
    return DEFAULT_CONFIG;
  });

  const toggleAdmin = (open?: boolean) => {
    const nextState = open !== undefined ? open : !isAdminOpen;
    setIsAdminOpen(nextState);
    if (typeof window !== 'undefined') {
      try {
        if (nextState) {
          window.history.pushState({}, '', '/admin');
        } else {
          window.history.pushState({}, '', '/');
        }
      } catch {
        // iframe fallback
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const isNowAdmin =
        window.location.pathname.includes('admin') ||
        window.location.hash.includes('admin') ||
        window.location.search.includes('admin');
      setIsAdminOpen(isNowAdmin);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const timeLeft = useCountdown(config.targetDateISO);

  const triggerCandleExtinguished = () => {
    sounds.playBlowing();
    setTimeout(() => {
      sounds.playFanfare();
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#f43f5e', '#ec4899', '#fbbf24', '#c084fc', '#38bdf8'],
      });
      setAppState('CANDLES_BLOWN');
    }, 400);
  };

  // Automatic transition when countdown hits zero
  useEffect(() => {
    if (
      appState === 'COUNTDOWN' &&
      timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0
    ) {
      const timer = setTimeout(() => {
        setAppState('CAKE_BLOW');
        sounds.playChime();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, appState]);

  // Microphone blow detection
  const { permissionError } = useBlowDetection(() => {
    if (appState === 'CAKE_BLOW') {
      triggerCandleExtinguished();
    }
  }, appState === 'CAKE_BLOW');

  const handleOpenEnvelope = () => {
    sounds.playEnvelopeOpen();
    setTimeout(() => {
      sounds.playChime();
      setAppState('LETTER_SHOW');
    }, 450);
  };

  const getThemeBackground = () => {
    switch (config.theme) {
      case 'midnightStar':
        return 'bg-gradient-to-b from-[#0b0f19] via-[#1e1b4b] to-[#172554] text-slate-100';
      case 'lavenderDream':
        return 'bg-gradient-to-b from-[#faf5ff] via-[#f3e8ff] to-[#fdf2f8] text-slate-800';
      case 'candlelight':
        return 'bg-gradient-to-b from-[#fefce8] via-[#fff7ed] to-[#ffe4e6] text-slate-800';
      case 'roseGold':
      default:
        return 'bg-gradient-to-b from-[#fff5f7] via-[#fff1f2] to-[#fef3c7] text-slate-800';
    }
  };

  return (
    <div className={`min-h-screen relative overflow-x-hidden selection:bg-pink-200 selection:text-pink-900 transition-colors duration-500 ${getThemeBackground()}`}>
      <PetalCanvas />
      <FairyLights />

      {/* Butterflies floating in background */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Butterfly key={i} delay={i * 3.5} />
      ))}

      {/* Interactive Cute Cats fleet with hover purring & love reactions */}
      <CuteCatFleet />

      {/* Top Bar Contract Navigation */}
      <Navbar
        currentStage={appState}
        onSelectStage={(stage) => {
          if (isAdminOpen) toggleAdmin(false);
          setAppState(stage);
        }}
        isAdminOpen={isAdminOpen}
        onToggleAdmin={() => toggleAdmin()}
        recipientName={config.recipientName}
      />

      {/* Main Content Area */}
      <main className="relative z-20 max-w-5xl mx-auto px-4 py-4 sm:py-8 min-h-[calc(100vh-90px)] flex flex-col items-center justify-center">
        {isAdminOpen ? (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full"
          >
            <AdminPanel
              config={config}
              onUpdateConfig={(newConfig) => setConfig(newConfig)}
              currentState={appState}
              onSetState={(st) => {
                setAppState(st);
                toggleAdmin(false);
              }}
              onClose={() => toggleAdmin(false)}
            />
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            {/* STAGE 1: COUNTDOWN */}
            {appState === 'COUNTDOWN' && (
              <motion.div
                key="countdown"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="text-center w-full max-w-xl mx-auto flex flex-col items-center"
              >
                {/* Romantic Title Header */}
                <div className="mb-6 sm:mb-8">
                  <span className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-2 inline-block">
                    A Celebration Made Just For You
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-script font-bold text-slate-800 tracking-wide drop-shadow-xs">
                    Counting Down to Your Day
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-md mx-auto">
                    Every second brings us closer to celebrating the most wonderful person in the world.
                  </p>
                </div>

                {/* Revamped 3D Glass Countdown Timer */}
                <CountdownTimer timeLeft={timeLeft} />

                {/* Primary Preview & Proceed Actions */}
                <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      sounds.playChime();
                      setAppState('CAKE_BLOW');
                    }}
                    className="px-8 py-3.5 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-xl shadow-rose-500/25 transition-all text-sm sm:text-base flex items-center gap-2.5 cursor-pointer border border-white/40"
                  >
                    <span>🎂</span>
                    <span>Start Birthday Celebration Now</span>
                  </motion.button>

                  <button
                    onClick={() => toggleAdmin(true)}
                    className="px-5 py-3 bg-white/80 hover:bg-white text-slate-700 text-xs font-semibold rounded-2xl border border-slate-200/90 shadow-xs transition-colors cursor-pointer"
                  >
                    ⚙️ Customize / Admin
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: 3D CAKE & BLOW CANDLES */}
            {appState === 'CAKE_BLOW' && (
              <motion.div
                key="cake"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col items-center"
              >
                <div className="text-center mb-4">
                  <span className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-1 inline-block">
                    Happy Birthday, {config.recipientName}!
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-script font-bold text-slate-800">
                    Make a Secret Birthday Wish
                  </h2>
                </div>

                <BirthdayCake
                  isBlown={false}
                  onBlow={triggerCandleExtinguished}
                  permissionError={permissionError}
                  soundEnabled={config.soundEnabled}
                />
              </motion.div>
            )}

            {/* STAGE 3: WAX SEAL ENVELOPE */}
            {appState === 'CANDLES_BLOWN' && (
              <motion.div
                key="envelope"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col items-center"
              >
                <div className="text-center mb-6">
                  <span className="text-xs font-semibold uppercase tracking-widest text-rose-500 mb-1 inline-block">
                    A Special Delivery For You
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-script font-bold text-slate-800">
                    Your Birthday Love Letter
                  </h2>
                </div>

                <Envelope
                  isOpen={false}
                  onOpen={handleOpenEnvelope}
                  recipientName={config.recipientName}
                />
              </motion.div>
            )}

            {/* STAGE 4: FULL LOVE LETTER & KEEPSAKE */}
            {appState === 'LETTER_SHOW' && (
              <motion.div
                key="letter"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <LetterView
                  config={config}
                  onReplay={() => setAppState('COUNTDOWN')}
                  onOpenAdmin={() => toggleAdmin(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
