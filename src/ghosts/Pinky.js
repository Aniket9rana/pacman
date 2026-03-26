import Ghost from "../entities/Ghost.js";
import * as C from "../constants.js";

export default class Pinky extends Ghost {
  constructor(x, y, maze, pacman) {
    super(x, y, maze, pacman, C.COLORS.PINKY);
    // Pinky's scatter target is the top-left corner
    this.scatterTarget = { x: -2, y: -2 };
  }

  getTargetTile() {
    if (this.mode === C.GHOST_MODES.CHASE) {
      // Pinky tries to ambush Pac-Man by targeting 4 tiles in front of him.
      const pacmanTile = this.pacman.getTile();
      const pacmanDir = this.pacman.direction;

      // A special case from the original game: when Pac-Man is moving up,
      // the target is 4 tiles up AND 4 tiles to the left.
      if (pacmanDir === C.DIRS.UP) {
        return {
          x: pacmanTile.x - 4,
          y: pacmanTile.y - 4,
        };
      }

      return {
        x: pacmanTile.x + pacmanDir.x * 4,
        y: pacmanTile.y + pacmanDir.y * 4,
      };
    }
    // For other modes, use the default behavior from the Ghost class
    return super.getTargetTile();
  }
}
