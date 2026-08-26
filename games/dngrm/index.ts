import { DebugRay, Entity, objIs, PlayableCharacter, Scene, Vector, BulletObject, Angle, Raycast, Cooldown, random, Img } from "../../phantom2d.js";
Img.config.set("root", "assets");
/**
 * TODO:
 * procedual gen
 * stat
 * shop
 * skill tree
 * objects that block vision
 * sprites
 * fix coin lerp
 */
const scene = new Scene({ canvas: "dng", w: 500, h: 500 });
const size = 10;
var stat = {
    /**
     * The current XP points.
     */
    xp: 0,
    /**
     * The current player level.
     * 
     * Required xp is Math.floor(Math.pow(lvl, 1.25)).
     */
    lvl: 1,
    /**
     * The amount of damage dealt per bullet.
     */
    dmg: 1,
    /**
     * The movement speed.
     */
    spd: 3,
    /**
     * The speed the bullet travels at.
     */
    bspd: 4,
    /**
     * The current HP.
     */
    hp: 5,
    /**
     * The max HP.
     */
    mhp: 5,
    /**
     * The chance to land a critical hit. (dmg x2)
     */
    crit: 0,
    /**
     * Luck to get better items for purchase.
     */
    luck: 0,
    /**
     * Damage resistence. Armor-piercing attacks ignore armor.
     */
    armor: 0,
    /**
     * The chance to dodge an attack.
     */
    dodge: 0,
    /**
     * Currency. Money dropped from enemy kills.
     */
    mon: 0,
    /**
     * Perks unlocked during battle.
     */
    perks: [],
    /**
     * Permanent skills.
     */
    skill: [],
    /**
     * Adventure points (AP). Used to level up skills.
     */
    ap: 0
};
const healthOpts = (self: Entity, hp: number, onDie: Function, c1: string, c2: string = "#8b0b0b") => {
    return { hp, onDie, onHurt: () => {
        self.color = c2;
        setTimeout(() => self.color = c1, 125);
    } } as any;
}
const plr = new PlayableCharacter({ strength: 0, width: size, height: size, color: "#29ad05", upd: () => {
    plr.rot = scene.rotToMouse(plr);
    const bound = (n: number, n0: number, n1: number) => n < n0 || n > n1 ? (n < n0 ? n0 : n1) : n;
    plr.x = bound(plr.x, 0, scene.width - plr.width);
    plr.y = bound(plr.y, 0, scene.height - plr.height);
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
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, atk: Function, cd: number, spd = 1) {
        super({ x, y, width: size * w, height: size * h, color: c, upd: () => {
            if(this.dp() <= 300) {
                const dx = plr.x - this.x;
                const dy = plr.y - this.y;
                const d = Math.hypot(dx, dy);
                if(d > 0) {
                    const md = Math.min(spd, d);
                    this.x += (dx / d) * md;
                    this.y += (dy / d) * md;
                }
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
        for(let i = 0; i < random(1, 5); i++) {
            new Coin(this.x, this.y);
        }
        let x = 0;
        scene.forEach(e => {
            if(objIs(e, Enemy)) x++;
        });
        if(x == 0) ldExs();
    }
}
class MeleeEnemy extends Enemy {
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number, range: number, cd: number, spd = 1) {
        super(x, y, w, h, c, hp, () => {
            if(this.dp() <= range) {
                plr.comp("health").hurt(dmg);
            }
        }, cd, spd);
    }
}
class GunEnemy extends Enemy {
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number, getRot: () => number, bspd: number, cd: number, asWell?: (e: Entity) => void, atkCount = 1, spd = 1) {
        super(x, y, w, h, c, hp, () => {
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
        }, cd, spd);
    }
}
class BasicMeleeEnemy extends MeleeEnemy {
    constructor(x: number, y: number) {
        super(x, y, 1, 2, "#ec0303", 5, 1, 50, 500);
    }
}
class CoreGunEnemy extends GunEnemy {
    rf: number;
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number, bspd: number, cd: number, roff = 10, asWell?: (e: Entity) => void, atkCount = 1, spd = 1) {
        super(x, y, w, h, c, hp, dmg, () => this.bulRot(), bspd, cd, asWell, atkCount, spd);
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
class SprintMeleeEnemy extends MeleeEnemy {
    constructor(x: number, y: number) {
        super(x, y, 1, 2, "#ec0303", 5, 1, 50, 500, 2.5);
    }
}

class Exit extends Entity {
    constructor(x: number, y: number, rot: number, then: Vector, sp: Vector) {
        super({ x, y, rot, width: 5, height: 20, color: "#a23c04", collide: (e) => {
            if(e != plr) return;
            // unload previous exits
            const rm = fdRm();
            if(rm) scene.rm(...rm.exit);
            pos.x += then.x;
            pos.y += then.y;
            // load new room
            ldRm();
            // reset plr pos to the spawn pos
            plr.x = sp.x;
            plr.y = sp.y;
            console.log(plr.x, plr.y);
        } });
    }
}
function LeftExit() { return new Exit(0, scene.height / 2, 0, new Vector(-1, 0), new Vector(scene.width - 25, scene.height / 2)); }
function RightExit() { return new Exit(scene.width - 5, scene.height / 2, 0, new Vector(1, 0), new Vector(25, scene.height / 2)); }
function TopExit() { return new Exit(scene.width / 2, 0, Angle.rad(90), new Vector(0, 1), new Vector(scene.width / 2, scene.height - 25)); }
function BtmExit() { return new Exit(scene.width / 2, scene.height - 10, Angle.rad(90), new Vector(0, -1), new Vector(scene.width / 2, 25)); }

const rooms: Room[] = [
    { at: new Vector(0, 0), e: [new BasicMeleeEnemy(0, 0)], exit: [RightExit(), LeftExit()] },
    { at: new Vector(1, 0), e: [new BasicMeleeEnemy(0, 0), new BasicMeleeEnemy(10, 0)], exit: [RightExit()] },
    { at: new Vector(2, 0), e: [new BasicGunEnemy(0, 0)], exit: [BtmExit()] },
    { at: new Vector(2, -1), e: [new BulletSprayGunEnemy(0, 0)], exit: [] },
    { at: new Vector(-1, 0), e: [new SprintMeleeEnemy(0, 0)], exit: [RightExit()] }
];
/**
 * Generates a set of random exit locations, given cardinal directions.
 * 
 * Used for procedual generation.
 * @returns Random exit locations.
 */
function getRmExits() {
    const es = ["left", "right", "top", "btm"] as const;
    const esm = { left: LeftExit, right: RightExit, top: TopExit, btm: BtmExit } as const;
    const exits = new Set<(typeof es)[number]>();
    for(let i = 0; i < random(1, 4); i++) {
        let x = es[random(es.length)];
        while(exits.has(x)) x = es[random(es.length)];
        exits.add(x);
    }
    return Array.from(exits).map(v => esm[v]());
}
function rmCb(r: Room) {
    return r.at.x == pos.x && r.at.y == pos.y;
}
function fdRm() {
    return rooms.find(rmCb);
}
function fdRmIdx() {
    return rooms.findIndex(rmCb);
}
function ldRm() {
    const rm = fdRm();
    if(rm) {
        if(rm.e.length) scene.add(...rm.e);
        else ldExs();
        coins = [];
    }
}
function ldExs() {
    const rm = fdRm();
    if(rm) {
        scene.add(...rm.exit);
        // remove enemy objects (already defeated)
        rooms[fdRmIdx()].e = [];
    }
}
function bulGenr(x: number, y: number, rot: number, collide: (e: Entity) => void, spd: number) {
    return new BulletObject({ x, y, rot, height: 6, width: 18, scene, color: "#e2e603", collide, extLeft: 0, extRight: scene.width, extTop: 0, extBtm: scene.height, spd });
}
ldRm();

var coins: Coin[] = [];
class Coin extends Entity {
    static img: Img = new Img("coin.png");
    constructor(x: number, y: number) {
        super({ x, y, width: 7, height: 7, collide: (e) => { if(e == plr) { scene.rm(this); stat.mon++; } } });
        coins.push(this);
        this.use("enhancedphys", { scene });
        const dir = Angle.toVector(Angle.rad(random(0, 361)));
        const v = 60;
        dir.scale(random(-v, v+1));
        this.lerp("pos", scene, new Vector(this.x + dir.x, this.y + dir.y), "once", 0.25);
    }
    render() {
        scene.img(Coin.img, this.x, this.y, this.width, this.height);
    }
}

scene.add(plr);
scene.on("click", () => {
    const o = bulGenr(plr.x, plr.y, scene.rotToMouse(plr), (e) => { if(objIs(e, Enemy)) { e.comp("health").hurt(stat.dmg); scene.rm(o); } }, stat.bspd);
    scene.add(o);
});
scene.start(() => {
    scene.bg("#003764");
    coins.forEach(c => c.render());
});