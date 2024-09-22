let input_key = new Array();

window.addEventListener("keydown", handleKeydown);
function handleKeydown(e) {
  console.log(`${e.keyCode}が押されたよ`);
  input_key[e.keyCode] = true;
}

window.addEventListener("keyup", handleKeyup);
function handleKeyup(e) {
  input_key[e.keyCode] = false;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 640;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const IMG_SIZE = 80;
const CHARA_SPEED = 4;

let x = 0;
let y = 300;

let vy = 0;
let isJump = false;

let isGameOver = false;
let isGameClear = false;

const GOAL_X = 850;
const GOAL_Y = 320;

let blocks = [
  { x: 0, y: 600, w: 400, h: 40 },
  { x: 400, y: 500, w: 250, h: 40 },
  { x: 650, y: 400, w: 310, h: 40 },
];

let enemies = [
  { x: 550, y: 0, isJump: true, vy: 0 },
  { x: 750, y: 0, isJump: true, vy: 0 },
  { x: 300, y: 180, isJump: true, vy: 0 },
];
const ENEMY_SPEED = 1;

window.addEventListener("load", update);

function update() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  for (const enemy of enemies) {
    let updatedEnemyX = enemy.x;
    let updatedEnemyY = enemy.y;
    let updatedEnemyInJump = enemy.isJump;
    let updatedEnemyVy = enemy.vy;
    updatedEnemyX = updatedEnemyX - ENEMY_SPEED;
    if (enemy.isJump) {
      updatedEnemyY = enemy.y + enemy.vy;
      updatedEnemyVy = enemy.vy + 0.5;
      const blockTargetIsOn = getBlockTargetIsOn(
        enemy.x,
        enemy.y,
        updatedEnemyX,
        updatedEnemyY
      );
      if (blockTargetIsOn !== null) {
        updatedEnemyY = blockTargetIsOn.y - IMG_SIZE;
        updatedEnemyInJump = false;
      }
    } else {
      if (
        getBlockTargetIsOn(enemy.x, enemy.y, updatedEnemyX, updatedEnemyY) ===
        null
      ) {
        updatedEnemyInJump = true;
        updatedEnemyVy = 0;
      }
    }
    enemy.x = updatedEnemyX;
    enemy.y = updatedEnemyY;
    enemy.isJump = updatedEnemyInJump;
    enemy.vy = updatedEnemyVy;
  }

  let updateX = x;
  let updateY = y;

  if (isGameClear) {
    alert("ゲームクリア");
    isGameClear = false;
    isJump = false;
    updateX = 0;
    updateY = 0;
    vy = 0;
  } else if (isGameOver) {
    updateY = y + vy;
    vy = vy + 0.5;
    if (y > CANVAS_HEIGHT) {
      alert("GAME OVER");
      isGameOver = false;
      isJump = false;
      updateX = 0;
      updateY = 0;
      vy = 0;
    }
  } else {
    if (input_key[37]) {
      updateX = x - CHARA_SPEED;
    }
    if (input_key[38] && !isJump) {
      vy = -10;
      isJump = true;
    }
    if (input_key[39]) {
      updateX = x + CHARA_SPEED;
    }
    if (isJump) {
      updateY = y + vy;
      vy = vy + 0.5;
      const blockTargetIsOn = getBlockTargetIsOn(x, y, updateX, updateY);
      if (blockTargetIsOn !== null) {
        updateY = blockTargetIsOn.y - IMG_SIZE;
        isJump = false;
      }
    } else {
      if (getBlockTargetIsOn(x, y, updateX, updateY) === null) {
        isJump = true;
        vy = 0;
      }
    }
    if (y > CANVAS_HEIGHT) {
      isGameOver = true;
      updateY = CANVAS_HEIGHT;
      vy = -15;
    }
  }

  x = updateX;
  y = updateY;

  if (!isGameOver) {
    for (const enemy of enemies) {
      let isHit = isAreaOverlap(
        x,
        y,
        IMG_SIZE,
        IMG_SIZE,
        enemy.x,
        enemy.y,
        IMG_SIZE,
        IMG_SIZE
      );
      if (isHit) {
        if (isJump && vy > 0) {
          vy = -7;
          enemy.y = CANVAS_HEIGHT;
        } else {
          isGameOver = true;
          vy = -10;
        }
      }
    }
    let isHit = isAreaOverlap(
      x,
      y,
      IMG_SIZE,
      IMG_SIZE,
      GOAL_X,
      GOAL_Y,
      IMG_SIZE,
      IMG_SIZE
    );
    if (isHit) {
      isGameClear = true;
    }
  }

  let image = new Image();
  image.src = "img/mario.jpg";
  ctx.drawImage(image, x, y, IMG_SIZE, IMG_SIZE);

  let enemyImage = new Image();
  enemyImage.src = "img/kuribo.jpeg";
  for (const enemy of enemies) {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, IMG_SIZE, IMG_SIZE);
  }
  let goalImage = new Image();
  goalImage.src = "img/pichi.jpg";
  ctx.drawImage(goalImage, GOAL_X, GOAL_Y, IMG_SIZE, IMG_SIZE);

  ctx.fillStyle = "Orange";
  for (const block of blocks) {
    ctx.fillRect(block.x, block.y, block.w, block.h);
  }

  window.requestAnimationFrame(update);
}

function getBlockTargetIsOn(x, y, updateX, updateY) {
  for (const block of blocks) {
    if (y + IMG_SIZE <= block.y && updateY + IMG_SIZE >= block.y) {
      if (
        (x + IMG_SIZE <= block.x || x >= block.x + block.w) &&
        (updateX + IMG_SIZE <= block.x || updateX >= block.x + block.w)
      ) {
        continue;
      }
      return block;
    }
  }
  return null;
}

function isAreaOverlap(cx, cy, cw, ch, ex, ey, ew, eh) {
  if (ex + ew < cx) return false;
  if (cx + cw < ex) return false;
  if (ey + eh < cy) return false;
  if (cy + ch < ey) return false;
  return true;
}
