import React from 'react';
import { ActivePowerUp, Difficulty, GameMode } from '../types/game';
import { POWER_UP_CONFIG } from '../constants/gameConfig';
import { Zap, Clock, ShieldAlert, Sparkles } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  highScore: number;
  snakeLength: number;
  combo: number;
  comboTimeLeft: number;
  mode: GameMode;
  difficulty: Difficulty;
  blitzTimeLeft: number;
  activePowerUps: ActivePowerUp[];
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  highScore,
  snakeLength,
  combo,
  comboTimeLeft,
  mode,
  difficulty,
  blitzTimeLeft,
  activePowerUps,
}) => {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
        {/* Current Score */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            Score
          </span>
          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
            {score.toLocaleString()}
          </span>
        </div>

        {/* High Score */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            Best ({mode} · {difficulty})
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight tabular-nums">
            {highScore.toLocaleString()}
          </span>
        </div>

        {/* Snake Length */}
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            Length
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight tabular-nums">
            {snakeLength}
            <span className="text-xs text-slate-500 font-normal ml-1">tiles</span>
          </span>
        </div>

        {/* Combo / Blitz Timer */}
        <div className="flex flex-col justify-center">
          {mode === 'blitz' ? (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1 font-medium text-amber-300">
                  <Clock className="w-3.5 h-3.5" /> Blitz Clock
                </span>
                <span className="font-mono tabular-nums text-white font-semibold">
                  {Math.floor(blitzTimeLeft / 60)}:{(blitzTimeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${(blitzTimeLeft / 120) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1 font-medium text-cyan-300">
                  <Zap className="w-3.5 h-3.5" /> Combo Multiplier
                </span>
                <span className="font-mono tabular-nums text-cyan-400 font-bold">
                  {combo > 1 ? `${combo}x` : '1x'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${
                    combo >= 4 ? 'bg-rose-500' : combo >= 2 ? 'bg-cyan-400' : 'bg-slate-700'
                  }`}
                  style={{ width: `${comboTimeLeft * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Power-Ups Row (if any) */}
      {activePowerUps.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Active Boosts:
          </span>
          <div className="flex flex-wrap gap-3">
            {activePowerUps.map((p) => {
              const config = POWER_UP_CONFIG[p.type];
              const remainingSec = Math.max(0, Math.ceil((p.expiresAt - Date.now()) / 1000));
              return (
                <div
                  key={p.type}
                  className="flex items-center gap-2 text-xs font-mono tabular-nums bg-slate-800/70 px-2.5 py-1 rounded border border-slate-700/60"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-slate-200 font-sans font-medium">{config.name}</span>
                  <span className="text-slate-400">{remainingSec}s</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
