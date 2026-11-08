import React from 'react';
import { BoardTheme, SnakeSkin } from '../types/game';
import { BOARD_THEMES, SNAKE_SKINS } from '../constants/gameConfig';
import { saveSelectedSkin, saveSelectedTheme } from '../utils/storage';
import { X, Check } from 'lucide-react';

interface SkinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkin: SnakeSkin;
  onSelectSkin: (skin: SnakeSkin) => void;
  currentTheme: BoardTheme;
  onSelectTheme: (theme: BoardTheme) => void;
}

export const SkinsModal: React.FC<SkinsModalProps> = ({
  isOpen,
  onClose,
  currentSkin,
  onSelectSkin,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  const handleSkinSelect = (skin: SnakeSkin) => {
    saveSelectedSkin(skin.id);
    onSelectSkin(skin);
  };

  const handleThemeSelect = (theme: BoardTheme) => {
    saveSelectedTheme(theme.id);
    onSelectTheme(theme);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Custom Skins & Arena</h3>
            <p className="text-xs text-slate-400 mt-0.5">Customize your snake appearance and playing field colors</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snake Skins Section */}
        <div className="my-5">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-3">
            Viper Skins
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SNAKE_SKINS.map((skin) => {
              const isSelected = currentSkin.id === skin.id;
              return (
                <button
                  key={skin.id}
                  onClick={() => handleSkinSelect(skin)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Live Skin Swatch Preview */}
                    <div className="flex items-center -space-x-1.5 shrink-0">
                      <div
                        className="w-5 h-5 rounded-full border border-black/40 z-30"
                        style={{ backgroundColor: skin.headColor }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-black/40 z-20"
                        style={{ backgroundColor: skin.bodyColorStart }}
                      />
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-black/40 z-10"
                        style={{ backgroundColor: skin.bodyColorEnd }}
                      />
                    </div>

                    <div>
                      <span className="text-sm font-semibold text-slate-200 block">{skin.name}</span>
                      <span className="text-[11px] text-slate-400 font-sans capitalize">{skin.pattern} pattern</span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Board Arena Themes Section */}
        <div className="pt-4 border-t border-slate-800">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-3">
            Arena Atmosphere
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BOARD_THEMES.map((theme) => {
              const isSelected = currentTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Theme Swatch Preview */}
                    <div
                      className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: theme.canvasBg,
                        borderColor: theme.borderColor,
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: theme.obstacleColor }}
                      />
                    </div>

                    <div>
                      <span className="text-sm font-semibold text-slate-200 block">{theme.name}</span>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                </button>
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
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
