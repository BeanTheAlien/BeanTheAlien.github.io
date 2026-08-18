import { Scene } from "../../phantom2d.js";
const scene = new Scene({ canvas: "dng", w: 500, h: 500 });
const size = 1;
var stat = {
    dmg: 1
};
const plr = new PlayableCharacter({ strength: 0, width: size, height: size, color: "#29ad05", upd: () => {
    plr.rot = scene.rotToMouse(plr);
} });
plr.binds(["w", plr.moveY(-size)], ["a", plr.moveX(-size)], ["s", plr.moveY(size)], ["d", plr.moveX(size)]);
var pos = new Vector(0, 0);
interface Room {
    at: Vector;
    e: Enemy[];
}
const rooms = [];
class Enemy extends Entity {
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number) {
        super({ x, y, width: w, height: h, color: c });
        this.use("health", { hp, onHurt: () => {
            this.color = "#a91515";
            setTimeout(() => this.color = c, 125);
        }, onDie: () => scene.rm(this) });
        scene.add(this);
    }
}

scene.add(plr);
scene.on("click", () => {
    const o = (new DebugRay({ origin: plr.getPos(), angle: plr.rot, dist: 5, scene, color: "#e2e603", life: 1.5 })).cast()?.obj;
    if(obj && objIs(obj, Enemy)) obj.comp("health").hurt(stat.dmg);
});
scene.start(() => {
    scene.bg("#003764");
});