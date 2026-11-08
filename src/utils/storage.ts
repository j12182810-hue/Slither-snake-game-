import { Achievement, BoardTheme, Difficulty, GameMode, PlayerStats, SnakeSkin } from '../types/game';
import { BOARD_THEMES, INITIAL_ACHIEVEMENTS, SNAKE_SKINS } from '../constants/gameConfig';

const STORAGE_KEYS = {
  STATS: 'snake_player_stats_v1',
  ACHIEVEMENTS: 'snake_achievements_v1',
  SELECTED_SKIN: 'snake_selected_skin_v1',
  SELECTED_THEME: 'snake_selected_theme_v1',
  SETTINGS: 'snake_settings_v1',
};

export interface GameSettings {
  showGridLines: boolean;
  vibrationEnabled: boolean;
  dpadEnabled: boolean;
  highPrecisionMode: boolean;
}

const DEFAULT_STATS: PlayerStats = {
  gamesPlayed: 0,
  totalScore: 0,
  totalApplesEaten: 0,
  maxLength: 3,
  highestCombo: 0,
  powerUpsCollected: 0,
  highScores: {},
};

const DEFAULT_SETTINGS: GameSettings = {
  showGridLines: true,
  vibrationEnabled: true,
  dpadEnabled: false, // auto-detect or toggleable
  highPrecisionMode: true,
};

export const getStoredStats = (): PlayerStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (raw) {
      return { ...DEFAULT_STATS, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_STATS;
};

export const saveStats = (stats: PlayerStats) => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch {}
};

export const getHighScoreFor = (mode: GameMode, difficulty: Difficulty): number => {
  const stats = getStoredStats();
  const key = `${mode}_${difficulty}`;
  return stats.highScores[key] || 0;
};

export const updateHighScore = (mode: GameMode, difficulty: Difficulty, score: number): boolean => {
  const stats = getStoredStats();
  const key = `${mode}_${difficulty}`;
  const current = stats.highScores[key] || 0;
  if (score > current) {
    stats.highScores[key] = score;
    stats.totalScore += score;
    saveStats(stats);
    return true; // New high score achieved!
  }
  return false;
};

export const getStoredAchievements = (): Achievement[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (raw) {
      const saved = JSON.parse(raw) as Achievement[];
      // Merge with initial in case new achievements were added
      return INITIAL_ACHIEVEMENTS.map((item) => {
        const found = saved.find((s) => s.id === item.id);
        return found ? found : item;
      });
    }
  } catch {}
  return INITIAL_ACHIEVEMENTS;
};

export const unlockAchievement = (id: string): Achievement | null => {
  const achievements = getStoredAchievements();
  const target = achievements.find((a) => a.id === id);
  if (target && !target.unlocked) {
    target.unlocked = true;
    target.unlockedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch {}
    return target;
  }
  return null;
};

export const getSelectedSkin = (): SnakeSkin => {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.SELECTED_SKIN);
    const skin = SNAKE_SKINS.find((s) => s.id === id);
    if (skin) return skin;
  } catch {}
  return SNAKE_SKINS[0];
};

export const saveSelectedSkin = (skinId: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_SKIN, skinId);
  } catch {}
};

export const getSelectedTheme = (): BoardTheme => {
  try {
    const id = localStorage.getItem(STORAGE_KEYS.SELECTED_THEME);
    const theme = BOARD_THEMES.find((t) => t.id === id);
    if (theme) return theme;
  } catch {}
  return BOARD_THEMES[0];
};

export const saveSelectedTheme = (themeId: string) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_THEME, themeId);
  } catch {}
};

export const getStoredSettings = (): GameSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
};

export const saveStoredSettings = (settings: GameSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {}
};
