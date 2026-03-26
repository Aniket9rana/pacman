# Pac-Man Neon Arcade

A classic Pac-Man game recreation with a vibrant, neon-themed aesthetic. This project is a web-based game built with plain JavaScript, HTML, and CSS.

![Gameplay Screenshot](https://i.imgur.com/example.png) *(Note: Add a real screenshot here)*

## How to Play

- **Arrow Keys**: Move Pac-Man through the maze.
- **'P' or 'ESC'**: Pause and resume the game.

The objective is to eat all the dots in the maze while avoiding the ghosts. Eating a power pellet will temporarily allow you to eat the ghosts for extra points.

## Features

- Classic Pac-Man gameplay.
- Neon-style graphics and UI.
- High score tracking.
- Sound effects for key game events.
- Multiple levels of increasing difficulty.
- Pause and resume functionality.

## Getting Started

To run this game locally, you don't need any complex setup. Since it is built with standard web technologies, you only need a modern web browser.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Aniket9rana/pacman.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd pacman-game
    ```
3.  **Open `index.html` in your browser.**

    You can simply double-click the `index.html` file, or right-click and choose "Open with" your favorite browser.

    For the best experience, it's recommended to serve the files using a local web server to avoid any potential issues with browser security policies regarding local files. If you have Python, you can run:
    ```bash
    python -m http.server
    ```
    Or if you have Node.js and `live-server` installed:
    ```bash
    live-server
    ```

## Technologies Used

- **JavaScript (ES6 Modules)**: Core game logic, character movement, and state management.
- **HTML5 Canvas**: Rendering the game board, characters, and all visual elements.
- **CSS3**: Styling the user interface, including the start, pause, and game-over screens.
- **No external libraries or frameworks** were used, keeping the project lightweight and focused on fundamental web technologies.

## Project Structure

```
/
├── assets/         # Images and sound files
├── src/            # JavaScript source code
│   ├── entities/   # Pac-Man and Ghost classes
│   ├── ghosts/     # AI for each individual ghost
│   ├── maze/       # Maze generation and tile logic
│   ├── constants.js
│   ├── Game.js     # Main game state machine
│   ├── InputHandler.js
│   ├── main.js     # Entry point, game loop
│   ├── Renderer.js # Handles all drawing on the canvas
│   └── SoundManager.js
├── styles/         # CSS stylesheets
├── index.html      # Main HTML file
└── README.md
```
