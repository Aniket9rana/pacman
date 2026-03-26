import Ghost from "../entities/Ghost.js";
import * as C from "../constants.js";

export default class Blinky extends Ghost {
  constructor(x, y, maze, pacman) {
    super(x, y, maze, pacman, C.COLORS.BLINKY);
    // Blinky's scatter target is the top-right corner
    this.scatterTarget = { x: C.MAP_WIDTH_TILES - 2, y: -2 };
  }

  // Blinky's chase logic is to target Pac-Man's current tile directly.
  // This is the default behavior of the base Ghost class, so we don't need to override getTargetTile().
}
