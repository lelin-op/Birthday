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

const checkIsAdminRoute = (): boolean => {
  if (typeof window === 'undefined') return false;
  const { pathname, hash, search } = window.location;
  const isAdmin = (
    pathname === '/admin' ||
    pathname.startsWith('/admin') ||
    hash === '#/admin' ||
    hash.startsWith('#/admin') ||
    search.includes('admin')
  );

  // Clean up legacy hash /#/admin if present
  if (isAdmin && hash.includes('admin')) {
    try {
      window.history.replaceState({}, '', '/admin');
    } catch {
      // ignore
    }
  }

  return isAdmin;
};

export default function App() {
  const [isAdminPage, setIsAdminPage] = useState<boolean>(checkIsAdminRoute);
  const [appState, setAppState] = useState<AppState>('COUNTDOWN');

  const [config, setConfig] = useState<AppConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('birthday_app_config');
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_CONFIG;
  });

  // URL Navigation helper: updates URL in address bar and component state
  const navigateTo = (path: '/admin' | '/') => {
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({}, '', path);
      } catch {
        // ignore
      }
    }
    setIsAdminPage(path === '/admin');
  };

  // Synchronize route on browser back/forward and hashchange
  useEffect(() => {
    const handleRouteChange = () => {
      setIsAdminPage(checkIsAdminRoute());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const timeLeft = useCountdown(config.targetDateISO);

  const triggerCandleExtinguished = () => {
    sounds.playBlowing();
    setTimeout(() => {
      sounds.playFanfare();
      confetti({
        particleCount: 170,
        spread: 90,
        origin: { y: 0.55 },
        colors: ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#38bdf8'],
      });
      setAppState('CANDLES_BLOWN');
    }, 400);
  };

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

  const isDark = config.theme === 'blackPurplePink' || config.theme === 'midnightStar';

  const getThemeBackground = () => {
    switch (config.theme) {
      case 'blackPurplePink':
        return 'bg-[#090514] text-white';
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

  // 1. DEDICATED /admin PAGE VIEW (Accessed via URL /admin)
  if (isAdminPage) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <AdminPanel
          config={config}
          onUpdateConfig={(newConfig) => setConfig(newConfig)}
          currentState={appState}
          onSetState={(st) => {
            setAppState(st);
            navigateTo('/');
          }}
          onClose={() => navigateTo('/')}
        />
      </div>
    );
  }

  // 2. CELEBRATION APP VIEW (/) - Completely clean without any visible admin buttons
  return (
    <div className={`min-h-screen relative overflow-x-hidden selection:bg-pink-500 selection:text-white transition-colors duration-500 ${getThemeBackground()}`}>
      {/* Ambient Radial Mesh for Black, Purple & Pink Glow */}
      {config.theme === 'blackPurplePink' && (
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-15%,rgba(168,85,247,0.28),rgba(244,63,94,0.18),rgba(9,5,20,1))]" />
      )}

      {/* Layered Magic Petals, Twinkling Stars & Hearts Canvas */}
      <PetalCanvas />
      <FairyLights />

      {/* Butterflies drifting across screen */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Butterfly key={i} delay={i * 3.5} />
      ))}

      {/* Interactive Cute Cats fleet with hover purring & love reactions */}
      <CuteCatFleet />

      {/* Navigation (Pure wordmark, no admin buttons) */}
      <Navbar
        currentStage={appState}
        onSelectStage={(stage) => setAppState(stage)}
        recipientName={config.recipientName}
        isDark={isDark}
      />

      {/* Main Experience Viewport */}
      <main className="relative z-20 max-w-5xl mx-auto px-4 py-4 sm:py-8 min-h-[calc(100vh-90px)] flex flex-col items-center justify-center">
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
              {/* Header Title */}
              <div className="mb-4 sm:mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-2 inline-block drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                  A Special Celebration For You
                </span>
                <h1 className={`text-4xl sm:text-6xl font-script font-bold tracking-wide ${isDark ? 'text-white drop-shadow-[0_0_25px_rgba(236,72,153,0.5)]' : 'text-slate-800'}`}>
                  Birthday Countdown
                </h1>
                <p className={`mt-2 text-sm sm:text-base max-w-md mx-auto ${isDark ? 'text-purple-200/80' : 'text-slate-600'}`}>
                  Counting every precious second until your special day arrives!
                </p>
              </div>

              {/* Cool 3D Neon Glass Countdown Timer */}
              <CountdownTimer timeLeft={timeLeft} />
            </motion.div>
          )}

          {/* STAGE 2: VECTOR CAKE & BLOW CANDLES */}
          {appState === 'CAKE_BLOW' && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-1 inline-block drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                  Happy Birthday, {config.recipientName}!
                </span>
                <h2 className={`text-3xl sm:text-5xl font-script font-bold ${isDark ? 'text-white drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]' : 'text-slate-800'}`}>
                  Make a Wish & Blow the Candles
                </h2>
              </div>

              <BirthdayCake
                isBlown={false}
                onBlow={triggerCandleExtinguished}
                permissionError={permissionError}
                soundEnabled={config.soundEnabled}
                recipientName={config.recipientName}
                cakeStyle={config.cakeStyle}
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
                <span className="text-xs font-bold uppercase tracking-widest text-pink-400 mb-1 inline-block drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
                  A Special Delivery
                </span>
                <h2 className={`text-3xl sm:text-5xl font-script font-bold ${isDark ? 'text-white drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]' : 'text-slate-800'}`}>
                  Your Love Letter Awaits
                </h2>
              </div>

              <Envelope
                isOpen={false}
                onOpen={handleOpenEnvelope}
                recipientName={config.recipientName}
              />
            </motion.div>
          )}

          {/* STAGE 4: LOVE LETTER & KEEPSAKE */}
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
                onOpenAdmin={() => navigateTo('/admin')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
