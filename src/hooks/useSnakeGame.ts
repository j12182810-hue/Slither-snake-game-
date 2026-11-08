import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivePowerUp,
  Difficulty,
  Direction,
  FloatingText,
  FoodItem,
  GameMode,
  GameStatus,
  Particle,
  Position,
  PowerUpType,
} from '../types/game';
import {
  BASE_SPEEDS,
  BLITZ_TIME_SECONDS,
  GRID_SIZE,
  MAZE_LAYOUTS,
  POWER_UP_CONFIG,
} from '../constants/gameConfig';
import { soundManager } from '../utils/audio';
import {
  getHighScoreFor,
  getSelectedSkin,
  getSelectedTheme,
  getStoredSettings,
  getStoredStats,
  saveStats,
  unlockAchievement,
  updateHighScore,
} from '../utils/storage';
import confetti from 'canvas-confetti';

const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

const DIRECTION_OFFSETS: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export function useSnakeGame() {
  // Game state
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [snakeLength, setSnakeLength] = useState<number>(3);
  const [combo, setCombo] = useState<number>(1);
  const [comboTimeLeft, setComboTimeLeft] = useState<number>(0); // 0 to 1
  const [mode, setMode] = useState<GameMode>('classic');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [mazeId, setMazeId] = useState<string>('pillars');
  const [blitzTimeLeft, setBlitzTimeLeft] = useState<number>(BLITZ_TIME_SECONDS);
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Appearance & Settings
  const [skin, setSkin] = useState(getSelectedSkin);
  const [theme, setTheme] = useState(getSelectedTheme);
  const [settings, setSettings] = useState(getStoredSettings);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  // Mutable Game Engine Refs (for 60fps / requestAnimationFrame precision)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const snakeRef = useRef<Position[]>([
    { x: 12, y: 12 },
    { x: 11, y: 12 },
    { x: 10, y: 12 },
  ]);
  const directionRef = useRef<Direction>('RIGHT');
  const inputQueueRef = useRef<Direction[]>([]);
  const foodsRef = useRef<FoodItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const activePowerUpsRef = useRef<ActivePowerUp[]>([]);
  const obstaclesRef = useRef<Position[]>([]);

  const comboTimerRef = useRef<{ combo: number; expireAt: number }>({ combo: 1, expireAt: 0 });
  const scoreRef = useRef<number>(0);
  const lastTickTimeRef = useRef<number>(0);
  const blitzStartTimeRef = useRef<number>(0);
  const lastPowerUpSpawnRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const tongueTimerRef = useRef<number>(0);

  // Sync high score on mode/difficulty change
  useEffect(() => {
    setHighScore(getHighScoreFor(mode, difficulty));
  }, [mode, difficulty]);

  // Load obstacles based on mode and maze layout
  useEffect(() => {
    if (mode === 'maze') {
      const layout = MAZE_LAYOUTS.find((m) => m.id === mazeId) || MAZE_LAYOUTS[0];
      obstaclesRef.current = layout.obstacles;
    } else {
      obstaclesRef.current = [];
    }
  }, [mode, mazeId]);

  // Particle Spawner
  const spawnParticles = useCallback((x: number, y: number, color: string, count: number = 12) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 3.5;
      newParticles.push({
        x: x + 0.5,
        y: y + 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1,
        size: 2 + Math.random() * 3,
        maxLife: 24 + Math.random() * 12,
        life: 0,
      });
    }
    particlesRef.current.push(...newParticles);
  }, []);

  // Floating text spawner
  const addFloatingText = useCallback((text: string, x: number, y: number, color: string) => {
    floatingTextsRef.current.push({
      id: Math.random().toString(),
      text,
      x: x + 0.5,
      y: y + 0.2,
      color,
      alpha: 1,
      scale: 1,
    });
  }, []);

  // Check if position is occupied
  const isTileOccupied = useCallback((pos: Position): boolean => {
    const onSnake = snakeRef.current.some((seg) => seg.x === pos.x && seg.y === pos.y);
    if (onSnake) return true;

    const onObstacle = obstaclesRef.current.some((obs) => obs.x === pos.x && obs.y === pos.y);
    if (onObstacle) return true;

    const onFood = foodsRef.current.some((f) => f.x === pos.x && f.y === pos.y);
    if (onFood) return true;

    return false;
  }, []);

  // Find random empty tile
  const getRandomEmptyTile = useCallback((): Position => {
    let attempts = 0;
    while (attempts < 500) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      if (!isTileOccupied({ x, y })) {
        return { x, y };
      }
      attempts++;
    }
    return { x: 0, y: 0 };
  }, [isTileOccupied]);

  // Spawn regular apple
  const spawnApple = useCallback(() => {
    const pos = getRandomEmptyTile();
    foodsRef.current.push({
      x: pos.x,
      y: pos.y,
      type: 'apple',
      points: 100,
      growth: 1,
    });
  }, [getRandomEmptyTile]);

  // Spawn powerup
  const spawnPowerUp = useCallback((forcedType?: PowerUpType) => {
    const types: PowerUpType[] = ['golden', 'slow', 'ghost', 'magnet', 'shrink'];
    const selectedType = forcedType || types[Math.floor(Math.random() * types.length)];
    const config = POWER_UP_CONFIG[selectedType];
    const pos = getRandomEmptyTile();
    const durationOnBoard = 12000; // 12 seconds to collect

    foodsRef.current.push({
      x: pos.x,
      y: pos.y,
      type: selectedType,
      points: config.points,
      growth: config.growth,
      expiresAt: Date.now() + durationOnBoard,
      maxDuration: durationOnBoard,
    });
  }, [getRandomEmptyTile]);

  // Reset Game
  const resetGame = useCallback(() => {
    const center = Math.floor(GRID_SIZE / 2);
    snakeRef.current = [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ];
    directionRef.current = 'RIGHT';
    inputQueueRef.current = [];
    foodsRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    activePowerUpsRef.current = [];
    setActivePowerUps([]);

    scoreRef.current = 0;
    setScore(0);
    setSnakeLength(3);
    setCombo(1);
    setComboTimeLeft(0);
    comboTimerRef.current = { combo: 1, expireAt: 0 };
    lastTickTimeRef.current = performance.now();
    lastPowerUpSpawnRef.current = performance.now();
    blitzStartTimeRef.current = performance.now();
    setBlitzTimeLeft(BLITZ_TIME_SECONDS);
    setIsNewHighScore(false);

    // Initial food spawn
    spawnApple();
    if (mode === 'blitz') {
      spawnApple(); // 2 apples in blitz mode
    }
  }, [mode, spawnApple]);

  // Start game
  const startGame = useCallback(() => {
    resetGame();
    setStatus('PLAYING');
    soundManager.playClick();
  }, [resetGame]);

  // Pause toggle
  const togglePause = useCallback(() => {
    setStatus((prev) => {
      if (prev === 'PLAYING') {
        soundManager.playClick();
        return 'PAUSED';
      }
      if (prev === 'PAUSED') {
        soundManager.playClick();
        lastTickTimeRef.current = performance.now();
        return 'PLAYING';
      }
      return prev;
    });
  }, []);

  // Direction input handler with queueing
  const changeDirection = useCallback((newDir: Direction) => {
    const queue = inputQueueRef.current;
    const lastDir = queue.length > 0 ? queue[queue.length - 1] : directionRef.current;

    // Prevent direct 180-degree turnaround
    if (newDir === lastDir || newDir === OPPOSITE_DIRECTIONS[lastDir]) {
      return;
    }

    // Limit buffer to 2 inputs
    if (queue.length < 2) {
      queue.push(newDir);
      soundManager.playTurn();
      if (settings.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(10);
        } catch {}
      }
    }
  }, [settings.vibrationEnabled]);

  // Handle Game Over
  const handleGameOver = useCallback((reason: string = 'crash') => {
    setStatus('GAME_OVER');
    soundManager.playCrash();

    const currentScore = scoreRef.current;
    const isHigh = updateHighScore(mode, difficulty, currentScore);
    if (isHigh && currentScore > 0) {
      setIsNewHighScore(true);
      soundManager.playHighScore();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#F59E0B', '#38BDF8', '#F43F5E'],
        });
      } catch {}
    }

    // Explode snake body particles
    const head = snakeRef.current[0];
    if (head) {
      spawnParticles(head.x, head.y, skin.headColor, 28);
    }

    // Update global stats
    const stats = getStoredStats();
    stats.gamesPlayed += 1;
    stats.totalScore += currentScore;
    stats.maxLength = Math.max(stats.maxLength, snakeRef.current.length);
    stats.highestCombo = Math.max(stats.highestCombo, comboTimerRef.current.combo);
    saveStats(stats);

    // Achievements check
    if (stats.maxLength >= 25) unlockAchievement('centipede');
    if (stats.maxLength >= 50) unlockAchievement('leviathan');
    if (currentScore >= 1000) unlockAchievement('high_roller');
    if (currentScore >= 5000) unlockAchievement('high_roller_pro');
  }, [difficulty, mode, skin.headColor, spawnParticles]);

  // Main game tick step
  const tick = useCallback(() => {
    if (status !== 'PLAYING') return;

    // Blitz mode timer check
    if (mode === 'blitz') {
      const elapsed = (performance.now() - blitzStartTimeRef.current) / 1000;
      const remaining = Math.max(0, Math.ceil(BLITZ_TIME_SECONDS - elapsed));
      setBlitzTimeLeft(remaining);
      if (remaining <= 0) {
        unlockAchievement('blitz_champion');
        handleGameOver('time_up');
        return;
      }
    }

    // Pop next direction from queue if available
    if (inputQueueRef.current.length > 0) {
      directionRef.current = inputQueueRef.current.shift()!;
    }

    const dir = directionRef.current;
    const offset = DIRECTION_OFFSETS[dir];
    const snake = [...snakeRef.current];
    const head = snake[0];

    let newHeadX = head.x + offset.x;
    let newHeadY = head.y + offset.y;

    // Check active ghost mode
    const isGhostActive = activePowerUpsRef.current.some((p) => p.type === 'ghost');

    // Wall collision / Wrapping
    if (mode === 'wrap' || isGhostActive) {
      newHeadX = (newHeadX + GRID_SIZE) % GRID_SIZE;
      newHeadY = (newHeadY + GRID_SIZE) % GRID_SIZE;
    } else {
      if (newHeadX < 0 || newHeadX >= GRID_SIZE || newHeadY < 0 || newHeadY >= GRID_SIZE) {
        handleGameOver('wall_hit');
        return;
      }
    }

    const newHead: Position = { x: newHeadX, y: newHeadY };

    // Obstacle collision (in maze mode)
    if (!isGhostActive && mode === 'maze') {
      const hitObstacle = obstaclesRef.current.some(
        (obs) => obs.x === newHead.x && obs.y === newHead.y
      );
      if (hitObstacle) {
        handleGameOver('obstacle_hit');
        return;
      }
    }

    // Self-collision check (skip tail tip since it moves unless eating, but check rest)
    if (!isGhostActive) {
      const selfCollision = snake.slice(0, -1).some(
        (seg) => seg.x === newHead.x && seg.y === newHead.y
      );
      if (selfCollision) {
        handleGameOver('self_hit');
        return;
      }
    }

    // Move snake head forward
    snake.unshift(newHead);

    // Food collision check
    let ateFoodIndex = -1;
    for (let i = 0; i < foodsRef.current.length; i++) {
      const food = foodsRef.current[i];
      if (food.x === newHead.x && food.y === newHead.y) {
        ateFoodIndex = i;
        break;
      }
    }

    if (ateFoodIndex !== -1) {
      const food = foodsRef.current[ateFoodIndex];
      foodsRef.current.splice(ateFoodIndex, 1);

      // Handle Combo
      const now = performance.now();
      let currentCombo = comboTimerRef.current.combo;
      if (now < comboTimerRef.current.expireAt) {
        currentCombo = Math.min(currentCombo + 1, 8);
      } else {
        currentCombo = 1;
      }
      comboTimerRef.current = { combo: currentCombo, expireAt: now + 3500 };
      setCombo(currentCombo);

      // Points calculation
      let pointsEarned = food.points * currentCombo;
      // Golden apple bonus multiplier
      if (activePowerUpsRef.current.some((p) => p.type === 'golden')) {
        pointsEarned *= 2;
      }

      scoreRef.current += pointsEarned;
      setScore(scoreRef.current);

      // Audio & Visual FX
      if (food.type === 'apple') {
        soundManager.playEat(currentCombo);
        spawnParticles(newHead.x, newHead.y, '#EF4444', 12);
        addFloatingText(
          currentCombo > 1 ? `+${pointsEarned} (${currentCombo}x)` : `+${pointsEarned}`,
          newHead.x,
          newHead.y,
          '#FBBF24'
        );

        // Update stats
        const stats = getStoredStats();
        stats.totalApplesEaten += 1;
        saveStats(stats);
        unlockAchievement('first_bite');

        // Chance to spawn a power-up when eating apple
        if (Math.random() < 0.28) {
          spawnPowerUp();
        }
      } else {
        // Power-Up eaten!
        soundManager.playPowerUp();
        const config = POWER_UP_CONFIG[food.type];
        spawnParticles(newHead.x, newHead.y, config.color, 20);
        addFloatingText(`${config.name}! +${pointsEarned}`, newHead.x, newHead.y, config.color);

        const stats = getStoredStats();
        stats.powerUpsCollected += 1;
        saveStats(stats);
        if (stats.powerUpsCollected >= 10) unlockAchievement('power_hunter');
        if (food.type === 'ghost') unlockAchievement('ghost_runner');

        // Handle specific power-up mechanics
        if (food.type === 'shrink') {
          // Shrink snake
          const minLen = 3;
          if (snake.length > minLen) {
            snake.splice(Math.max(minLen, snake.length - 3));
          }
        } else {
          // Add/refresh active powerup timer
          const existing = activePowerUpsRef.current.find((p) => p.type === food.type);
          if (existing) {
            existing.expiresAt = Date.now() + config.duration * 1000;
          } else {
            activePowerUpsRef.current.push({
              type: food.type,
              expiresAt: Date.now() + config.duration * 1000,
              duration: config.duration * 1000,
            });
          }
        }
      }

      // Growth handling
      if (food.growth > 1) {
        // For golden apple (+3 length), don't pop tail for extra segments
        // We'll let the snake expand by not popping the tail
      }

      // Check combo achievement
      if (currentCombo >= 5) {
        unlockAchievement('combo_master');
      }

      // Ensure an apple is always on board
      const hasApple = foodsRef.current.some((f) => f.type === 'apple');
      if (!hasApple) {
        spawnApple();
      }
    } else {
      // Didn't eat food, remove tail tip
      snake.pop();
    }

    snakeRef.current = snake;
    setSnakeLength(snake.length);
  }, [addFloatingText, difficulty, handleGameOver, mode, spawnApple, spawnParticles, spawnPowerUp, status]);

  // Magnet effect: attract food toward head
  const updateMagnetPull = useCallback(() => {
    const isMagnetActive = activePowerUpsRef.current.some((p) => p.type === 'magnet');
    if (!isMagnetActive) return;

    const head = snakeRef.current[0];
    if (!head) return;

    foodsRef.current.forEach((food) => {
      if (food.type !== 'apple') return;
      const dx = head.x - food.x;
      const dy = head.y - food.y;
      const dist = Math.hypot(dx, dy);

      // If within 5 tiles, drift towards head
      if (dist <= 5 && dist > 1) {
        if (Math.random() < 0.25) {
          const stepX = dx > 0 ? 1 : dx < 0 ? -1 : 0;
          const stepY = dy > 0 ? 1 : dy < 0 ? -1 : 0;
          const nextPos = {
            x: food.x + (Math.abs(dx) > Math.abs(dy) ? stepX : 0),
            y: food.y + (Math.abs(dy) >= Math.abs(dx) ? stepY : 0),
          };
          if (!isTileOccupied(nextPos)) {
            food.x = nextPos.x;
            food.y = nextPos.y;
          }
        }
      }
    });
  }, [isTileOccupied]);

  // Clean expired powerups on board & active effects
  const cleanupExpiring = useCallback(() => {
    const now = Date.now();

    // Expire board items
    foodsRef.current = foodsRef.current.filter((food) => {
      if (!food.expiresAt) return true;
      return food.expiresAt > now;
    });

    // Expire active power-ups
    const updated = activePowerUpsRef.current.filter((p) => p.expiresAt > now);
    if (updated.length !== activePowerUpsRef.current.length) {
      activePowerUpsRef.current = updated;
    }
    setActivePowerUps([...updated]);

    // Update combo decay bar
    if (comboTimerRef.current.expireAt > performance.now()) {
      const remaining = (comboTimerRef.current.expireAt - performance.now()) / 3500;
      setComboTimeLeft(Math.max(0, Math.min(1, remaining)));
    } else {
      if (comboTimerRef.current.combo > 1) {
        comboTimerRef.current.combo = 1;
        setCombo(1);
      }
      setComboTimeLeft(0);
    }
  }, []);

  // Periodic power-up spawner
  const checkPeriodicPowerUp = useCallback(() => {
    const now = performance.now();
    const interval = mode === 'blitz' ? 7000 : 18000;
    if (now - lastPowerUpSpawnRef.current > interval) {
      lastPowerUpSpawnRef.current = now;
      if (foodsRef.current.length < 5) {
        spawnPowerUp();
      }
    }
  }, [mode, spawnPowerUp]);

  // Draw Game Loop onto Canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const tileSize = width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = theme.canvasBg;
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines (if enabled)
    if (settings.showGridLines) {
      ctx.strokeStyle = theme.gridLineColor;
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        const pos = i * tileSize;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(width, pos);
        ctx.stroke();
      }
    }

    // Draw Obstacles (in maze mode)
    if (mode === 'maze' && obstaclesRef.current.length > 0) {
      obstaclesRef.current.forEach((obs) => {
        const x = obs.x * tileSize;
        const y = obs.y * tileSize;
        const pad = tileSize * 0.08;

        ctx.fillStyle = theme.obstacleColor;
        ctx.beginPath();
        ctx.roundRect(x + pad, y + pad, tileSize - pad * 2, tileSize - pad * 2, tileSize * 0.2);
        ctx.fill();

        ctx.strokeStyle = theme.obstacleBorder;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner metallic bevel
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(x + pad * 1.5, y + pad * 1.5, tileSize - pad * 3, 2);
      });
    }

    // Draw Foods & Powerups
    const now = performance.now();
    foodsRef.current.forEach((food) => {
      const cx = food.x * tileSize + tileSize / 2;
      const cy = food.y * tileSize + tileSize / 2;
      const pulse = 1 + Math.sin(now * 0.006 + food.x * 2) * 0.08;
      const radius = (tileSize * 0.4) * pulse;

      if (food.type === 'apple') {
        // Red delicious apple with leaf and stem
        ctx.save();
        ctx.shadowColor = 'rgba(239, 68, 68, 0.5)';
        ctx.shadowBlur = 10;

        // Apple body
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(cx, cy + 1, radius, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(cx - radius * 0.35, cy - radius * 0.3, radius * 0.28, 0, Math.PI * 2);
        ctx.fill();

        // Stem
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#78350F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - radius * 0.8);
        ctx.quadraticCurveTo(cx + 2, cy - radius * 1.3, cx + 3, cy - radius * 1.4);
        ctx.stroke();

        // Green leaf
        ctx.fillStyle = '#22C55E';
        ctx.beginPath();
        ctx.ellipse(cx + 4, cy - radius * 1.1, 4, 2, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else {
        // Power-Up Item
        const config = POWER_UP_CONFIG[food.type];
        ctx.save();
        ctx.shadowColor = config.glow;
        ctx.shadowBlur = 14;

        // Pulsing powerup orb
        const grad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 2, cx, cy, radius);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.4, config.color);
        grad.addColorStop(1, '#000000');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Orbiting energy ring
        const rotAngle = (now * 0.004) % (Math.PI * 2);
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * 1.35, radius * 0.65, rotAngle, 0, Math.PI * 2);
        ctx.stroke();

        // Countdown timer ring if expiring
        if (food.expiresAt && food.maxDuration) {
          const timeLeft = Math.max(0, food.expiresAt - Date.now());
          const progress = timeLeft / food.maxDuration;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 1.25, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
          ctx.stroke();
        }

        ctx.restore();
      }
    });

    // Draw Snake
    const snake = snakeRef.current;
    if (snake.length > 0) {
      const isGhostActive = activePowerUpsRef.current.some((p) => p.type === 'ghost');

      ctx.save();
      if (isGhostActive) {
        ctx.globalAlpha = 0.65;
        ctx.shadowColor = '#A855F7';
        ctx.shadowBlur = 16;
      } else {
        ctx.shadowColor = skin.glowColor;
        ctx.shadowBlur = 10;
      }

      // Draw body segments (from tail to neck)
      for (let i = snake.length - 1; i > 0; i--) {
        const seg = snake[i];
        const nextSeg = snake[i - 1];
        const t = i / (snake.length - 1 || 1); // 0 at head, 1 at tail

        // Taper tail subtly
        const segRadius = (tileSize * 0.44) * (1 - t * 0.25);
        const cx = seg.x * tileSize + tileSize / 2;
        const cy = seg.y * tileSize + tileSize / 2;

        // Smooth color blend
        ctx.fillStyle = i % 2 === 0 ? skin.bodyColorStart : skin.bodyColorEnd;

        ctx.beginPath();
        ctx.arc(cx, cy, segRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connecting capsule between adjacent segments for buttery smooth body
        if (nextSeg) {
          const dx = Math.abs(seg.x - nextSeg.x);
          const dy = Math.abs(seg.y - nextSeg.y);
          // Only connect if not wrapping around edges
          if (dx <= 1 && dy <= 1) {
            const ncx = nextSeg.x * tileSize + tileSize / 2;
            const ncy = nextSeg.y * tileSize + tileSize / 2;
            ctx.lineWidth = segRadius * 2;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(ncx, ncy);
            ctx.stroke();
          }
        }

        // Segment spine pattern (dots)
        if (skin.pattern === 'scale' && i % 2 === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.beginPath();
          ctx.arc(cx, cy, segRadius * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Snake Head
      const head = snake[0];
      const hcx = head.x * tileSize + tileSize / 2;
      const hcy = head.y * tileSize + tileSize / 2;
      const headRadius = tileSize * 0.48;

      ctx.fillStyle = skin.headColor;
      ctx.beginPath();
      ctx.arc(hcx, hcy, headRadius, 0, Math.PI * 2);
      ctx.fill();

      // Expressive Eyes & Flicking Tongue
      const dir = directionRef.current;
      let eye1X = 0, eye1Y = 0, eye2X = 0, eye2Y = 0;
      let tongueBaseX = 0, tongueBaseY = 0, tongueTipX = 0, tongueTipY = 0;
      const eyeOffset = headRadius * 0.42;
      const eyeSpread = headRadius * 0.45;

      if (dir === 'RIGHT') {
        eye1X = hcx + eyeOffset * 0.6;
        eye1Y = hcy - eyeSpread;
        eye2X = hcx + eyeOffset * 0.6;
        eye2Y = hcy + eyeSpread;
        tongueBaseX = hcx + headRadius;
        tongueBaseY = hcy;
        tongueTipX = tongueBaseX + tileSize * 0.35;
        tongueTipY = tongueBaseY;
      } else if (dir === 'LEFT') {
        eye1X = hcx - eyeOffset * 0.6;
        eye1Y = hcy - eyeSpread;
        eye2X = hcx - eyeOffset * 0.6;
        eye2Y = hcy + eyeSpread;
        tongueBaseX = hcx - headRadius;
        tongueBaseY = hcy;
        tongueTipX = tongueBaseX - tileSize * 0.35;
        tongueTipY = tongueBaseY;
      } else if (dir === 'UP') {
        eye1X = hcx - eyeSpread;
        eye1Y = hcy - eyeOffset * 0.6;
        eye2X = hcx + eyeSpread;
        eye2Y = hcy - eyeOffset * 0.6;
        tongueBaseX = hcx;
        tongueBaseY = hcy - headRadius;
        tongueTipX = tongueBaseX;
        tongueTipY = tongueBaseY - tileSize * 0.35;
      } else if (dir === 'DOWN') {
        eye1X = hcx - eyeSpread;
        eye1Y = hcy + eyeOffset * 0.6;
        eye2X = hcx + eyeSpread;
        eye2Y = hcy + eyeOffset * 0.6;
        tongueBaseX = hcx;
        tongueBaseY = hcy + headRadius;
        tongueTipX = tongueBaseX;
        tongueTipY = tongueBaseY + tileSize * 0.35;
      }

      // Draw flicking red tongue occasionally (every ~3s)
      tongueTimerRef.current += 1;
      const shouldFlickTongue = (tongueTimerRef.current % 180) < 30;
      if (shouldFlickTongue) {
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tongueBaseX, tongueBaseY);
        ctx.lineTo(tongueTipX, tongueTipY);
        ctx.stroke();

        // Fork tip
        ctx.beginPath();
        if (dir === 'RIGHT' || dir === 'LEFT') {
          const sign = dir === 'RIGHT' ? 1 : -1;
          ctx.moveTo(tongueTipX, tongueTipY);
          ctx.lineTo(tongueTipX + sign * 3, tongueTipY - 3);
          ctx.moveTo(tongueTipX, tongueTipY);
          ctx.lineTo(tongueTipX + sign * 3, tongueTipY + 3);
        } else {
          const sign = dir === 'DOWN' ? 1 : -1;
          ctx.moveTo(tongueTipX, tongueTipY);
          ctx.lineTo(tongueTipX - 3, tongueTipY + sign * 3);
          ctx.moveTo(tongueTipX, tongueTipY);
          ctx.lineTo(tongueTipX + 3, tongueTipY + sign * 3);
        }
        ctx.stroke();
      }

      // Draw eye sockets (White)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(eye1X, eye1Y, headRadius * 0.32, 0, Math.PI * 2);
      ctx.arc(eye2X, eye2Y, headRadius * 0.32, 0, Math.PI * 2);
      ctx.fill();

      // Pupils looking towards direction
      ctx.fillStyle = skin.eyeColor;
      const pupilShiftX = dir === 'RIGHT' ? 1.5 : dir === 'LEFT' ? -1.5 : 0;
      const pupilShiftY = dir === 'DOWN' ? 1.5 : dir === 'UP' ? -1.5 : 0;
      ctx.beginPath();
      ctx.arc(eye1X + pupilShiftX, eye1Y + pupilShiftY, headRadius * 0.18, 0, Math.PI * 2);
      ctx.arc(eye2X + pupilShiftX, eye2Y + pupilShiftY, headRadius * 0.18, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Update and Draw Particles
    particlesRef.current.forEach((p) => {
      p.x += p.vx * 0.12;
      p.y += p.vy * 0.12;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life++;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x * tileSize, p.y * tileSize, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.02);

    // Update and Draw Floating Texts
    floatingTextsRef.current.forEach((ft) => {
      ft.y -= 0.025;
      ft.alpha -= 0.02;
      ft.scale = Math.min(1.2, ft.scale + 0.01);

      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.font = `bold ${Math.round(tileSize * 0.65 * ft.scale)}px 'Outfit', sans-serif`;
      ctx.fillStyle = ft.color;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 6;
      ctx.fillText(ft.text, ft.x * tileSize, ft.y * tileSize);
      ctx.restore();
    });
    floatingTextsRef.current = floatingTextsRef.current.filter((ft) => ft.alpha > 0.05);

    // Draw Pause Overlay if paused
    if (status === 'PAUSED') {
      ctx.save();
      ctx.fillStyle = 'rgba(9, 13, 22, 0.75)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${Math.round(tileSize * 1.5)}px 'Outfit', sans-serif`;
      ctx.fillStyle = '#F8FAFC';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PAUSED', width / 2, height / 2 - 14);

      ctx.font = `500 ${Math.round(tileSize * 0.65)}px 'Outfit', sans-serif`;
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('Press SPACE or Resume to continue', width / 2, height / 2 + 24);
      ctx.restore();
    }
  }, [mode, settings.showGridLines, skin, status, theme]);

  // RequestAnimationFrame Game Loop
  useEffect(() => {
    let animId: number;

    const gameLoop = (currentTime: number) => {
      if (status === 'PLAYING') {
        // Calculate tick delay based on difficulty & active powerups
        let delay = BASE_SPEEDS[difficulty];
        // Gradual speedup with length (max 25% faster)
        const lengthBoost = Math.min(snakeRef.current.length * 0.6, 25);
        delay = Math.max(38, delay - lengthBoost);

        // Slow-Mo Cryo Chill effect
        if (activePowerUpsRef.current.some((p) => p.type === 'slow')) {
          delay *= 1.6;
        }

        if (currentTime - lastTickTimeRef.current >= delay) {
          lastTickTimeRef.current = currentTime;
          tick();
          updateMagnetPull();
        }

        cleanupExpiring();
        checkPeriodicPowerUp();
      }

      renderCanvas();
      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    animationFrameIdRef.current = animId;

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [
    checkPeriodicPowerUp,
    cleanupExpiring,
    difficulty,
    renderCanvas,
    status,
    tick,
    updateMagnetPull,
  ]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent page scrolling on arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        if (status === 'PLAYING' || status === 'PAUSED') {
          togglePause();
        } else if (status === 'IDLE' || status === 'GAME_OVER') {
          startGame();
        }
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        startGame();
        return;
      }

      if (status !== 'PLAYING') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'k':
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'j':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'h':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'l':
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, startGame, status, togglePause]);

  // Sound toggle
  const toggleSound = useCallback(() => {
    const next = !isMuted;
    soundManager.setMuted(next);
    setIsMuted(next);
  }, [isMuted]);

  return {
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
  };
}
