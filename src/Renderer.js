import * as C from "./constants.js";
import Tile from "./maze/Tile.js";

export default class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.canvas.width = C.MAP_WIDTH;
    this.canvas.height = C.MAP_HEIGHT;
  }

  init() {
    this.mazeCanvas = document.createElement("canvas");
    this.mazeCanvas.width = this.canvas.width;
    this.mazeCanvas.height = this.canvas.height;
    this.mazeCtx = this.mazeCanvas.getContext("2d");
    
    // Disable smoothing for sharp pixels
    this.ctx.imageSmoothingEnabled = false;
    this.mazeCtx.imageSmoothingEnabled = false;

    this.mazePreRendered = false;
  }

  draw(game) {
    this.clear();
    if (!game.maze) return;

    this.drawMaze(game.maze);
    this.drawPellets(game.maze);
    this.drawPacman(game.pacman);
    game.ghosts.forEach((ghost) => this.drawGhost(ghost, game));
  }

  clear() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawMaze(maze) {
    // Only redraw the static maze once (pre-render optimization)
    if (!this.mazePreRendered) {
      this.mazeCtx.fillStyle = "#000";
      this.mazeCtx.fillRect(0, 0, this.mazeCanvas.width, this.mazeCanvas.height);
      
      // Draw a subtle grid background
      this.mazeCtx.strokeStyle = "rgba(0, 255, 255, 0.05)";
      this.mazeCtx.lineWidth = 1;
      this.mazeCtx.beginPath();
      for (let x = 0; x <= C.MAP_WIDTH; x += C.TILE_SIZE) {
        this.mazeCtx.moveTo(x, 0);
        this.mazeCtx.lineTo(x, C.MAP_HEIGHT);
      }
      for (let y = 0; y <= C.MAP_HEIGHT; y += C.TILE_SIZE) {
        this.mazeCtx.moveTo(0, y);
        this.mazeCtx.lineTo(C.MAP_WIDTH, y);
      }
      this.mazeCtx.stroke();

      this.mazeCtx.strokeStyle = C.COLORS.MAZE_WALL;
      this.mazeCtx.lineWidth = 2;
      this.mazeCtx.lineCap = "round";
      this.mazeCtx.shadowBlur = 8;
      this.mazeCtx.shadowColor = C.COLORS.MAZE_WALL;

      this.mazeCtx.beginPath();
      for (let y = 0; y < C.MAP_HEIGHT_TILES; y++) {
        for (let x = 0; x < C.MAP_WIDTH_TILES; x++) {
          if (maze.grid[y][x] === Tile.WALL) {
            const centerX = (x + 0.5) * C.TILE_SIZE;
            const centerY = (y + 0.5) * C.TILE_SIZE;
            const left = x * C.TILE_SIZE + 4;
            const top = y * C.TILE_SIZE + 4;
            const right = (x + 1) * C.TILE_SIZE - 4;
            const bottom = (y + 1) * C.TILE_SIZE - 4;

            // Connect to neighbors
            let hasNeighbor = false;
            if (x > 0 && maze.grid[y][x-1] === Tile.WALL) {
              this.mazeCtx.moveTo(x * C.TILE_SIZE, centerY);
              this.mazeCtx.lineTo(centerX, centerY);
              hasNeighbor = true;
            }
            if (x < C.MAP_WIDTH_TILES - 1 && maze.grid[y][x+1] === Tile.WALL) {
              this.mazeCtx.moveTo(centerX, centerY);
              this.mazeCtx.lineTo((x + 1) * C.TILE_SIZE, centerY);
              hasNeighbor = true;
            }
            if (y > 0 && maze.grid[y-1][x] === Tile.WALL) {
              this.mazeCtx.moveTo(centerX, y * C.TILE_SIZE);
              this.mazeCtx.lineTo(centerX, centerY);
              hasNeighbor = true;
            }
            if (y < C.MAP_HEIGHT_TILES - 1 && maze.grid[y+1][x] === Tile.WALL) {
              this.mazeCtx.moveTo(centerX, centerY);
              this.mazeCtx.lineTo(centerX, (y + 1) * C.TILE_SIZE);
              hasNeighbor = true;
            }

            // If it's a "solo" wall tile (dots/corners in maze)
            if (!hasNeighbor) {
              this.mazeCtx.rect(left, top, right - left, bottom - top);
            }
          }
        }
      }
      this.mazeCtx.stroke();
      
      // Reset shadow for other drawings
      this.mazeCtx.shadowBlur = 0;

      // Ghost house door
      this.mazeCtx.strokeStyle = C.COLORS.UI_YELLOW;
      this.mazeCtx.lineWidth = 4;
      this.mazeCtx.beginPath();
      this.mazeCtx.moveTo(13 * C.TILE_SIZE, 11.5 * C.TILE_SIZE);
      this.mazeCtx.lineTo(15 * C.TILE_SIZE, 11.5 * C.TILE_SIZE);
      this.mazeCtx.stroke();

      this.mazePreRendered = true;
    }

    this.ctx.drawImage(this.mazeCanvas, 0, 0);
  }

  drawPellets(maze) {
    this.ctx.fillStyle = C.COLORS.MAZE_DOT;
    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = C.COLORS.MAZE_DOT;
    const offset = C.TILE_SIZE / 2;
    
    for (const pellet of maze.pellets) {
      if (pellet.eaten) continue;

      this.ctx.beginPath();
      if (pellet.isPowerPellet) {
        const pulseSize = Math.sin(Date.now() / 150) * 2 + 8;
        this.ctx.arc(
          pellet.x * C.TILE_SIZE + offset,
          pellet.y * C.TILE_SIZE + offset,
          pulseSize,
          0,
          2 * Math.PI,
        );
      } else {
        this.ctx.arc(
          pellet.x * C.TILE_SIZE + offset,
          pellet.y * C.TILE_SIZE + offset,
          2.5,
          0,
          2 * Math.PI,
        );
      }
      this.ctx.fill();
    }
    this.ctx.shadowBlur = 0;
  }

  drawPacman(pacman) {
    const x = pacman.x * C.TILE_SIZE + C.TILE_SIZE / 2;
    const y = pacman.y * C.TILE_SIZE + C.TILE_SIZE / 2;

    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(pacman.direction.angle);

    this.ctx.fillStyle = C.COLORS.PACMAN;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = C.COLORS.PACMAN;
    this.ctx.beginPath();

    const mouthAngle = pacman.isMoving
      ? (Math.sin(pacman.animTimer * 20) * 0.2 + 0.2) * Math.PI
      : 0.4 * Math.PI;
    this.ctx.arc(0, 0, C.TILE_SIZE / 2, mouthAngle / 2, -mouthAngle / 2);
    this.ctx.lineTo(0, 0);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.restore();
  }

  drawGhost(ghost, game) {
    const x = ghost.x * C.TILE_SIZE + C.TILE_SIZE / 2;
    const y = ghost.y * C.TILE_SIZE + C.TILE_SIZE / 2;
    const size = C.TILE_SIZE;

    let color = ghost.color;
    if (ghost.mode === C.GHOST_MODES.FRIGHTENED) {
      const isEnding =
        ghost.frightTimer < 2000 &&
        Math.floor(ghost.frightTimer / 250) % 2 === 0;
      color = isEnding ? C.COLORS.FRIGHTENED_FLASH : C.COLORS.FRIGHTENED;
    }

    this.ctx.fillStyle = color;
    this.ctx.shadowBlur = 8;
    this.ctx.shadowColor = color;

    if (ghost.mode === C.GHOST_MODES.RETURNING) {
      this.ctx.fillStyle = C.COLORS.UI_WHITE;
      this.ctx.beginPath();
      this.ctx.arc(-size * 0.2, 0, size * 0.15, 0, Math.PI * 2);
      this.ctx.arc(size * 0.2, 0, size * 0.15, 0, Math.PI * 2);
      this.ctx.fill();
    } else {
      this.ctx.beginPath();
      this.ctx.arc(x, y - size * 0.1, size / 2, Math.PI, 0);
      this.ctx.lineTo(x + size / 2, y + size / 2);
      const anim = Math.sin((Date.now() + ghost.id * 100) / 150) * (size / 10);
      this.ctx.lineTo(x + size / 3, y + size / 2 - anim);
      this.ctx.lineTo(x, y + size / 2);
      this.ctx.lineTo(x - size / 3, y + size / 2 - anim);
      this.ctx.lineTo(x - size / 2, y + size / 2);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.fillStyle = C.COLORS.UI_WHITE;
      this.ctx.shadowBlur = 0;
      this.ctx.beginPath();
      this.ctx.arc(x - size * 0.2, y - size * 0.1, size * 0.15, 0, Math.PI * 2);
      this.ctx.arc(x + size * 0.2, y - size * 0.1, size * 0.15, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = "#000";
      const pupilOffsetX = ghost.direction.x * size * 0.05;
      const pupilOffsetY = ghost.direction.y * size * 0.05;
      this.ctx.beginPath();
      this.ctx.arc(x - size * 0.2 + pupilOffsetX, y - size * 0.1 + pupilOffsetY, size * 0.07, 0, Math.PI * 2);
      this.ctx.arc(x + size * 0.2 + pupilOffsetX, y - size * 0.1 + pupilOffsetY, size * 0.07, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}
