import { DebugRay, Entity, objIs, PlayableCharacter, Scene, Vector } from "../../phantom2d.js";
const scene = new Scene({ canvas: "dng", w: 500, h: 500 });
const size = 1;
var stat = {
    dmg: 1
};
const plr = new PlayableCharacter({ strength: 0, width: size, height: size, color: "#29ad05", upd: () => {
    plr.rot = scene.rotToMouse(plr);
} });
plr.binds(["w", () => plr.moveY(-size)], ["a", () => plr.moveX(-size)], ["s", () => plr.moveY(size)], ["d", () => plr.moveX(size)]);
var pos = new Vector(0, 0);
interface Room {
    at: Vector;
    e: Enemy[];
    exit: Exit[];
}
const rooms = [];
function fdRm() {
    return rooms.find(r => r.at.x == pos.x && r.at.y == pos.y);
}
class Enemy extends Entity {
    dmg: number;
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number) {
        super({ x, y, width: w, height: h, color: c });
        this.use("health", { hp, onHurt: () => {
            this.color = "#a91515";
            setTimeout(() => this.color = c, 125);
        }, onDie: () => scene.rm(this) });
        scene.add(this);
        this.dmg = dmg;
    }
}
class Exit extends Entity {
    constructor(x: number, y: number, rot: number, then: Vector) {
        super({ x, y, rot, width: 5, height: 10, color: "#fa5700", collide: (e) => {
            if(e != plr) return;
            pos.x += then.x;
            pos.y += then.y;
        } });
    }
}

scene.add(plr);
scene.on("click", () => {
    const o = new Entity({ x: plr.x, y: plr.y, rot: plr.rot, height: 5, width: 3, scene, color: "#e2e603", expr: 1.5, collide: (e) => { if(objIs(e, Enemy)) e.comp("health").hurt(stat.dmg); scene.rm(o); } });
    scene.add(o);
});
scene.start(() => {
    scene.bg("#003764");
});