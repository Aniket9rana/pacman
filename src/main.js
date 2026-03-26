import Game from "./Game.js";
import Renderer from "./Renderer.js";
import InputHandler from "./InputHandler.js";
import SoundManager from "./SoundManager.js";
import * as C from "./constants.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game-canvas");
  const gameContainer = document.getElementById("game-container");

  const renderer = new Renderer(canvas);
  const input = new InputHandler();
  const sound = new SoundManager();
  const game = new Game(renderer, input, sound);

  // --- DOM Elements ---
  const uiOverlay = document.getElementById("ui-overlay");
  const startScreen = document.getElementById("start-screen");
  const pauseScreen = document.getElementById("pause-screen");
  const gameOverScreen = document.getElementById("game-over-screen");
  const levelClearScreen = document.getElementById("level-clear-screen");
  const readyText = document.getElementById("ready-text");

  const startButton = document.getElementById("start-button");
  const resumeButton = document.getElementById("resume-button");
  const restartButton = document.getElementById("restart-button");

  const scoreEl = document.getElementById("score");
  const highScoreEl = document.getElementById("high-score");
  const highScoreScreenEl = document.getElementById("high-score-screen");
  const finalScoreEl = document.getElementById("final-score");
  const livesContainer = document.getElementById("lives-container");
  const levelEl = document.getElementById("level");

  // --- Game State UI Updates ---
  function updateUI() {
    scoreEl.textContent = game.score.toString().padStart(4, "0");
    highScoreEl.textContent = game.highScore.toString().padStart(4, "0");
    if (highScoreScreenEl) {
      highScoreScreenEl.textContent = game.highScore.toString().padStart(4, "0");
    }
    levelEl.textContent = game.level;

    // Update lives display with neon glow effect (via class or just img)
    livesContainer.innerHTML = "";
    for (let i = 0; i < game.lives; i++) {
      const lifeIcon = document.createElement("img");
      lifeIcon.src = "assets/pacman_life.svg";
      lifeIcon.alt = "Life";
      lifeIcon.style.width = "24px";
      lifeIcon.style.filter = "drop-shadow(0 0 5px #FFFF00)";
      livesContainer.appendChild(lifeIcon);
    }

    // Handle screen visibility based on game state
    const currentStatus = game.state;
    startScreen.style.display = currentStatus === C.GAME_STATE.START ? "flex" : "none";
    pauseScreen.style.display = currentStatus === C.GAME_STATE.PAUSED ? "flex" : "none";
    gameOverScreen.style.display = currentStatus === C.GAME_STATE.GAME_OVER ? "flex" : "none";
    levelClearScreen.style.display = currentStatus === C.GAME_STATE.LEVEL_CLEAR ? "flex" : "none";
    readyText.style.display = currentStatus === C.GAME_STATE.READY ? "block" : "none";

    if (currentStatus === C.GAME_STATE.PLAYING) {
      uiOverlay.style.display = "none";
    } else {
      uiOverlay.style.display = "flex";
      if (currentStatus === C.GAME_STATE.READY) {
        uiOverlay.style.backgroundColor = "transparent";
        uiOverlay.style.backdropFilter = "none";
      } else {
        uiOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        uiOverlay.style.backdropFilter = "blur(4px)";
      }
    }

    if (currentStatus === C.GAME_STATE.GAME_OVER) {
      finalScoreEl.textContent = game.score.toString().padStart(4, "0");
    }
  }

  // --- Event Listeners ---
  startButton.addEventListener("click", () => {
    game.start();
    sound.resumeAudioContext();
  });
  resumeButton.addEventListener("click", () => game.togglePause());
  restartButton.addEventListener("click", () => game.restart());

  // Listen for pause key
  window.addEventListener("keydown", (e) => {
    if (e.key === "p" || e.key === "P" || e.key === "Escape") {
      game.togglePause();
    }
  });

  // --- Resize Handling ---
  function resizeCanvas() {
    const aspectRatio = C.MAP_WIDTH / C.MAP_HEIGHT;
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;

    let newWidth, newHeight;

    if (containerWidth / containerHeight > aspectRatio) {
      newHeight = containerHeight;
      newWidth = newHeight * aspectRatio;
    } else {
      newWidth = containerWidth;
      newHeight = newWidth / aspectRatio;
    }

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
    
    // Ensure the canvas is centered if container is larger
    canvas.style.marginTop = `${(containerHeight - newHeight) / 2}px`;
  }

  window.addEventListener("resize", resizeCanvas);

  // --- Main Loop ---
  let lastTime = 0;
  function gameLoop(timestamp) {
    let deltaTime = 0;
    if (lastTime > 0) {
      deltaTime = (timestamp - lastTime) / 1000;
    }
    lastTime = timestamp;

    game.update(deltaTime);
    renderer.draw(game);
    updateUI();

    requestAnimationFrame(gameLoop);
  }

  // --- Initialization ---
  game.init();
  resizeCanvas();
  updateUI();
  requestAnimationFrame(gameLoop);
});
