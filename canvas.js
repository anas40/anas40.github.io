const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d');

const ps1 = document.querySelector('#player1 span')
const ps2 = document.querySelector('#player2 span')
//defining canvas size
canvas.height = screen.height / 1.8;
canvas.width = screen.width / 1.8;

//color of pads
context.fillStyle = 'black';
let keys = [];

//defining pads,ball and players details
let pause = true;
const speed = 3;
const pad = {
    height: 100,
    width: 20,
}
const p1 = {
    x: canvas.width * 0.1,
    y: (canvas.height - pad.height) / 2,
    dy: 0,
    score: 0
}
const p2 = {
    x: canvas.width * 0.9 - pad.width,
    y: (canvas.height - pad.height) / 2,
    dy: 0,
    score: 0
}
const ball = {
    r: 15,
    color: 'red',
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: 4,
    min_dx: 2.5,
    max_dx: 10,
    dy: 2.5,
    max_dy: 5
}
randomSpeed();
//changing position of player 1
function updatePlayer(p) {
    context.clearRect(p.x - 1, p.y - 1, pad.width + 2, pad.height + 1);
    if (p.y >= 0 && p.y <= canvas.height - pad.height) {
        p.y += p.dy;
        if (p.y < 0) {
            p.y = 0;
        } else if (p.y > canvas.height - pad.height) {
            p.y = canvas.height - pad.height;
        }
    }
    p.dy = 0;
    context.fillStyle = 'black';
    context.fillRect(p.x, p.y, pad.width, pad.height)
}

function updateBall() {
    context.clearRect(ball.x - ball.r - 1, ball.y - ball.r - 1, ball.x + ball.r, ball.y + ball.r);
    ball.x += ball.dx;
    ball.y += ball.dy;
    checkBoundary();
    onContact();
    drawBall()
}

function randomSpeed() {
    ball.dx = (Math.random() * 2.5 + 1.5) * (Math.random() > 0.5 ? 1 : -1) //random speed between 2.5 to 5 second for sign
    ball.dy = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1)
}

function drawBall() {
    context.beginPath();
    context.fillStyle = ball.color;
    context.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true);
    context.fill();
}

function checkBoundary() {
    if (ball.x - ball.r < 0) {
        restart(p2);
    } else if (ball.x + ball.r > canvas.width) {
        restart(p1)
    }
    if (ball.y - ball.r < 0) {
        ball.y = ball.r;
        ball.dy *= -1;
    } else if (ball.y + ball.r > canvas.height) {
        ball.y = canvas.height - ball.r;
        ball.dy *= -1;
    }
}

function restart(p) {
    p.score += 1;
    context.clearRect(0, 0, canvas.width, canvas.height);
    ps1.innerHTML = p1.score;
    ps2.innerHTML = p2.score;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    drawBall();
    p1.x = canvas.width * 0.1;
    p1.y = (canvas.height - pad.height) / 2;
    p2.x = canvas.width * 0.9 - pad.width;
    p2.y = (canvas.height - pad.height) / 2;
    context.fillStyle = 'black';
    context.fillRect(p1.x, p1.y, pad.width, pad.height);
    context.fillRect(p2.x, p2.y, pad.width, pad.height);
    randomSpeed()
}

function onContact() {
    //checking if balls frame lies within the pad (width)
    if (ball.x - ball.r <= p1.x + pad.width && ball.x - ball.r > p1.x) {
        //checking if the ball is within the pad(height) then reflect the ball
        if (ball.y >= p1.y - 2 && ball.y <= p1.y + pad.height + 2) {
            ball.dx *= -1;
            changeSpeed(p1);
            //if balls position frame is deep inside the pad then changing speed again causes the ball to bounce as next frame is also insite the pad
            ball.x = p1.x + pad.width + ball.r;
        }
        //if ball half is in the pad (less than ball.r) then bounce but not back
        if (ball.y < p1.y && ball.y + ball.r >= p1.y) {
            ball.dy *= -1;
        } else if (ball.y - ball.r < p1.y + pad.height && ball.y > p1.y + pad.height) {
            ball.dy *= -1;
        }

    } //ball bouncing at player2 side
    else if (ball.x + ball.r >= p2.x && ball.x + ball.r < p2.x + pad.width) {
        if (ball.y >= p2.y - 2 && ball.y <= p2.y + pad.height + 2) {
            ball.dx *= -1;
            changeSpeed(p2)
            ball.x = p2.x - ball.r;
        }
        if (ball.y < p2.y && ball.y + ball.r >= p2.y) {
            ball.dy *= -1;
        } else if (ball.y - ball.r < p2.y + pad.height && ball.y > p2.y + pad.height) {
            ball.dy *= -1;
        }
    }
}

function changeSpeed(p) {
    //if ball is 30 away at the sides of pad i.e 40px of center
    if (ball.y >= p.y + 30 && ball.y <= p.y + pad.height - 30) {
        if (ball.dx > 0) {
            ball.dx += 0.5;
            if (ball.dy > 0) {
                ball.dy -= 0.1;
            } else if (ball.dy < 0) {
                ball.dy += 0.1;
            }
        } else {
            ball.dx -= 0.5;
            if (ball.dy > 0) {
                ball.dy -= 0.1;
            } else if (ball.dy < 0) {
                ball.dy += 0.1;
            }
        }
    } else {
        if (ball.dx > 0) {
            if (ball.dx >= 2.5) {
                ball.dx -= 0.1;
            }
            if (ball.dy > 0) {
                ball.dy += 0.5;
            } else if (ball.dy < 0) {
                ball.dy -= 0.5;
            }
        } else {
            if (ball.dx <= -2.5) {
                ball.dx += 0.1;
            }
            if (ball.dy > 0) {
                ball.dy += 0.5;
            } else if (ball.dy < 0) {
                ball.dy -= 0.5;
            }
        }
    }
    if (ball.dy > ball.max_dy) {
        ball.dy = ball.max_dy
    } else if (ball.dy < -ball.max_dy) {
        ball.dy = -ball.max_dy
    }
    if (ball.dx < ball.min_dx && ball.dx >= 0) {
        ball.dx = ball.min_dx
    } else if (ball.dx > -ball.min_dx && ball.dx <= 0) {
        ball.dx = -ball.min_dx
    }
    if (ball.dx > ball.max_dx) {
        ball.dx = ball.max_dx
    } else if (ball.dx < -ball.max_dx) {
        ball.dx = -ball.max_dx
    }
}

function update() {

    if (keys[87]) {
        p1.dy = -speed;
    }
    if (keys[83]) {
        p1.dy = speed;
    }
    if (keys[38]) {
        p2.dy = -speed;
    }
    if (keys[40]) {
        p2.dy = speed;
    }
    if (pause) {

    }
    updateBall()
    updatePlayer(p1);
    updatePlayer(p2);
    if(!pause){
    setTimeout(update, 1000 / 55);
    }

}
function callUpdate () {
    update();
}
//listening for keys
document.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true;
    if (keys[32]) {
        pause = !pause;
        if(!pause){
            callUpdate()
        }

    }
});
document.addEventListener('keyup', (e) => keys[e.keyCode] = false);