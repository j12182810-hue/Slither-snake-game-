export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameMode = 'classic' | 'wrap' | 'maze' | 'blitz';

export type Difficulty = 'chill' | 'normal' | 'hard' | 'extreme';

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type PowerUpType = 'golden' | 'slow' | 'ghost' | 'magnet' | 'shrink';

export interface Position {
  x: number;
  y: number;
}

export interface FoodItem extends Position {
  type: 'apple' | PowerUpType;
  expiresAt?: number;
  maxDuration?: number;
  points: number;
  growth: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  expiresAt: number;
  duration: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  maxLife: number;
  life: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  alpha: number;
  scale: number;
}

export interface SnakeSkin {
  id: string;
  name: string;
  headColor: string;
  bodyColorStart: string;
  bodyColorEnd: string;
  eyeColor: string;
  glowColor: string;
  pattern: 'solid' | 'striped' | 'scale' | 'neon';
  unlockCondition?: string;
}

export interface BoardTheme {
  id: string;
  name: string;
  canvasBg: string;
  gridLineColor: string;
  borderColor: string;
  borderGlow: string;
  obstacleColor: string;
  obstacleBorder: string;
}

export interface HighScoreRecord {
  score: number;
  length: number;
  mode: GameMode;
  difficulty: Difficulty;
  date: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  totalScore: number;
  totalApplesEaten: number;
  maxLength: number;
  highestCombo: number;
  powerUpsCollected: number;
  highScores: Record<string, number>; // key: `${mode}_${difficulty}`
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'score' | 'length' | 'skill' | 'collection';
}

export interface MazeLayout {
  id: string;
  name: string;
  obstacles: Position[];
}
