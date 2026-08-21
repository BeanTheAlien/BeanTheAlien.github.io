import { DebugRay, Entity, objIs, PlayableCharacter, Scene, Vector, BulletObject, Angle, Raycast } from "../../phantom2d.js";
const scene = new Scene({ canvas: "dng", w: 500, h: 500 });
const size = 10;
var stat = {
    dmg: 1,
    spd: 3,
    bspd: 4
};
const plr = new PlayableCharacter({ strength: 0, width: size, height: size, color: "#29ad05", upd: () => {
    plr.rot = scene.rotToMouse(plr);
} });
plr.binds(["w", () => plr.moveY(-stat.spd)], ["a", () => plr.moveX(-stat.spd)], ["s", () => plr.moveY(stat.spd)], ["d", () => plr.moveX(stat.spd)]);
var pos = new Vector(0, 0);
interface Room {
    at: Vector;
    e: Enemy[];
    exit: Exit[];
}
class Enemy extends Entity {
    dmg: number;
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number) {
        super({ x, y, width: size * w, height: size * h, color: c, upd: () => {
            const r = new DebugRay({ scene, dist: 200, angle: scene.rotBtwn(this, plr), origin: this.getPos(), color: "#ff3c00" });
            setTimeout(() => scene.rmMisc(r), 500);
            const h = r.cast();
            if(!h || h.obj == this) return;
            this.x += Math.sign(plr.x - this.x);
            this.y += Math.sign(plr.y - this.y);
        } });
        this.use("health", { hp, onHurt: () => {
            this.color = "#8b0b0b";
            setTimeout(() => this.color = c, 125);
        }, onDie: () => scene.rm(this) });
        this.dmg = dmg;
    }
}
class BasicEnemy extends Enemy {
    constructor(x: number, y: number) {
        super(x, y, 1, 2, "#ec0303", 5, 0);
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
function LeftExit() { return new Exit(0, scene.height / 2, 0, new Vector(-1, 0)); }
function RightExit() { return new Exit(scene.width, scene.height / 2, 0, new Vector(1, 0)); }
function TopExit() { return new Exit(scene.width / 2, 0, Angle.rad(90), new Vector(0, 1)); }
function BtmExit() { return new Exit(scene.width / 2, scene.height, Angle.rad(90), new Vector(0, -1)); }

const rooms: Room[] = [
    { at: new Vector(0, 0), e: [new BasicEnemy(0, 0)], exit: [] }
];
function fdRm() {
    return rooms.find(r => r.at.x == pos.x && r.at.y == pos.y);
}
function ldRm() {
    const rm = fdRm();
    if(rm) scene.add(...rm.e);
}
ldRm();

scene.add(plr);
scene.on("click", () => {
    const o = new BulletObject({ x: plr.x, y: plr.y, rot: scene.rotToMouse(plr), height: 6, width: 18, scene, color: "#e2e603", collide: (e) => { if(objIs(e, Enemy)) { e.comp("health").hurt(stat.dmg); scene.rm(o); } }, extLeft: 0, extRight: scene.width, extTop: 0, extBtm: scene.height, spd: stat.bspd });
    scene.add(o);
});
scene.start(() => {
    scene.bg("#003764");
});