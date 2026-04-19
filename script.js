const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("scoreVal");
const homeScreen = document.getElementById("home-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const finalScoreText = document.getElementById("final-score");
const highScoreHome = document.getElementById("highScoreHome");
const highScoreBoard = document.getElementById("highScoreBoard");
const gameContainer = document.getElementById("game-container");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let gameState = "HOME"; 
let bird = { x: 50, y: canvas.height / 2, width: 30, height: 30, velocity: 0, gravity: 0.4, jump: -7 };
let pipes = [];
let score = 0;
let frameCount = 0;
let highScore = localStorage.getItem("flappyHighScore") || 0;

highScoreHome.innerText = highScore;

gameContainer.addEventListener("mousedown", handleInput);
gameContainer.addEventListener("touchstart", (e) => { 
    handleInput(); 
    e.preventDefault(); 
}, { passive: false });

function handleInput() {
    if (gameState === "HOME") {
        gameState = "PLAYING";
        homeScreen.style.display = "none";
    } else if (gameState === "PLAYING") {
        bird.velocity = bird.jump;
    } else if (gameState === "GAMEOVER") {
        resetGame();
    }
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreElement.innerText = score;
    gameState = "PLAYING";
    gameOverScreen.style.display = "none";
}

function update() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === "PLAYING") {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (frameCount % 100 === 0) {
            let gap = 200;
            let h = Math.random() * (canvas.height - gap - 100) + 50;
            pipes.push({ x: canvas.width, top: h, bottom: canvas.height - h - gap, width: 60, passed: false });
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= 3;
            ctx.fillStyle = "#2ecc71";
            ctx.fillRect(pipes[i].x, 0, pipes[i].width, pipes[i].top);
            ctx.fillRect(pipes[i].x, canvas.height - pipes[i].bottom, pipes[i].width, pipes[i].bottom);

            if (bird.x < pipes[i].x + pipes[i].width && bird.x + bird.width > pipes[i].x &&
                (bird.y < pipes[i].top || bird.y + bird.height > canvas.height - pipes[i].bottom)) {
                endGame();
            }

            if (!pipes[i].passed && bird.x > pipes[i].x + pipes[i].width) {
                score++;
                scoreElement.innerText = score;
                pipes[i].passed = true;
            }
            if (pipes[i].x + pipes[i].width < 0) pipes.splice(i, 1);
        }

        if (bird.y + bird.height > canvas.height || bird.y < 0) endGame();
        frameCount++;
    }

    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    requestAnimationFrame(update);
}

function endGame() {
    gameState = "GAMEOVER";
    gameOverScreen.style.display = "flex";
    finalScoreText.innerText = "Score: " + score;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("flappyHighScore", highScore);
    }
    highScoreBoard.innerText = highScore;
    highScoreHome.innerText = highScore;
}

update();