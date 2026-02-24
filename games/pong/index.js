import { chance } from "../../utils.js";

const pre = performance.now();
const load = await import("../load.js");
const p2d = await load.load();
const pro = performance.now();
console.log(`Loaded Phantom2D in ${(pro-pre).toFixed(2)}ms.`);
const c = document.createElement("canvas");
c.style.border = "2px solid black";
c.style.backgroundColor = "black";
c.width = 800;
c.height = 600;
document.body.appendChild(c);
class Player {
    constructor() {
        this.y = 300;
        this.spd = 0;
        this.mspd = 5;
    }
    upd() {
        this.y += this.spd;
        if(this.y < 0) this.y = 0;
        if(this.y + 100 > c.height) this.y = c.height - 100;
    }
}
class Enemy {
    constructor() {
        this.spd = 1;
        this.y = 300;
    }
    upd() {
        if(ball.y < this.y + 50) this.y -= this.spd;
        else if(ball.y > this.y + 50) this.y += this.spd;
        if(this.y < 0) this.y = 0;
        if(this.y + 100 > c.height) this.y = c.height - 100;
    }
}
class Ball {
    constructor() {
        this.x = 400;
        this.y = 300;
        this.vx = 3;
        this.vy = 2;
        this.vx *= chance(50) ? -1 : 1;
        this.vy *= chance(50) ? -1 : 1;
    }
    upd() {
        this.x += this.vx;
        this.y += this.vy;
        if(this.y <= 0 || this.y + 10 >= c.height) this.vy *= -1;
    }
}
var player = new Player();
var enemy = new Enemy();
var ball = new Ball();
var score = 0;
var delta = 0;
const ctx = c.getContext("2d");
const pong = new Image();
pong.src = "ball.png";
var runtime = null;
function game() {
    ball.upd();
    player.upd();
    enemy.upd();
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(100, player.y, 20, 100);
    ctx.rect(700, enemy.y, 20, 100);
    ctx.fill();
    ctx.drawImage(pong, ball.x, ball.y, 10, 10);
    if(ball.x <= 120 && ball.x + 10 >= 100 && ball.y >= player.y && ball.y <= player.y + 100) {
        ball.vx *= -1.05;
        ball.vy *= 1.05;
        ball.x = 120;
    }
    if(ball.x + 10 >= 700 && ball.x <= 720 && ball.y >= enemy.y && ball.y <= enemy.y + 100) {
        ball.vx *= -1.05;
        ball.vy *= 1.05;
        ball.x = 690;
    }
    if(ball.x <= 0) {
        load.gameEnd(runtime, score, "pong-hs");
    } else if(ball.x >= c.width) {
        score++;
        enemy.spd += 0.5;
        ball = new Ball();
    }
    delta++;
}
function setup() {
    runtime = setInterval(game, 10);
    document.addEventListener("keydown", (e) => {
        const k = e.key;
        if(k == "ArrowUp" || k == "w") player.spd = -player.mspd;
        if(k == "ArrowDown" || k == "s") player.spd = player.mspd;
    });
    document.addEventListener("keyup", (e) => {
        const k = e.key;
        if(["ArrowUp", "ArrowDown", "w", "s"].includes(k)) player.spd = 0;
    });
}
setup();