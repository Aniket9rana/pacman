import Entity from "./Entity.js";
import * as C from "../constants.js";

export default class PacMan extends Entity {
  constructor(x, y, maze, input) {
    super(x, y, maze);
    this.input = input;
    this.speed = C.PACMAN_SPEED;
    this.startPos = { x, y };
  }

  update(deltaTime) {
    // Get desired direction from input handler
    const desiredDirection = this.input.getDirection();

    // If a new direction is desired, try to set it.
    // The parent Entity class will handle the logic of when to actually turn.
    if (desiredDirection) {
      this.setDirection(desiredDirection);
    }

    const oldDirection = this.direction;

    // Call the parent update method to handle movement and animation
    super.update(deltaTime);

    // Keep the input handler's current direction in sync with PacMan's actual direction.
    this.input.setCurrentDirection(this.direction);

    // If we successfully turned, clear the input buffer.
    if (this.direction !== oldDirection) {
      this.input.clearBuffer();
    }
  }

  reset() {
    this.x = this.startPos.x;
    this.y = this.startPos.y;
    this.direction = C.DIRS.STOP;
    this.nextDirection = C.DIRS.STOP;
    this.isMoving = false;
    this.input.clearBuffer();
    this.input.setCurrentDirection(C.DIRS.STOP);
  }
}
