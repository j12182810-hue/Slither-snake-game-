import React, { useState } from 'react';
import { GameSettings, saveStoredSettings } from '../utils/storage';
import { soundManager } from '../utils/audio';
import { X, Volume2, Smartphone, Grid, Sparkles, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  isMuted,
  onToggleSound,
}) => {
  const [volume, setVolume] = useState(soundManager.getVolume());
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleToggleGrid = () => {
    const updated = { ...settings, showGridLines: !settings.showGridLines };
    saveStoredSettings(updated);
    onUpdateSettings(updated);
  };

  const handleToggleVibration = () => {
    const updated = { ...settings, vibrationEnabled: !settings.vibrationEnabled };
    saveStoredSettings(updated);
    onUpdateSettings(updated);
  };

  const handleToggleDpad = () => {
    const updated = { ...settings, dpadEnabled: !settings.dpadEnabled };
    saveStoredSettings(updated);
    onUpdateSettings(updated);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundManager.setVolume(val);
  };

  const handleClearData = () => {
    try {
      localStorage.removeItem('snake_player_stats_v1');
      localStorage.removeItem('snake_achievements_v1');
      window.location.reload();
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Game Settings</h3>
            <p className="text-xs text-slate-400 mt-0.5">Customize audio, graphics, and mobile input controls</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings List */}
        <div className="my-5 flex flex-col gap-4">
          {/* Audio Volume Slider */}
          <div className="flex flex-col gap-2 p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" /> Sound Volume
              </span>
              <button
                onClick={onToggleSound}
                className="text-xs text-slate-400 hover:text-emerald-400 font-medium cursor-pointer"
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              disabled={isMuted}
              className="w-full accent-emerald-400 cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Grid lines toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-2.5">
              <Grid className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-sm font-semibold text-slate-200 block">Arena Grid Lines</span>
                <span className="text-xs text-slate-400">Display subtle tile grid coordinates</span>
              </div>
            </div>
            <button
              onClick={handleToggleGrid}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.showGridLines ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.showGridLines ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Mobile D-Pad toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-sm font-semibold text-slate-200 block">Mobile D-Pad Overlay</span>
                <span className="text-xs text-slate-400">Show on-screen touch arrows for mobile</span>
              </div>
            </div>
            <button
              onClick={handleToggleDpad}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.dpadEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.dpadEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Haptic Vibration toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-sm font-semibold text-slate-200 block">Haptic Feedback</span>
                <span className="text-xs text-slate-400">Subtle vibration pulse on turns and bites</span>
              </div>
            </div>
            <button
              onClick={handleToggleVibration}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.vibrationEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  settings.vibrationEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Clear High Scores & Stats */}
          <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-rose-300 block">Reset Progress</span>
              <span className="text-xs text-slate-400">Clear all local high scores & career stats</span>
            </div>
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearData}
                  className="px-2.5 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="p-2 text-rose-400 hover:bg-rose-950/50 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Done Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
