import Entity from "./Entity.js";
import * as C from "../constants.js";
import Tile from "../maze/Tile.js";

let ghostId = 0;

export default class Ghost extends Entity {
  constructor(x, y, maze, pacman, color) {
    super(x, y, maze);
    this.pacman = pacman;
    this.color = color;
    this.id = ghostId++;

    this.startPos = { x, y };
    this.scatterTarget = { x: 0, y: 0 }; // To be set by subclasses

    this.mode = C.GHOST_MODES.SCATTER;
    this.speed = C.GHOST_SPEED;

    this.frightTimer = 0;
    this.lastTurnTileX = -1;
    this.lastTurnTileY = -1;
  }

  update(deltaTime) {
    if (this.mode === C.GHOST_MODES.FRIGHTENED) {
      this.frightTimer -= deltaTime * 1000;
      if (this.frightTimer <= 0) {
        this.switchMode(C.GHOST_MODES.CHASE); // Or scatter, depending on game logic
      }
    } else if (this.mode === C.GHOST_MODES.RETURNING) {
      if (Math.round(this.x) === C.GHOST_HOUSE_EXIT_POS.x && Math.round(this.y) === C.GHOST_HOUSE_EXIT_POS.y) {
        this.switchMode(C.GHOST_MODES.CHASE);
      }
    }

    // Only choose a new direction at an intersection
    const currentTileX = Math.round(this.x);
    const currentTileY = Math.round(this.y);

    if (this.canTurn() && (this.lastTurnTileX !== currentTileX || this.lastTurnTileY !== currentTileY)) {
      this.lastTurnTileX = currentTileX;
      this.lastTurnTileY = currentTileY;
      this.x = currentTileX;
      this.y = currentTileY;
      this.chooseNextDirection();
    }

    super.update(deltaTime);
  }

  chooseNextDirection() {
    const possibleDirs = this.getPossibleDirections();
    let bestDir = C.DIRS.STOP;
    let minDistance = Infinity;

    const target = this.getTargetTile();

    for (const dir of possibleDirs) {
      const nextTileX = this.getTile().x + dir.x;
      const nextTileY = this.getTile().y + dir.y;
      const distance = Math.hypot(nextTileX - target.x, nextTileY - target.y);

      if (distance < minDistance) {
        minDistance = distance;
        bestDir = dir;
      }
    }
    this.direction = bestDir;
  }

  getPossibleDirections() {
    const { x: tileX, y: tileY } = this.getTile();
    const dirs = [C.DIRS.UP, C.DIRS.DOWN, C.DIRS.LEFT, C.DIRS.RIGHT];

    // Ghosts cannot reverse direction
    const oppositeDir = { x: -this.direction.x, y: -this.direction.y };

    return dirs.filter((dir) => {
      // Cannot be opposite direction
      if (dir.x === oppositeDir.x && dir.y === oppositeDir.y) {
        return false;
      }
      // Cannot be a wall
      const nextTile = this.maze.getTile(tileX + dir.x, tileY + dir.y);
      if (nextTile === Tile.WALL) {
        return false;
      }
      // Cannot enter ghost house unless in RETURNING mode
      if (
        nextTile === Tile.GHOST_HOUSE &&
        this.mode !== C.GHOST_MODES.RETURNING
      ) {
        // Allow if we are currently inside the ghost house (so we can navigate out)
        const currentTileType = this.maze.getTile(tileX, tileY);
        if (currentTileType !== Tile.GHOST_HOUSE) {
          return false;
        }
      }
      return true;
    });
  }

  getTargetTile() {
    const tile = this.getTile();
    const currentTileType = this.maze.getTile(tile.x, tile.y);
    if (
      currentTileType === Tile.GHOST_HOUSE &&
      this.mode !== C.GHOST_MODES.RETURNING
    ) {
      return { x: 13, y: 8 };
    }

    switch (this.mode) {
      case C.GHOST_MODES.CHASE:
        // Implemented by subclasses
        return this.pacman.getTile();
      case C.GHOST_MODES.SCATTER:
        return this.scatterTarget;
      case C.GHOST_MODES.FRIGHTENED:
        // Move randomly
        return {
          x: Math.random() * C.MAP_WIDTH_TILES,
          y: Math.random() * C.MAP_HEIGHT_TILES,
        };
      case C.GHOST_MODES.RETURNING:
        return C.GHOST_HOUSE_EXIT_POS;
    }
    return { x: 0, y: 0 };
  }

  switchMode(newMode) {
    if (this.mode === C.GHOST_MODES.RETURNING) return; // Cannot be interrupted
    this.mode = newMode;

    if (this.mode === C.GHOST_MODES.FRIGHTENED) {
      this.speed = C.GHOST_FRIGHT_SPEED;
      this.frightTimer = C.FRIGHTENED_TIME;
    } else {
      this.speed = C.GHOST_SPEED;
    }
  }

  frighten() {
    if (this.mode !== C.GHOST_MODES.RETURNING) {
      this.switchMode(C.GHOST_MODES.FRIGHTENED);
      // Reverse direction when frightened
      this.direction = { x: -this.direction.x, y: -this.direction.y };
    }
  }

  returnToHouse() {
    this.mode = C.GHOST_MODES.RETURNING;
    this.speed = C.GHOST_RETURN_SPEED;
  }

  reset() {
    this.x = this.startPos.x;
    this.y = this.startPos.y;
    this.mode = C.GHOST_MODES.SCATTER;
    this.speed = C.GHOST_SPEED;
    this.direction = C.DIRS.STOP;
    this.frightTimer = 0;
    this.lastTurnTileX = -1;
    this.lastTurnTileY = -1;
  }
}
