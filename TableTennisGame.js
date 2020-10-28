const cvs = document.getElementById("tableTennis");
const ctx = cvs.getContext("2d");
const user = {
    x : 0,
    y : cvs.height/2-100/2,
    width : 10,
    height : 100,
    color : "black",
    score : 0,
};
const bot = {
    x : cvs.width - 10,
    y : cvs.height/2-100/2,
    width : 10,
    height : 100,
    color : "black",
    score : 0,
};

const net = {
    x : cvs.width/2,
    y : 0,
    width : 2,
    height : 10,
    color : "gray",
};
function drawNet(){
    for (let i = 0; i <= cvs.height;i+=15){
        drawRect(net.x,net.y + i,net.width,net.height,net.color);
    }
}

const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 10,
    velocityX : 10,
    velocityY : 10,
    strokeStyle : "orange",
};

function drawRect(x,y,width,height,color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,width,height);
}
function drawCircle(x,y,radius,color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2,false);
    ctx.closePath();
    ctx.stroke();
}
function drawText(text,x,y,color){
    ctx.strokeStyle = color;
    ctx.font = "75px fantasy";
    ctx.fillText(text,x,y);
}

function render(){
    drawRect(0,0,cvs.width,cvs.height, "pink");

    drawNet();

    drawText(user.score, cvs.width/4, cvs.height/5, "black");
    drawText(bot.score, 3*cvs.width/4, cvs.height/5, "black");

    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawRect(bot.x,bot.y,bot.width,bot.height,bot.color);

    drawCircle(ball.x,ball.y,ball.radius,ball.color);
}
cvs.addEventListener("mousemove",movePaddle);
function movePaddle(evt){
    let rect = cvs.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}
function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    let botlevel = 0.1;
    bot.y += (ball.y - ( bot.y + bot.height/2))*botlevel;
    if (ball.y + ball.radius > cvs.height - ball.radius || ball.y - ball.radius < 0 ){
        ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x < cvs.width/2) ? user : bot;
    if (collision(ball,player)){
        let collidePoint = ball.y - (player.y + player.height/2);
        collidePoint =collidePoint/(player.height/2);
        let angleRad = (Math.PI/4)*collidePoint;
        let direction = (ball.x < cvs.width/2) ? 1 : -1;
        ball.velocityX = direction*ball.speed*Math.cos(angleRad);
        ball.velocityY = ball.speed*Math.sin(angleRad);

        ball.speed += 0.1;
    }
    if (ball.x - ball.radius <0) {
        bot.score++;
        resetBall();
    } else if (ball.x + ball.radius > cvs.width){
        user.score++;
        resetBall();
    }
}
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.speed = 10;
    ball.velocityX = -ball.velocityX;
}

function checkWin() {
    if (user.score === 5){
        alert(" Đố mày thắng lần nữa đấy ! ");
        document.location.reload();
    }
}
function checkLose() {
    if (bot.score === 5){
        alert (" Xin cái tuổi bạn nhé ! ");
        document.location.reload();
    }
}

function game(){
    update();
    render();
    checkWin();
    checkLose();
}
const framePerSecond = 60;
setInterval(game, 1000/framePerSecond);