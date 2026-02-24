const pre = performance.now();
const load = await import("../load.js");
const p2d = await load.load();
const pro = performance.now();
console.log(`Loaded Phantom2D in ${(pro-pre).toFixed(2)}ms.`);
const c = document.createElement("canvas");
c.style.border = "2px solid black";
c.width = 800;
c.height = 600;
document.body.appendChild(c);

class Player {
    constructor() {
        this.height = Math.round(c.height / 2);
        this.grav = 0.09;
        this.gspd = 0;
        this.x = 70;
        this.y = 30;
        this.w = 40;
        this.h = 30;
    }
    upd() {
        this.gspd += this.grav;
        this.y += this.gspd;
        if(this.y <= 0) this.y = 0;
        if(this.y >= c.height) load.gameEnd(runtime, score, "flappybird-hs");
    }
}
class Pipe {
    constructor(x, pt, pb) {
        this.x = x;
        this.pt = pt;
        this.pb = pb;
        this.w = 50;
    }
}

var player = new Player();
var pipes = [];
var delta = 0;
var deltasr = 500;
var gap = 200;
var score = 0;
const ctx = c.getContext("2d");
const bg = new Image();
bg.src = "bg.jpg";
const bird = new Image();
bird.src = "bird.png";

var runtime = null;

function game() {
    if((delta % 2) == 0) player.upd();
    if((delta % deltasr) == 0) {
        let topHeight = Math.floor(Math.random() * (c.height - gap - 50));
        let bottomYt = topHeight + gap;
        pipes.push(new Pipe(c.width, 0, topHeight));
        pipes.push(new Pipe(c.width, bottomYt, c.height));
    }
    if((delta % 4000) == 0) { // 20000 ms => 5 ms upd => 4000 ticks
        deltasr -= 25;
        gap -= 10;
        if(deltasr < 100) deltasr = 100;
        if(gap < 50) gap = 50;
    }
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(bg, 0, 0, c.width, c.height + 3);
    ctx.fillStyle = "green";
    ctx.beginPath();
    pipes.forEach(pipe => {
        const pipeW = player.w;
        const pipeH = pipe.pb - pipe.pt;
        const pipeX = pipe.x;
        const pipeY = pipe.pt;
        const birdX = player.x;
        const birdY = player.y;
        const birdW = player.w;
        const birdH = player.h;
        // AABB collision
        const collide = birdX < pipeX + pipeW &&
                    birdX + birdW > pipeX &&
                    birdY < pipeY + pipeH &&
                    birdY + birdH > pipeY;
        if(collide) {
            load.gameEnd(runtime, score, "flappybird-hs");
        }
        const height = pipe.pb - pipe.pt;
        ctx.rect(pipe.x, pipe.pt, 50, height);
        pipe.x--;
        if(pipe.x + 50 < 0) {
            pipes.splice(pipes.indexOf(pipe), 1);
            score++;
        }
    });
    ctx.fill();
    ctx.drawImage(bird, player.x, player.y, player.w, player.h);
    delta++;
}
function setup() {
    runtime = setInterval(game, 5);
    document.addEventListener("keydown", (e) => {
        if(["w", "ArrowUp"].includes(e.key)) player.gspd = -3.17;
    });
}
setup();