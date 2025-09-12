import '/utils.js';
import { random, chance, getEl, wait, isTrue, isFalse, safeEval, RandomNums, ClickRegion, copyToClipboard, dist, mouse, lsGet, lsSet, quadratic, getQuerys } from '/utils.js';

/*
games:
around us (among us)
btd6
geometric jump (geo dash)
snake
2048
pong
breakout
pvz
angry birds
fruit ninja
tag
fnaf
*/

window.addEventListener("error", (e) => alert(e.message));

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
                    this.grav = 0.05;
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
                    if(this.y >= c.height + 15) this.y = c.height + 15;
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
                    if(["w", "ArrowUp"].includes(e.key)) player.gspd = -3;
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
                    //
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
            function game() {
                if(keys["w"]) lobby[0].y++;
                if(keys["a"]) lobby[0].x--;
                if(keys["s"]) lobby[0].y--;
                if(keys["d"]) lobby[0].x++;
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
        if(0 <= i && i <= 30) display.style.color = "#CD7F32";
        else if(30 <= i && i <= 60) display.style.color = "#C0C0C0";
        else if(60 <= i && i <= 90) display.style.color = "#FFD700";
        else if(90 <= i && i <= 120) display.style.color = "#9D00FF";
        else if(120 <= i <= 150) display.style.color = "#FF0000";
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
