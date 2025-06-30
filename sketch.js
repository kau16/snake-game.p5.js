let snake = [];
let food;
let dir = 'right';
let nextDir = 'right';
let sz = 20;
let score = 0;
let gameOver = false;
let speed = 10;

function setup() {
  createCanvas(400, 400);
  frameRate(speed);
  resetGame();
}

function resetGame() {
  snake = [];
  for (let i = 2; i >= 0; i--) {
    snake.push({ x: i * sz, y: 0 });
  }
  dir = 'right';
  nextDir = 'right';
  score = 0;
  gameOver = false;
  spawnFood();
}

function spawnFood() {
  let validSpot = false;
  while (!validSpot) {
    food = {
      x: floor(random(width / sz)) * sz,
      y: floor(random(height / sz)) * sz
    };
   
    validSpot = true;
    for (let segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        validSpot = false;
        break;
      }
    }
  }
}

function draw() {
  background(0);
 
  if (!gameOver) {
    updateSnake();
    checkCollisions();
    drawGame();
  } else {
    drawGameOver();
  }
 
  drawScore();
}

function updateSnake() {
  // Atualiza a direção atual no início do frame
  dir = nextDir;
 
  // Cria nova cabeça baseada na direção
  let head = { x: snake[0].x, y: snake[0].y };
 
  if (dir === 'right') head.x += sz;
  if (dir === 'left') head.x -= sz;
  if (dir === 'up') head.y -= sz;
  if (dir === 'down') head.y += sz;
 
  // Adiciona nova cabeça
  snake.unshift(head);
 
  // Verifica se comeu a comida
  if (head.x === food.x && head.y === food.y) {
    score++;
    if (score % 3 === 0 && speed < 20) {
      speed++;
      frameRate(speed);
    }
    spawnFood();
  } else {
    // Remove cauda se não comeu
    snake.pop();
  }
}

function checkCollisions() {
  let head = snake[0];
 
  // Verifica colisão com paredes
  if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
    gameOver = true;
    return;
  }
 
  // Verifica colisão com o próprio corpo (começando do 1 porque 0 é a cabeça)
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
      return;
    }
  }
}

function drawGame() {
  // Desenha comida
  fill(255, 0, 0);
  rect(food.x, food.y, sz, sz);
 
  // Desenha cobra
  fill(0, 255, 0);
  for (let segment of snake) {
    rect(segment.x, segment.y, sz, sz);
  }
 
  // Desenha olhos na cabeça (opcional)
  fill(255);
  let head = snake[0];
  if (dir === 'right') {
    ellipse(head.x + sz/2, head.y + sz/4, sz/4);
    ellipse(head.x + sz/2, head.y + 3*sz/4, sz/4);
  } else if (dir === 'left') {
    ellipse(head.x + sz/2, head.y + sz/4, sz/4);
    ellipse(head.x + sz/2, head.y + 3*sz/4, sz/4);
  } else if (dir === 'up') {
    ellipse(head.x + sz/4, head.y + sz/2, sz/4);
    ellipse(head.x + 3*sz/4, head.y + sz/2, sz/4);
  } else { // down
    ellipse(head.x + sz/4, head.y + sz/2, sz/4);
    ellipse(head.x + 3*sz/4, head.y + sz/2, sz/4);
  }
}

function drawScore() {
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Pontuação: " + score, 10, 10);
}

function drawGameOver() {
  fill(255, 0, 0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Fim de Jogo!", width/2, height/2 - 30);
 
  textSize(20);
  text("Pontuação final: " + score, width/2, height/2 + 10);
 
  textSize(16);
  text("Pressione ESPAÇO para reiniciar", width/2, height/2 + 40);
}

function keyPressed() {
  if (keyCode === 32 && gameOver) { // Espaço para reiniciar
    resetGame();
    return;
  }
 
  // Controles (impede movimento inverso imediato)
  if (keyCode === UP_ARROW && dir !== 'down') {
    nextDir = 'up';
  } else if (keyCode === DOWN_ARROW && dir !== 'up') {
    nextDir = 'down';
  } else if (keyCode === LEFT_ARROW && dir !== 'right') {
    nextDir = 'left';
  } else if (keyCode === RIGHT_ARROW && dir !== 'left') {
    nextDir = 'right';
  }
}  