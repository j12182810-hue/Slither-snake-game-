import React from 'react';
import { Difficulty, GameMode } from '../types/game';
import { RotateCcw, Trophy, Award, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  snakeLength: number;
  combo: number;
  mode: GameMode;
  difficulty: Difficulty;
  onRestart: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  highScore,
  isNewHighScore,
  snakeLength,
  combo,
  mode,
  difficulty,
  onRestart,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          className={`absolute top-0 inset-x-0 h-1 ${
            isNewHighScore ? 'bg-amber-400 shadow-[0_0_20px_#f59e0b]' : 'bg-rose-500 shadow-[0_0_20px_#f43f5e]'
          }`}
        />

        {/* Icon & Title */}
        <div className="mb-4">
          {isNewHighScore ? (
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3 animate-bounce">
              <Trophy className="w-7 h-7" />
            </div>
          ) : (
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
              <Award className="w-7 h-7" />
            </div>
          )}

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isNewHighScore ? 'New High Score!' : 'Run Finished'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode.toUpperCase()} · {difficulty.toUpperCase()}
          </p>
        </div>

        {/* Score Display */}
        <div className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-4 my-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Final Score</span>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight tabular-nums mt-0.5">
            {score.toLocaleString()}
          </div>
          {isNewHighScore && (
            <div className="text-xs font-semibold text-amber-400 flex items-center justify-center gap-1 mt-1">
              <Sparkles className="w-3.5 h-3.5" /> Bested previous record!
            </div>
          )}
        </div>

        {/* Run Breakdown Stats */}
        <div className="grid grid-cols-2 gap-3 w-full my-4">
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-2.5 text-left">
            <span className="text-[11px] text-slate-400 block font-medium">Max Length</span>
            <span className="text-lg font-bold text-emerald-400 tabular-nums">
              {snakeLength} <span className="text-xs font-normal text-slate-500">tiles</span>
            </span>
          </div>
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-2.5 text-left">
            <span className="text-[11px] text-slate-400 block font-medium">Peak Combo</span>
            <span className="text-lg font-bold text-cyan-400 tabular-nums">
              {combo}x <span className="text-xs font-normal text-slate-500">multiplier</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2.5 mt-2">
          <button
            onClick={onRestart}
            autoFocus
            className="w-full py-3 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again (Enter)</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Adjust Options & Themes
          </button>
        </div>
      </div>
    </div>
  );
};
