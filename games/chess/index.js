import { Entity, Img, Scene, Vector } from "../../phantom2d.js";
window.onerror = alert;
Img.config.set("root", "assets");
const tileSize = 50;
const size = 750;
const scene = new Scene({ canvas: "chess", w: size, h: size });
function near(a, b, tolerance) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy) < tolerance;
}
function fd(at) {
    return pieces.find(p => {
        const g = p.grid();
        return g.x == at.x && g.y == at.y;
    });
}
class Piece extends Entity {
    ico;
    team;
    ms;
    constructor(x, y, team, img) {
        super({ x: Piece.center(x), y: Piece.center(y), width: tileSize / 2, height: tileSize / 2 });
        this.ico = new Img(img);
        this.team = team;
        this.ms = 0;
    }
    static center(val) {
        return Piece.normal(val) + (tileSize / 4);
    }
    static normal(val) {
        return (val - 1) * tileSize;
    }
    static grid(source) {
        return new Vector(Math.floor(source.x / tileSize) + 1, Math.floor(source.y / tileSize) + 1);
    }
    grid() {
        return Piece.grid(this.getPos());
    }
}
class Pawn extends Piece {
    constructor(x, y, team) {
        super(x, y, team, `pawn_${team}.png`);
        pieces.push(this);
    }
    ok(p) {
        // 1. Get the CURRENT grid position of THIS piece (using its pixel x,y)
        const currentGrid = this.grid();
        // 2. Calculate the difference (p is already grid coords)
        const dx = p.x - currentGrid.x;
        const dy = p.y - currentGrid.y;
        // No side-stepping
        if (dx != 0)
            return false;
        // 3. Direction Logic:
        // Blue (top) moves DOWN: targetY (2) - currentY (1) = 1. Direction = 1
        // Red (bottom) moves UP: targetY (14) - currentY (15) = -1. Direction = -1
        const direction = (this.team == "red") ? -1 : 1;
        const moveDistance = dy * direction;
        const canMoveTwo = this.ms == 0;
        return canMoveTwo
            ? (moveDistance == 1 || moveDistance == 2)
            : (moveDistance == 1);
    }
    valid() {
        const g = this.grid();
        const d = this.team == "red" ? -1 : 1;
        const cm = this.ms == 0;
        const one = new Vector(g.x, g.y + d);
        return cm ? [one, new Vector(g.x, g.y + d * 2)] : [one];
    }
}
class RPawn extends Pawn {
    constructor(x, y) {
        super(x, y, "red");
    }
}
class BPawn extends Pawn {
    constructor(x, y) {
        super(x, y, "blue");
    }
}
const pieces = [];
var team = "red";
var active = null;
new RPawn(1, scene.height / tileSize);
new BPawn(1, 1);
scene.start(() => {
    for (let i = 0; i <= scene.width; i += tileSize) {
        for (let j = 0; j <= scene.height; j += tileSize) {
            const r = i / tileSize;
            const c = j / tileSize;
            scene.rect(i, j, tileSize, tileSize, (r + c) % 2 == 0 ? "#1a5a00" : "#fff4e8");
        }
    }
    if (active) {
        const g = active.grid();
        // Highlight the whole tile
        scene.rect(Piece.normal(g.x), Piece.normal(g.y), tileSize, tileSize, "rgba(238, 255, 0, 0.5)");
        const a = active.valid();
        a.forEach(v => scene.rect(Piece.center(v.x), Piece.center(v.y), tileSize / 4, tileSize / 4, "#d40700"));
    }
    pieces.forEach(p => scene.img(p.ico, p.x, p.y, p.width, p.height));
});
scene.on("click", (e) => {
    const at = scene.mouseAt(e);
    const sx = Piece.grid(at).x;
    const sy = Piece.grid(at).y;
    const pos = new Vector(sx, sy);
    if (!active) {
        const p = fd(pos);
        if (!p || p.team != team)
            return;
        active = p;
    }
    else {
        if (active.ok(pos) && !fd(pos)) {
            active.ms++;
            active.setPos(new Vector(Piece.center(pos.x), Piece.center(pos.y)));
            active = null;
            team = team == "red" ? "blue" : "red";
        }
        else if (pos.x == active.grid().x && pos.y == active.grid().y) {
            active = null;
        }
    }
});
