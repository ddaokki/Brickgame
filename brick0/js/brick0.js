window.onload = function(){
  $('tr').on("click",function(){
    $('table').css({
      opacity:0
    });
    brickGame();
  });
}


function brickGame(){
  $(document).on("keyup", function(key){
    if(key.keyCode == 77){
      show_win(); 
      window.setTimeout(effect_win,1500);
    }
  });



  window.scrollTo(0,700);
  const canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var settingVairable = location.href.split("?")[1];
  var regex = /[^0-9]/g;
  settingVairable = settingVairable.replace(regex,""); //사용자로부터 받아온 환경변수 추출
  const level = settingVairable[0];
  const color = settingVairable[1];
  const music = settingVairable[2];
  const character = settingVairable[3]; 

  console.log(character);

  
  $('#char').attr("src", "../image/char" + character + ".png");
  $('#canvas-container').fadeIn();

  var audio = new Audio("../music/bgm" + music + ".mp3");
  audio.volume = 0.2;
  audio.play();

  var time = 60; //기본 제한 시간

  // 공 기본값
  ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 15,
    speed: 2,
    dx: 2,
    dy: -2,
    hits:-1,
  };

  if (level == 1){
    ball.size = 15;
    ball.speed = 2;
  }
  else if (level == 2){
    ball.size = 13;
    ball.speed = 3;
  }
  else if (level == 3){
    ball.size = 10;
    ball.speed = 4;
  }

  // 패들 기본값
  paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80 + 20 * (4-level),
    h: 10,
    speed: 8,
    dx: 0,
  };

  

  // 공 그리기 함수
  function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    context.fillStyle = '#6fadcf';
    context.fill();
    context.closePath();
}

  // 패들 그리기
  function drawPaddle() {
    context.beginPath();
    context.fillStyle = "#0095dd";
    context.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    context.fill();
    context.closePath();
  }

  var brickRowCount = 9 - (3-level); //한 행에 들어있는 벽돌 갯수
  if (level==3)  brickRowCount = 10;
  var brickColumnCount = 5 - (3-level); // 한 열에 들어 있는 벽돌 갯수
  // 벽돌 기본값
  const brickInfo = {
    w: 60 + 20 * (3-level),
    h: 40,
    padding: 2,
    offsetY: 0,
    visible: true,
    opacity: 1,
    hits:-1
  };
  const brickColor = [["#483D03","#646536","#9ABD97","#B6D7B9","#CFE0C3"],
                      ["#4F3130","#753742","#AA5042","#D8BD8A","#D8D78F"],
                      ["#1F363D","#40798C","#70A9A1","#9EC1A3","#CFE0C3"]];
  //효과 기본값
  const effectInfo = {
    w: 60 + 20 * (3-level),
    h: 40,
    offsetY: 23,
    padding:2,
    visible: true,
    opacity: 1
  };

  const effectArray = ["div", "width", "height", "scale","opacity","float","ul","","fixed","li"];

  // 벽돌 만들기
  const bricks = [];
  for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
      var offsetX;
      if(level == 1)
        offsetX = 15;
      else if(level == 2)
        offsetX = 30;
      else if(level == 3){
        offsetX = 55;
      }
        
      var x = i * (brickInfo.w + brickInfo.padding) + offsetX;
      var y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
      bricks[i][j] = { x, y, i, j, offsetX, ...brickInfo };
    }
  }

  //효과 만들기 
  var effects = [];
  var effectCnt = 0;
  const effectLimit = level;
  var fixedCount = 0;
  for (let i = 0; i < brickRowCount; i++) {
    effects[i] = []; 
    effectCnt = 0; 
    for (let j = 0; j < brickColumnCount; j++) {
      var randNum;
      if((i == parseInt(brickRowCount / 2)) && (j == 0)){
        randNum = 0;
        effectCnt--; //div는 게임 종료 효과 이므로 효과 1개 제외
      }
      else if(effectCnt < effectLimit) //이펙트 개수가 한도보다 작다면
        if (level==1)randNum = 7;  //1레벨이면 이펙트 부여 x
        else randNum = parseInt(Math.random() * 8 + 1);
      else
        randNum = 7;
      if(randNum != 7){
        effectCnt++;
      }
      var offsetX;
      if(level == 1)
        offsetX = 52;
      else if(level == 2)
        offsetX = 45;
      else if(level == 3)
        offsetX = 65;
      var text = effectArray[randNum];
      var x = i * (effectInfo.w + effectInfo.padding) + offsetX;
      var y = j * (effectInfo.h + effectInfo.padding) + effectInfo.offsetY;
      effects[i][j] = {x, y, randNum, text , offsetX, ...effectInfo};

      //fixed 3개까지만 허용

      if(effects[i][j].text == "fixed"){
        fixedCount++;
        if(fixedCount>3){
          effects[i][j].text = "";
          effects[i][j].randNum = 7;
        }
      }
    }
  }

  // fixed가 div를 완전히 가리지 않도록 함.
var fixedRand = Math.floor(Math.random() * 3);
if (
  effects[parseInt(brickRowCount / 2) - 1][0].text == "fixed" &&
  effects[parseInt(brickRowCount / 2)][1].text == "fixed" &&
  effects[parseInt(brickRowCount / 2) + 1][0].text == "fixed"
) {
  switch (fixedRand) {
    case 0:
      effects[parseInt(brickRowCount / 2) - 1][0].text = "";
      effects[parseInt(brickRowCount / 2) - 1][0].randNum = 7;
      break;
    case 1:
      effects[parseInt(brickRowCount / 2)][1].text = "";
      effects[parseInt(brickRowCount / 2)][1].randNum = 7;
      break;
    case 2:
      effects[parseInt(brickRowCount / 2) + 1][0].text = "";
      effects[parseInt(brickRowCount / 2) + 1][0].randNum = 7;
      break;
  }
}

  //캔버스에 효과 그리기
  function drawText(){
    effects.forEach((column)=>{
      column.forEach((effect)=>{
        context.beginPath();
        context.fillStyle = effect.visible ? "white" : "transparent";
        context.globalAlpha = effect.opacity;
        context.font = "18px Arial";
        if(level == 3)
          context.font = "15px Arial";
        context.fillText(effect.text,effect.x,effect.y);
        context.closePath();
      })
    }) 
    context.globalAlpha = 1;
  }

  // 캔버스에 벽돌 그리기
  function drawBricks() {
    const divRow = parseInt(brickRowCount / 2); // div 블록의 행 위치
    const divCol = 0; // div 블록의 열 위치

    const divBrick = bricks[divRow][divCol]; // div 블록 가져오기

    var cnt = 0;
    bricks.forEach((column) => {
      column.forEach((brick) => {
        context.beginPath();
        context.rect(brick.x, brick.y, brick.w, brick.h);
        context.fillStyle = brick.visible ? brickColor[color][cnt] : "transparent";
        if(brick.i == divRow && brick.j == 0){
          if(brick.hits == 1)
            context.fillStyle = brick.visible ? "green" : "transparent";
          else if(brick.hits==2)     
            context.fillStyle = brick.visible ? "orange" : "transparent";
          else if(brick.hits==3)
            context.fillStyle = brick.visible ? "red" : "transparent";
        }
        context.globalAlpha = brick.opacity;
        context.fill();
        context.closePath();
        cnt++;
      });
      cnt=0;
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
          return;
        }

        effectState.isRunning = true;

        effectState.timeoutId = setTimeout(() => {
          effectState.isRunning = false;
          drawInit();
        }, 5000);

        func();
      };
    }
  };
  effectManager.registerEffect('effect0', effect_div);
  effectManager.registerEffect('effect1', effect_width);
  effectManager.registerEffect('effect2', effect_height);
  effectManager.registerEffect('effect3', effect_scale);
  effectManager.registerEffect('effect4', effect_opacity);
  effectManager.registerEffect('effect5', effect_float);
  effectManager.registerEffect('effect6', effect_ul);
  effectManager.registerEffect('effect9', effect_li);


  //체크한 효과들 시행
  function check_effects(row,col){
    switch(effects[row][col].randNum){
        case 0:
          effect_div();
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
        case 7:
          return;
        case 8:   //fixed
          return;
        case 9:
          effectManager.effect9();
          break;
        
    }
  }


  function drawInit(){
    for(let i = 0; i < brickRowCount; i++) {
      for (let j = 0; j < brickColumnCount; j++) {
        bricks[i][j].w = 60 + 20 * (3-level);
        bricks[i][j].h = 40;
        bricks[i][j].opacity= 1;
        effects[i][j].opacity= 1;
        bricks[i][j].padding=2;
        effects[i][j].padding=2;
        if(level == 1){
          bricks[i][j].offsetX = 15;
          effects[i][j].offsetX = 52;
        }
        else if(level == 2){
          bricks[i][j].offsetX = 30;
          effects[i][j].offsetX = 45;
        }
        else if(level == 3){ 
          bricks[i][j].offsetX = 55;
          effects[i][j].offsetX = 65;
        }
        bricks[i][j].x = i * (brickInfo.w + brickInfo.padding) + bricks[i][j].offsetX;
        effects[i][j].x = i * (effectInfo.w + effectInfo.padding) + effects[i][j].offsetX;
        bricks[i][j].y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        effects[i][j].y = j * (effectInfo.h + effectInfo.padding) + effectInfo.offsetY;
        ball.size= 10;
      }
    }
    draw();
  }


  function effect_div() {
    
    const divRow = parseInt(brickRowCount / 2); // div 블록의 행 위치
    const divCol = 0; // div 블록의 열 위치

    const divBrick = bricks[divRow][divCol]; // div 블록 가져오기
    console.log(divBrick.hits);
    if (divBrick.hits === -1) {
      // 첫 번째 부딪힘
      divBrick.hits = 1;
    } else if (divBrick.hits === 1) {
      // 두 번째 부딪힘
      divBrick.hits = 2;
    } else if (divBrick.hits === 2) {
      // 세 번째 부딪힘 (승리 조건)
      divBrick.hits = 3;
    }
    else if(divBrick.hits == 3){
      show_win(); 
      window.setTimeout(effect_win,1500);
    }
  }
  function show_win(){
      ball.dx = 0;
      ball.dy = 0;
      for(let i = 0; i < brickRowCount; i++) {
        for (let j = 0; j < brickColumnCount; j++) {
          bricks[i][j].visible = false;
          effects[i][j].visible = false;
        }
      }  
    draw(); 
  }
  function effect_win() {
    alert("해냈다! 모든 블럭을 부쉈어!");
    score = 100;
    drawScore();
    location.replace("../html/gameSuccess.html");
  }

  //width 효과
  function effect_width(){
    if(effectManager.effectStates['effect5'].isRunning == true){
      return;
    }
    for(let i = 0; i < brickRowCount; i++) {
      if(level==2){
        for (let j = 0; j < brickColumnCount; j++) {
          bricks[i][j].w += 10;
          bricks[i][j].x += 10 * i - 20;
          effects[i][j].x += 10 * i - 20;
        }
      }
      else{
        for (let j = 0; j < brickColumnCount; j++) {
          bricks[i][j].w += 10;
          bricks[i][j].x += 10 * i - 40;
          effects[i][j].x += 10 * i - 40;
        }
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
        bricks[i][j].h += 10;
        effects[i][j].h += 10;
      }
    }  
    draw();
  }
  
  function effect_opacity() {
    const randomBlocks = [];
    while (randomBlocks.length < 3) {
      const randomRow = Math.floor(Math.random() * brickRowCount);
      const randomCol = Math.floor(Math.random() * brickColumnCount);
      const randomBlock = { row: randomRow, col: randomCol };
  
      // 중복 및 부숴진 블록 확인
      if (!randomBlocks.some(block => block.row === randomRow && block.col === randomCol) && bricks[randomRow][randomCol].visible) {
        randomBlocks.push(randomBlock);
      }
    }
  
    randomBlocks.forEach(block => {
      bricks[block.row][block.col].opacity = 0;
      effects[block.row][block.col].opacity = 0;
    });
  
    draw();
  }

  

  function effect_float() {
    if(effectManager.effectStates['effect1'].isRunning == true){
      return;
    }
    const floatDirection = Math.random() < 0.5 ? "L" : "R"; // 랜덤하게 L 또는 R 선택
  
    // L이면 모든 블록들을 왼쪽으로 정렬, R이면 모든 블록들을 오른쪽으로 정렬
    if (floatDirection === "L") {
      const minX = Math.min(...bricks.map(column => column[0].x)); // 가장 왼쪽 블록의 x 좌표
      if (minX > 0) { // 이미 왼쪽으로 정렬되어 있지 않은 경우에만 정렬
        const shiftAmount = minX; // 왼쪽으로 이동할 양
        bricks.forEach(column => {
          column.forEach(brick => {
            brick.x -= shiftAmount; // 모든 블록들을 왼쪽으로 이동
          });
        });
        effects.forEach(column => {
          column.forEach(effect => {
            effect.x -= shiftAmount; // 모든 블록들을 왼쪽으로 이동
          });
        });
      }
    } else if (floatDirection === "R") {
      const maxX = Math.max(...bricks.map(column => column[brickColumnCount - 1].x + brickInfo.w)); // 가장 오른쪽 블록의 x 좌표
      if (maxX < canvas.width) { // 이미 오른쪽으로 정렬되어 있지 않은 경우에만 정렬
        const shiftAmount = canvas.width - maxX; // 오른쪽으로 이동할 양
        bricks.forEach(column => {
          column.forEach(brick => {
            brick.x += shiftAmount; // 모든 블록들을 오른쪽으로 이동
          });
        });
        
        effects.forEach(column => {
          column.forEach(effect => {
            effect.x += shiftAmount; // 모든 블록들을 왼쪽으로 이동
          });
        });
      }
    }
  
    draw(); // 변경된 위치에 따라 새로 그리기
  }

  function effect_scale() {
    ball.size *= 1.5; // ball.size를 1.2배로 늘림
    draw(); // 변경된 크기에 따라 새로 그리기
  }

  function effect_ul() {
    var li_count=0;
    
    for(let i = 0; i < brickRowCount; i++) {
      
      for (let j = 0; j < brickColumnCount; j++) {
        var li_rand=Math.floor(Math.random() * 2);
        if(li_count<3 && bricks[i][j].visible &&effects[i][j].randNum==7 && li_rand == 1){
          effects[i][j].text="li";
          effects[i][j].randNum= 9;
          li_count++;
          
        }
      }
    }
     
     draw();
  }
  function effect_li() {
    for(let i = 0; i < brickRowCount; i++) {
      
      for (let j = 0; j < brickColumnCount; j++){
        if(bricks[i][j].visible && effects[i][j].text=="li"){
           bricks[i][j].visible = false;
          effects[i][j].visible = false;
        }
      }
    }
  }

  let score = 0;
  // 점수판
  function drawScore() {
    $('#score').text("점수: " + score);
  }

  //테두리 그리기
  function drawBorder() {
    context.beginPath();
    context.lineWidth = 2; 
    context.strokeStyle = '#000000'; 
    context.fillStyle = '#ffffff'; 
    context.fillRect(0, 0, canvas.width, canvas.height);
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
    ball.x + ball.size > paddle.x && 
    ball.x < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) { 
    let collidePoint = ball.x - (paddle.x + paddle.w / 2);

    // 패들의 폭의 절반으로 정규화
    collidePoint = collidePoint / (paddle.w / 2);

    // 반발 각도를 -45도에서 45도 사이로 설정
    let angle = collidePoint * (Math.PI / 4);

    // 새로운 방향 설정
    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }

    // 벽돌 충돌
    bricks.forEach((column) => {
      column.forEach((brick) => {
        if (brick.visible) {
          if (
            ball.x + ball.size / 2 > brick.x && // 공의 오른쪽이 벽돌의 왼쪽보다 오른쪽에 있는지 확인
            ball.x - ball.size / 2 < brick.x + brick.w && // 공의 왼쪽이 벽돌의 오른쪽보다 왼쪽에 있는지 확인
            ball.y + ball.size / 2 > brick.y && // 공의 아래쪽이 벽돌의 위쪽보다 아래에 있는지 확인
            ball.y - ball.size / 2 < brick.y + brick.h // 공의 위쪽이 벽돌의 아래쪽보다 위에 있는지 확인
          ) {
            // 충돌 면을 결정
            const collideFromTop = ball.y + ball.size / 2 - ball.dy <= brick.y;
            const collideFromBottom = ball.y - ball.size / 2 - ball.dy >= brick.y + brick.h;
            const collideFromLeft = ball.x + ball.size / 2 - ball.dx <= brick.x;
            const collideFromRight = ball.x - ball.size / 2 - ball.dx >= brick.x + brick.w;
  
            // 충돌 면에 따라 공의 방향을 반전
            if (collideFromTop || collideFromBottom) {
              ball.dy *= -1;
            }
            if (collideFromLeft || collideFromRight) {
              ball.dx *= -1;
            }
            if(effects[brick.i][brick.j].randNum <=7  && effects[brick.i][brick.j].randNum > 0){
              brick.visible = false;
              effects[brick.i][brick.j].visible = false;
            }
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
  var timer = setInterval(function(){
    time--;
    $('#timelimit').text("남은 시간: " + time);
    if(time==45){
      showHint();
    }
    if(time == 0){
      clearInterval(timer);
      gameOver(); //제한시간이 됐을때 게임 오버 처리
    }
  },1000);

  function showHint(){
    $('#hint').fadeIn();
  }
  // 게임오버 함수
  function gameOver() {
    return;
    if (window.confirm("으악..실패했다..난 이제 어떻게 되는거지?\n" + "점수: " + score + "점"))
      {
        location.replace("../html/gameFail.html?level=" + level + "&color=" + color + "&music=" + music+ "&character=" + character + "&score=" + score);
      }
      else
      {
        alert("도망칠수없어..");
        location.replace("../html/gameFail.html?level=" + level + "&color=" + color + "&music=" + music+ "&character=" + character + "&score=" + score);
      }
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

  // draw
  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBorder();
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
    drawText();
  }

// 마우스 움직임 이벤트
canvas.addEventListener("mousemove", mouseMoveHandler, false);

  // 패들 움직임 함수
function mouseMoveHandler(e) {
  // 캔버스 위치 가져오기
  var canvasRect = canvas.getBoundingClientRect();

  var relativeX = e.clientX - canvasRect.left;

  // relativeX가 캔버스 범위 내에 있을 때만 패들의 위치를 업데이트
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.w / 2;
  }
}

}
