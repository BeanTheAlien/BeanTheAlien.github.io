import { DebugRay, Entity, objIs, PlayableCharacter, Scene, Vector, BulletObject, Angle, Raycast, Cooldown, random } from "../../phantom2d.js";
const scene = new Scene({ canvas: "dng", w: 500, h: 500 });
const size = 10;
var stat = {
    dmg: 1,
    spd: 3,
    bspd: 4,
    hp: 5
};
const healthOpts = (self: Entity, hp: number, onDie: Function, c1: string, c2: string = "#8b0b0b") => {
    return { hp, onDie, onHurt: () => {
        self.color = c2;
        setTimeout(() => self.color = c1, 125);
    } } as any;
}
const plr = new PlayableCharacter({ strength: 0, width: size, height: size, color: "#29ad05", upd: () => {
    plr.rot = scene.rotToMouse(plr);
}, x: 5, y: 20 });
plr.use("health", healthOpts(plr, stat.hp, scene.stop, "#29ad05"));
plr.binds(["w", () => plr.moveY(-stat.spd)], ["a", () => plr.moveX(-stat.spd)], ["s", () => plr.moveY(stat.spd)], ["d", () => plr.moveX(stat.spd)]);
var pos = new Vector(0, 0);
interface Room {
    at: Vector;
    e: Enemy[];
    exit: Exit[];
}
class Enemy extends Entity {
    atkCd: Cooldown;
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number, atk: Function, cd: number) {
        super({ x, y, width: size * w, height: size * h, color: c, upd: () => {
            if(this.dp() <= 300) {
                this.x += Math.sign(plr.x - this.x);
                this.y += Math.sign(plr.y - this.y);
            }
            if(this.atkCd.ready) {
                atk();
                this.atkCd.consume();
            }
        } });
        this.use("health", healthOpts(this, hp, () => this.kill(), c));
        this.atkCd = new Cooldown(cd, false);
    }
    dp() {
        return Vector.dist(this.getPos(), plr.getPos());
    }
    kill() {
        scene.rm(this);
        let x = 0;
        scene.forEach(e => {
            if(objIs(e, Enemy)) x++;
        });
        if(x == 0) ldExs();
    }
}
class MeleeEnemy extends Enemy {
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number, range: number, cd: number) {
        super(x, y, w, h, c, hp, dmg, () => {
            if(this.dp() <= range) {
                plr.comp("health").hurt(dmg);
            }
        }, cd);
    }
}
class GunEnemy extends Enemy {
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number, getRot: () => number, bspd: number, cd: number, asWell?: (e: Entity) => void, atkCount = 1) {
        super(x, y, w, h, c, hp, dmg, () => {
            for(let i = 0; i < atkCount; i++) {
                const o = bulGenr(this.x, this.y, getRot(), (e) => {
                    if(e == plr) {
                        e.comp("health").hurt(dmg);
                        scene.rm(o);
                        if(asWell) asWell(e);
                    }
                }, bspd);
                scene.add(o);
            }
        }, cd);
    }
}
class BasicMeleeEnemy extends MeleeEnemy {
    constructor(x: number, y: number) {
        super(x, y, 1, 2, "#ec0303", 5, 1, 50, 500);
    }
}
class CoreGunEnemy extends GunEnemy {
    rf: number;
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number, bspd: number, cd: number, roff = 10, asWell?: (e: Entity) => void, atkCount = 1) {
        super(x, y, w, h, c, hp, dmg, () => this.bulRot(), bspd, cd, asWell, atkCount);
        this.rf = roff;
    }
    bulRot() {
        const r = Angle.deg(scene.rotBtwn(this, plr));
        return Angle.rad(random(r - this.rf, r + this.rf));
    }
}
class BasicGunEnemy extends CoreGunEnemy {
    constructor(x: number, y: number) {
        super(x, y, 1, 2, "#ec5c03", 5, 1, 3, 750);
    }
}
class BulletSprayGunEnemy extends CoreGunEnemy {
    constructor(x: number, y: number) {
        super(x, y, 1, 2, "#be2b2b", 5, 1, 3, 150, 10, () => {}, 5);
    }
}

class Exit extends Entity {
    constructor(x: number, y: number, rot: number, then: Vector) {
        super({ x, y, rot, width: 5, height: 20, color: "#a23c04", collide: (e) => {
            if(e != plr) return;
            // unload previous exits
            const rm = fdRm();
            if(rm) scene.rm(...rm.exit);
            pos.x += then.x;
            pos.y += then.y;
            // load new room
            ldRm();
            // reset plr pos to this pos
            plr.x = this.x + (then.x * -1 * 5);
            plr.y = this.y + (then.y * -1 * 5);
        } });
    }
}
function LeftExit() { return new Exit(0, scene.height / 2, 0, new Vector(-1, 0)); }
function RightExit() { return new Exit(scene.width - 5, scene.height / 2, 0, new Vector(1, 0)); }
function TopExit() { return new Exit(scene.width / 2, 0, Angle.rad(90), new Vector(0, 1)); }
function BtmExit() { return new Exit(scene.width / 2, scene.height - 10, Angle.rad(90), new Vector(0, -1)); }

const rooms: Room[] = [
    { at: new Vector(0, 0), e: [new BasicMeleeEnemy(0, 0)], exit: [RightExit()] },
    { at: new Vector(1, 0), e: [new BasicMeleeEnemy(0, 0), new BasicMeleeEnemy(10, 0)], exit: [RightExit()] },
    { at: new Vector(2, 0), e: [new BasicGunEnemy(0, 0)], exit: [BtmExit()] },
    { at: new Vector(2, -1), e: [new BulletSprayGunEnemy(0, 0)], exit: [] }
];
function fdRm() {
    return rooms.find(r => r.at.x == pos.x && r.at.y == pos.y);
}
function ldRm() {
    const rm = fdRm();
    if(rm) scene.add(...rm.e);
}
function ldExs() {
    const rm = fdRm();
    if(rm) scene.add(...rm.exit);
}
function bulGenr(x: number, y: number, rot: number, collide: (e: Entity) => void, spd: number) {
    return new BulletObject({ x, y, rot, height: 6, width: 18, scene, color: "#e2e603", collide, extLeft: 0, extRight: scene.width, extTop: 0, extBtm: scene.height, spd });
}
ldRm();

scene.add(plr);
scene.on("click", () => {
    const o = bulGenr(plr.x, plr.y, scene.rotToMouse(plr), (e) => { if(objIs(e, Enemy)) { e.comp("health").hurt(stat.dmg); scene.rm(o); } }, stat.bspd);
    scene.add(o);
});
scene.start(() => {
    scene.bg("#003764");
});