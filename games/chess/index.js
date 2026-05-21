import { Entity, Img, Scene, Vector } from "../../phantom2d.js";
window.onerror = alert;
Img.config.set("root", "assets");
const tileSize = 50;
const size = 400;
const tilesX = 8;
const tilesY = 8;
const scene = new Scene({ canvas: "chess", w: tileSize * tilesX, h: tileSize * tilesY });
const gridWidth = scene.width / tileSize;
const gridHeight = scene.height / tileSize;
function near(a, b, tolerance) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy) < tolerance;
}
function fd(at) {
    return pieces.find(p => {
        const g = p.grid();
        return Piece.compare(g, at);
    });
}
function eat(at) {
    const p = fd(at);
    if (p) {
        pieces.splice(pieces.indexOf(p), 1);
    }
}
function okAt(at, team) {
    const tp = fd(at);
    return tp != undefined && tp.team != team;
}
function clear(start, end) {
    const dx = Math.sign(end.x - start.x);
    const dy = Math.sign(end.y - start.y);
    let x = start.x + dx;
    let y = start.y + dy;
    while (x != end.x || y != end.y) {
        if (fd(new Vector(x, y)))
            return false; // Found an obstacle!
        x += dx;
        y += dy;
    }
    return true;
}
function isUnsafe(vec) {
    return unsafe.some(v => Piece.compare(v, vec));
}
function isSafe(vec) {
    return !isUnsafe(vec);
}
class Base extends Entity {
    ico;
    constructor(x, y, img) {
        super({ x: Piece.center(x), y: Piece.center(y), width: tileSize / 2, height: tileSize / 2 });
        this.ico = new Img(img);
    }
}
class Piece extends Base {
    team;
    ms;
    constructor(x, y, team, img) {
        super(x, y, img);
        this.team = team;
        this.ms = 0;
        pieces.push(this);
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
    static compare(gv1, gv2) {
        return gv1.x == gv2.x && gv1.y == gv2.y;
    }
}
class Pawn extends Piece {
    constructor(x, y, team) {
        super(x, y, team, `pawn_${team}.png`);
    }
    // Inside class Pawn
    ok(p) {
        const currentGrid = this.grid();
        const dx = p.x - currentGrid.x;
        const dy = p.y - currentGrid.y;
        const direction = (this.team == "red") ? -1 : 1;
        const tp = fd(p);
        // Diagonal Capture: Just check if an enemy is there
        if (Math.abs(dx) == 1 && dy == direction) {
            return tp != undefined && tp.team != this.team;
        }
        // Straight Move
        if (dx == 0) {
            if (tp)
                return false;
            const moveDistance = dy * direction;
            return (this.ms == 0) ? (moveDistance == 1 || moveDistance == 2) : (moveDistance == 1);
        }
        return false;
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
class Knight extends Piece {
    constructor(x, y, team) {
        super(x, y, team, `horse_${team}.png`);
    }
    getL(src) {
        return [
            // 2 vertical, 1 horizontal
            new Vector(src.x + 1, src.y + 2),
            new Vector(src.x - 1, src.y + 2),
            new Vector(src.x + 1, src.y - 2),
            new Vector(src.x - 1, src.y - 2),
            // 1 vertical, 2 horizontal
            new Vector(src.x + 2, src.y + 1),
            new Vector(src.x - 2, src.y + 1),
            new Vector(src.x + 2, src.y - 1),
            new Vector(src.x - 2, src.y - 1)
        ];
    }
    // Knight ok()
    ok(p) {
        const g = this.grid();
        const dx = Math.abs(p.x - g.x);
        const dy = Math.abs(p.y - g.y);
        const isLMove = dx * dy == 2;
        if (!isLMove)
            return false;
        const target = fd(p);
        return !target || target.team !== this.team; // Can't land on teammates
    }
    valid() {
        return this.getL(this.grid());
    }
}
class RKnight extends Knight {
    constructor(x, y) {
        super(x, y, "red");
    }
}
class BKnight extends Knight {
    constructor(x, y) {
        super(x, y, "blue");
    }
}
class Bishop extends Piece {
    constructor(x, y, team) {
        super(x, y, team, `bishop_${team}.png`);
    }
    ok(p) {
        const g = this.grid();
        // 1. Must be a perfect diagonal
        if (Math.abs(g.x - p.x) != Math.abs(g.y - p.y))
            return false;
        // 2. Path must be clear
        if (!clear(g, p))
            return false;
        // 3. Target cannot be a teammate
        const target = fd(p);
        return !target || target.team != this.team;
    }
    valid() {
        const d = [];
        const g = this.grid();
        const v = (r, c) => 0 <= r && r <= gridWidth &&
            0 <= c && c <= gridHeight;
        const r = g.x;
        const c = g.y;
        const iter = (next) => {
            for (let i = 1;; i++) {
                const [a, b] = next(i);
                if (!v(a, b))
                    break;
                d.push(new Vector(a, b));
            }
        };
        iter((i) => [r - i, c - i]);
        iter((i) => [r + i, c + i]);
        iter((i) => [r - i, c + i]);
        iter((i) => [r + i, c - i]);
        return d;
    }
}
class RBishop extends Bishop {
    constructor(x, y) {
        super(x, y, "red");
    }
}
class BBishop extends Bishop {
    constructor(x, y) {
        super(x, y, "blue");
    }
}
class King extends Piece {
    constructor(x, y, team) {
        super(x, y, team, `king_${team}.png`);
    }
    // King ok()
    ok(p) {
        const g = this.grid();
        const dx = Math.abs(p.x - g.x);
        const dy = Math.abs(p.y - g.y);
        const isOneSquare = (dx <= 1 && dy <= 1);
        if (!isOneSquare)
            return false;
        const target = fd(p);
        return !target || target.team != this.team;
    }
    valid() {
        const g = this.grid();
        return [
            new Vector(g.x + 1, g.y),
            new Vector(g.x, g.y + 1),
            new Vector(g.x - 1, g.y),
            new Vector(g.x, g.y - 1),
            new Vector(g.x + 1, g.y + 1),
            new Vector(g.x - 1, g.y - 1),
            new Vector(g.x + 1, g.y - 1),
            new Vector(g.x - 1, g.y + 1)
        ];
    }
}
class RKing extends King {
    constructor(x, y) {
        super(x, y, "red");
    }
}
class BKing extends King {
    constructor(x, y) {
        super(x, y, "blue");
    }
}
class Rook extends Piece {
    constructor(x, y, team) {
        super(x, y, team, `rook_${team}.png`);
    }
    ok(p) {
        const g = this.grid();
        // 1. Must be a straight line
        if (g.x != p.x && g.y != p.y)
            return false;
        // 2. Path must be clear
        if (!clear(g, p))
            return false;
        // 3. Destination cannot be a teammate
        const target = fd(p);
        return !target || target.team != this.team;
    }
    valid() {
        const pos = [];
        const g = this.grid();
        for (let i = 1; i <= gridWidth; i++) {
            pos.push(new Vector(i, g.y));
        }
        for (let i = 1; i <= gridHeight; i++) {
            pos.push(new Vector(g.x, i));
        }
        return pos;
    }
}
class RRook extends Rook {
    constructor(x, y) {
        super(x, y, "red");
    }
}
class BRook extends Rook {
    constructor(x, y) {
        super(x, y, "blue");
    }
}
class Queen extends Piece {
    constructor(x, y, team) {
        super(x, y, team, `queen_${team}.png`);
    }
    ok(p) {
        const g = this.grid();
        // 1. Must be a perfect diagonal
        if ((Math.abs(g.x - p.x) != Math.abs(g.y - p.y)) && (g.x != p.x && g.y != p.y))
            return false;
        // 2. Path must be clear
        if (!clear(g, p))
            return false;
        // 3. Target cannot be a teammate
        const target = fd(p);
        return !target || target.team != this.team;
    }
    valid() {
        const d = [];
        const g = this.grid();
        const v = (r, c) => 0 <= r && r <= gridWidth &&
            0 <= c && c <= gridHeight;
        const r = g.x;
        const c = g.y;
        const iter = (next) => {
            for (let i = 1;; i++) {
                const [a, b] = next(i);
                if (!v(a, b))
                    break;
                d.push(new Vector(a, b));
            }
        };
        iter((i) => [r - i, c - i]);
        iter((i) => [r + i, c + i]);
        iter((i) => [r - i, c + i]);
        iter((i) => [r + i, c - i]);
        for (let i = 1; i <= gridWidth; i++) {
            d.push(new Vector(i, g.y));
        }
        for (let i = 1; i <= gridHeight; i++) {
            d.push(new Vector(g.x, i));
        }
        return d;
    }
}
class RQueen extends Queen {
    constructor(x, y) {
        super(x, y, "red");
    }
}
class BQueen extends Queen {
    constructor(x, y) {
        super(x, y, "blue");
    }
}
class Landmine extends Base {
    constructor(x, y) {
        super(x, y, "mine.png");
    }
}
const pieces = [];
const unsafe = [];
const mines = [];
var team = "red";
var active = null;
new RRook(1, tilesY);
new BRook(1, 1);
new RRook(tilesX, tilesY);
new BRook(tilesX, 1);
new RBishop(3, tilesY);
new BBishop(3, 1);
new RBishop(tilesX - 2, tilesY);
new BBishop(tilesX - 2, 1);
new RKnight(2, tilesY);
new BKnight(2, 1);
new RKnight(tilesX - 1, tilesY);
new BKnight(tilesX - 1, 1);
new RQueen(4, tilesY);
new BQueen(4, 1);
new RKing(5, tilesY);
new BKing(5, 1);
for (let i = 1; i <= tilesX; i++) {
    new RPawn(i, tilesY - 1);
    new BPawn(i, 2);
}
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
        const a = active.valid().filter(isSafe);
        a.forEach(v => scene.rect(Piece.center(v.x), Piece.center(v.y), tileSize / 4, tileSize / 4, "#d40700"));
    }
    [...pieces, ...mines].forEach(p => scene.img(p.ico, p.x, p.y, p.width, p.height));
});
scene.on("click", (e) => {
    const at = scene.mouseAt(e);
    const pos = Piece.grid(at); // Current clicked grid square
    if (!active) {
        const p = fd(pos);
        if (!p || p.team != team)
            return;
        active = p;
    }
    else {
        // If we click the same piece again, deselect it
        if (Piece.compare(pos, active.grid())) {
            active = null;
            return;
        }
        if (active.ok(pos) && isSafe(pos)) {
            // CHECK FOR CAPTURE HERE
            const target = fd(pos);
            if (target && target.team != active.team) {
                eat(pos);
            }
            if (mines.some(m => Piece.compare(new Vector(m.x, m.y), pos))) {
                eat(active.grid());
                active = null;
                team = team == "red" ? "blue" : "red";
                return;
            }
            active.ms++;
            active.setPos(new Vector(Piece.center(pos.x), Piece.center(pos.y)));
            active = null;
            team = team == "red" ? "blue" : "red";
        }
    }
});
