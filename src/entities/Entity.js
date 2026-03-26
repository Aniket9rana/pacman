import { DIRS, TILE_SIZE, MAP_WIDTH_TILES } from "../constants.js";

export default class Entity {
  constructor(x, y, maze) {
    this.x = x;
    this.y = y;
    this.maze = maze;

    this.speed = 0; // Tiles per second
    this.direction = DIRS.STOP;
    this.nextDirection = DIRS.STOP;

    this.isMoving = false;
    this.animTimer = 0;
  }

  update(deltaTime) {
    this.animTimer += deltaTime;
    this.move(deltaTime);
  }

  move(deltaTime) {
    const moveAmount = this.speed * deltaTime;

    // --- Handle turning ---
    // Check if we can apply the next intended direction
    if (this.nextDirection !== DIRS.STOP && this.nextDirection !== this.direction && this.canTurn()) {
      // Check if the turn is valid
      const nextTileX = Math.round(this.x) + this.nextDirection.x;
      const nextTileY = Math.round(this.y) + this.nextDirection.y;
      if (!this.maze.isWall(nextTileX, nextTileY)) {
        this.direction = this.nextDirection;
        this.nextDirection = DIRS.STOP;
        // Snap to grid for perfect turns. Use round to match canTurn offset base.
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
      }
    }

    // --- Handle movement and wall collision ---
    const nextX = this.x + this.direction.x * moveAmount;
    const nextY = this.y + this.direction.y * moveAmount;

    // Stop if moving into a wall
    const wallCheckX = Math.round(this.x) + this.direction.x;
    const wallCheckY = Math.round(this.y) + this.direction.y;
    
    let stoppedByWall = false;
    if (this.direction !== DIRS.STOP && this.maze.isWall(wallCheckX, wallCheckY)) {
      if (this.direction.x === 1 && nextX > Math.round(this.x)) stoppedByWall = true;
      if (this.direction.x === -1 && nextX < Math.round(this.x)) stoppedByWall = true;
      if (this.direction.y === 1 && nextY > Math.round(this.y)) stoppedByWall = true;
      if (this.direction.y === -1 && nextY < Math.round(this.y)) stoppedByWall = true;
    }

    if (stoppedByWall) {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      this.direction = DIRS.STOP;
      this.isMoving = false;
    } else {
      this.x = nextX;
      this.y = nextY;
      this.isMoving = this.direction !== DIRS.STOP;
    }

    // --- Handle tunnel wrapping ---
    if (this.y === 14) {
      if (this.x < -1) {
        this.x = MAP_WIDTH_TILES;
      } else if (this.x > MAP_WIDTH_TILES) {
        this.x = -1;
      }
    }
  }

  // Checks if the entity is close enough to the center of a tile to make a turn.
  canTurn() {
    // If we're not moving, we can always choose a direction.
    if (this.direction === DIRS.STOP) {
      return true;
    }
    const tolerance = 0.1; // 10% of a tile
    const xOffset = Math.abs(this.x - Math.round(this.x));
    const yOffset = Math.abs(this.y - Math.round(this.y));
    return xOffset < tolerance && yOffset < tolerance;
  }



  setDirection(dir) {
    this.nextDirection = dir;
  }

  getTile() {
    return {
      x: Math.floor(this.x),
      y: Math.floor(this.y),
    };
  }

  reset() {
    // To be implemented by subclasses
  }
}
