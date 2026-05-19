import { Entity, Img, Scene, Vector } from "../../phantom2d.js";

window.onerror = alert;
Img.config.set("root", "assets");
const tileSize = 50;
const size = 750;

const scene = new Scene({ canvas: "chess", w: size, h: size });

function near(a: Vector, b: Vector, tolerance: number) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy) < tolerance;
}

type TeamColor = "red" | "blue";
abstract class Piece extends Entity {
    ico: Img;
    team: TeamColor;
    ms: number;
    constructor(x: number, y: number, team: TeamColor, img: string) {
        super({ x: (x - 1) * tileSize + (tileSize / 4), y: (y - 1) * tileSize + (tileSize / 4), width: tileSize / 2, height: tileSize / 2 });
        this.ico = new Img(img);
        this.team = team;
        this.ms = 0;
    }
    abstract ok(pos: Vector): boolean;
}
class Pawn extends Piece {
    constructor(x: number, y: number, team: TeamColor) {
        super(x, y, team, `pawn_${team}.png`);
    }
    ok(p: Vector) {
        const targetX = Math.round(p.x / tileSize);
        const targetY = Math.round(p.y / tileSize);
        
        const dx = this.x - targetX;
        const dy = this.y - targetY;

        // Ensure the pawn stays in its lane (Y doesn't change)
        if(dy != 0) return false;

        // ms === 0 means it's the first move
        const canMoveTwo = this.ms == 0;

        return canMoveTwo ? (dx == 1 || dx == 2) : dx == 1;
    }
}
const pieces: Piece[] = [];
var team: TeamColor = "red";
var active: Piece | null = null;

scene.start(() => {
    for(let i = 0; i <= scene.width; i += tileSize) {
        for(let j = 0; j <= scene.height; j += tileSize) {
            const r = i / tileSize;
            const c = j / tileSize;
            scene.rect(i, j, tileSize, tileSize, (r + c) % 2 == 0 ? "#1a5a00" : "#fff4e8");
        }
    }
    pieces.forEach(p => scene.img(p.ico, p.x, p.y, p.width, p.height));
});
scene.on("click", (e) => {
    const at = scene.mouseAt(e);
    const sx = Math.floor(at.x / tileSize) + 1;
    const sy = Math.floor(at.y / tileSize) + 1;
    const pos = new Vector(sx, sy);
    if(!active) {
        if(!(pieces.some(p => near(p.getPos(), pos, 5)))) return;
        const p = pieces.find(p => near(p.getPos(), pos, 5)) as Piece;
        if(p.team != team) return;
        active = p;
    } else {
        if(active.ok(pos)) {
            active.ms++;
            active.setPos(pos);
            active = null;
            team = team == "red" ? "blue" : "red";
        }
    }
});