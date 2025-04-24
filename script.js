// Game configuration
const config = {
    gridSize: 20,
    initialSpeed: 150,
    speedIncrease: 2,
    foodColors: ['#e94560', '#ff9e00', '#72edf2', '#9896f1'],
    snakeHeadColor: '#72edf2',
    snakeBodyColor: '#4eacfc'
};

// Game state variables
let canvas, ctx;
let snake, food;
let direction, nextDirection;
let score;
let gameInterval;
let gameRunning = false;
let playerName = "Guest";

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const nameScreen = document.getElementById('name-screen');
    const countdownScreen = document.getElementById('countdown-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameOverModal = document.getElementById('game-over-modal');
    const startBtn = document.getElementById('start-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const countdownElement = document.getElementById('countdown');
    const playerNameElement = document.getElementById('player-name');
    const snakeNameElement = document.getElementById('snake-name');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('final-score');
    const finalMessageElement = document.getElementById('final-message');
    const usernameInput = document.getElementById('username');
    
    // Control buttons for mobile
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    
    // Setup canvas
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Setup event listeners
    startBtn.addEventListener('click', function() {
        // Get player name
        playerName = usernameInput.value.trim() || "Guest";
        playerNameElement.textContent = `Player: ${playerName}`;
        snakeNameElement.textContent = `Snake: ${playerName}'s ex`;
        
        // Hide name screen, show countdown
        nameScreen.classList.add('hidden');
        countdownScreen.classList.remove('hidden');
        
        // Start countdown
        let count = 3;
        countdownElement.textContent = count;
        
        const countdownInterval = setInterval(() => {
            count--;
            countdownElement.textContent = count;
            
            if (count <= 0) {
                clearInterval(countdownInterval);
                countdownScreen.classList.add('hidden');
                gameScreen.classList.remove('hidden');
                startGame();
            }
        }, 1000);
    });
    
    playAgainBtn.addEventListener('click', function() {
        gameOverModal.classList.add('hidden');
        nameScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
        usernameInput.value = playerName;
    });
    
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                setDirection('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                setDirection('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                setDirection('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                setDirection('right');
                break;
        }
    });
    
    // Mobile controls
    upBtn.addEventListener('click', () => setDirection('up'));
    downBtn.addEventListener('click', () => setDirection('down'));
    leftBtn.addEventListener('click', () => setDirection('left'));
    rightBtn.addEventListener('click', () => setDirection('right'));
    
    // Make sure the canvas is responsive
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Functions
    function startGame() {
        // Initialize game variables
        snake = [{x: 10, y: 10}]; // Start with a single segment
        generateFood();
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        scoreElement.textContent = `Score: ${score}`;
        
        // Start game loop
        gameRunning = true;
        gameInterval = setInterval(gameLoop, config.initialSpeed);
    }
    
    function gameLoop() {
        direction = nextDirection;
        moveSnake();
        
        if (checkCollision()) {
            endGame();
            return;
        }
        
        if (checkFoodCollision()) {
            score++;
            scoreElement.textContent = `Score: ${score}`;
            // Make snake grow
            snake.push({...snake[snake.length - 1]});
            generateFood();
            
            // Increase speed
            clearInterval(gameInterval);
            const newSpeed = Math.max(config.initialSpeed - (score * config.speedIncrease), 50);
            gameInterval = setInterval(gameLoop, newSpeed);
        }
        
        drawGame();
    }
    
    function endGame() {
        gameRunning = false;
        clearInterval(gameInterval);
        
        // Show final score
        finalScoreElement.textContent = `Your score: ${score}`;
        
        // Customize message based on performance
        if (score === 0) {
            finalMessageElement.textContent = "Thats why you are single!";
        } else if (score < 5) {
            finalMessageElement.textContent = "Don't give up! Your ex still likes you!";
        } else if (score < 10) {
            finalMessageElement.textContent = "Its okay buddy! You deserve someone better.";
        } else if (score < 20) {
            finalMessageElement.textContent = "Your ex played you like a pro!";
        } else {
            finalMessageElement.textContent = "Woahhhh! Your ex is a Snake Master!";
        }
        
        // Show game over modal
        gameOverModal.classList.remove('hidden');
    }
    
    function resizeCanvas() {
        // Set canvas size based on container/viewport
        const container = document.querySelector('.container');
        const headerHeight = document.querySelector('.game-header')?.offsetHeight || 0;
        const controlsHeight = document.querySelector('.game-controls')?.offsetHeight || 0;
        const padding = 40; // Account for container padding
        
        const availableWidth = container.clientWidth - padding;
        const availableHeight = container.clientHeight - headerHeight - controlsHeight - padding;
        
        // Make sure we have square cells by ensuring width is a multiple of gridSize
        const cellSize = Math.floor(Math.min(availableWidth, availableHeight) / config.gridSize);
        const canvasSize = cellSize * config.gridSize;
        
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        
        // If game is active, redraw
        if (gameRunning) {
            drawGame();
        }
    }
});

// Game mechanics functions
function setDirection(newDirection) {
    // Prevent 180 degree turns
    if (
        (direction === 'up' && newDirection === 'down') ||
        (direction === 'down' && newDirection === 'up') ||
        (direction === 'left' && newDirection === 'right') ||
        (direction === 'right' && newDirection === 'left')
    ) {
        return;
    }
    
    nextDirection = newDirection;
}

function moveSnake() {
    // Shift each segment to the position of its predecessor
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i] = { ...snake[i - 1] };
    }

    // Move the head in the current direction
    switch (direction) {
        case 'up':
            snake[0].y--;
            break;
        case 'down':
            snake[0].y++;
            break;
        case 'left':
            snake[0].x--;
            break;
        case 'right':
            snake[0].x++;
            break;
    }
    // (no wrapping here—if x or y is <0 or ≥ gridSize,
    // checkCollision() will return true and end the game)
}


function checkCollision() {
    const head = snake[0];

    // Wall‐collision: if head goes out of bounds, end game
    if (
        head.x < 0 ||
        head.x >= config.gridSize ||
        head.y < 0 ||
        head.y >= config.gridSize
    ) {
        return true;
    }

    // Skip body‐collision check if snake is still very short
    if (snake.length <= 3) return false;

    // Body‐collision: from segment 3 onward to allow tight turns early on
    for (let i = 3; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}


function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

function generateFood() {
    let newFood;
    let validPosition = false;
    
    while (!validPosition) {
        newFood = {
            x: Math.floor(Math.random() * config.gridSize),
            y: Math.floor(Math.random() * config.gridSize),
            color: config.foodColors[Math.floor(Math.random() * config.foodColors.length)]
        };
        
        // Make sure food doesn't spawn on the snake
        validPosition = true;
        for (const segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                validPosition = false;
                break;
            }
        }
    }
    
    food = newFood;
}

function drawGame() {
    if (!ctx) return;
    
    const cellSize = canvas.width / config.gridSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < config.gridSize; i++) {
        for (let j = 0; j < config.gridSize; j++) {
            if ((i + j) % 2 === 0) {
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
        const x = segment.x * cellSize;
        const y = segment.y * cellSize;
        
        // Use different color for head
        if (index === 0) {
            ctx.fillStyle = config.snakeHeadColor;
            ctx.shadowColor = config.snakeHeadColor;
            ctx.shadowBlur = 10;
            // Draw head as a rounded rectangle
            drawRoundedRect(x + 1, y + 1, cellSize - 2, cellSize - 2, 5);
            // Add eyes based on direction
            drawSnakeEyes(x, y, cellSize);
        } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = config.snakeBodyColor;
            // Draw body segments as smaller rounded rectangles
            const padding = 2 + (index * 0.1);
            drawRoundedRect(x + padding, y + padding, cellSize - padding * 2, cellSize - padding * 2, 5);
        }
    });
    
    // Draw food with glow effect
    if (food) {
        ctx.fillStyle = food.color;
        ctx.shadowColor = food.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(
            food.x * cellSize + cellSize / 2,
            food.y * cellSize + cellSize / 2,
            cellSize / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    
    // Reset shadow
    ctx.shadowBlur = 0;
}

function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
}

function drawSnakeEyes(x, y, cellSize) {
    const eyeSize = cellSize / 6;
    const eyeOffset = cellSize / 4;
    
    ctx.fillStyle = 'white';
    ctx.shadowBlur = 0;
    
    // Position eyes based on direction
    switch(direction) {
        case 'up':
            ctx.beginPath();
            ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
            ctx.arc(x + cellSize - eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupils
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x + eyeOffset, y + eyeOffset - 1, eyeSize / 2, 0, Math.PI * 2);
            ctx.arc(x + cellSize - eyeOffset, y + eyeOffset - 1, eyeSize / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 'down':
            ctx.beginPath();
            ctx.arc(x + eyeOffset, y + cellSize - eyeOffset, eyeSize, 0, Math.PI * 2);
            ctx.arc(x + cellSize - eyeOffset, y + cellSize - eyeOffset, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupils
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x + eyeOffset, y + cellSize - eyeOffset + 1, eyeSize / 2, 0, Math.PI * 2);
            ctx.arc(x + cellSize - eyeOffset, y + cellSize - eyeOffset + 1, eyeSize / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 'left':
            ctx.beginPath();
            ctx.arc(x + eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
            ctx.arc(x + eyeOffset, y + cellSize - eyeOffset, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupils
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x + eyeOffset - 1, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
            ctx.arc(x + eyeOffset - 1, y + cellSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
            
        case 'right':
            ctx.beginPath();
            ctx.arc(x + cellSize - eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
            ctx.arc(x + cellSize - eyeOffset, y + cellSize - eyeOffset, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupils
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x + cellSize - eyeOffset + 1, y + eyeOffset, eyeSize / 2, 0, Math.PI * 2);
            ctx.arc(x + cellSize - eyeOffset + 1, y + cellSize - eyeOffset, eyeSize / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
    }
}