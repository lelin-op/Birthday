import React, { useState } from 'react';
import type { AppConfig, AppState, AppTheme, CakeStyle, MusicTrack } from '../../types';
import { DEFAULT_CONFIG } from '../../types';
import { sounds } from '../../utils/soundEffects';
import { bgMusic } from '../../utils/backgroundMusic';
import confetti from 'canvas-confetti';
import { db, handleFirestoreError, OperationType } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AdminPanelProps {
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  currentState: AppState;
  onSetState: (state: AppState) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  config,
  onUpdateConfig,
  currentState,
  onSetState,
  onClose,
}) => {
  const [formData, setFormData] = useState<AppConfig>({ ...config });
  const [newMemory, setNewMemory] = useState('');
  const [saveToast, setSaveToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPlayingMusicPreview, setIsPlayingMusicPreview] = useState(bgMusic.getIsPlaying());

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: AppConfig & { updatedAt: string } = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'settings', 'app_config'), payload, { merge: true });
      onUpdateConfig(payload);

      // Sync background music state
      if (payload.musicEnabled) {
        bgMusic.setTrack(payload.musicTrack);
        bgMusic.setVolume(payload.musicVolume);
      } else {
        bgMusic.stop();
        setIsPlayingMusicPreview(false);
      }

      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2500);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/app_config');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'app_config'), DEFAULT_CONFIG);
      setFormData(DEFAULT_CONFIG);
      onUpdateConfig(DEFAULT_CONFIG);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/app_config');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleMusicPreview = () => {
    if (isPlayingMusicPreview) {
      bgMusic.stop();
      setIsPlayingMusicPreview(false);
    } else {
      bgMusic.start(formData.musicTrack, formData.musicVolume);
      setIsPlayingMusicPreview(true);
    }
  };

  const handleAddMemory = () => {
    if (!newMemory.trim()) return;
    setFormData({
      ...formData,
      memories: [...formData.memories, newMemory.trim()],
    });
    setNewMemory('');
  };

  const handleRemoveMemory = (index: number) => {
    setFormData({
      ...formData,
      memories: formData.memories.filter((_, i) => i !== index),
    });
  };

  const testConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f59e0b', '#8b5cf6'],
    });
    sounds.playFanfare();
  };

  const stages: { id: AppState; label: string; icon: string; desc: string }[] = [
    {
      id: 'COUNTDOWN',
      label: 'Stage 1: Countdown',
      icon: '⏳',
      desc: 'Anticipation countdown timer to birthday',
    },
    {
      id: 'CAKE_BLOW',
      label: 'Stage 2: Cake & Candles',
      icon: '🎂',
      desc: 'Interactive 3D cake with glowing candles',
    },
    {
      id: 'CANDLES_BLOWN',
      label: 'Stage 3: Wax Sealed Envelope',
      icon: '💌',
      desc: 'Candles extinguished, wax seal envelope arrives',
    },
    {
      id: 'LETTER_SHOW',
      label: 'Stage 4: Love Letter & Keepsake',
      icon: '📜',
      desc: 'Full love letter, photo polaroid, and memories',
    },
  ];

  const themes: { id: AppTheme; name: string; preview: string }[] = [
    { id: 'blackPurplePink', name: 'Black, Purple & Pink (Neon)', preview: 'from-purple-900 via-pink-600 to-black' },
    { id: 'roseGold', name: 'Rose Gold Romance', preview: 'from-rose-100 to-amber-50' },
    { id: 'midnightStar', name: 'Midnight Starlight', preview: 'from-slate-900 to-indigo-950' },
    { id: 'lavenderDream', name: 'Lavender Twilight', preview: 'from-purple-100 to-pink-50' },
    { id: 'candlelight', name: 'Candlelight Amber', preview: 'from-amber-100 to-orange-50' },
  ];

  const cakeStyles: { id: CakeStyle; name: string; desc: string }[] = [
    { id: 'butterflyPink', name: '🌸 Butterfly Pink (1-Tier)', desc: 'Single-tier soft pink cake with butterflies & white pearls' },
    { id: 'royalPurpleTwoTier', name: '💜 Royal Purple (2-Tier)', desc: 'Two-tier purple velvet cake with rosette borders' },
    { id: 'grandThreeTier', name: '👑 Grand Celebration (3-Tier)', desc: 'Three-tier luxury cake with cascading glaze' },
  ];

  const musicTracks: { id: MusicTrack; name: string; desc: string }[] = [
    { id: 'lofiBirthday', name: '🎵 Romantic Lo-Fi Birthday', desc: 'Chill lo-fi chord progressions (Cmaj7-Am7-Fmaj7-G7)' },
    { id: 'romanticPiano', name: '🎹 Acoustic Piano Serenade', desc: 'Warm acoustic piano arpeggios (Dmaj7-Bm7-Gmaj7-A7)' },
    { id: 'acousticAura', name: '✨ Soft Dreamscape Aura', desc: 'Ethereal ambient pads and soft bells (Gmaj7-Em7-Cmaj7)' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Celebration Admin & Background Music Controller
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Configure romantic background lo-fi playlists, cake styles, love letter content, and real-time cloud sync.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              {isSaving ? 'Saving to Cloud...' : saveToast ? '✓ Saved & Synced!' : 'Save & Sync Cloud'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Back to Preview
            </button>
          </div>
        </div>

        {/* SECTION 1: BACKGROUND MUSIC CONTROLLER */}
        <div className="bg-gradient-to-r from-rose-50 via-purple-50 to-pink-50 rounded-xl border border-rose-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎶</span>
                <h2 className="text-base font-bold text-slate-900">
                  Background Music & Romantic Lo-Fi Playlist
                </h2>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Automatically starts playing soft romantic lo-fi birthday melody when visitors open or touch the app.
              </p>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-rose-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-700">
                {formData.musicEnabled ? 'Music Enabled' : 'Music Muted'}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, musicEnabled: !formData.musicEnabled })
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.musicEnabled ? 'bg-rose-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.musicEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {formData.musicEnabled && (
            <div className="space-y-4 pt-2 border-t border-rose-200/60">
              {/* Track Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-2">
                  Select Melody Playlist Track
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {musicTracks.map((tr) => {
                    const isSelected = formData.musicTrack === tr.id;
                    return (
                      <button
                        key={tr.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, musicTrack: tr.id });
                          bgMusic.setTrack(tr.id);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-rose-500 bg-white shadow-sm ring-2 ring-rose-500/20'
                            : 'border-slate-200 bg-white/60 hover:bg-white'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-800">{tr.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{tr.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Volume Slider & Test Play Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 p-3.5 rounded-xl border border-rose-200/80">
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-1">
                    <span>Playlist Volume</span>
                    <span className="text-rose-600 font-bold">{Math.round(formData.musicVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={formData.musicVolume}
                    onChange={(e) => {
                      const vol = parseFloat(e.target.value);
                      setFormData({ ...formData, musicVolume: vol });
                      bgMusic.setVolume(vol);
                    }}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={toggleMusicPreview}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer self-start sm:self-center"
                >
                  <span>{isPlayingMusicPreview ? '⏸ Pause Preview' : '▶ Play Test Loop'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: STAGE JUMP & PREVIEW CONTROLLER */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            Live Stage Navigator
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Instantly switch the app into any stage to test how it looks and behaves.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stages.map((st) => {
              const isActive = currentState === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    onSetState(st.id);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xl mb-1.5">{st.icon}</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {st.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{st.desc}</div>
                  {isActive && (
                    <span className="inline-block mt-2 text-[10px] uppercase font-bold tracking-wider text-rose-600">
                      Currently Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Test Effects Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Sound & FX Testing:
            </span>
            <button
              onClick={testConfetti}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
            >
              🎉 Test Confetti
            </button>
            <button
              onClick={() => sounds.playBlowing()}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
            >
              🌬️ Test Candle Blow Sound
            </button>
            <button
              onClick={() => sounds.playChime()}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
            >
              🔔 Test Crystal Chime
            </button>
          </div>
        </div>

        {/* SECTION 3: CAKE DESIGN SELECTOR */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-900">
            Cake Architecture Design
          </h2>
          <p className="text-xs text-slate-500">
            Choose between single-tier, two-tier, or three-tier vector cakes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {cakeStyles.map((c) => {
              const isSelected = formData.cakeStyle === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setFormData({ ...formData, cakeStyle: c.id })}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/70 ring-2 ring-rose-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-sm font-semibold text-slate-800">{c.name}</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">{c.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 4: LETTER CONTENT & RECIPIENT SETTINGS */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h2 className="text-base font-semibold text-slate-900">
            Letter & Personalization Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Recipient Name / Salutation
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) =>
                  setFormData({ ...formData, recipientName: e.target.value })
                }
                placeholder="e.g. My Dearest Wife, Sweetheart..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Sender Name / Signature
              </label>
              <input
                type="text"
                value={formData.senderName}
                onChange={(e) =>
                  setFormData({ ...formData, senderName: e.target.value })
                }
                placeholder="e.g. Your Loving Husband, Lelin..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Letter Title / Subtitle
            </label>
            <input
              type="text"
              value={formData.letterTitle}
              onChange={(e) =>
                setFormData({ ...formData, letterTitle: e.target.value })
              }
              placeholder="e.g. A Love Letter For Your Special Day"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Love Letter Body (Heartfelt Message)
            </label>
            <textarea
              rows={4}
              value={formData.letterBody}
              onChange={(e) =>
                setFormData({ ...formData, letterBody: e.target.value })
              }
              placeholder="Write your romantic birthday message..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 leading-relaxed"
            />
          </div>

          {/* Cherished Memories Editor */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Cherished Memories & Highlights
            </label>
            <div className="space-y-2 mb-3">
              {formData.memories.map((mem, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700"
                >
                  <span className="flex-1">♥ {mem}</span>
                  <button
                    onClick={() => handleRemoveMemory(idx)}
                    className="text-xs text-rose-500 hover:text-rose-700 font-medium px-2 py-1 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMemory()}
                placeholder="Add a new memory (e.g. 'That rainy walk in Paris')..."
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              <button
                type="button"
                onClick={handleAddMemory}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Add Memory
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 5: COUNTDOWN TARGET & THEME */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h2 className="text-base font-semibold text-slate-900">
            Countdown Target & Visual Theme
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Target Birthday Date & Time (ISO)
              </label>
              <input
                type="datetime-local"
                value={formData.targetDateISO ? formData.targetDateISO.slice(0, 16) : ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetDateISO: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Set to a past time to test automatic trigger into celebration!
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Polaroid Photo Caption
              </label>
              <input
                type="text"
                value={formData.photoCaption}
                onChange={(e) =>
                  setFormData({ ...formData, photoCaption: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          {/* Theme Palette Chooser */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Atmospheric Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {themes.map((th) => {
                const isSelected = formData.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => setFormData({ ...formData, theme: th.id })}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-full h-8 rounded-md bg-gradient-to-r ${th.preview} border border-slate-200 mb-2`}
                    />
                    <div className="text-xs font-semibold text-slate-800">
                      {th.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Footnotes */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={handleReset}
            disabled={isSaving}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
          >
            Reset All to Defaults
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save & Sync Cloud'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
