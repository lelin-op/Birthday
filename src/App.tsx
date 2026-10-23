import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CountdownTimer } from './components/CountdownTimer';
import { useCountdown } from './hooks/useCountdown';
import { BirthdayCake } from './components/Celebration/BirthdayCake';
import { useBlowDetection } from './hooks/useBlowDetection';
import { Envelope } from './components/Letter/Envelope';
import { LetterEditorDrawer } from './components/Letter/LetterEditorDrawer';
import { FairyLights, CuteCat, Butterfly } from './components/VisualAssets';
import { PetalCanvas } from './components/PetalCanvas';
import confetti from 'canvas-confetti';

type AppState = 'COUNTDOWN' | 'CAKE_BLOW' | 'CANDLES_BLOWN' | 'LETTER_SHOW';

const DEFAULT_CONFIG = {
  recipientName: "My Dearest Wife",
  senderName: "Your Loving Husband",
  letterBody: "Happy Birthday to the most amazing woman in my life. You make every day brighter..."
};

export default function App() {
  const [appState, setAppState] = useState<AppState>('COUNTDOWN');
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const timeLeft = useCountdown('2026-10-26T00:00:00');

  const { permissionError } = useBlowDetection(() => {
    if (appState === 'CAKE_BLOW') {
      setAppState('CANDLES_BLOWN');
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, appState === 'CAKE_BLOW');

  return (
    <div className="min-h-screen bg-blush-50 relative flex flex-col items-center justify-center p-4">
      <PetalCanvas />
      <FairyLights />

      <div className="absolute top-20 left-10"><CuteCat pose="sitting" /></div>
      <div className="absolute bottom-20 right-10"><CuteCat pose="sleeping" /></div>
      {Array.from({ length: 5 }).map((_, i) => <Butterfly key={i} delay={i * 3} />)}

      <AnimatePresence mode="wait">
        {appState === 'COUNTDOWN' && (
          <motion.div key="countdown" className="text-center z-20">
            <h1 className="text-5xl font-script text-blush-600 mb-8">Birthday Countdown</h1>
            <CountdownTimer timeLeft={timeLeft} />
            <button
              onClick={() => setAppState('CAKE_BLOW')}
              className="mt-10 px-6 py-2 bg-pink-400 text-white rounded-full font-sans"
            >
              Test Preview
            </button>
          </motion.div>
        )}

        {appState === 'CAKE_BLOW' && (
          <motion.div key="cake" className="z-20">
            <BirthdayCake isBlown={false} onBlow={() => setAppState('CANDLES_BLOWN')} />
          </motion.div>
        )}

        {appState === 'CANDLES_BLOWN' && (
          <motion.div key="envelope" className="z-20">
            <Envelope isOpen={false} onOpen={() => setAppState('LETTER_SHOW')} />
          </motion.div>
        )}

        {appState === 'LETTER_SHOW' && (
          <motion.div key="letter" className="z-20 p-8 glass-card max-w-lg rounded-xl">
             <h2 className="text-3xl font-script text-pink-700">{config.recipientName}</h2>
             <p className="mt-4 text-lg font-sans leading-relaxed">{config.letterBody}</p>
             <button onClick={() => setDrawerOpen(true)} className="mt-6 text-sm text-pink-500 underline">Customize</button>
          </motion.div>
        )}
      </AnimatePresence>

      <LetterEditorDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={(c) => { setConfig(c); setDrawerOpen(false); }}
        config={config}
      />
    </div>
  );
}
