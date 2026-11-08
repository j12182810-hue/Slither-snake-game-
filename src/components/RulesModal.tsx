import React from 'react';
import { POWER_UP_CONFIG } from '../constants/gameConfig';
import { PowerUpType } from '../types/game';
import { X, Sparkles, Keyboard, Trophy, Flame } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const powerUpTypes: PowerUpType[] = ['golden', 'slow', 'ghost', 'magnet', 'shrink'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Game Guide & Power-Ups</h3>
            <p className="text-xs text-slate-400 mt-0.5">Learn how to maximize your score and survive longer</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Section */}
        <div className="my-5">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5 mb-3">
            <Keyboard className="w-4 h-4 text-emerald-400" /> Controls & Inputs
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
              <span className="text-slate-300">Steer Viper</span>
              <div className="flex items-center gap-1 font-mono">
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200">WASD</kbd>
                <span className="text-slate-500">or</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-200">Arrows</kbd>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
              <span className="text-slate-300">Pause / Resume</span>
              <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-200">Space / P</kbd>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
              <span className="text-slate-300">Quick Restart</span>
              <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-200">R</kbd>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
              <span className="text-slate-300">Mobile Swipes</span>
              <span className="text-slate-400">Swipe screen or use D-Pad</span>
            </div>
          </div>
        </div>

        {/* Combo Multiplier System */}
        <div className="mb-5 p-4 bg-slate-950/40 border border-slate-800 rounded-xl">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5 mb-1.5">
            <Flame className="w-4 h-4 text-amber-400" /> Combo Frenzy System
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            Eat another apple within 3.5 seconds to increase your combo multiplier up to <strong>8x</strong>! Each consecutive bite during frenzy gives exponentially higher points.
          </p>
        </div>

        {/* Power-Ups Guide */}
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5 mb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Rare Power-Up Orbs
          </span>

          <div className="flex flex-col gap-2.5">
            {powerUpTypes.map((type) => {
              const item = POWER_UP_CONFIG[type];
              return (
                <div
                  key={type}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 flex items-center gap-3.5"
                >
                  <div
                    className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 12px ${item.glow}`,
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{item.name}</span>
                      <span className="text-xs font-mono tabular-nums text-slate-400">
                        {item.duration > 0 ? `${item.duration}s duration` : 'Instant Effect'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
