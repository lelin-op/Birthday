import React, { useState } from 'react';
import type { AppConfig, AppState, AppTheme } from '../../types';
import { DEFAULT_CONFIG } from '../../types';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

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

  const handleSave = () => {
    onUpdateConfig(formData);
    try {
      localStorage.setItem('birthday_app_config', JSON.stringify(formData));
    } catch {
      // ignore storage error
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleReset = () => {
    setFormData(DEFAULT_CONFIG);
    onUpdateConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem('birthday_app_config');
    } catch {
      // ignore
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
    { id: 'roseGold', name: 'Rose Gold Romance', preview: 'from-rose-100 to-amber-50' },
    { id: 'midnightStar', name: 'Midnight Starlight', preview: 'from-slate-900 to-indigo-950' },
    { id: 'lavenderDream', name: 'Lavender Twilight', preview: 'from-purple-100 to-pink-50' },
    { id: 'candlelight', name: 'Candlelight Amber', preview: 'from-amber-100 to-orange-50' },
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
                Celebration Admin & Preview Controller
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Test all celebration stages, edit the love letter, customize memories, and configure preview states.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {saveToast ? '✓ Saved!' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              Back to Preview
            </button>
          </div>
        </div>

        {/* SECTION 1: STAGE JUMP & PREVIEW CONTROLLER */}
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

        {/* SECTION 2: LETTER CONTENT & RECIPIENT SETTINGS */}
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

        {/* SECTION 3: COUNTDOWN TARGET & THEME */}
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
                value={formData.targetDateISO.slice(0, 16)}
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
            className="text-xs text-rose-500 hover:text-rose-700 font-medium cursor-pointer"
          >
            Reset All to Defaults
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save & Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
