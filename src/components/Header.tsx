import React from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';

interface HeaderProps {
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenSkins: () => void;
  onOpenAchievements: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  isPlaying: boolean;
  onStartOrRestart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleSound,
  onOpenSkins,
  onOpenAchievements,
  onOpenRules,
  onOpenSettings,
  isPlaying,
  onStartOrRestart,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
            Viper<span className="text-emerald-400">Strike</span>
          </span>
        </div>

        {/* Zone 2: Clean single-line navigation actions */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={onOpenSkins}
            className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Skins
          </button>
          <button
            onClick={onOpenAchievements}
            className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Trophies
          </button>
          <button
            onClick={onOpenRules}
            className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Power-Ups & Rules
          </button>
          <button
            onClick={onOpenSettings}
            className="hover:text-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Settings
          </button>
        </nav>

        {/* Zone 3: Primary action + quick sound toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSound}
            aria-label={isMuted ? 'Unmute game audio' : 'Mute game audio'}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-md transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onStartOrRestart}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-500/20 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isPlaying ? 'Restart Game' : 'Start Play'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
