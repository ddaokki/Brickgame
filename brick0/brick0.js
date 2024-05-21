// 벽돌 게임 구현(스코어 계산/게임 시작과 종료 조건 포함) – 강민호

const canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

// 공 기본값
ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 2,
  dy: -2,
};

// 패들 기본값
paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};

// 공 이미지
var ballImage = new Image();
ballImage.src = 'image/delete.jpg'; // 공 이미지 파일 경로

// 공 그리기
function drawBall() {
  // 이미지가 로드되었을 때만 그리기
  if (ballImage.complete) {
    context.drawImage(ballImage, ball.x - ball.size*1.5, ball.y - ball.size*1.5, ball.size * 3, ball.size * 3);
  } else {
    ballImage.onload = function() {
      context.drawImage(ballImage, ball.x - ball.size, ball.y - ball.size, ball.size * 2, ball.size * 2);
    };
  }
}

// 패들 그리기
function drawPaddle() {
  context.beginPath();
  context.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
  context.fillStyle = "#0095dd";
  context.fill();
  context.closePath();
}

const brickRowCount = 9; //한 행에 들어있는 벽돌 갯수
const brickColumnCount = 5; // 한 열에 들어 있는 벽돌 갯수

// 벽돌 기본값
const brickInfo = {
  w: 50,
  h: 20,
  padding: 10,
  offsetX: 105,
  offsetY: 60,
  visible: true,
  opacity: 1
};

//효과 기본값
const effectInfo = {
  w: 50,
  h: 20,
  offsetX: 115,
  offsetY: 73,
  padding:10,
  visible: true,
  opacity: 1
};

const effectArray = ["", "width", "height", "ul","opacity","fontsize","display"];

// 벽돌 만들기
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    var x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    var y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, i, j, ...brickInfo };
  }
}

//효과 만들기 
var effects = [];
var effectCnt = 0;
const effectLimit = 2;
for (let i = 0; i < brickRowCount; i++) {
  effects[i] = []; 
  effectCnt = 0; 
  for (let j = 0; j < brickColumnCount; j++) {
    var randNum;
    if(effectCnt < effectLimit) //이펙트 개수가 한도보다 작다면
      randNum = parseInt(Math.random() * 5);
    else
      randNum = 0;
    if(randNum != 0){
      effectCnt++;
    }
    var text = effectArray[randNum];
    var x = i * (effectInfo.w + effectInfo.padding) + effectInfo.offsetX;
    var y = j * (effectInfo.h + effectInfo.padding) + effectInfo.offsetY;
    effects[i][j] = {x, y, randNum, text , ...effectInfo};
  }
}

//캔버스에 효과 그리기
function drawText(){
  effects.forEach((column)=>{
    column.forEach((effect)=>{
      context.beginPath();
      context.fillStyle = effect.visible ? "#cfa5a5" : "transparent";
      context.globalAlpha = effect.opacity;
      context.font = "10px Arial";
      context.fillText(effect.text,effect.x,effect.y);
      context.closePath();
    })
  }) 
  context.globalAlpha = 1;
}

// 캔버스에 벽돌 그리기
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      context.beginPath();
      context.rect(brick.x, brick.y, brick.w, brick.h);
      context.fillStyle = brick.visible ? "#000000" : "transparent";
      context.globalAlpha = brick.opacity;
      context.fill();
      context.closePath();
    });
  });
  context.globalAlpha = 1;
}

const effectManager = {
  effectStates: {},

  registerEffect(name, func) {
    this.effectStates[name] = {
      isRunning: false,
      timeoutId: null
    };

    this[name] = () => {
      const effectState = this.effectStates[name];
      
      if (effectState.isRunning) {
        console.log(`${name} is already running. Please wait.`);
        return;
      }

      effectState.isRunning = true;
      console.log(`${name} started.`);

      effectState.timeoutId = setTimeout(() => {
        effectState.isRunning = false;
        console.log(`${name} ended. You can run it again.`);
        drawInit();
      }, 3000);

      func();
    };
  }
};
effectManager.registerEffect('effect1', effect_width);
effectManager.registerEffect('effect2', effect_height);
effectManager.registerEffect('effect3', effect_ul);
effectManager.registerEffect('effect4', effect_opacity);
effectManager.registerEffect('effect5', effect_fontsize);
effectManager.registerEffect('effect6', effect_display);


//체크한 효과들 시행
function check_effects(row,col){
  switch(effects[row][col].randNum){
      case 0:
          return;
      case 1:
          effectManager.effect1();
          break;
      case 2:
          effectManager.effect2();
          break;
      case 3:
          effectManager.effect3();
          break;
      case 4:
          effectManager.effect4();
          break;
      case 5:
          effectManager.effect5();
          break;
      case 6:
          effectManager.effect6();
          break;
      
  }
}


function drawInit(){
  for(let i = 0; i < brickRowCount; i++) {
    for (let j = 0; j < brickColumnCount; j++) {
      bricks[i][j].w = 50;
      bricks[i][j].h = 20;
      bricks[i][j].opacity= 1;
      effects[i][j].opacity= 1;
      bricks[i][j].padding=10;
      effects[i][j].padding=10;
      bricks[i][j].x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
      effects[i][j].x = i * (effectInfo.w + effectInfo.padding) + effectInfo.offsetX;
      bricks[i][j].y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
      effects[i][j].y = j * (effectInfo.h + effectInfo.padding) + effectInfo.offsetY;
      ball.size= 10;
    }
  }
  draw();
}

//width 효과
function effect_width(){
  for(let i = 0; i < brickRowCount; i++) {
    for (let j = 0; j < brickColumnCount; j++) {
      bricks[i][j].w = 60;
      bricks[i][j].x += 10 * i - 50;
      effects[i][j].x += 10 * i - 50;
    }
  }
  drawText();
  drawBricks();
}
function effect_height(){
  for(let i = 0; i < brickRowCount; i++) {
    
    for (let j = 0; j < brickColumnCount; j++) {
      bricks[i][j].y += 10 * j;
      effects[i][j].y += 10 * j; 
      bricks[i][j].h = 30;
    }
  }  
  drawText();
  drawBricks();
}
function effect_ul(){
  for(let i = 0; i < brickRowCount; i++) {
    for (let j = 0; j < brickColumnCount; j++) {
      if(effects[i][j].randNum==0 && effects[i][j].visible==true){
        effects[i][j].text="li";
        
      }
    }
  }
}
function effect_opacity(){
  for(let i = 0; i < brickRowCount; i++) {
    for (let j = 0; j < brickColumnCount; j++) {
      bricks[i][j].opacity=0;
      effects[i][j].opacity=0;
    }
  }
  drawText();
  drawBricks();
}
function effect_fontsize(){
  ball.size += 7;
}

function effect_display(){
  console.log(1);
}


let score = 0;
// 점수판
function drawScore() {
  context.font = "20px Arial";
  context.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

//테두리 그리기
function drawBorder() {
  context.beginPath();
  context.lineWidth = 2; 
  context.strokeStyle = '#000000'; 
  context.rect(0, 0, canvas.width, canvas.height);
  context.stroke(); 
}

// 애니메이션 업데이트
function update() {
  movePaddle();
  moveBall();

  draw();

  requestAnimationFrame(update);
}

update();

// 패들 움직이는 함수
function movePaddle() {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// 공 움직임 함수
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 좌우 충돌
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; 
  }

  //  상하 충돌
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // 패들 충돌
  if (
    ball.x - ball.size > paddle.x && 
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // 벽돌 충돌
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && 
          ball.x + ball.size < brick.x + brick.w && 
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h 
        ) {
          ball.dy *= -1;
          brick.visible = false;
          effects[brick.i][brick.j].visible = false;
          check_effects(brick.i,brick.j);
          increaseScore();
        }
      }
    });
  });

  // 바닥에 닿으면 게임오버
  if (ball.y + ball.size > canvas.height) {
    gameOver();
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 0;
    ball.dy = 0;
  }
}

// 게임오버 함수
function gameOver() {
  if (window.confirm("으악..실패했다..난 이제 어떻게 되는거지?\n" + "점수: " + score + "점"))
    {
      location.replace("gameFail.html");
    }
    else
    {
      alert("도망칠수없어..");
      location.replace("gameFail.html");
    }
    /*
  context.clearRect(0, 0, canvas.width, canvas.height);
  // 게임 오버 메시지를 표시
  context.font = "30px Arial";
  context.fillStyle = "#000000";
  context.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
  // 점수 표시
  context.fillText(`Your Score: ${score}`, canvas.width / 2 - 100, canvas.height / 2 + 40);

  // 게임 오버 화면 표시
  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("finalScore").innerText = score; 
  */
}

// 게임 다시 시작
function restartGame() {
  document.getElementById("gameOverScreen").style.display = "none";

  // 점수 초기화
  score = 0;

  // 공과 패들 초기 위치로 이동
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  paddle.x = canvas.width / 2 - 40;
  paddle.y = canvas.height - 20;

  // 공의 이동 방향 초기화
  ball.dx = 4;
  ball.dy = -4;

  // 공의 초기 속도와 패들 속도 고정값으로 설정
  ball.speed = 4;
  ball.dx = ball.speed;
  ball.dy = -ball.speed;
  paddle.speed = 8;

  // 블록 재생성
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });

  // 다시 시작
  update();
}


// 점수 계산 함수
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) {
    showAllBricks();
  }
}

// 모든 벽돌 생성
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

// 공 속도 출력
function drawBallSpeed() {
  context.font = "16px Arial";
  context.fillText(`Ball Speed: ${Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy).toFixed(2)}`, 20, 30);
}

// draw
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
  drawBallSpeed(); // 속도 표시 추가
  drawBorder();
  drawText();
}

// 마우스 움직임 이벤트
canvas.addEventListener("mousemove", mouseMoveHandler, false);

// 패들 움직임 함수
function mouseMoveHandler(e) {
  var relativeX = e.clientX - 265;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.w / 2;
  }
}
