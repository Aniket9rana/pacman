// --- TILE & MAP ---
export const TILE_SIZE = 24; // 24px x 24px
export const MAP_WIDTH_TILES = 28;
export const MAP_HEIGHT_TILES = 31;
export const MAP_WIDTH = TILE_SIZE * MAP_WIDTH_TILES;
export const MAP_HEIGHT = TILE_SIZE * MAP_HEIGHT_TILES;

// --- GAME STATES ---
export const GAME_STATE = {
  START: "START",
  READY: "READY",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  GAME_OVER: "GAME_OVER",
  LEVEL_CLEAR: "LEVEL_CLEAR",
};

// --- DIRECTIONS ---
export const DIRS = {
  UP: { x: 0, y: -1, angle: -Math.PI / 2 },
  DOWN: { x: 0, y: 1, angle: Math.PI / 2 },
  LEFT: { x: -1, y: 0, angle: Math.PI },
  RIGHT: { x: 1, y: 0, angle: 0 },
  STOP: { x: 0, y: 0, angle: 0 },
};

// --- ENTITY SPEEDS (tiles per second) ---
export const PACMAN_SPEED = 5;
export const GHOST_SPEED = 4;
export const GHOST_FRIGHT_SPEED = 2.5;
export const GHOST_RETURN_SPEED = 8;

// --- TIMING ---
export const READY_TIME = 2000; // 2 seconds
export const FRIGHTENED_TIME = 7000; // 7 seconds
export const GHOST_MODE_SWITCH_TIMES = [
  7000, 20000, 7000, 20000, 5000, 20000, 5000,
]; // Scatter/Chase timers

// --- COLORS ---
export const COLORS = {
  // Maze
  MAZE_WALL: "#00FFFF", // Neon blue wall
  MAZE_DOT: "#FFFFFF",
  // Pac-Man
  PACMAN: "#FFFF00",
  // Ghosts
  BLINKY: "#FF0000",
  PINKY: "#FFC0CB",
  INKY: "#00FFFF",
  CLYDE: "#FFA500",
  FRIGHTENED: "#4444FF",
  FRIGHTENED_FLASH: "#FFFFFF",
  // UI
  UI_WHITE: "#FFFFFF",
  UI_YELLOW: "#FFFF00",
};

// --- SCORING ---
export const SCORES = {
  PELLET: 10,
  POWER_PELLET: 50,
  GHOST_COMBO: [200, 400, 800, 1600],
  FRUIT: 100, // For now, can be expanded
};

// --- GHOST AI ---
export const GHOST_MODES = {
  SCATTER: "SCATTER",
  CHASE: "CHASE",
  FRIGHTENED: "FRIGHTENED",
  RETURNING: "RETURNING",
};

// --- GHOST HOUSE ---
export const GHOST_HOUSE_EXIT_POS = { x: 13, y: 11 };
export const GHOST_START_POS = {
  BLINKY: { x: 13, y: 8 }, // Starts outside the ghost house
  PINKY: { x: 13, y: 11 },
  INKY: { x: 12, y: 11 },
  CLYDE: { x: 14, y: 11 },
};

// --- PACMAN ---
export const PACMAN_START_POS = { x: 13, y: 23 };
export const PACMAN_START_LIVES = 3;
export const EXTRA_LIFE_SCORE = 10000;
