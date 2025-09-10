import '/utils.js';
import { random, chance, getEl, wait, isTrue, isFalse, safeEval, RandomNums, ClickRegion, copyToClipboard, dist, mouse, lsGet, lsSet, quadratic, getQuerys } from '/utils.js';

window.addEventListener("error", (e) => alert(e.message));

const gamelist = document.createElement("div");
Object.assign(gamelist.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    margin: "auto",
    gap: "20px" // Added gap for spacing
});

const buttons = [{
    "filename": "flappybird",
    "name": "Flappy Bird",
    "win": `
        class Player {
            constructor() {
                this.height = Math.round(c.height / 2);
                this.grav = 0.05;
                this.gspd = 0;
                this.x = 15;
                this.w = 20;
                this.h = 20;
                this.colour = "yellow";
            }
            upd() {
                this.gspd += this.grav;
                this.height += this.gspd;
            }
        }
        class Pipe {
            constructor(x, pt, pb) {
                this.x = x;
                this.pt = pt;
                this.pb = pb;
                this.w = 50;
                this.colour = "green";
            }
        }

        const c = document.createElement("canvas");
        c.style.border = "2px solid black";
        c.width = 800;
        c.height = 600;
        document.body.appendChild(c);

        var player = new Player();
        var pipes = [];
        var delta = 0;
        var deltasr = 500;
        var gap = 150;
        const ctx = c.getContext("2d");

        if((delta % deltaSpawn) == 0) {
            let topHeight = Math.floor(Math.random() * (c.height - gap - 50));
            let bottomYt = topHeight + gap;
            pipes.push(new Pipe(c.width, 0, topHeight));
            pipes.push(new Pipe(c.width, bottomYt, c.height));
        }
    ctx.clearRect(0, 0, gameboard.width, gameboard.height);

        export class BirdPlayer {
    constructor(canvas) {
        this.height = Math.round(canvas.height / 2);
        this.gravity = 0.05;
        this.gravitySpeed = 0;
    }
    update(Runtime, gravRuntime) {
        this.gravitySpeed += this.gravity;
        this.height += this.gravitySpeed;
        // if(this.height <= 600) {
        //     clearInterval(Runtime);
        //     clearInterval(gravRuntime);
        // }
    }
}
export class BirdPipe {
    constructor(x, yTop, yBottom) {
        this.pX = x;
        this.pYt = yTop;
        this.pYb = yBottom;
    }
}
    `
}];

buttons.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.name;
    btn.addEventListener("click", () => launch(b.win, b.filename));
    gamelist.appendChild(btn);
});

document.body.appendChild(gamelist);

function launch(wincontent, fname) {
    const blob = new Blob([wincontent], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const win = window.open("", "_blank");
    if(win) {
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${fname}</title>
                <style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }</style>
            </head>
            <body>
                <script>
                    ${wincontent}
                </script>
                <div style="margin-bottom: 10px;"></div>
                <a href="${url}" download="${fname}.js">download</a>
            </body>
            </html>
        `);
        win.document.close();
    } else {
        alert("Pop-up blocked! Please allow pop-ups for this site to launch the game.");
    }
}


// see https://codehs.com/sandbox/bengoldstein/i-am-really-stupid

// const querys = getQuerys()
// if(querys.has("id")) { const g = buttons[parseInt(querys.get("id"))]; launch(g.win, g.filename) }