import React, { useState } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { GameCanvas } from './components/GameCanvas';
import { ControlPanel } from './components/ControlPanel';
import { GameOverModal } from './components/GameOverModal';
import { SkinsModal } from './components/SkinsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { Sparkles, Trophy, Palette, BookOpen } from 'lucide-react';

export default function App() {
  const {
    canvasRef,
    status,
    score,
    highScore,
    snakeLength,
    combo,
    comboTimeLeft,
    mode,
    setMode,
    difficulty,
    setDifficulty,
    mazeId,
    setMazeId,
    blitzTimeLeft,
    activePowerUps,
    isNewHighScore,
    skin,
    setSkin,
    theme,
    setTheme,
    settings,
    setSettings,
    isMuted,
    toggleSound,
    startGame,
    togglePause,
    resetGame,
    changeDirection,
  } = useSnakeGame();

  // Modal visibility states
  const [isSkinsOpen, setIsSkinsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Header
        isMuted={isMuted}
        onToggleSound={toggleSound}
        onOpenSkins={() => setIsSkinsOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isPlaying={status === 'PLAYING'}
        onStartOrRestart={startGame}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {/* Score and Metric Monitor Header */}
        <ScoreBoard
          score={score}
          highScore={highScore}
          snakeLength={snakeLength}
          combo={combo}
          comboTimeLeft={comboTimeLeft}
          mode={mode}
          difficulty={difficulty}
          blitzTimeLeft={blitzTimeLeft}
          activePowerUps={activePowerUps}
        />

        {/* Central Arena and Controls Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Game Canvas Board Column (7 or 8 cols on desktop) */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <GameCanvas
              canvasRef={canvasRef}
              status={status}
              onStart={startGame}
              onTogglePause={togglePause}
              onChangeDirection={changeDirection}
              showDpad={settings.dpadEnabled}
            />
          </div>

          {/* Configuration and Quick Arsenal Sidebar (4 cols on desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <ControlPanel
              mode={mode}
              onSelectMode={setMode}
              difficulty={difficulty}
              onSelectDifficulty={setDifficulty}
              mazeId={mazeId}
              onSelectMaze={setMazeId}
              isPlaying={status === 'PLAYING'}
            />

            {/* Quick Action Navigation Cards */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-2.5">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Arcade Vault
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsSkinsOpen(true)}
                  className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-colors flex items-center gap-2.5 cursor-pointer group"
                >
                  <Palette className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Skins</span>
                    <span className="text-[10px] text-slate-400 truncate">{skin.name}</span>
                  </div>
                </button>

                <button
                  onClick={() => setIsAchievementsOpen(true)}
                  className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-left transition-colors flex items-center gap-2.5 cursor-pointer group"
                >
                  <Trophy className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Trophies</span>
                    <span className="text-[10px] text-slate-400">View Badges</span>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setIsRulesOpen(true)}
                className="w-full p-2.5 bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800/70 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> Power-Up & Combo Guide
                </span>
                <span className="text-slate-500 text-[11px] font-mono">5 Boosts</span>
              </button>
            </div>

            {/* Quick Keyboard Reference */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3.5 text-xs text-slate-400">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-2">
                Hotkeys
              </span>
              <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Steer</span>
                  <span className="text-slate-200">WASD / Arrow Keys</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pause / Resume</span>
                  <span className="text-slate-200">Space / P</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quick Restart</span>
                  <span className="text-slate-200">R</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Footer with clean unboxed metadata */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ViperStrike Arcade Engine</span>
          <div className="flex items-center gap-2">
            <span>60 FPS Smooth Canvas</span>
            <span aria-hidden="true">·</span>
            <span>Web Audio Synthesizer</span>
            <span aria-hidden="true">·</span>
            <span>Local High Score Persistence</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GameOverModal
        isOpen={status === 'GAME_OVER'}
        score={score}
        highScore={highScore}
        isNewHighScore={isNewHighScore}
        snakeLength={snakeLength}
        combo={combo}
        mode={mode}
        difficulty={difficulty}
        onRestart={startGame}
        onClose={() => resetGame()}
      />

      <SkinsModal
        isOpen={isSkinsOpen}
        onClose={() => setIsSkinsOpen(false)}
        currentSkin={skin}
        onSelectSkin={setSkin}
        currentTheme={theme}
        onSelectTheme={setTheme}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        isMuted={isMuted}
        onToggleSound={toggleSound}
      />
    </div>
  );
}
