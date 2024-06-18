const GAME_WIDTH = 360;
const GAME_HEIGHT = 580;
const BULLET_SPEED = 10;
const ENEMY_SPEED = 5;
const SCORE_INCREMENT = 10;

const gameArea = document.getElementById('gameArea');
const playerShip = document.getElementById('playerShip');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');

let gameInterval;
let shipSpeed = 25;
let score = 0;
let isGameOver = false;
let bullets = [];
let enemies = [];
let playerShipX = gameArea.clientWidth / 2 - playerShip.clientWidth / 2;

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    movePlayerShip(e);
  } else if ((e).key === ' ') {
    shootBullet();
  }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        playerShipX -= shipSpeed;
    } else if (event.key === 'ArrowRight') {
        playerShipX += shipSpeed;
    }
    if (playerShipX < 0) playerShipX = 0;
    if (playerShipX > gameArea.clientWidth - playerShip.clientWidth) playerShipX = gameArea.clientWidth - playerShip.clientWidth;
    playerShip.style.left = playerShip + 'px';
});

function startGame() {
  isGameOver = false;
  score = 0;
  scoreDisplay.innerText = 'Score: 0';
  bullets = [];
  enemies = [];
  playerShip.style.left = `${GAME_WIDTH / 2}px`;
  startButton.style.display = 'none';
  gameArea.innerHTML = '<div id="playerShip"></div><div id="score">Score: 0</div>';
  gameInterval = setInterval(gameLoop, 100);
}

function endGame() {
  isGameOver = true;
  clearInterval(gameInterval);
  startButton.style.display = 'block';
  alert(`Game Over! Your score is ${score}`);
}

function movePlayerShip(e) {
  const left = parseInt(window.getComputedStyle(playerShip).getPropertyValue('left'));
  if (e.key === 'ArrowLeft' && left > 0) {
    playerShip.style.left = `${left - 20}px`;
  }
  if (e.key === 'ArrowRight' && left < GAME_WIDTH - 20) {
    playerShip.style.left = `${left + 20}px`;
  }
}

function shootBullet() {
  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = `${parseInt(window.getComputedStyle(playerShip).getPropertyValue('left')) + 17}px`;
  bullet.style.top = `${parseInt(window.getComputedStyle(playerShip).getPropertyValue('top')) - 20}px`;
  gameArea.appendChild(bullet);
  bullets.push(bullet);
}

function gameLoop() {
  if (isGameOver) return;
  score++;
  scoreDisplay.innerText = `Score: ${score}`;

  bullets.forEach((bullet) => {
    let bulletTop = parseInt(bullet.style.top);
    bullet.style.top = `${bulletTop - BULLET_SPEED}px`;
    if (bulletTop < 0) {
      bullet.remove();
      bullets = bullets.filter((b) => b!== bullet);
    }
  });

  if (Math.random() < 0.05) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = `${Math.floor(Math.random() * GAME_WIDTH)}px`;
    enemy.style.top = '0px';
    gameArea.appendChild(enemy);
    enemies.push(enemy);
  }

  enemies.forEach((enemy) => {
    let enemyTop = parseInt(enemy.style.top);
    enemy.style.top = `${enemyTop + ENEMY_SPEED}px`;
    if (enemyTop > GAME_HEIGHT) {
      enemy.remove();
      enemies = enemies.filter((e) => e!== enemy);
      endGame();
    }
    bullets.forEach((bullet) => {
      if (checkCollision(bullet, enemy)) {
        bullet.remove();
        bullets = bullets.filter((b) => b!== bullet);
        enemy.remove();
        enemies = enemies.filter((e) => e!== enemy);
        score += SCORE_INCREMENT;
        scoreDisplay.innerText = `Score: ${score}`;
      }
    });
  });
}

function checkCollision(bullet, enemy) {
  const bulletRect = bullet.getBoundingClientRect();
  const enemyRect = enemy.getBoundingClientRect();

  return !(bulletRect.top > enemyRect.bottom ||
             bulletRect.bottom < enemyRect.top ||
             bulletRect.left > enemyRect.right ||
             bulletRect.right < enemyRect.left);
}