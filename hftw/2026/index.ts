const canvas = document.getElementById("c") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if(!ctx) throw new Error();
function re() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
re();
window.addEventListener("resize", re);
const size = 128;
const world = { x: 0, y: 0 };
var money = 0;
const md = document.getElementById("money-counter");
abstract class Root {
    x: number; y: number;
    w: number; h: number;
    color: string;
    constructor(w: number, h: number, color: string) {
        this.x = 0;
        this.y = 0;
        this.w = w;
        this.h = h;
        this.color = color;
    }
    abstract render(): void;
    abstract update(): void;
}
class Robo extends Root {
    move: boolean;
    constructor() {
        super(10, 5, "#747474");
        this.move = true;
    }
    render() {
        if(!ctx) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    update() {
        if(!this.move) return;
        if(keys["KeyW"]) this.y--;
        if(keys["KeyA"]) this.x--;
        if(keys["KeyS"]) this.y++;
        if(keys["KeyD"]) this.x++;
        if(keys["Space"]) {
            this.move = false;
            arm.lower();
            const i = setInterval(() => {
                if(!arm.state) { clearInterval(i); this.move = true; }
            }, 5);
        }
    }
}
class Arm extends Root {
    /**
     * Stateful attribute.
     * 
     * 0 = idle; 1 = lowering; -1 = lifting
     */
    state: number;
    sy: number;
    constructor() {
        super(5, 5, "#747474");
        this.state = 0;
        this.sy = 0;
    }
    render() {
        if(!ctx) return;
        ctx.fillStyle = this.color;
        const h = robo.y - this.y;
        ctx.fillRect(this.x, this.y, this.w, h);
        // if(!this.state) return;
        // ctx.fillRect(this.x, this.y + h + 10, this.w + 5, 5);
    }
    update() {
        if(!this.state) {
            this.x = robo.x + robo.w / 2;
            this.y = robo.y;
        } else {
            this.y -= this.state;
        }
        if(this.state == -1 && this.y >= this.sy + 100) {
            this.state = 1;
        } else if(this.state == 1 && this.y <= robo.y) {
            this.state = 0;
        }
        const cb = (s: Root) => s instanceof Plastic && this.x == s.x && this.y == s.y;
        if(scene.some(cb)) {
            const s = scene.find(cb);
            if(s) {
                scene.splice(scene.indexOf(s), 1);
                money++;
            }
        }
    }
    lower() {
        this.state = -1;
    }
}
class Plastic extends Root {
    constructor(x: number, y: number, w: number, h: number, color: string) {
        super(w, h, color);
        this.x = x;
        this.y = y;
    }
    render() {
        if(!ctx) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    update() {
        //
    }
}
function plastic() {
    setInterval(() => {
        const _ = () => Math.random() * 10000 - 5000;
        const x = _();
        const y = _();
        const sx = x - world.x + canvas.width / 2;
        const sy = y - world.y + canvas.height / 2;
        scene.push(new Plastic(sx, sy, 20, 20, "red"));
    }, 5000);
}
plastic();
const robo = new Robo();
const arm = new Arm();
const p = new Plastic(0, 0, 10, 10, "#d50b0b");
const scene = [robo, arm, p];
const keys: { [x: string]: boolean } = {};
document.addEventListener("keydown", (e) => keys[e.code] = true);
document.addEventListener("keyup", (e) => keys[e.code] = false);

function render() {
    if(!ctx) return;
    scene.forEach(s => s.update());
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    scene.forEach(s => s.render());
    if(!md) return;
    md.textContent = String(money);
    ctx.fillStyle = "#006";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const sc = Math.floor(world.x / size);
    const sr = Math.floor(world.y / size);
    const ox = world.x % size;
    const oy = world.y % size;
    const cols = Math.ceil(canvas.width / size) + 1;
    const rows = Math.ceil(canvas.height / size) + 1;
    ctx.fillStyle = "#08f";
    for(let i = 0; i < rows; i++) for(let j = 0; j < cols; j++) {
        const x = j * size - ox;
        const y = i * size - oy;
        ctx.fillRect(x, y, size, size);
    }
    requestAnimationFrame(render);
}
render();