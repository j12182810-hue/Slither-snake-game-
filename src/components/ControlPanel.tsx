import React from 'react';
import { Difficulty, GameMode } from '../types/game';
import { GAME_MODE_DESCRIPTIONS, MAZE_LAYOUTS } from '../constants/gameConfig';
import { Shield, Repeat, Grid, Clock } from 'lucide-react';

interface ControlPanelProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  difficulty: Difficulty;
  onSelectDifficulty: (diff: Difficulty) => void;
  mazeId: string;
  onSelectMaze: (mazeId: string) => void;
  isPlaying: boolean;
}

const MODE_ICONS: Record<GameMode, React.ReactNode> = {
  classic: <Shield className="w-3.5 h-3.5" />,
  wrap: <Repeat className="w-3.5 h-3.5" />,
  maze: <Grid className="w-3.5 h-3.5" />,
  blitz: <Clock className="w-3.5 h-3.5" />,
};

export const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  onSelectMode,
  difficulty,
  onSelectDifficulty,
  mazeId,
  onSelectMaze,
  isPlaying,
}) => {
  const modes: GameMode[] = ['classic', 'wrap', 'maze', 'blitz'];
  const difficulties: { id: Difficulty; label: string; desc: string }[] = [
    { id: 'chill', label: 'Chill', desc: '125ms' },
    { id: 'normal', label: 'Normal', desc: '88ms' },
    { id: 'hard', label: 'Hard', desc: '62ms' },
    { id: 'extreme', label: 'Insane', desc: '42ms' },
  ];

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 sm:p-5 flex flex-col gap-4">
      {/* Game Mode Segmented Buttons */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Game Mode
          </span>
          {isPlaying && (
            <span className="text-xs text-amber-400 font-medium">
              Change will apply on next run
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-slate-950/70 border border-slate-800 rounded-lg">
          {modes.map((m) => {
            const isSelected = mode === m;
            return (
              <button
                key={m}
                onClick={() => onSelectMode(m)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {MODE_ICONS[m]}
                <span>{GAME_MODE_DESCRIPTIONS[m].title}</span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-500 mt-2">
          {GAME_MODE_DESCRIPTIONS[mode].subtitle}
        </p>
      </div>

      {/* Maze Selection (only if maze mode active) */}
      {mode === 'maze' && (
        <div className="pt-2 border-t border-slate-800/60">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-2">
            Labyrinth Layout
          </span>
          <div className="flex flex-wrap gap-2">
            {MAZE_LAYOUTS.map((mz) => (
              <button
                key={mz.id}
                onClick={() => onSelectMaze(mz.id)}
                className={`py-1.5 px-3 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                  mazeId === mz.id
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {mz.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Speed / Difficulty Segmented Control */}
      <div className="pt-2 border-t border-slate-800/60">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-2">
          Speed & Challenge
        </span>

        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950/70 border border-slate-800 rounded-lg">
          {difficulties.map((d) => {
            const isSelected = difficulty === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onSelectDifficulty(d.id)}
                className={`py-2 px-2 text-xs font-semibold rounded-md transition-colors text-center whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div>{d.label}</div>
                <div className="text-[10px] font-mono text-slate-500 font-normal">{d.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
