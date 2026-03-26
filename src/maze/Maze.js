import { MAZE_LAYOUT } from "./mazeLayout.js";
import Tile from "./Tile.js";

class Pellet {
  constructor(x, y, isPowerPellet = false) {
    this.x = x;
    this.y = y;
    this.isPowerPellet = isPowerPellet;
    this.eaten = false;
  }
}

export default class Maze {
  constructor() {
    this.grid = MAZE_LAYOUT.map((row) => [...row]); // Create a mutable copy
    this.pellets = [];
    this.pelletCount = 0;
    this.initPellets();
  }

  initPellets() {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        const tile = this.grid[y][x];
        if (tile === Tile.PELLET || tile === Tile.POWER_PELLET) {
          const isPower = tile === Tile.POWER_PELLET;
          this.pellets.push(new Pellet(x, y, isPower));
          if (!isPower) {
            this.pelletCount++;
          }
        }
      }
    }
  }

  // Returns the type of tile at a given grid coordinate
  getTile(x, y) {
    if (x < 0 || x >= this.grid[0].length || y < 0 || y >= this.grid.length) {
      // Handle the wrap-around tunnel
      if (y === 14) {
        if (x < 0) return this.grid[14][this.grid[0].length - 1];
        if (x >= this.grid[0].length) return this.grid[14][0];
      }
      return Tile.WALL; // Should not happen with proper movement
    }
    return this.grid[y][x];
  }

  isWall(x, y) {
    const tile = this.getTile(x, y);
    return tile === Tile.WALL;
  }

  isGhostHouse(x, y) {
    return this.getTile(x, y) === Tile.GHOST_HOUSE;
  }

  eatPellet(x, y) {
    const pellet = this.pellets.find((p) => p.x === x && p.y === y && !p.eaten);
    if (pellet) {
      pellet.eaten = true;
      if (!pellet.isPowerPellet) {
        this.pelletCount--;
      }
      return pellet;
    }
    return null;
  }
}
