import { DIRS } from "./constants.js";

export default class InputHandler {
  constructor() {
    this.currentDirection = DIRS.STOP;
    this.bufferedDirection = null;

    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
  }

  handleKeyDown(e) {
    let newDirection = null;
    switch (e.key) {
      case "ArrowUp":
      case "w":
        newDirection = DIRS.UP;
        break;
      case "ArrowDown":
      case "s":
        newDirection = DIRS.DOWN;
        break;
      case "ArrowLeft":
      case "a":
        newDirection = DIRS.LEFT;
        break;
      case "ArrowRight":
      case "d":
        newDirection = DIRS.RIGHT;
        break;
    }

    if (newDirection) {
      // Prevent the browser from scrolling
      e.preventDefault();

      // If there's an immediate move to be made, it will be handled by PacMan.
      // We buffer the input so if the player presses a turn key before
      // reaching an intersection, the turn is executed as soon as possible.
      this.bufferedDirection = newDirection;
    }
  }

  // Called by PacMan to get the next intended direction
  getDirection() {
    // If there's a buffered direction, prioritize it.
    if (this.bufferedDirection) {
      const dir = this.bufferedDirection;
      // The buffer is cleared once PacMan requests it, but only if it's a valid move.
      // PacMan itself will handle clearing it upon a successful turn.
      return dir;
    }
    return this.currentDirection;
  }

  // Called by PacMan after it successfully makes a turn using the buffer.
  clearBuffer() {
    this.bufferedDirection = null;
  }

  // Called by PacMan to set its current direction of travel.
  setCurrentDirection(dir) {
    this.currentDirection = dir;
  }
}
