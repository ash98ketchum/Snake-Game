# Snake-Game
Snake Game

A modern, responsive Snake game built with HTML5 Canvas and vanilla JavaScript. Features dynamic scaling for any screen size, keyboard and touch controls, customizable themes, and fun game-over messages.

🎮 Game Overview

Objective: Guide the snake to eat food pieces, grow in length, and avoid colliding with walls or its own body.

Countdown: A 3‑2‑1 countdown before each game start.

Personalization: Enter your name to display custom player and snake titles.

Speed Scaling: The snake speeds up as you score more points.

Game‑Over Modal: Fun messages tailored to your performance.

🚀 Installation & Setup

Clone the repository

git clone https://github.com/yourusername/snake-game.git
cd snake-game

Open in Browser
Simply open index.html in your favorite browser. No build tools or servers required.

🛠️ Usage

Enter Your Name: Type your name and hit Start.

Countdown: Watch the 3‑2‑1 countdown.

Control the Snake:

Desktop: Arrow keys or WASD

Mobile/Tablet: On‑screen buttons (Up/Down/Left/Right)

Eat Food: Each food piece increases your length and score.

Avoid Collisions: Hitting a wall or your own body ends the game.

Play Again: Use the Play Again button on the game-over modal.

⚙️ Configuration

All game settings live in main.js under the config object:

const config = {
  gridSize: 20,           // Number of rows/columns in the grid
  initialSpeed: 150,      // Starting interval (ms) between frames
  speedIncrease: 2,       // ms reduction per food eaten
  foodColors: [...],      // Array of food glow colors
  snakeHeadColor: '#72edf2',
  snakeBodyColor: '#4eacfc'
};

Feel free to tweak these values to change grid size, speed, and colors.

📁 Project Structure

┌── index.html        # Main HTML file
├── styles.css        # All game and UI styles
└── main.js           # Game logic and rendering

🤝 Contributing

Contributions, issues, and feature requests are welcome:

Fork the repo

Create a feature branch (git checkout -b feature/my-feature)

Commit your changes (git commit -am 'Add my feature')

Push to the branch (git push origin feature/my-feature)

Open a Pull Request

