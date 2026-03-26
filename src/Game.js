import * as C from "./constants.js";
import Maze from "./maze/Maze.js";
import PacMan from "./entities/PacMan.js";
import Blinky from "./ghosts/Blinky.js";
import Pinky from "./ghosts/Pinky.js";
import Inky from "./ghosts/Inky.js";
import Clyde from "./ghosts/Clyde.js";

export default class Game {
  constructor(renderer, input, sound) {
    this.renderer = renderer;
    this.input = input;
    this.sound = sound;

    this.state = C.GAME_STATE.START;
    this.score = 0;
    this.highScore = 0;
    this.lives = 0;
    this.level = 1;
    this.extraLifeAwarded = false;

    this.maze = null;
    this.pacman = null;
    this.ghosts = [];

    this.timer = 0;
    this.ghostModeTimer = 0;
    this.ghostModeIndex = 0;
    this.frightenedPelletsEaten = 0;
  }

  init() {
    this.highScore =
      parseInt(localStorage.getItem("pacman_highScore"), 10) || 0;
    this.renderer.init();
  }

  start() {
    this.score = 0;
    this.lives = C.PACMAN_START_LIVES;
    this.level = 1;
    this.extraLifeAwarded = false;
    this.startLevel();
    this.sound.playIntro();
    this.setState(C.GAME_STATE.READY);
  }

  restart() {
    this.state = C.GAME_STATE.START;
  }

  startLevel() {
    this.maze = new Maze();
    this.pacman = new PacMan(
      C.PACMAN_START_POS.x,
      C.PACMAN_START_POS.y,
      this.maze,
      this.input,
    );

    const blinky = new Blinky(
      C.GHOST_START_POS.BLINKY.x,
      C.GHOST_START_POS.BLINKY.y,
      this.maze,
      this.pacman,
    );
    this.ghosts = [
      blinky,
      new Pinky(
        C.GHOST_START_POS.PINKY.x,
        C.GHOST_START_POS.PINKY.y,
        this.maze,
        this.pacman,
      ),
      new Inky(
        C.GHOST_START_POS.INKY.x,
        C.GHOST_START_POS.INKY.y,
        this.maze,
        this.pacman,
        blinky,
      ), // Inky needs Blinky
      new Clyde(
        C.GHOST_START_POS.CLYDE.x,
        C.GHOST_START_POS.CLYDE.y,
        this.maze,
        this.pacman,
      ),
    ];

    this.timer = 0;
    this.ghostModeTimer = 0;
    this.ghostModeIndex = 0;
  }

  setState(newState) {
    this.state = newState;
    this.timer = 0;
  }

  togglePause() {
    if (this.state === C.GAME_STATE.PLAYING) {
      this.setState(C.GAME_STATE.PAUSED);
    } else if (this.state === C.GAME_STATE.PAUSED) {
      this.setState(C.GAME_STATE.PLAYING);
    }
  }

  update(deltaTime) {
    this.timer += deltaTime * 1000;

    switch (this.state) {
      case C.GAME_STATE.READY:
        if (this.timer > C.READY_TIME) {
          this.setState(C.GAME_STATE.PLAYING);
        }
        break;
      case C.GAME_STATE.PLAYING:
        this.updateEntities(deltaTime);
        this.checkCollisions();
        this.checkPellets();
        this.updateGhostMode(deltaTime);
        break;
      case C.GAME_STATE.LEVEL_CLEAR:
        if (this.timer > 2000) {
          this.level++;
          this.startLevel();
          this.setState(C.GAME_STATE.READY);
        }
        break;
      // Other states (PAUSED, GAME_OVER, etc.) halt updates.
    }
  }

  updateEntities(deltaTime) {
    this.pacman.update(deltaTime);
    this.ghosts.forEach((ghost) => ghost.update(deltaTime));
  }

  updateGhostMode(deltaTime) {
    // Frightened mode overrides scatter/chase
    if (this.ghosts.some((g) => g.mode === C.GHOST_MODES.FRIGHTENED)) {
      return;
    }

    this.ghostModeTimer += deltaTime * 1000;
    const switchTime = C.GHOST_MODE_SWITCH_TIMES[this.ghostModeIndex];

    if (this.ghostModeTimer > switchTime) {
      this.ghostModeTimer = 0;
      this.ghostModeIndex++;
      const newMode =
        this.ghostModeIndex % 2 === 0
          ? C.GHOST_MODES.SCATTER
          : C.GHOST_MODES.CHASE;
      this.ghosts.forEach((g) => g.switchMode(newMode));

      // If we've gone through all modes, just stay in chase
      if (this.ghostModeIndex >= C.GHOST_MODE_SWITCH_TIMES.length) {
        this.ghostModeIndex = C.GHOST_MODE_SWITCH_TIMES.length - 1;
      }
    }
  }

  checkPellets() {
    const tile = this.pacman.getTile();
    const pellet = this.maze.eatPellet(tile.x, tile.y);

    if (pellet) {
      if (pellet.isPowerPellet) {
        this.addScore(C.SCORES.POWER_PELLET);
        this.sound.playPowerPellet();
        this.frightenGhosts();
      } else {
        this.addScore(C.SCORES.PELLET);
        this.sound.playChomp();
      }
    }

    // Check for level clear
    if (this.maze.pelletCount === 0) {
      this.setState(C.GAME_STATE.LEVEL_CLEAR);
      this.sound.playLevelClear();
    }
  }

  frightenGhosts() {
    this.frightenedPelletsEaten = 0;
    this.ghosts.forEach((ghost) => ghost.frighten());
    // Reset scatter/chase timer
    this.ghostModeTimer = 0;
    this.ghostModeIndex = 0;
  }

  checkCollisions() {
    const pacmanTile = this.pacman.getTile();
    for (const ghost of this.ghosts) {
      const ghostTile = ghost.getTile();
      if (pacmanTile.x === ghostTile.x && pacmanTile.y === ghostTile.y) {
        this.handlePacmanGhostCollision(ghost);
      }
    }
  }

  handlePacmanGhostCollision(ghost) {
    if (ghost.mode === C.GHOST_MODES.FRIGHTENED) {
      const score = C.SCORES.GHOST_COMBO[this.frightenedPelletsEaten];
      this.addScore(score);
      this.frightenedPelletsEaten++;
      ghost.returnToHouse();
      this.sound.playGhostEat();
    } else if (ghost.mode !== C.GHOST_MODES.RETURNING) {
      this.loseLife();
    }
  }

  loseLife() {
    this.lives--;
    this.sound.playDeath();
    if (this.lives < 0) {
      this.setState(C.GAME_STATE.GAME_OVER);
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem("pacman_highScore", this.highScore);
      }
    } else {
      // Reset positions for next life
      this.pacman.reset();
      this.ghosts.forEach((g) => g.reset());
      this.setState(C.GAME_STATE.READY);
    }
  }

  addScore(points) {
    this.score += points;
    if (!this.extraLifeAwarded && this.score >= C.EXTRA_LIFE_SCORE) {
      this.lives++;
      this.extraLifeAwarded = true;
      this.sound.playExtraLife();
    }
  }
}
