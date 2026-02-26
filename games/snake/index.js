import { random } from "../../utils.js";

const pre = performance.now();
const load = await import("../load.js");
const p2d = await load.load();
const pro = performance.now();
console.log(`Loaded Phantom2D in ${(pro-pre).toFixed(2)}ms.`);
const tileSize = 15;
const cols = 50; // 1000/10
const rows = 50; // 1000/10
const c = load.init(cols * tileSize, rows * tileSize);
const ctx = load.ctx(c);
load.pLock(c);
load.fScrn(c);
class sqr { constructor(x, y) { this.x = x; this.y = y; } }
var player = [new sqr(5, 25), new sqr(4, 25), new sqr(3, 25)];
var dir = { x: 1, y: 0 };
var score = 0;
var delta = 0;
var apl = new sqr(random(cols), random(rows));
const apfel = new Image();
apfel.src = "apfel.jpg";
var runtime = null;
function drawRect(x, y, colour) {
    ctx.fillStyle = colour;
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}
function game() {
    const head = player[0];
    const nhead = new sqr(head.x + dir.x, head.y + dir.y);
    if(nhead.x < 0 || nhead.x >= cols || nhead.y < 0 || nhead.y >= rows || player.some(p => p.x == nhead.x && p.y == nhead.y)) {
        load.gameEnd(runtime, score, "snake-hs");
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
    ctx.drawImage(apfel, apl.x * tileSize, apl.y * tileSize, tileSize, tileSize);
    // Draw apple
    // drawRect(apl.x, apl.y, "#ff0000");
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