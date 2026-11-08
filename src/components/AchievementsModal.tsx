import React, { useEffect, useState } from 'react';
import { Achievement, PlayerStats } from '../types/game';
import { getStoredAchievements, getStoredStats } from '../utils/storage';
import { X, Trophy, Apple, Maximize2, Crown, Zap, Award, Sparkles, Ghost, Timer, Lock } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Apple: <Apple className="w-5 h-5" />,
  Maximize2: <Maximize2 className="w-5 h-5" />,
  Crown: <Crown className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  Award: <Award className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Ghost: <Ghost className="w-5 h-5" />,
  Timer: <Timer className="w-5 h-5" />,
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAchievements(getStoredAchievements());
      setStats(getStoredStats());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Trophy Vault & Career Stats</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Unlocked: {unlockedCount} / {achievements.length} achievements
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Stats Grid */}
        {stats && (
          <div className="my-5 p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-3">
              Lifetime Records
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 block">Games Played</span>
                <span className="text-lg font-bold text-white tabular-nums">{stats.gamesPlayed}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Total Apples</span>
                <span className="text-lg font-bold text-emerald-400 tabular-nums">
                  {stats.totalApplesEaten.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Max Length</span>
                <span className="text-lg font-bold text-amber-400 tabular-nums">{stats.maxLength} tiles</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Highest Combo</span>
                <span className="text-lg font-bold text-cyan-400 tabular-nums">{stats.highestCombo}x</span>
              </div>
            </div>
          </div>
        )}

        {/* Trophy Grid */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
            Badges of Honor
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((item) => {
              const icon = ICON_MAP[item.icon] || <Trophy className="w-5 h-5" />;
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                    item.unlocked
                      ? 'bg-slate-800/60 border-slate-700'
                      : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                      item.unlocked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {item.unlocked ? icon : <Lock className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold truncate ${item.unlocked ? 'text-white' : 'text-slate-400'}`}>
                        {item.title}
                      </span>
                      {item.unlocked && (
                        <span className="text-[10px] text-emerald-400 font-medium shrink-0 ml-2">Unlocked</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.description}</p>
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
