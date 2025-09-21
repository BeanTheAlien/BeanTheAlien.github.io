import '/utils.js';
import { random, chance, getEl, wait, isTrue, isFalse, safeEval, RandomNums, ClickRegion, copyToClipboard, dist, mouse, lsGet, lsSet, quadratic, getQuerys, isFactorable, makeEl } from '/utils.js';

/*
games:
around us (among us)
btd6
geometric jump (geo dash)
2048
breakout
pvz
angry birds
fruit ninja
tag
fnaf
*/

window.addEventListener("error", (e) => alert(`msg: ${e.message}, ln: ${e.lineno}`));

window.addEventListener("load", () => {
    const querys = getQuerys();
    if(querys.has("id")) {
        const idx = parseInt(querys.get("id"));
        if(idx >= games.length) return;
        const item = games[idx];
        launch(item.exec, item.filename);
    }
});

const gamelist = document.createElement("div");
Object.assign(gamelist.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    margin: "auto",
    gap: "20px" // Added gap for spacing
});

const games = [
    {
        "filename": "flappybird",
        "name": "Flappy Bird",
        "exec": (popup) => {
            const d1 = document.createElement("div");
            const d2 = document.createElement("div");
            d1.className = "score1";
            d2.className = "score2";
            const c = document.createElement("canvas");
            c.style.border = "2px solid black";
            c.width = 800;
            c.height = 600;
            d2.appendChild(c);
            popup.appendChild(d2);
            class Player {
                constructor() {
                    this.height = Math.round(c.height / 2);
                    this.grav = 0.0527;
                    this.gspd = 0;
                    this.x = 15;
                    this.y = 30;
                    this.w = 20;
                    this.h = 20;
                }
                upd() {
                    this.gspd += this.grav;
                    this.y += this.gspd;
                    if(this.y <= 0) this.y = 0;
                    if(this.y >= c.height) gameEnd(runtime, score, "flappybird-hs");
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
            var gap = 150;
            var score = 0;
            const ctx = c.getContext("2d");

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
                    if(deltasr < 100) deltasr = 100;
                }
                ctx.clearRect(0, 0, c.width, c.height);
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
                        gameEnd(runtime, score, "flappybird-hs");
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
                ctx.fillStyle = "yellow";
                ctx.beginPath();
                ctx.rect(player.x, player.y, player.w, player.h);
                ctx.fill();
                delta++;
            }
            function setup() {
                runtime = setInterval(game, 5);
                document.addEventListener("keydown", (e) => {
                    if(["w", "ArrowUp"].includes(e.key)) player.gspd = -3.17;
                });
            }
            setup();
        }
    },
    {
        "filename": "amongus",
        "name": "Among Us",
        "exec": (popup) => {
            const d1 = document.createElement("div");
            const d2 = document.createElement("div");
            d1.className = "score1";
            d2.className = "score2";
            const c = document.createElement("canvas");
            c.style.border = "2px solid black";
            c.width = 800;
            c.height = 600;
            d2.appendChild(c);
            popup.appendChild(d2);
            class Crewmate {
                constructor(s) {
                    this.colour = s.colour;
                    this.x = s.x;
                    this.y = s.y;
                    this.name = s.name;
                    this.role = "crewmate";
                    this.tasks = [];
                    this.dead = false;
                }
                upd() {
                    //
                }
            }
            class Imposter {
                constructor(s) {
                    this.colour = s.colour;
                    this.x = s.x;
                    this.y = s.y;
                    this.name = s.name;
                    this.role = "imposter";
                    this.tasks = [];
                    this.killtimer = 0;
                    this.killcd = 120;
                    this.dead = false;
                }
                upd() {
                    const cmates = lobby.filter(l => l.role == "crewmate");
                    const clCmate = [...cmates].sort((a, b) => dist(this.x, this.y, a.x, a.y) - dist(this.x, this.y, b.x, b.y))[0];
                    const clTask = [...this.tasks].sort((a, b) => dist(this.x, this.y, a.x, a.y) - dist(this.x, this.y, b.x, b.y))[0];
                    if(clCmate <= clTask && this.killtimer == 0) {} // will path to them & kill them
                    else {} // path to task & pretend to do
                }
            }
            var lobby = [];
            const lobsize = 10;
            const impcount = 3;
            const ctx = c.getContext("2d");
            var runtime = null;
            var keys = {};
            for(let i = 0; i < lobsize; i++) {
                const imps = lobby.filter(p => p.role == "imposter").length;
                if(imps < impcount) if(chance(50)) lobby.push(new Imposter({"colour":"red", "x":0, "y":0, "name":"Imposer"})); else lobby.push(new Crewmate({"colour":"green", "x":0, "y":0, "name":"Crowmate"}));
                else lobby.push(new Crewmate({"colour":"green", "x":0, "y":0, "name":"Crowmate"}));
            }
            const player = lobby[0];;
            function game() {
                if(keys["w"]) player.y++;
                if(keys["a"]) player.x--;
                if(keys["s"]) player.y--;
                if(keys["d"]) player.x++;
                lobby.forEach(l => {
                    l.upd();
                    ctx.fillStyle = l.colour;
                    ctx.beginPath();
                    ctx.rect(l.x, l.y, 5, 10);
                    ctx.fill();
                });
            }
            function setup() {
                runtime = setInterval(game, 5);
                document.addEventListener("keydown", (e) => keys[e.key] = true);
                document.addEventListener("keyup", (e) => keys[e.key] = false);
            }
            setup();
        }
    },
    {
        "filename": "snake",
        "name": "Snake",
        "exec": (popup) => {
            const d1 = document.createElement("div");
            const d2 = document.createElement("div");
            d1.className = "score1";
            d2.className = "score2";
            const c = document.createElement("canvas");
            c.style.border = "2px solid black";
            const tileSize = 5;
            const cols = 50; // 1000/10
            const rows = 50; // 1000/10
            c.width = cols * tileSize;
            c.height = rows * tileSize;
            d2.appendChild(c);
            popup.appendChild(d2);
            class sqr { constructor(x, y) { this.x = x; this.y = y; } }
            var player = [new sqr(5, 25), new sqr(4, 25), new sqr(3, 25)];
            var dir = { x: 1, y: 0 };
            var score = 0;
            var delta = 0;
            var apl = new sqr(random(cols), random(rows));
            const ctx = c.getContext("2d");
            var runtime = null;
            function drawRect(x, y, colour) {
                ctx.fillStyle = colour;
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
            function game() {
                const head = player[0];
                const nhead = new sqr(head.x + dir.x, head.y + dir.y);
                if(nhead.x < 0 || nhead.x >= cols || nhead.y < 0 || nhead.y >= rows || player.some(p => p.x == nhead.x && p.y == nhead.y)) {
                    gameEnd(runtime, score, "snake-hs");
                    return;
                }
                player.unshift(nhead);
                if(nhead.x == apl.x && nhead.y == apl.y) {
                    score++;
                    let nx = random(cols);
                    let ny = random(rows);
                    while(player.some(p => p.x == nx && p.y == ny)) {
                        nx = random(cols);
                        ny = random(rows);
                    }
                    apl = new sqr(nx, ny);
                } else {
                    player.pop();
                }
                // Draw
                ctx.clearRect(0, 0, c.width, c.height);
                // Draw apple
                drawRect(apl.x, apl.y, "#ff0000");
                // Draw snake
                player.forEach(p => drawRect(p.x, p.y, "#26c400"));
                delta++;
            }
            function setup() {
                runtime = setInterval(game, 80);
                document.addEventListener("keydown", (e) => {
                    switch(e.key) {
                        case "w": if(dir.y == 0) dir = {x:0, y:-1}; break;
                        case "ArrowUp": if(dir.y == 0) dir = {x:0, y:-1}; break;
                        case "s": if(dir.y == 0) dir = {x:0, y:1}; break;
                        case "ArrowDown": if(dir.y == 0) dir = {x:0, y:1}; break;
                        case "a": if(dir.x == 0) dir = {x:-1, y:0}; break;
                        case "ArrowLeft": if(dir.x == 0) dir = {x:-1, y:0}; break;
                        case "d": if(dir.x == 0) dir = {x:1, y:0}; break;
                        case "ArrowRight": if(dir.x == 0) dir = {x:1, y:0}; break;
                    }
                });
            }
            setup();
        }
    },
    {
        "filename": "pong",
        "name": "Pong",
        "exec": (popup) => {
            const d1 = document.createElement("div");
            const d2 = document.createElement("div");
            d1.className = "score1";
            d2.className = "score2";
            const c = document.createElement("canvas");
            c.style.border = "2px solid black";
            c.style.backgroundColor = "black";
            c.width = 800;
            c.height = 600;
            d2.appendChild(c);
            popup.appendChild(d2);
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
                ctx.rect(ball.x, ball.y, 10, 10);
                ctx.fill();
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
                    gameEnd(runtime, score, "pong-hs");
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
        }
    },
    {
        "filename": "geometricjump",
        "name": "Geometric Jump",
        "exec": (popup) => {
            const d1 = document.createElement("div");
            const d2 = document.createElement("div");
            d1.className = "score1";
            d2.className = "score2";
            const c = document.createElement("canvas");
            c.style.border = "2px solid black";
            c.style.backgroundColor = "darkblue";
            c.width = 800;
            c.height = 600;
            d2.appendChild(c);
            popup.appendChild(d2);
            class Player {
                constructor() {
                    this.x = 100;
                    this.y = 0;
                    this.w = 20;
                    this.h = 20;
                    this.grav = 0.5;
                    this.gspd = 0;
                }
                upd() {
                    this.gspd += this.grav;
                    this.y += this.gspd;
                    if(this.y + this.h > c.height) {
                        this.y = c.height - this.h;
                        this.gspd = 0;
                    }
                }
            }
            class Spike {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.w = 15;
                    this.h = 20;
                }
            }
            class Platform {
                constructor(x, y, w, h) {
                    this.x = x;
                    this.y = y;
                    this.w = w;
                    this.h = h;
                }
            }
            function aabb(a, b) {
                return (
                    a.x < b.x + b.w &&
                    a.x + a.w > b.x &&
                    a.y < b.y + b.h &&
                    a.y + a.h > b.y
                );
            }
            var player = new Player();
            var spikes = [];
            var pforms = [];
            for(let i = 0; i < 1000; i++) {
                if(chance(5)) {
                    if(chance(50)) spikes.push(new Spike(i + 500, random(0, c.height)));
                    else pforms.push(new Platform(i + 500, random(0, c.height, random(1, 101), random(1, 101))));
                }
            }
            var gy = 500;
            var score = 0;
            var delta = 0;
            const ctx = c.getContext("2d");
            var runtime = null;
            function game() {
                if(delta % 3 == 0) {
                    player.upd();
                    player.minH = c.height;
                }
                ctx.clearRect(0, 0, c.width, c.height);
                ctx.fillStyle = "yellow";
                ctx.beginPath();
                ctx.rect(100, player.y, 20, 20);
                ctx.fill();
                spikes.forEach(s => {
                    s.x--;
                    if(aabb(player, s)) {
                        gameEnd(runtime, score, "geo-hs");
                        return;
                    }
                    if(s.x + 15 < 0) spikes.splice(spikes.indexOf(s), 1);
                });
                pforms.forEach(p => {
                    p.x--;
                    if(aabb(player, p) && player.gspd >= 0) {
                        player.y = p.y - player.h; // stand on top
                        player.gspd = 0;
                    }
                    if(p.x + 15 < 0) pforms.splice(pforms.indexOf(p), 1);
                });
                ctx.fillStyle = "#3194b4ff";
                ctx.beginPath();
                pforms.forEach(p => ctx.rect(p.x, p.y, p.w, p.h));
                ctx.fill();
                ctx.fillStyle = "white";
                ctx.beginPath();
                spikes.forEach(s => ctx.rect(s.x, s.y, 15, 20));
                ctx.fill();
                delta++;
            }
            function setup() {
                runtime = setInterval(game, 5);
                document.addEventListener("keydown", (e) => {
                    const k = e.key;
                    if([" ", "w", "ArrowUp"].includes(k) && player.y >= c.height - 25) player.gspd = -10;
                });
            }
            setup();
        }
    },
    {
        "filename": "pvz",
        "name": "Plants vs Zombies",
        "exec": (popup) => {
            const d1 = document.createElement("div");
            const d2 = document.createElement("div");
            d1.className = "score1";
            d2.className = "score2";
            const c = document.createElement("canvas");
            c.style.border = "2px solid black";
            const tileSize = 50;
            const cols = 10;
            const rows = 5;
            c.width = cols * tileSize;
            c.height = rows * tileSize;
            d2.appendChild(c);
            popup.appendChild(d2);
            const menu = document.createElement("div");
            popup.appendChild(menu);
            menu.style.backgroundColor = "#e2900ad2";
            menu.style.width = "200px";
            menu.style.height = "500px";
            function drawRect(x, y, colour) {
                ctx.fillStyle = colour;
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
            function drawImg(x, y, w, h, path) {
                const img = new Image();
                img.src = path;
                img.onload = () => ctx.drawImage(img, x, y, w, h);
            }
            function plant() {
                return new Promise((resolve) => {
                    const canvasClick = (e) => {
                        c.removeEventListener("click", canvasClick);
                        const rect = c.getBoundingClientRect();
                        const x = Math.floor((e.clientX - rect.left) / tileSize);
                        const y = Math.floor((e.clientY - rect.top) / tileSize);
                        resolve({ x, y });
                    };
                    c.addEventListener("click", canvasClick);
                });
            }
            class Plant {
                constructor(x, y, hp, act, actdl, img) {
                    this.x = x * tileSize;
                    this.y = y * tileSize;
                    this.hp = hp;
                    this.act = act;
                    this.actdl = actdl * 200;
                    this.timer = this.actdl;
                    this.img = img;
                }
                upd() {
                    this.timer--;
                    if(this.timer <= 0) {
                        this.act();
                        this.timer = this.actdl;
                    }
                }
                hurt(d) {
                    this.hp -= d;
                    if(this.hp <= 0) plants.splice(plants.indexOf(this), 1);
                }
            }
            class Peashooter extends Plant {
                constructor(x, y) {
                    super(x, y, 3, () => world.push(new Pea(this.x, this.y)), 1, "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT02qjx8I12R1aouaJvkbIRzvCucMJ3DqWCCzZFTPb4rcyKBXPdD9PTKQNv2JfXr8LF_b6wNLOvKByQPSKAGvwLDQ");
                }
            }
            class Zombie {
                constructor(x, y, spd, hp, dmg, img) {
                    this.x = x * tileSize;
                    this.y = y * tileSize;
                    this.hp = hp;
                    this.dmg = dmg;
                    this.img = img;
                    this.spd = spd * 5;
                    this.timer = this.spd;
                }
                upd() {
                    this.timer--;
                    if(this.timer <= 0) {
                        this.x--;
                        this.timer = this.spd;
                    }
                }
                hurt(d) {
                    this.hp -= d;
                    if(this.hp <= 0) zombies.splice(zombies.indexOf(this), 1);
                }
            }
            class Zomb extends Zombie {
                constructor(x, y) {
                    super(x, y, 1, 3, 1, "https://static.wikia.nocookie.net/villains/images/8/8c/Zombie1plant.png/revision/latest?cb=20240801183626");
                }
            }
            class Pea {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.img = "https://images.steamusercontent.com/ugc/972119341016831838/5182552889AF62A2AE66B8C79CD41D1FF66B03AD/?imw=1024&imh=1023&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true";
                    this.spd = 1;
                    this.timer = this.spd;
                }
                upd() {
                    this.timer--;
                    if(this.timer <= 0) {
                        this.x++;
                        this.timer = this.spd;
                    }
                    zombies.forEach(z => {
                        if(Math.abs(this.x - z.x) <= 0.1 && Math.abs(this.y - z.y) <= 0.1) {
                            world.splice(world.indexOf(this), 1);
                            z.hurt(1);
                        }
                    });
                    if(this.x > c.width) world.splice(world.indexOf(this), 1);
                }
            }
            var plants = [];
            var zombies = [];
            var world = [];
            var sun = 200;
            [["Peashooter", 100, Peashooter]].forEach(p => {
                const b = document.createElement("button");
                b.innerHTML = `${p[0]}<br>${p[1]}☀️`;
                b.className = "pbtn";
                b.addEventListener("click", async () => {
                    if(sun < p[1]) return;
                    sun -= p[1];
                    //b.style.backgroundColor = "#0bd6c5ff";
                    const { x, y } = await plant();
                    plants.push(new (p[2])(x, y));
                });
                b.style.width = "100px";
                b.style.height = "50px";
                menu.appendChild(b);
            });
            var score = 0;
            var delta = 0;
            const ctx = c.getContext("2d");
            var runtime = null;
            zombies.push(new Zomb(8, 1));
            function game() {
                plants.forEach(p => p.upd());
                zombies.forEach(z => z.upd());
                world.forEach(w => w.upd());
                ctx.clearRect(0, 0, c.width, c.height);
                // Loop through rows and columns to draw the checkerboard
                for(let row = 0; row < c.height / tileSize; row++) {
                    for(let col = 0; col < c.width / tileSize; col++) {
                        // Determine the color based on the sum of row and column indices
                        // If (row + col) is even, use color1; otherwise, use color2
                        if((row + col) % 2 == 0) {
                            ctx.fillStyle = "#32d600ff";
                        } else {
                            ctx.fillStyle = "#229100ff";
                        }
                        // Draw the rectangle (square)
                        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
                    }
                }
                plants.forEach(p => drawImg(p.x, p.y, tileSize / 2, tileSize / 2, p.img));
                zombies.forEach(z => drawImg(z.x, z.y, tileSize / 2, tileSize / 2, z.img));
                world.forEach(w => drawImg(w.x, w.y, tileSize / 2, tileSize / 2, w.img));
                delta++;
            }
            function setup() {
                runtime = setInterval(game, 10);
            }
            setup();
        }
    },
    {
        "filename": "angrybirds",
        "name": "Angry Birds",
        "exec": (popup) => {
            const d1 = document.createElement("div");
            const d2 = document.createElement("div");
            d1.className = "score1";
            d2.className = "score2";
            const c = document.createElement("canvas");
            c.style.border = "2px solid black";
            c.width = 1000;
            c.height = 500;
            d2.appendChild(c);
            popup.appendChild(d2);
            function drawRect(x, y, colour) {
                ctx.fillStyle = colour;
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
            function drawImg(x, y, w, h, path) {
                const img = new Image();
                img.src = path;
                img.onload = () => ctx.drawImage(img, x, y, w, h);
            }
            class Bird {
                constructor(x, y, dmg, stats, act, actlm) {
                    this.x = x;
                    this.y = y;
                    this.dmg = dmg;
                    this.stats = stats;
                    this.act = act;
                    this.actlm = actlm;
                    this.grav = 0.05;
                    this.gspd = 0;
                }
                upd() {
                    this.gspd += this.grav;
                    this.y += this.gspd;
                }
            }
            class Pig {
                constructor(x, y, hp) {
                    this.x = x;
                    this.y = y;
                    this.hp = hp;
                    this.grav = 0.05;
                    this.gspd = 0;
                }
                upd() {
                    this.gspd += this.grav;
                    this.y += this.gspd;
                }
            }
            class Block {
                constructor(x, y, hp, type) {
                    this.x = x;
                    this.y = y;
                    this.hp = hp;
                    this.type = type;
                }
            }
            class Piggy extends Pig {
                constructor(x, y) {
                    super(x, y, 1);
                }
            }
            class Red extends Bird {
                constructor(x, y) {
                    super(x, y, 1, ["glass", "wood", "stone"], () => {}, 0);
                }
            }
            class Wood extends Block {
                constructor(x, y) {
                    super(x, y, 2, "wood");
                }
            }
            class Level {
                constructor(lvlbirds, lvlpigs, lvlblocks) {
                    this.lvlbirds = lvlbirds;
                    this.lvlpigs = lvlpigs;
                    this.lvlblocks = lvlblocks;
                }
            }
            const levels = [
                new Level([new Red(3, 1), new Red(2, 1), new Red(1, 1)], [new Piggy(5, 10)], [new Wood(5, 10)])
            ];
            const lvl = levels[0]; // repl with choosing menu ltr
            var bird = null;
            var birds = lvl.lvlbirds;
            var pigs = lvl.lvlpigs;
            var world = [...lvl.lvlblocks];
            bird = birds[0];
            var score = 0;
            var delta = 0;
            const ctx = c.getContext("2d");
            var runtime = null;
            function game() {
                bird.upd();
                pigs.forEach(z => z.upd());
                world.forEach(w => w.upd());
                ctx.clearRect(0, 0, c.width, c.height);
                delta++;
            }
            function setup() {
                runtime = setInterval(game, 10);
            }
            setup();
        }
    },
    {
        "filename": "jpgdatingsim",
        "name": "JPG Dating Sim",
        "exec": (popup) => {
            const d1 = document.createElement("div");
            const d2 = document.createElement("div");
            d1.className = "score1";
            d2.className = "score2";
            popup.appendChild(d2);
            /*
            intro - basic scene (text, driving to restaurant?)
                - could have interactive elements
                - driving minigame
                - bg will change a lot
                - w does not show up yet (maybe pfp for contact?)
            driving - driving minigame (see intro)
                - dodge cars and dont die or break the law
                - no w still
            restraunt - main game scene (ordering food, talking, general activities)
                - have an actual timer to time how long its been
                - certain events trigger at certain times
            order apt/drinks - minor scene (select items from menu)
                - will show up later (no hardcoded scene bgs)
            order food - another basic scene (select items)
                - also shows up later (see other order)
            order dsrt - anther basic scene (see other ordering scenes)
            pay the bill - impacts her opinion?
                - depending on already exsiting stats (from waiting around)
                - impacts stats
                - pay: good person (1?)
                - split: fine (0?)
                - no pay: bad person (-1?)
            leave - depending on stats if she comes with you or not
            home - wth/wthout?
            scenes can branch from when you get home ig
            */
        }
    },
    {
        "filename": "dungeon",
        "name": "Dungeon",
        "exec": (popup) => {
            const d1 = document.createElement("div");
            const d2 = document.createElement("div");
            d1.className = "score1";
            d2.className = "score2";
            const c = document.createElement("canvas");
            c.style.border = "2px solid black";
            const tileSize = 10;
            c.width = 50 * tileSize;
            c.height = 50 * tileSize;
            d2.appendChild(c);
            popup.appendChild(d2);
            class Player {
                constructor() {
                    this.x = 0;
                    this.y = 0;
                    this.w = tileSize;
                    this.h = tileSize;
                    this.mag = 8;
                    this.ammo = this.mag;
                    this.dir = "x";
                    this.cd = 100;
                    this.scd = this.cd;
                    this.rcd = this.cd;
                    this.hp = 5;
                }
                upd() {
                    this.scd--;
                    this.rcd--;
                    if(this.scd <= 0) this.scd = 0;
                    if(this.rcd <= 0) this.rcd = 0;
                    if(this.x < 0) this.x = 0;
                    else if(this.x + 15 > c.width) this.x = c.width - 15;
                    if(this.y < 0) this.y = 0;
                    else if(this.y + 15 > c.height) this.y = c.height - 15;
                    if(keys["w"] || keys["ArrowUp"]) {
                        this.y--;
                        this.dir = "-y";
                    }
                    if(keys["a"] || keys["ArrowLeft"]) {
                        this.x--;
                        this.dir = "-x";
                    }
                    if(keys["s"] || keys["ArrowDown"]) {
                        this.y++;
                        this.dir = "y";
                    }
                    if(keys["d"] || keys["ArrowRight"]) {
                        this.x++;
                        this.dir = "x";
                    }
                    if(keys["e"] && !keys["r"] && this.ammo > 0 && this.scd <= 0) {
                        bullets.push(new Bullet(this.x, this.y, this.dir));
                        this.scd = this.cd;
                        this.ammo--;
                    }
                    if(keys["r"] && !keys["e"] && this.ammo < this.mag && this.rcd <= 0) {
                        this.ammo++;
                        this.rcd = this.cd;
                    }
                }
                hurt(d) {
                    this.hp -= d;
                    if(this.hp <= 0) gameEnd(runtime, score, "dungeon-hs");
                }
            }
            class Enemy {
                constructor(x, y, hp, hurt, die, move, atk) {
                    this.x = x;
                    this.y = y;
                    this.w = tileSize;
                    this.h = tileSize;
                    this.hp = hp;
                    this.hurt = hurt;
                    this.die = die;
                    this.move = move;
                    this.atk = atk;
                }
                upd() {
                    this.move();
                    this.atk();
                }
            }
            class Basic extends Enemy {
                constructor(x, y) {
                    super(x, y, 3, (d) => {
                        this.hp -= d;
                        if(this.hp <= 0) this.die();
                    }, () => {
                        enemies.splice(enemies.indexOf(this), 1);
                    }, () => {
                        if(player.x < this.x) this.x--;
                        else if(player.x > this.x) this.x++;
                        if(this.y < this.y) this.y--;
                        else if(player.y > this.y) this.y++;
                    }, () => {
                        if(sqrCheck(this, player, 1)) player.hurt(1);
                    });
                }
            }
            class Bullet {
                constructor(x, y, dir) {
                    this.x = x;
                    this.y = y;
                    this.w = tileSize;
                    this.h = tileSize;
                    this.dir = dir;
                }
                upd() {
                    switch(this.dir) {
                        case "x": this.x++; break;
                        case "-x": this.x--; break;
                        case "y": this.y++; break;
                        case "-y": this.y--; break;
                    }
                    if(this.x < 0 || this.x + 15 > c.width || this.y < 0 || this.y + 15 > c.height) bullets.splice(bullets.indexOf(this), 1);
                    if(enemies.some(e => e.x == this.x && e.y == this.y)) enemies.find(e => e.x == this.x && e.y == this.y).hurt(1);
                }
            }
            function sqrCheck(initiator, target, radius) {
                return initiator.x - radius <= target.x && initiator.x + radius >= target.x && initiator.y - radius <= target.y && initiator.y + radius >= target.y
            }

            var player = new Player();
            var enemies = [];
            var bullets = [];
            var stage = 0;
            var keys = {};
            var delta = 0;
            var score = 0;
            const ctx = c.getContext("2d");

            var runtime = null;

            function game() {
                if(enemies.length > 0) {
                    player.upd();
                    enemies.forEach(e => e.upd());
                    bullets.forEach(b => b.upd());
                    ctx.clearRect(0, 0, c.width, c.height);
                    ctx.fillStyle = "green";
                    ctx.beginPath();
                    ctx.rect(player.x, player.y, player.w, player.h);
                    ctx.fill();
                    ctx.fillStyle = "red";
                    ctx.beginPath();
                    enemies.forEach(e => ctx.rect(e.x, e.y, player.w, player.h));
                    ctx.fill();
                    ctx.fillStyle = "yellow";
                    ctx.beginPath();
                    bullets.forEach(b => ctx.rect(b.x, b.y, b.w, b.h));
                    ctx.fill();
                    delta++;
                } else {
                    stage++;
                    makeStage();
                }
            }
            function shop() {}
            function makeStage() {
                for(let i = 0; i < stage; i++) enemies.push(new Basic(50, 30));
            }
            function setup() {
                runtime = setInterval(game, 5);
                document.addEventListener("keydown", (e) => keys[e.key] = true);
                document.addEventListener("keyup", (e) => keys[e.key] = false);
            }
            setup();
            //TODO
            /*
            game levels + shop
            stage
            base off of the C++ one
            make enemy templates (extend Enemy)
            make makeStage actually work based on stage
            */
        }
    }
];

games.forEach(g => {
    const b = document.createElement("button");
    b.textContent = g.name;
    b.addEventListener("click", () => launch(g.exec, g.filename));
    b.id = g.filename;
    gamelist.appendChild(b);
});

document.body.appendChild(gamelist);

function launch(exec, fname) {
    disableGL();
    const blob = new Blob([exec], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const popup = document.createElement("div");
    popup.className = "overlay";
    document.body.appendChild(popup);
    // const btn = document.createElement("button");
    // const a = document.createElement("a");
    // a.textContent = "download";
    // a.href = url;
    // a.download = fname + ".js";
    // btn.appendChild(a);
    // document.body.appendChild(btn);
    // TODO: fix CSS/JS so <div><button> instead of static pos of button

    /*
    TODO:
    download => open small menu
    menu 0 => download (raw) (script without utils)
    menu 1 => download (utils) (script with utils)
    menu 2 => download (full) (zip of launcher + script + utils)
    */
   exec(popup);
}

function gameEnd(runtime, score, hsname) {
    clearInterval(runtime);
    const div = document.createElement("div");
    div.innerHTML = `<div class="score1"><div class="score2" id="scr"></div></div>`;
    document.body.appendChild(div);
    const display = document.getElementById("scr");
    let i = 0;
    const hs = parseInt(localStorage.getItem(hsname) ?? 0);
    const trophy = setInterval(() => {
        display.textContent = i;
        /*
        ranges:
        0 - 30 = bronze
        30 - 60 = silver
        60 - 90 = gold
        90 - 120 = purple
        120 - 150 = legend
        150+ = diamond
        */
        if(0 <= i && i <= 30) display.style.color = "#CD7F32";
        else if(30 <= i && i <= 60) display.style.color = "#C0C0C0";
        else if(60 <= i && i <= 90) display.style.color = "#FFD700";
        else if(90 <= i && i <= 120) display.style.color = "#9D00FF";
        else if(120 <= i && i <= 150) display.style.color = "#FF0000";
        else display.style.color = "#4EE2EC";
        display.style.fontSize = `clamp(10px, ${5 + i}px, 100px)`;
        if(i >= score) {
            clearInterval(trophy);
            if(hs < score) {
                localStorage.setItem(hsname, JSON.stringify(score));
                display.innerHTML = `${score}<br><div id="newhs"></div>`;
                const newhs = document.getElementById("newhs");
                newhs.style.fontSize = `clamp(10px, ${display.style.fontSize - 10}px, 80px)`;
                const text = "New Highscore!";
                const len = text.length;
                for(let i = 0; i < len; i++) {
                    newhs.innerHTML += `<span id="nhs_${i}" style="color: #0068e0; font-weight: bold">${text[i]}</span>`;
                }
                let waveIndex = 0;
                const nhsInterval = setInterval(() => {
                    for(let i = 0; i < len; i++) {
                        const char = document.getElementById(`nhs_${i}`);
                        if(char) {
                            if(i == waveIndex) {
                                char.style.color = "#489dff"; // teal focus
                            } else {
                                char.style.color = "#0068e0"; // default blue
                            }
                        }
                    }
                    waveIndex++;
                    if(waveIndex >= len) waveIndex = 0; // loop back for infinite wave
                }, 30);
            } else {
                display.innerHTML = `${score}<br><div>Highscore: ${parseInt(localStorage.getItem(hsname) ?? 0)}</div>`;
            }
        }
        else i++;
    }, 50);
}

function disableGL() {
    games.forEach(g => {
        const id = g.filename;
        const el = document.getElementById(id);
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        el.disabled = true;
    });
}
function enableGL() {
    games.forEach(g => {
        const id = g.filename;
        const el = document.getElementById(id);
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
        el.disabled = false;
    });
}

// see https://codehs.com/sandbox/bengoldstein/i-am-really-stupid
