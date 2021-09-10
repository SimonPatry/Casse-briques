/****************************************************/
/*                  global vars                     */
/****************************************************/

let test;
let fps = 0;
let plus = document.getElementById("plus");        //
let minus = document.getElementById("minus");      //   buttons to controle speed
let rstspeed = document.getElementById("rstspeed");//
let restartBtn = document.getElementById("restart"); //    buttons of the menu
let homeBtn = document.getElementById("home");       //-----------------------------    
let menuBtn = document.getElementById("menu");       //    div menu - contains the buttons
let titleBtn = document.getElementById("title");     //    "menu"

let surprise;
let gift;
let falling = 0;
let clrTimer;
let bonusTimer;
let allowSpace = 0;
let blockBonus = 0;
let saveFps = 0;
let maxBonus = [3];
let xSpeed = 4;
let ySpeed = 4;
let oldSpeed = [2];

/* Ball */
let ball = {
    radius:10,
    x: 0,
    y:0,
    color: "red",
    xSpeed: 4,
    ySpeed: 4,
};
let allow = 0;
let xDirection = 1;
let yDirection = -1;
let direction = 0;

/* Screen */
let walls = {
    width: 0,
    height: 0,
}

/* Bricks*/

let bricks = [40];

/* paddle */
let paddle = {
    x: 0,
    y: 0,
    width: 100,
    height: 20,
    bonus : 0,
    color: "white",
};
let rightPressed;
let leftPressed;
let upPressed;
let downPressed;
let speed = 7;
let paddleHit = 0;


/* set up canvas */
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');


/****************************************************/
/*                   Functions                      */
/****************************************************/

    /****************************************************/
    /*              Keypad Handler                      */
    /****************************************************/
    
function keyDownHandler(k) {
    if(k.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(k.key == "ArrowLeft") {
        leftPressed = true;
    }
	else if(k.key == "ArrowUp") {
        upPressed = true;
    }
	else if(k.key == "ArrowDown") {
        downPressed = true;
    }
}

function keyUpHandler(k) {
    if(k.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(k.key == "ArrowLeft") {
        leftPressed = false;
    }
	else if(k.key == "ArrowUp") {
        upPressed = false;
    }
	else if(k.key == "ArrowDown") {
        downPressed = false;
    }
}

    /****************************************************/
    /*                   Win/lose                       */
    /****************************************************/

function losing(){
    
    /* hide canvas */
    canvas.style.display = "none";
    
    /* Show menu */
    restartBtn.style.display = "block";
    homeBtn.style.display = "block";
    menuBtn.style.display = "flex";
    titleBtn.innerHTML = "You Lose";
    titleBtn.style.display = "inline";
    window.cancelAnimationFrame(test);
    surprise = clearInterval(drawSurprise);
    console.log("lost");
}

function win(){
    canvas.style.display = "none";
    restartBtn.style.display = "block";
    homeBtn.style.display = "block";
    menuBtn.style.display = "flex";
    titleBtn.innerHTML = "You Win";
    titleBtn.style.display = "inline";
    ball.xSpeed = 0;
    ball.ySpeed = 0;
    window.cancelAnimationFrame(test);
}

function restartGame(){
    
    /* reset menu display */
    restartBtn.style.display = "none";
    homeBtn.style.display = "none";
    menuBtn.style.display = "none"
    
    /* show canvas */
    
    canvas.style.display = "block";
    generateBricks();
    /* reset of the board, ball position and direction */
    xDirection = 1;
    yDirection = -1;
    ball.xSpeed = 4;
    ball.ySpeed = 4;
    ball.radius = 10;
    ball.color = "red";
    paddle.width = 100;
    paddle.color = "white";
    speed = 7;
    allowSpace = 0;
    blockBonus = 0;
    setBoard();
    allow = 0;
    /* relaunch the game */
    test = window.requestAnimationFrame(drawGame);
}

        /****************************************************/
        /*                    bonuses                       */
        /****************************************************/

function interGiftTopPaddle(){
    
    let a = gift.x;         // circle basic equation : (x - a)² + (y - b)²
    let b = gift.y;
    let y = paddle.y;         // circle equation: (x - centerX)² + (y - centerY)²
    let c = gift.radius * gift.radius;       // line equation:   y = (ax + b) or y = b in our case cause a = 0 we have a horizontale line
    
    let x1 = gift.x - gift.radius;
    let x2 = gift.x + gift.radius;
    let x3 = paddle.x;
    let x4 = paddle.x + paddle.width;
    
    /*             developpement                                                    */
    /* if intersection th two equations are equals so: (x - a)² + (y - b)² = c      */
    /* conclusion of the equation of the intersection : (x - a)² + (y - b)² -c = 0  */
    /*  (x - a)(x - a) + (y - b)(y - b) -b                                          */
    /*  (x² + 2ax + a²) + (y² + 2yb + b²) - b)                                      */
    /*  if y = b then i become easy to keep only x as unknown simple equation system*/
    /*  it gives: (x² + 2ax + a²) + (c² + 2.c.b + b²) - c                           */
    /*  know your resole to get something like ax² + bx + c                         */
    /*          with a = 1 ; b = 2a c = many things                                 */
    /*  id rthe discriminent ( b² -4.a.c ) is equal to 0 or positive you have one   */
    /*  or more solution  so there is an intersection !                             */
    
    let oldC = c;
    c = (a * a) + ((y * y) - (2 * y * b) + (b * b)) - oldC; 
    b = 2 * a;
    a = 1;
    let discr = (b * b) - (4 * a * c);
    if (discr >= 0 && (gift.y + gift.radius) > paddle.y 
    && ((x3 <= x1 && x1 <= x4) || (x3 <= x2 && x2 <= x4)))
        return 1;
    return 0;
}


function checkCollisions(){
    if (interGiftTopPaddle() == 1){
        return 1;
    }
    if (gift.y + gift.radius >= canvas.height)
        return 2;
    return 0;
}

function blockSpace(){
    allowSpace = 0;
    ball.color = "red";
    blockBonus = 0;
    bonusTimer = clearTimeout(bonusTimer);
}

function speedingPaddle(){
    speed = 7;
    blockBonus = 0;
    bonusTimer = clearTimeout(speedingPaddle);
}

function destroyRandomBricks(){
    let count = 0;
    let nbBricks = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < 40; i++){
        if (bricks[i].hitbox == 1)
            count++;
    }
    if (count <= 8)
        nbBricks = count;
    for (let i = 0; i < nbBricks; i++){
        let random = Math.floor(Math.random() * 40);
        while (bricks[random].hitbox == 0)
            random = Math.floor(Math.random() * 40);
        let brick = bricks[random];
        brick.hitbox = 0;
        brick.opacity = 0;
        brick.color = `rgba(${brick.r},${brick.g},${brick.b},${brick.opacity})`;
        console.log(brick.num + " ");
    }
}

function generateBonus(){
    let max = 7;
    if (blockBonus == 1)
        max = 4;
    let random = Math.floor(Math.random() * max) + 1;
    console.log(random);
    paddle.bonus = random;
    if (random == 1 && ball.radius <= 10)
        ball.radius *= 2;
    else if (random == 2 && ball.radius >= 10)
        ball.radius /= 2;
    else if (random == 3 && paddle.width <= 100)
        paddle.width *=2;
    else if (random == 4 && paddle.width >= 100)
        paddle.width /=2;
    else if (random == 5){
        allowSpace = 1;
        ball.color = "blue";
        blockBonus = 1;
        bonusTimer = setTimeout(blockSpace, 15000);
    }
    else if (random == 6){
        speed = 20;
        paddle.color = "pink";
        blockBonus = 1;
        bonusTimer = setTimeout(speedingPaddle, 20000);
    }
    else if (random == 7){
        destroyRandomBricks();
    }
}

function changeColor(){
    gift.r = Math.floor(Math.random() * 255) + 1;
    gift.g = Math.floor(Math.random() * 255) + 1;
    gift.b = Math.floor(Math.random() * 255) + 1;
    gift.color = `rgb(${gift.r},${gift.g},${gift.b})`;
    saveFps = 0;
}

function drawSurprise(){
    let res;
    ctx.beginPath();
	ctx.arc(gift.x, gift.y, gift.radius, 0, Math.PI*2);
	ctx.fillStyle = gift.color;
	ctx.fill();
	ctx.closePath();
	gift.y += 6;
	if (fps == (saveFps + 20))
	    clrTimer = setTimeout(changeColor, 20);
    if ((res = checkCollisions())){
        if (res == 1){
            generateBonus();
        }
        paddleHit = 0;
        falling = 0;
        clearTimeout(clrTimer);
        saveFps = 0;
        return ;
    }
    if (saveFps == 0)
        saveFps = fps;
}

function surpiseBox(brick){
    let r = Math.floor(Math.random() * 255) + 1;
    let g = Math.floor(Math.random() * 255) + 1;
    let b = Math.floor(Math.random() * 255) + 1;
    gift = {
        x: (brick.x + (brick.width / 2)),
        y: (brick.y + (brick.height / 2)),
        radius: 20,
        r: r,
        g: g,
        b: b,
        color: `rgb(${r},${g},${b})`,
    };
}

function changeSpeed(sign){
    if (sign == "plus" && speed < 10)
        speed++;
    else if (sign == "minus" && speed > 0)
        speed--;
    else if (sign = null)
        speed = 7;
}

        /****************************************************/
        /*                      paddle                      */
        /****************************************************/

function movePaddle(){
    if (rightPressed){
        allow = 1;
        direction = 1;
    }
    else if (leftPressed){
        allow = 1;
        direction = -1;
    }
    else{
        direction = 0;
    }
    if (((paddle.x + (speed * direction) + paddle.width) <= canvas.width)
    && (paddle.x + (speed * direction)) >= 0)
        paddle.x += speed * direction;
}


        /****************************************************/
        /*            collisions functions                  */
        /****************************************************/

function interBallTopPaddle(){
    
    let a = ball.x;         // circle basic equation : (x - a)² + (y - b)²
    let b = ball.y;
    let y = paddle.y;         // circle equation: (x - centerX)² + (y - centerY)²
    let c = ball.radius * ball.radius;       // line equation:   y = (ax + b) or y = b in our case cause a = 0 we have a horizontale line
    
    let x1 = ball.x - ball.radius;
    let x2 = ball.x + ball.radius;
    let x3 = paddle.x;
    let x4 = paddle.x + paddle.width;
    
    /*             developpement                                                    */
    /* if intersection th two equations are equals so: (x - a)² + (y - b)² = c      */
    /* conclusion of the equation of the intersection : (x - a)² + (y - b)² -c = 0  */
    /*  (x - a)(x - a) + (y - b)(y - b) -b                                          */
    /*  (x² + 2ax + a²) + (y² + 2yb + b²) - b)                                      */
    /*  if y = b then i become easy to keep only x as unknown simple equation system*/
    /*  it gives: (x² + 2ax + a²) + (c² + 2.c.b + b²) - c                           */
    /*  know your resole to get something like ax² + bx + c                         */
    /*          with a = 1 ; b = 2a c = many things                                 */
    /*  id rthe discriminent ( b² -4.a.c ) is equal to 0 or positive you have one   */
    /*  or more solution  so there is an intersection !                             */
    
    let oldC = c;
    c = (a * a) + ((y * y) - (2 * y * b) + (b * b)) - oldC; 
    b = 2 * a;
    a = 1;
    let discr = (b * b) - (4 * a * c);
    if (discr >= 0 && (ball.y + ball.radius) > paddle.y 
    && ((x3 <= x1 && x1 <= x4) || (x3 <= x2 && x2 <= x4)))
        return 1;
    return 0;
}

function checkPaddleCollision(){
    if (interBallTopPaddle() == 1){ //the ball hit the top of the paddle
        if (ball.x > paddle.x 
            && ball.x < (paddle.x + (paddle.width / 5))){
            if (xDirection == 1){
                ball.xSpeed = 1;
                ball.ySpeed = 6;
            }
            else{
                ball.xSpeed = 6;
                ball.ySpeed = 3;
            }
        }
        else if (ball.x > paddle.x + (paddle.width/5)
            && ball.x < paddle.x + ((paddle.width/5) * 2)){
            if (xDirection == 1){
                ball.xSpeed = 3;
                ball.ySpeed = 5;
            }
            else{
                ball.xSpeed = 5;
                ball.ySpeed = 4;
            }
        }
        else if (ball.x > paddle.x + ((paddle.width/5) * 2)
            && ball.x < paddle.x + ((paddle.width/5) * 3)){
                ball.xSpeed = 4;
                ball.ySpeed = 4;
        }
        else if (ball.x > paddle.x + ((paddle.width/5) * 3)
            && ball.x < paddle.x + ((paddle.width/5) * 4)){
            if (xDirection == 1){
                ball.xSpeed = 5;
                ball.ySpeed = 3;
            }
            else{
                ball.xSpeed = 4;
                ball.ySpeed = 5;
            }
        }
        else if (ball.x > (paddle.x + ((paddle.width/5)) * 4)
            && ball.x < (paddle.x + paddle.width)){
            if (xDirection == 1){
                ball.xSpeed = 6;
                ball.ySpeed = 3;
            }
            else{
                ball.xSpeed = 1;
                ball.ySpeed = 6;
            }
        }
        yDirection *= -1;
    }
}

function brickCollision(brick, nb, coll){
    let a = ball.x;         // circle basic equation : (x - a)² + (y - b)²
    let b = ball.y;
    let y = brick.y + brick.height;         // circle equation: (x - centerX)² + (y - centerY)²
    let c = ball.radius * ball.radius;       // line equation:   y = (ax + b) or y = b in our case cause a = 0 we have a horizontale line
    let x1 = ball.x - ball.radius;
    let x2 = ball.x + ball.radius;
    let x3 = brick.x;
    let x4 = brick.x + brick.width;
    let ballL = ball.x - ball.radius;
    let ballR = ball.x + ball.radius;
    let ballT = ball.y - ball.radius;
    let ballB = ball.y + ball.radius;
    let bT = brick.y;
    let bB = brick.y + brick.height;
    /* top or bot collisions of a brick */
    if (nb == 2){
        let oldC = c;
        c = (a * a) + ((y * y) - (2 * y * b) + (b * b)) - oldC; 
        b = 2 * a;
        a = 1;
        let discr = (b * b) - (4 * a * c);
        if (discr >= 0 && (ball.y + ball.radius) > (brick.y + brick.height) 
        && ((x3 < ball.x && ball.x < x4))){
            return 1;
        }
        a = ball.x;
        b = ball.y;
        y = brick.y;
        c = ball.radius * ball.radius;
        oldC = c;
        c = (a * a) + ((y * y) - (2 * y * b) + (b * b)) - oldC; 
        b = 2 * a;
        a = 1;
        discr = (b * b) - (4 * a * c);
        if ((discr >= 0 && (ball.y + ball.radius) >= (brick.y))
        && (x3 <= ball.x && ball.x <= x4)){
            return 1;
        }
    }

    /* side collision with a brick */
    
    else if (nb == 1){
        if (((ballR > x3 && ballR < x4) && (ballL < x3 && ballL < x4))
        && ((bT < ballT && ballT < bB) || (bT < ballB && bB > ballB))){
            return 2;
        }
        else if (((ballL > x3 && ballL < x4) && (ballR > x3 && ballR > x4))
        && ((bT < ballT && ballT < bB) || (bT < ballB && bB > ballB))){
            return 2;
        }
    }
    return 0;
}

function checkBrickCollision(brick){
    if (brick.hitbox){
        if (brickCollision(brick, 2) == 1 || brickCollision(brick, 1) == 2){
            if (brick.opacity > 0.5)
                brick.opacity -= 0.5;
            else {
                brick.hitbox = 0;
                brick.opacity -= 0.5;
            }
            if (brickCollision(brick, 2) == 1)
                yDirection *= -1;
            else
                xDirection *= -1;
            paddleHit++;
            if (paddleHit == 8){
                falling = 1;
                surpiseBox(brick);
            }
        }
    }
    brick.color = `rgba(${brick.r},${brick.g},${brick.b},${brick.opacity})`
}

function checkWallCollision(){
    if ((ball.x + ball.radius >= canvas.width) || (ball.x - ball.radius<= 0)){
        xDirection *= -1;
    }
    if ((ball.y - ball.radius <= 0)){
        yDirection *= -1;
    }
    if ((ball.y + ball.radius >= canvas.height)){
        losing();
    }
}

        /****************************************************/
        /*                  Draw functions                  */
        /****************************************************/

function moveBall(){
    
    let oldPosX = ball.x;
    let oldPosY = ball.y;
    ball.x += ball.xSpeed * xDirection;
    ball.y += ball.ySpeed * yDirection;
    
    
    checkWallCollision();
    checkPaddleCollision();
    ball.x = oldPosX;
    ball.y = oldPosY;
    ball.x += ball.xSpeed * xDirection;
    ball.y += ball.ySpeed * yDirection;
}

function drawBall(){
    ctx.beginPath();
    if (allow == 1)
        moveBall();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
	ctx.fillStyle = ball.color;
	ctx.fill();
	ctx.closePath();
}

function drawBricks(){
    let bricksLeft = 0;
    for (let i = 0; i < 40; i++){
        if (bricks[i].hitbox)
            bricksLeft++;
        checkBrickCollision(bricks[i]);
        ctx.fillStyle = bricks[i].color;
        ctx.fillRect(bricks[i].x, bricks[i].y, bricks[i].width, bricks[i].height);
    }
    if (bricksLeft == 0){
        win();
    }
}

function drawPaddle(){
    movePaddle();
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fps++;
    test = window.requestAnimationFrame(drawGame);
    drawPaddle();
    drawBall();
    drawBricks();
    if(falling == 1)
        drawSurprise();
    
}

        /****************************************************/
        /*          Set up the Board/Brick                  */
        /****************************************************/

function generateBricks(){
    
    /* Set up  of the margin on the sides of the color */
    /* and dimensions of the bricks and the number of line and columns */
    
    let bricksPerLine = 8;
    let bricksPerColumn = 5;
    let width = 100;
    let height = 30;
    let margin = 30;
    let sideMargin = (canvas.width - (8 * (width + margin))) / 2;
    let heightMargin = 30;
    let r;
    let g;
    let b;
    for (let i = 0; i < 40; i++){
        for (let  j = 0; j < 8; j++){
            let r = Math.floor(Math.random() * 255) + 1;
            let g = Math.floor(Math.random() * 255) + 1;
            let b = Math.floor(Math.random() * 255) + 1;
            bricks[i] = {
                num: i,
                x: (sideMargin + ((i % bricksPerLine) * (width + margin))),
                y: (heightMargin + ((i % bricksPerColumn) * (height + margin))),
                r: r,
                g: g,
                b: b,
                width: 80,
                height: 20,
                opacity: 1,
                color: `rgba(${r},${g},${b},1)`,
                hitbox: 1,
            };
        }
    }
}

function setBoard(){
    let x = canvas.width;
    let y = canvas.height;
    paddle.x = (x / 2) - (paddle.width / 2);
    paddle.y = y - (paddle.height * 2);
    ball.x = (x / 2) - ball.radius;
    ball.y = y - (paddle.height * 2) - (ball.radius * 2);
}


/****************************************************/
/*                    Main code                     */
/****************************************************/


document.addEventListener("DOMContentLoaded",function(){
    setBoard();
    generateBricks();
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    document.addEventListener("keydown", event => {
        if (ball.xSpeed != 0)
                    oldSpeed[0] = ball.xSpeed;
                if (ball.ySpeed != 0)
                    oldSpeed[1] = ball.ySpeed;
        if (event.keyCode === 32) {
            if (allowSpace){
                
                ball.xSpeed = ball.xSpeed > 0 ? ball.xSpeed = 0 : ball.xSpeed = oldSpeed[0];
                ball.ySpeed = ball.ySpeed > 0 ? ball.ySpeed = 0 : ball.ySpeed = oldSpeed[1];
            }
            else{
                ball.xSpeed = oldSpeed[0];
                ball.ySpeed = oldSpeed[1];
            }
            return;
        }
    });
    document.addEventListener("keydown", event => {
        if (event.keyCode === 80) {
            if (ball.xSpeed != 0)
                oldSpeed[0] = ball.xSpeed;
            if (ball.ySpeed != 0)
                oldSpeed[1] = ball.ySpeed;
            ball.xSpeed = ball.xSpeed > 0 ? ball.xSpeed = 0 : ball.xSpeed = oldSpeed[0];
            ball.ySpeed = ball.ySpeed > 0 ? ball.ySpeed = 0 : ball.ySpeed = oldSpeed[1];
            speed = speed > 0 ? speed = 0 : speed = 7;
            return;
        }
    });
    plus.addEventListener('click', function(){
    changeSpeed("plus");});
    minus.addEventListener('click', function(){
    changeSpeed("minus");});
    rstspeed.addEventListener('click', function(){
    changeSpeed();});
    let lose = document.getElementById("lose"); // option to lose or not
    restartBtn.addEventListener('click', restartGame);
    test = window.requestAnimationFrame(drawGame);
});