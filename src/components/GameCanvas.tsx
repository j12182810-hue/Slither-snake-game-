import React, { useEffect, useRef, useState } from 'react';
import { Direction, GameStatus } from '../types/game';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react';

interface GameCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  status: GameStatus;
  onStart: () => void;
  onTogglePause: () => void;
  onChangeDirection: (dir: Direction) => void;
  showDpad: boolean;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  canvasRef,
  status,
  onStart,
  onTogglePause,
  onChangeDirection,
  showDpad,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Responsive canvas resizing with high DPI support
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const minDimension = Math.floor(Math.min(rect.width, 680));
      const dpr = window.devicePixelRatio || 1;

      canvas.width = minDimension * dpr;
      canvas.height = minDimension * dpr;
      canvas.style.width = `${minDimension}px`;
      canvas.style.height = `${minDimension}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [canvasRef]);

  // Touch Swipe Handlers for mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || status !== 'PLAYING') return;

    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 25; // pixels

    if (Math.abs(dx) > minSwipeDistance || Math.abs(dy) > minSwipeDistance) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) onChangeDirection('RIGHT');
        else onChangeDirection('LEFT');
      } else {
        if (dy > 0) onChangeDirection('DOWN');
        else onChangeDirection('UP');
      }
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Canvas Frame Container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[680px] aspect-square rounded-2xl p-2 sm:p-3 bg-slate-900/90 border border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          className="rounded-xl w-full h-full block bg-slate-950 cursor-crosshair shadow-inner"
        />

        {/* Start Overlay when IDLE */}
        {status === 'IDLE' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 text-center z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
              Ready to Slither?
            </h2>
            <p className="text-sm text-slate-400 max-w-sm mb-6">
              Use <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-200">WASD</kbd> or{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-200">Arrow Keys</kbd> to steer. Eat apples, collect power-up crystals, and chain fast bites for combo points!
            </p>
            <button
              onClick={onStart}
              className="px-6 py-3 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Game</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Canvas Controls (Pause / Restart) */}
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
        <button
          onClick={onTogglePause}
          disabled={status === 'IDLE' || status === 'GAME_OVER'}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          {status === 'PAUSED' ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          <span>{status === 'PAUSED' ? 'Resume (Space)' : 'Pause (Space)'}</span>
        </button>

        <span className="text-slate-600">·</span>

        <button
          onClick={onStart}
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Quick Reset (R)</span>
        </button>
      </div>

      {/* Mobile Touch D-Pad (Visible on small screens or when enabled) */}
      <div className={`mt-4 sm:hidden flex flex-col items-center ${showDpad ? 'block' : 'hidden'}`}>
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => onChangeDirection('UP')}
            aria-label="Move Up"
            className="w-14 h-14 bg-slate-800/90 active:bg-emerald-600 active:scale-95 border border-slate-700 rounded-xl flex items-center justify-center text-slate-200 text-lg shadow transition-all"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onChangeDirection('LEFT')}
              aria-label="Move Left"
              className="w-14 h-14 bg-slate-800/90 active:bg-emerald-600 active:scale-95 border border-slate-700 rounded-xl flex items-center justify-center text-slate-200 text-lg shadow transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={onTogglePause}
              aria-label="Pause or Resume"
              className="w-12 h-12 bg-slate-900 border border-slate-700/60 rounded-full flex items-center justify-center text-slate-400 text-xs shadow"
            >
              {status === 'PAUSED' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onChangeDirection('RIGHT')}
              aria-label="Move Right"
              className="w-14 h-14 bg-slate-800/90 active:bg-emerald-600 active:scale-95 border border-slate-700 rounded-xl flex items-center justify-center text-slate-200 text-lg shadow transition-all"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={() => onChangeDirection('DOWN')}
            aria-label="Move Down"
            className="w-14 h-14 bg-slate-800/90 active:bg-emerald-600 active:scale-95 border border-slate-700 rounded-xl flex items-center justify-center text-slate-200 text-lg shadow transition-all"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
