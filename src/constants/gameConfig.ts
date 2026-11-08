import { Achievement, BoardTheme, Difficulty, GameMode, MazeLayout, PowerUpType, SnakeSkin } from '../types/game';

export const GRID_SIZE = 24; // 24x24 tiles

export const BASE_SPEEDS: Record<Difficulty, number> = {
  chill: 125,
  normal: 88,
  hard: 62,
  extreme: 42,
};

export const BLITZ_TIME_SECONDS = 120; // 2 minutes

export const POWER_UP_CONFIG: Record<PowerUpType, {
  name: string;
  color: string;
  glow: string;
  duration: number; // in seconds
  description: string;
  points: number;
  growth: number;
}> = {
  golden: {
    name: 'Golden Apple',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.6)',
    duration: 8,
    description: '+300 pts & 2x Combo Multiplier',
    points: 300,
    growth: 3,
  },
  slow: {
    name: 'Cryo Chill',
    color: '#06B6D4',
    glow: 'rgba(6, 182, 212, 0.6)',
    duration: 7,
    description: 'Slows down time for surgical precision',
    points: 150,
    growth: 1,
  },
  ghost: {
    name: 'Phantom Veil',
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.6)',
    duration: 6,
    description: 'Phase harmlessly through your own tail & walls',
    points: 200,
    growth: 1,
  },
  magnet: {
    name: 'Graviton Ring',
    color: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.6)',
    duration: 8,
    description: 'Pulls nearby apples directly toward your head',
    points: 150,
    growth: 1,
  },
  shrink: {
    name: 'Tail Pruner',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.6)',
    duration: 0, // instantaneous
    description: 'Instantly trims 3 body segments for agility',
    points: 250,
    growth: -3,
  },
};

export const SNAKE_SKINS: SnakeSkin[] = [
  {
    id: 'emerald',
    name: 'Emerald Viper',
    headColor: '#10B981',
    bodyColorStart: '#34D399',
    bodyColorEnd: '#059669',
    eyeColor: '#0F172A',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    pattern: 'scale',
  },
  {
    id: 'cyber',
    name: 'Cyberpunk Synth',
    headColor: '#06B6D4',
    bodyColorStart: '#22D3EE',
    bodyColorEnd: '#E879F9',
    eyeColor: '#F43F5E',
    glowColor: 'rgba(6, 182, 212, 0.45)',
    pattern: 'neon',
  },
  {
    id: 'solar',
    name: 'Solar Phoenix',
    headColor: '#F59E0B',
    bodyColorStart: '#FBBF24',
    bodyColorEnd: '#EF4444',
    eyeColor: '#FFFFFF',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    pattern: 'striped',
  },
  {
    id: 'amethyst',
    name: 'Void Amethyst',
    headColor: '#8B5CF6',
    bodyColorStart: '#A78BFA',
    bodyColorEnd: '#4C1D95',
    eyeColor: '#F472B6',
    glowColor: 'rgba(139, 92, 246, 0.45)',
    pattern: 'neon',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Shadow',
    headColor: '#E2E8F0',
    bodyColorStart: '#94A3B8',
    bodyColorEnd: '#334155',
    eyeColor: '#10B981',
    glowColor: 'rgba(226, 232, 240, 0.3)',
    pattern: 'solid',
  },
  {
    id: 'retro_crt',
    name: 'Phosphor Matrix',
    headColor: '#22C55E',
    bodyColorStart: '#4ADE80',
    bodyColorEnd: '#15803D',
    eyeColor: '#14532D',
    glowColor: 'rgba(34, 197, 94, 0.5)',
    pattern: 'striped',
  },
];

export const BOARD_THEMES: BoardTheme[] = [
  {
    id: 'dark_arcade',
    name: 'Midnight Arena',
    canvasBg: '#090D16',
    gridLineColor: 'rgba(255, 255, 255, 0.035)',
    borderColor: '#1E293B',
    borderGlow: 'rgba(30, 41, 59, 0.5)',
    obstacleColor: '#334155',
    obstacleBorder: '#475569',
  },
  {
    id: 'deep_ocean',
    name: 'Abyssal Depth',
    canvasBg: '#030A16',
    gridLineColor: 'rgba(56, 189, 248, 0.04)',
    borderColor: '#0C4A6E',
    borderGlow: 'rgba(12, 74, 110, 0.5)',
    obstacleColor: '#075985',
    obstacleBorder: '#0284C7',
  },
  {
    id: 'emerald_grove',
    name: 'Jade Sanctum',
    canvasBg: '#04130C',
    gridLineColor: 'rgba(52, 211, 153, 0.04)',
    borderColor: '#064E3B',
    borderGlow: 'rgba(6, 78, 59, 0.5)',
    obstacleColor: '#065F46',
    obstacleBorder: '#10B981',
  },
  {
    id: 'retro_terminal',
    name: 'CRT Terminal',
    canvasBg: '#020C04',
    gridLineColor: 'rgba(74, 222, 128, 0.05)',
    borderColor: '#14532D',
    borderGlow: 'rgba(20, 83, 45, 0.6)',
    obstacleColor: '#166534',
    obstacleBorder: '#22C55E',
  },
];

export const MAZE_LAYOUTS: MazeLayout[] = [
  {
    id: 'pillars',
    name: 'Four Pillars',
    obstacles: [
      // 4 solid pillars
      { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 6 }, { x: 6, y: 6 },
      { x: 17, y: 5 }, { x: 18, y: 5 }, { x: 17, y: 6 }, { x: 18, y: 6 },
      { x: 5, y: 17 }, { x: 6, y: 17 }, { x: 5, y: 18 }, { x: 6, y: 18 },
      { x: 17, y: 17 }, { x: 18, y: 17 }, { x: 17, y: 18 }, { x: 18, y: 18 },
    ],
  },
  {
    id: 'crossroads',
    name: 'The Crossroad',
    obstacles: [
      // Cross in the center with center pass-through
      { x: 11, y: 4 }, { x: 12, y: 4 }, { x: 11, y: 5 }, { x: 12, y: 5 },
      { x: 11, y: 18 }, { x: 12, y: 18 }, { x: 11, y: 19 }, { x: 12, y: 19 },
      { x: 4, y: 11 }, { x: 4, y: 12 }, { x: 5, y: 11 }, { x: 5, y: 12 },
      { x: 18, y: 11 }, { x: 18, y: 12 }, { x: 19, y: 11 }, { x: 19, y: 12 },
    ],
  },
  {
    id: 'box_gates',
    name: 'Courtyard Gates',
    obstacles: [
      // Perimeter barrier fragments
      { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 14 }, { x: 4, y: 15 },
      { x: 19, y: 8 }, { x: 19, y: 9 }, { x: 19, y: 14 }, { x: 19, y: 15 },
      { x: 8, y: 4 }, { x: 9, y: 4 }, { x: 14, y: 4 }, { x: 15, y: 4 },
      { x: 8, y: 19 }, { x: 9, y: 19 }, { x: 14, y: 19 }, { x: 15, y: 19 },
      // Inner blocks
      { x: 11, y: 11 }, { x: 12, y: 11 }, { x: 11, y: 12 }, { x: 12, y: 12 },
    ],
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_bite',
    title: 'First Nibble',
    description: 'Eat your very first apple.',
    icon: 'Apple',
    unlocked: false,
    category: 'skill',
  },
  {
    id: 'centipede',
    title: 'Centipede',
    description: 'Reach a snake length of 25 tiles.',
    icon: 'Maximize2',
    unlocked: false,
    category: 'length',
  },
  {
    id: 'leviathan',
    title: 'Leviathan',
    description: 'Reach a snake length of 50 tiles.',
    icon: 'Crown',
    unlocked: false,
    category: 'length',
  },
  {
    id: 'combo_master',
    title: 'Frenzy Feeder',
    description: 'Build a combo multiplier of 5x or higher.',
    icon: 'Zap',
    unlocked: false,
    category: 'skill',
  },
  {
    id: 'high_roller',
    title: 'Score 1,000',
    description: 'Achieve 1,000 points in a single session.',
    icon: 'Trophy',
    unlocked: false,
    category: 'score',
  },
  {
    id: 'high_roller_pro',
    title: 'Score 5,000',
    description: 'Achieve 5,000 points in a single session.',
    icon: 'Award',
    unlocked: false,
    category: 'score',
  },
  {
    id: 'power_hunter',
    title: 'Alchemist',
    description: 'Collect 10 total power-ups.',
    icon: 'Sparkles',
    unlocked: false,
    category: 'collection',
  },
  {
    id: 'ghost_runner',
    title: 'Specter',
    description: 'Collect the Phantom Veil power-up.',
    icon: 'Ghost',
    unlocked: false,
    category: 'skill',
  },
  {
    id: 'blitz_champion',
    title: 'Blitz Survivor',
    description: 'Complete a full Blitz 2-minute round.',
    icon: 'Timer',
    unlocked: false,
    category: 'skill',
  },
];

export const GAME_MODE_DESCRIPTIONS: Record<GameMode, { title: string; subtitle: string; icon: string }> = {
  classic: {
    title: 'Classic Arcade',
    subtitle: 'Strict perimeter borders. Walls & self-collision are fatal.',
    icon: 'Shield',
  },
  wrap: {
    title: 'Infinity Wrap',
    subtitle: 'Edges wrap around Pac-Man style. Watch your own tail!',
    icon: 'Repeat',
  },
  maze: {
    title: 'Labyrinth',
    subtitle: 'Navigate rigid stone pillars and corridors without crashing.',
    icon: 'Grid',
  },
  blitz: {
    title: '2-Min Blitz',
    subtitle: 'Frantic 120s timer! Golden apples and bonus crystals spawn constantly.',
    icon: 'Clock',
  },
};
