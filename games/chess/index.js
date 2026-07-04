import { Entity, Img, objIs, Params, Scene, Vector } from "../../phantom2d.js";
//window.onerror = alert;
Img.config.set("root", "assets");
const tileSize = 50;
const size = 400;
const tilesX = 8;
const tilesY = 8;
const gamemodeList = [
    "reg", "outlaw"
];
const rulesList = [
    // phase blacklist
    "nomad", "nomine", "nomimic", "nolock",
    // victory conditions
    "mate", "cap",
    // capture all victory condition blacklist
    "nocapall",
    // skills
    // pawn
    "noself", "nochain", "notake", "nosneak",
    // bishop
    "nolight", "nointer",
    // knight
    "nofriend", "nosteed",
    // rook
    "nostone", "nolook",
    // king
    "nojump"
];
const gmp = new Params();
const gm = (gmp.get("gm") ?? "reg");
const rules = gmp.getAll("rule").filter(Boolean).filter(r => r in rulesList);
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
function wouldLeaveKingInCheck(piece, target) {
    const king = piece.team == "red" ? rking : bking;
    const captured = fd(target);
    const from = piece.getPos();
    if (captured && captured != piece) {
        pieces.splice(pieces.indexOf(captured), 1);
    }
    piece.setPos(new Vector(Piece.center(target.x), Piece.center(target.y)));
    const inCheck = king.check();
    piece.setPos(from);
    if (captured && captured != piece) {
        pieces.push(captured);
    }
    return inCheck;
}
function isLegal(piece, pos) {
    return (gm == "reg" && piece.ok(pos) && isSafe(pos) && !wouldLeaveKingInCheck(piece, pos)) || gm == "outlaw";
}
function allSpots() {
    const pos = [];
    for (let i = 1; i <= tilesX; i++)
        for (let j = 1; j <= tilesY; j++)
            pos.push(new Vector(i, j));
    return pos;
}
function hasAnyLegalMove(color) {
    for (const piece of pieces) {
        if (piece.team != color)
            continue;
        for (let x = 1; x <= tilesX; x++) {
            for (let y = 1; y <= tilesY; y++) {
                const target = new Vector(x, y);
                if (isLegal(piece, target)) {
                    return true;
                }
            }
        }
    }
    return false;
}
function resolveGameState() {
    const king = team === "red" ? rking : bking;
    const inCheck = king.check();
    const hasMoves = hasAnyLegalMove(team);
    if (!hasMoves) {
        if (inCheck) {
            console.log("checkmate");
        }
        else {
            console.log("stalemate");
        }
    }
}
function diag(g) {
    const d = [];
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
function line(g) {
    const pos = [];
    for (let i = 1; i <= gridWidth; i++) {
        pos.push(new Vector(i, g.y));
    }
    for (let i = 1; i <= gridHeight; i++) {
        pos.push(new Vector(g.x, i));
    }
    return pos;
}
function isBlack(obj) {
    return blacklist.some(b => objIs(obj, b));
}
function isRule(rule) {
    return rule in rules;
}
class Base extends Entity {
    ico;
    constructor(x, y, img) {
        super({ x: Piece.center(x), y: Piece.center(y), width: tileSize / 2, height: tileSize / 2 });
        this.ico = new Img(img);
    }
    grid() {
        return Piece.grid(this.getPos());
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
    static compare(gv1, gv2) {
        return gv1.x == gv2.x && gv1.y == gv2.y;
    }
    allies() {
        return pieces.filter(p => p.team == this.team);
    }
    enemies() {
        return pieces.filter(p => p.team != this.team);
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
        // blacklist teammate landing (nofriend)
        return !target || (target.team != this.team && isRule("nofriend")); // Can't land on teammates
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
        const g = this.grid();
        return diag(g).filter(v => clear(g, v));
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
    isCheck(where) {
        return this.enemies().some(p => p.ok(where));
    }
    check() {
        return this.isCheck(this.grid());
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
        const g = this.grid();
        return line(g).filter(v => clear(g, v));
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
        const g = this.grid();
        return [...diag(g), ...line(g)].filter(v => clear(g, v));
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
const blacklist = [];
var team = "red";
var active = null;
var phase = "setup";
var destructionCountR = 0;
var destructionCountB = 0;
var landmineR = false;
var landmineB = false;
var lockR = false;
var lockB = false;
const removeSelfFromRequests = (name) => {
    const out = reqBtnObjects.find(r => r[1] == name);
    if (out)
        phaseReqs.removeChild(out[0]);
};
const phaseReqs = document.getElementById("phase_game_requests");
const reqBtns = [
    ["Mutually Assured Destruction", "des", () => {
            showRequest("Mutually Assured Destruction", () => {
                phase = "des";
                removeSelfFromRequests("des");
            }, () => removeSelfFromRequests("des"));
        }],
    ["Landmine", "mine", () => {
            showRequest("Landmine", () => {
                phase = "mine";
                removeSelfFromRequests("mine");
            }, () => removeSelfFromRequests("mine"));
        }],
    ["Mimic", "mimic", () => {
            showRequest("Mimic", () => {
                phase = "mimic";
                removeSelfFromRequests("mimic");
            }, () => removeSelfFromRequests("mimic"));
        }],
    ["Landlock", "lock", () => {
            showRequest("Landlock", () => {
                phase = "lock";
                removeSelfFromRequests("lock");
            }, () => removeSelfFromRequests("lock"));
        }],
    ["End Setup", "done", () => {
            showRequest("End Setup", () => {
                phase = "play";
                document.body.removeChild(phaseReqs);
                team = "red";
            }, () => { });
        }]
];
const reqBtnObjects = [];
reqBtns.forEach(r => {
    const b = document.createElement("button");
    b.addEventListener("click", r[2]);
    b.textContent = r[0];
    reqBtnObjects.push([b, r[1]]);
    phaseReqs.appendChild(b);
});
const activeRequest = document.getElementById("activation_request");
function showRequest(text, onAccept, onDeny) {
    activeRequest.showModal();
    activeRequest.innerHTML = `
        <p>Opponent wants to activate phase:</p>
        <p><strong>${text}</strong></p>
        <br>
        <p>Do you accept?</p>
        <button id="accept">Accept</button>
        <button id="deny">Deny</button>
    `;
    const kill = () => {
        activeRequest.innerHTML = "";
        activeRequest.close();
    };
    document.getElementById("accept").addEventListener("click", () => {
        kill();
        onAccept();
    });
    document.getElementById("deny").addEventListener("click", () => {
        kill();
        onDeny();
    });
}
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
var rking = new RKing(5, tilesY);
var bking = new BKing(5, 1);
for (let i = 1; i <= tilesX; i++) {
    new RPawn(i, tilesY - 1);
    new BPawn(i, 2);
}
function drawTile(x, y, color) {
    scene.rect(x, y, tileSize, tileSize, color);
}
function drawNTile(vec, color) {
    drawTile(Piece.normal(vec.x), Piece.normal(vec.y), color);
}
scene.start(() => {
    for (let i = 0; i <= scene.width; i += tileSize) {
        for (let j = 0; j <= scene.height; j += tileSize) {
            const r = i / tileSize;
            const c = j / tileSize;
            drawTile(i, j, (r + c) % 2 == 0 ? "#1a5a00" : "#fff4e8");
        }
    }
    unsafe.forEach(u => drawNTile(u, "#7b4015"));
    if (active) {
        const g = active.grid();
        // Highlight the whole tile
        drawNTile(g, "rgba(238, 255, 0, 0.5)");
        const a = active.valid().filter(isSafe);
        a.forEach(v => scene.rect(Piece.center(v.x), Piece.center(v.y), tileSize / 4, tileSize / 4, "#d40700"));
    }
    const cdraw = (k) => {
        if (k.check())
            drawNTile(k.grid(), "#ca1515");
    };
    cdraw(rking);
    cdraw(bking);
    [...pieces, ...mines].forEach(p => scene.img(p.ico, p.x, p.y, p.width, p.height));
});
scene.on("click", async (e) => {
    const at = scene.mouseAt(e);
    const pos = Piece.grid(at); // Current clicked grid square
    if (phase == "play") {
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
            const np = fd(pos);
            if (np && np.team == team) {
                active = np;
                return;
            }
            const isLegalMove = isLegal(active, pos);
            if (isLegalMove) {
                // CHECK FOR CAPTURE HERE
                const target = fd(pos);
                if (target && target.team != active.team) {
                    eat(pos);
                }
                if (mines.some(m => Piece.compare(m.grid(), pos))) {
                    eat(active.grid());
                    active = null;
                    team = team == "red" ? "blue" : "red";
                    mines.splice(mines.findIndex(m => Piece.compare(m.grid(), pos)), 1);
                    return;
                }
                active.ms++;
                active.setPos(new Vector(Piece.center(pos.x), Piece.center(pos.y)));
                if (objIs(active, Pawn) && (team == "red" ? pos.y == 1 : pos.y == tilesY)) {
                    eat(pos);
                    const promo = document.createElement("dialog");
                    document.body.appendChild(promo);
                    const paths = ["queen", "rook", "horse", "bishop"];
                    promo.innerHTML = paths
                        .map(p => `${p}_${team}`)
                        .map(p => `<img src="assets/${p}.png" id="click-${p}" width="100" height="100">`)
                        .join("<br>");
                    promo.showModal();
                    await new Promise((resolve) => {
                        paths.forEach(p => {
                            document.getElementById(`click-${p}_${team}`)?.addEventListener("click", (e) => {
                                const id = e.target?.id;
                                const x = id?.split("-")[1];
                                const t = x?.split("_")[1];
                                new ({ "queen": Queen, "rook": Rook, "horse": Knight, "bishop": Bishop }[x?.split("_")[0]])(pos.x, pos.y, t);
                                resolve();
                            });
                        });
                    });
                    document.body.removeChild(promo);
                }
                active = null;
                team = team == "red" ? "blue" : "red";
                resolveGameState();
            }
        }
    }
    else if (phase == "des") {
        const p = fd(pos);
        if (p && p.team == team) {
            if (destructionCountR >= 3 && destructionCountB >= 3) {
                phase = "play";
                return;
            }
            if ((team == "red" ? destructionCountR : destructionCountB) < 3) {
                eat(pos);
                blacklist.push(p.constructor);
                if (team == "red")
                    destructionCountR++;
                if (team == "blue")
                    destructionCountB++;
            }
            // if both are not done, do handshake
            if (destructionCountR < 3 && destructionCountB < 3)
                team = team == "red" ? "blue" : "red";
            else if (destructionCountR >= 3 && destructionCountB < 3) {
                // force blue
                team = "blue";
            }
            else if (destructionCountR < 3 && destructionCountB >= 3) {
                // force red
                team = "red";
            }
            return;
        }
    }
    else if (phase == "mine") {
        if (!fd(pos)) {
            if (landmineR && landmineB) {
                phase = "play";
                return;
            }
            if (team == "red" ? !landmineR : !landmineB) {
                mines.push(new Landmine(pos.x, pos.y));
                if (team == "red")
                    landmineR = true;
                if (team == "blue")
                    landmineB = true;
            }
            // if both are not done, do handshake
            if (landmineR && landmineB)
                team = team == "red" ? "blue" : "red";
            else if (landmineR && !landmineB) {
                // force blue
                team = "blue";
            }
            else if (!landmineR && landmineB) {
                // force red
                team = "red";
            }
            return;
        }
    }
    else if (phase == "lock") {
        if (!fd(pos)) {
            if (lockR && lockB) {
                phase = "play";
                return;
            }
            if (team == "red" ? !lockR : !lockB) {
                unsafe.push(pos);
                if (team == "red")
                    lockR = true;
                if (team == "blue")
                    lockB = true;
            }
            // if both are not done, do handshake
            if (!lockR && !lockB)
                team = team == "red" ? "blue" : "red";
            else if (lockR && !lockB) {
                // force blue
                team = "blue";
            }
            else if (!lockR && lockB) {
                // force red
                team = "red";
            }
            return;
        }
    }
});
