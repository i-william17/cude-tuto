const gameContainer = document.getElementById('gameContainer');
const basket = document.getElementById('basket');
const scoreDisplay = document.getElementById('score');

let score = 0;
let basketX = gameContainer.clientWidth / 2 - basket.clientWidth / 2;
let basketSpeed = 10;

// Move basket with arrow keys
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        basketX -= basketSpeed;
    } else if (event.key === 'ArrowRight') {
        basketX += basketSpeed;
    }
    if (basketX < 0) basketX = 0;
    if (basketX > gameContainer.clientWidth - basket.clientWidth) basketX = gameContainer.clientWidth - basket.clientWidth;
    basket.style.left = basketX + 'px';
});

// Create and drop balls
function createBall() {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.style.left = Math.random() * (gameContainer.clientWidth - 30) + 'px';
    gameContainer.appendChild(ball);
    moveBall(ball);
}

function moveBall(ball) {
    let ballY = 0;
    const ballInterval = setInterval(function() {
        ballY += 5;
        ball.style.top = ballY + 'px';

        if (ballY > gameContainer.clientHeight) {
            gameContainer.removeChild(ball);
            clearInterval(ballInterval);
        }

        // Check for collision with basket
        const ballRect = ball.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();

        if (
            ballRect.top < basketRect.bottom &&
            ballRect.bottom > basketRect.top &&
            ballRect.left < basketRect.right &&
            ballRect.right > basketRect.left
        ) {
            gameContainer.removeChild(ball);
            clearInterval(ballInterval);
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
        }
    }, 20);
}

// Generate balls at intervals
setInterval(createBall, 1000);
