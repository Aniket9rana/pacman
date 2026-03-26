import Ghost from "../entities/Ghost.js";
import * as C from "../constants.js";

export default class Clyde extends Ghost {
  constructor(x, y, maze, pacman) {
    super(x, y, maze, pacman, C.COLORS.CLYDE);
    // Clyde's scatter target is the bottom-left corner
    this.scatterTarget = { x: 0, y: C.MAP_HEIGHT_TILES + 1 };
  }

  getTargetTile() {
    if (this.mode === C.GHOST_MODES.CHASE) {
      const pacmanTile = this.pacman.getTile();
      const clydeTile = this.getTile();

      // Calculate the distance from Clyde to Pac-Man
      const distance = Math.hypot(
        clydeTile.x - pacmanTile.x,
        clydeTile.y - pacmanTile.y,
      );

      // If Clyde is farther than 8 tiles away, he targets Pac-Man directly.
      if (distance > 8) {
        return pacmanTile;
      } else {
        // Otherwise, he flees to his scatter corner.
        return this.scatterTarget;
      }
    }
    // For other modes, use the default behavior
    return super.getTargetTile();
  }
}
