const cvs = document.getElementById("tableTennis");
const ctx = cvs.getContext("2d");
const user = {
    x : 0,
    y : cvs.height/2-100/2,
    width : 10,
    height : 100,
    color : "pink",
    score : 0,
};
const bot = {
    x : cvs.width - 10,
    y : cvs.height/2-100/2,
    width : 10,
    height : 100,
    color : "pink",
    score : 0,
};
const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 10,
    velocityX : 10,
    velocityY : 10,
    color : "pink",
};

const net = {
    x : cvs.width/2,
    y : 0,
    width : 2,
    height : 10,
    color : "pink",
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
    ctx.fill();
}
function drawText(text,x,y,color){
    ctx.fillStyle = color;
    ctx.font = "45px family";
    ctx.fillText(text,x,y);
}
function drawNet(){
    for (let i = 0; i <= cvs.height;i+=15){
        drawRect(net.x,net.y + i,net.width,net.height,net.color);
    }
}
function render(){
    drawRect(0,0,cvs.width,cvs.height, "black");

    drawNet();

    drawText(user.score, cvs.width/4, cvs.height/5, "pink");
    drawText(bot.score, 3*cvs.width/4, cvs.height/5, "pink");

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
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    ball.speed = 10;
    ball.velocityX = -ball.velocityX;
}
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    let botlevel = 0.1;
    bot.y += (ball.y - ( bot.y + bot.height/2))*botlevel;
    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0 ){
        ball.velocityY = -ball.velocityY;
    }
    let player = (ball.x < cvs.width/2) ? user : bot;
    if (collision(ball,player)){
        let collidePoint = ball.y - (player.y + player.height/2);
        collidePoint =collidePoint/(player.height/2);
        let angleRadius = collidePoint*Math.PI/4;
        let direction = (ball.x < cvs.width/2) ? 1 : -1;
        ball.velocityX = direction*ball.speed*Math.cos(angleRadius);
        ball.velocityY = ball.speed*Math.sin(angleRadius);

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
function game(){
    update();
    render();
}
const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);