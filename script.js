
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player position
let birdX = 90;
let birdY = 200;

// Player size
let birdWidth = 60;
let birdHeight = 60;

// Physics
let gravity = 0.5;
let velocity = 0;
let jumpStrength = -8;
// Pipe settings
let pipes = [];
let pipeWidth = 60;
let pipeGap = 170;
let pipeSpeed = 2;
let frameCount = 0;
let score = 0;
pipes.push({
    x: 300,
    topHeight: 150,
    scored: false
});

// Spacebar control
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        event.preventDefault();
        velocity = jumpStrength;
    }
});

// Mouse click and touchscreen control
canvas.addEventListener("pointerdown", function() {
    velocity = jumpStrength;
});

// Load happy photo
const happyImage = new Image();
happyImage.src = "images/happy.png";
const sadImage = new Image();
sadImage.src = "images/sad.png";

let gameOver = false;

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
if (gameOver) {
    drawPipes();

    if (sadImage.complete && sadImage.naturalWidth > 0) {
        ctx.drawImage(sadImage, birdX, birdY, birdWidth, birdHeight);
    }

    requestAnimationFrame(gameLoop);
    return;
}

    // Apply gravity
    velocity += gravity;
    birdY += velocity;

    // Draw player
   let currentImage = happyImage;

if (currentImage.complete && currentImage.naturalWidth > 0) {
    ctx.drawImage(
        currentImage,
        birdX,
        birdY,
        birdWidth,
        birdHeight
    );
}
// Count game frames
frameCount++;

// Create a new pipe every 120 frames
if (frameCount % 120 === 0) {
    pipes.push({
    x: canvas.width,
    topHeight: Math.floor(Math.random() * 220) + 80,
    scored: false
});
}

// Move pipes to the left
for (let pipe of pipes) {
    pipe.x -= pipeSpeed;
// Increase score when player passes a pipe
for (let pipe of pipes) {
    if (!pipe.scored && pipe.x + pipeWidth < birdX) {
        score++;
        pipe.scored = true;
    }
}
}

// Remove pipes that leave the screen
pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

    
      drawPipes();
// Display score
ctx.fillStyle = "black";
ctx.font = "28px Arial";
ctx.textAlign = "center";
ctx.fillText("Score: " + score, canvas.width / 2, 40);
if (!gameOver && checkCollision()) {
    gameOver = true;
    velocity = 0;

    document.getElementById("gameOverPopup").style.display = "block";
    document.getElementById("finalScore").textContent = "Your Score: " + score;
}

    requestAnimationFrame(gameLoop);
}
function checkCollision() {

    // Check top and bottom boundaries
    if (birdY < 0 || birdY + birdHeight > canvas.height) {
        return true;
    }

    // Check collision with pipes
    for (let pipe of pipes) {

        let hitPipe =
            birdX + birdWidth > pipe.x &&
            birdX < pipe.x + pipeWidth &&
            (
                birdY < pipe.topHeight ||
                birdY + birdHeight > pipe.topHeight + pipeGap
            );

        if (hitPipe) {
            return true;
        }
    }

    return false;
}

function drawPipes() {
    ctx.fillStyle = "green";

    for (let pipe of pipes) {

        // Top pipe
        ctx.fillRect(
            pipe.x,
            0,
            pipeWidth,
            pipe.topHeight
        );

        // Bottom pipe
        ctx.fillRect(
            pipe.x,
            pipe.topHeight + pipeGap,
            pipeWidth,
            canvas.height
        );
    }
}
// Play Again button
document.getElementById("playAgainButton").addEventListener("click", function() {

    birdX = 90;
    birdY = 200;
    velocity = 0;
    pipes = [];

    pipes.push({
        x: 300,
        topHeight: 150,
        scored: false
    });

    frameCount = 0;
    score = 0;
    gameOver = false;

    document.getElementById("gameOverPopup").style.display = "none";

        


});
gameLoop();
