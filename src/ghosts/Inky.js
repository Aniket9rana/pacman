import Ghost from "../entities/Ghost.js";
import * as C from "../constants.js";

export default class Inky extends Ghost {
  constructor(x, y, maze, pacman, blinky) {
    super(x, y, maze, pacman, C.COLORS.INKY);
    this.blinky = blinky; // Inky needs a reference to Blinky for his targeting
    // Inky's scatter target is the bottom-right corner
    this.scatterTarget = { x: C.MAP_WIDTH_TILES, y: C.MAP_HEIGHT_TILES + 1 };
  }

  getTargetTile() {
    if (this.mode === C.GHOST_MODES.CHASE) {
      // Inky's targeting is the most complex.
      // 1. Find the tile 2 spaces in front of Pac-Man.
      const pacmanTile = this.pacman.getTile();
      const pacmanDir = this.pacman.direction;
      const pivot = {
        x: pacmanTile.x + pacmanDir.x * 2,
        y: pacmanTile.y + pacmanDir.y * 2,
      };

      // 2. Get Blinky's current position.
      const blinkyTile = this.blinky.getTile();

      // 3. Calculate the vector from Blinky to the pivot point.
      const vectorX = pivot.x - blinkyTile.x;
      const vectorY = pivot.y - blinkyTile.y;

      // 4. Double the vector to get the final target.
      return {
        x: blinkyTile.x + vectorX * 2,
        y: blinkyTile.y + vectorY * 2,
      };
    }
    // For other modes, use the default behavior
    return super.getTargetTile();
  }
}
