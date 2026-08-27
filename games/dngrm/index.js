import { Entity, objIs, PlayableCharacter, Scene, Vector, BulletObject, Angle, Cooldown, random, Img, chance } from "../../phantom2d.js";
Img.config.set("root", "assets");
/**
 * TODO:
 * procedual gen
 * stat
 * shop
 * skill tree
 * objects that block vision
 * sprites
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
const healthOpts = (self, hp, onDie, c1, c2 = "#8b0b0b") => {
    return { hp, onDie, onHurt: () => {
            self.color = c2;
            setTimeout(() => self.color = c1, 125);
        } };
};
const plr = new PlayableCharacter({ strength: 0, width: size, height: size, color: "#29ad05", upd: () => {
        plr.rot = scene.rotToMouse(plr);
        const bound = (n, n0, n1) => n < n0 || n > n1 ? (n < n0 ? n0 : n1) : n;
        plr.x = bound(plr.x, 0, scene.width - plr.width);
        plr.y = bound(plr.y, 0, scene.height - plr.height);
    }, x: 50, y: 50 });
plr.use("health", healthOpts(plr, stat.hp, scene.stop, "#29ad05"));
plr.binds(["w", () => plr.moveY(-stat.spd)], ["a", () => plr.moveX(-stat.spd)], ["s", () => plr.moveY(stat.spd)], ["d", () => plr.moveX(stat.spd)]);
var pos = new Vector(0, 0);
class Enemy extends Entity {
    atkCd;
    constructor(x, y, w, h, c, hp, atk, cd, spd = 1) {
        super({ x, y, width: size * w, height: size * h, color: c, upd: () => {
                if (this.dp() <= 300) {
                    const dx = plr.x - this.x;
                    const dy = plr.y - this.y;
                    const d = Math.hypot(dx, dy);
                    if (d > 0) {
                        const md = Math.min(spd, d);
                        this.x += (dx / d) * md;
                        this.y += (dy / d) * md;
                    }
                }
                if (this.atkCd.ready) {
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
        for (let i = 0; i < random(1, 5); i++) {
            new Coin(this.x, this.y);
        }
        let x = 0;
        scene.forEach(e => {
            if (objIs(e, Enemy))
                x++;
        });
        if (x == 0)
            ldExs();
    }
}
class MeleeEnemy extends Enemy {
    constructor(x, y, w, h, c, hp, dmg, range, cd, spd = 1) {
        super(x, y, w, h, c, hp, () => {
            if (this.dp() <= range) {
                plr.comp("health").hurt(dmg);
            }
        }, cd, spd);
    }
}
class GunEnemy extends Enemy {
    constructor(x, y, w, h, c, hp, dmg, getRot, bspd, cd, asWell, atkCount = 1, spd = 1) {
        super(x, y, w, h, c, hp, () => {
            for (let i = 0; i < atkCount; i++) {
                const o = bulGenr(this.x, this.y, getRot(), (e) => {
                    if (e == plr) {
                        e.comp("health").hurt(dmg);
                        scene.rm(o);
                        if (asWell)
                            asWell(e);
                    }
                }, bspd);
                scene.add(o);
            }
        }, cd, spd);
    }
}
class BasicMeleeEnemy extends MeleeEnemy {
    constructor(x, y) {
        super(x, y, 1, 2, "#ec0303", 5, 1, 50, 500);
    }
}
class CoreGunEnemy extends GunEnemy {
    rf;
    constructor(x, y, w, h, c, hp, dmg, bspd, cd, roff = 10, asWell, atkCount = 1, spd = 1) {
        super(x, y, w, h, c, hp, dmg, () => this.bulRot(), bspd, cd, asWell, atkCount, spd);
        this.rf = roff;
    }
    bulRot() {
        const r = Angle.deg(scene.rotBtwn(this, plr));
        return Angle.rad(random(r - this.rf, r + this.rf));
    }
}
class BasicGunEnemy extends CoreGunEnemy {
    constructor(x, y) {
        super(x, y, 1, 2, "#ec5c03", 5, 1, 3, 750);
    }
}
class BulletSprayGunEnemy extends CoreGunEnemy {
    constructor(x, y) {
        super(x, y, 1, 2, "#be2b2b", 5, 1, 3, 150, 10, () => { }, 5);
    }
}
class SprintMeleeEnemy extends MeleeEnemy {
    constructor(x, y) {
        super(x, y, 1, 2, "#ec0303", 5, 1, 50, 500, 2.5);
    }
}
class Exit extends Entity {
    constructor(x, y, rot, then, sp) {
        super({ x, y, rot, width: 5, height: 20, color: "#a23c04", collide: (e) => {
                if (e != plr)
                    return;
                // unload previous exits
                const rm = fdRm();
                if (rm) {
                    scene.rm(...rm.exit);
                    if (rm.welt)
                        rm.welt.forEach(r => r.rm());
                }
                pos.x += then.x;
                pos.y += then.y;
                // load new room
                ldRm();
                // reset plr pos to the spawn pos
                plr.x = sp.x;
                plr.y = sp.y;
            } });
    }
}
function LeftExit() { return new Exit(0, scene.height / 2, 0, new Vector(-1, 0), new Vector(scene.width - 25, scene.height / 2)); }
function RightExit() { return new Exit(scene.width - 5, scene.height / 2, 0, new Vector(1, 0), new Vector(25, scene.height / 2)); }
function TopExit() { return new Exit(scene.width / 2, 0, Angle.rad(90), new Vector(0, 1), new Vector(scene.width / 2, scene.height - 25)); }
function BtmExit() { return new Exit(scene.width / 2, scene.height - 10, Angle.rad(90), new Vector(0, -1), new Vector(scene.width / 2, 25)); }
const rooms = [
// { at: new Vector(0, 0), e: [new BasicMeleeEnemy(0, 0)], exit: [RightExit(), LeftExit()] },
// { at: new Vector(1, 0), e: [new BasicMeleeEnemy(0, 0), new BasicMeleeEnemy(10, 0)], exit: [RightExit()] },
// { at: new Vector(2, 0), e: [new BasicGunEnemy(0, 0)], exit: [BtmExit()] },
// { at: new Vector(2, -1), e: [new BulletSprayGunEnemy(0, 0)], exit: [] },
// { at: new Vector(-1, 0), e: [new SprintMeleeEnemy(0, 0)], exit: [RightExit()] }
];
function getRmExits(room, rooms) {
    const hasRoom = (x, y) => rooms.some(r => r.x == x && r.y == y);
    const exits = [];
    if (hasRoom(room.x - 1, room.y)) {
        exits.push(LeftExit());
    }
    if (hasRoom(room.x + 1, room.y)) {
        exits.push(RightExit());
    }
    if (hasRoom(room.x, room.y - 1)) {
        exits.push(TopExit());
    }
    if (hasRoom(room.x, room.y + 1)) {
        exits.push(BtmExit());
    }
    return exits;
}
function genEnemyCtors() {
    const ec = [BasicMeleeEnemy, BasicGunEnemy, BulletSprayGunEnemy, SprintMeleeEnemy];
    const out = [];
    for (let i = 0; i < random(1, 6); i++)
        out.push(ec[random(ec.length)]);
    return out;
}
function genRmCoords() {
    const max = 20;
    const br = 85;
    const min = 10;
    const cord = [
        new Vector(0, 0)
    ];
    const stack = [
        new Vector(0, 0)
    ];
    const dirs = [
        new Vector(-1, 0),
        new Vector(1, 0),
        new Vector(0, 1),
        new Vector(0, -1)
    ];
    while (stack.length > 0 && cord.length < max) {
        const current = stack[stack.length - 1];
        const available = dirs.filter(dir => {
            const next = new Vector(current.x + dir.x, current.y + dir.y);
            return !cord.some(p => p.x == next.x && p.y == next.y);
        });
        if (available.length == 0 || (!chance(br) && cord.length >= min)) {
            stack.pop();
            continue;
        }
        const dir = available[random(available.length)];
        const next = new Vector(current.x + dir.x, current.y + dir.y);
        cord.push(next);
        stack.push(next);
    }
    return cord;
}
function genRms() {
    const cord = genRmCoords();
    let sc = 5;
    const bc = 5;
    for (let i = 0; i < cord.length; i++) {
        const c = cord[i];
        const tag = chance(bc) ? "boss" : chance(sc) ? "shop" : "nm";
        rooms.push({ at: c, e: genEnemyCtors().map(c => new c(0, 0)), exit: getRmExits(c, cord), tg: tag });
        if (tag != "shop")
            sc++;
    }
    // now clean rooms with shop / boss tag
    // boss logic not impl yet
    // but they cant have standard enemy spawn
    rooms.forEach(r => {
        if (r.tg == "nm")
            return;
        r.e = [];
        if (r.tg == "shop")
            r.welt = genShop();
    });
}
function genShop() {
    const ctor = [ShopEx];
    const obj = [];
    const ct = 3;
    const sx = scene.width / ct;
    for (let i = 0; i < ct; i++) {
        obj.push(ctor[random(ctor.length)](sx * i, scene.height / 2));
    }
    return obj;
}
function rmCb(r, at) {
    at = at ?? pos;
    return r.at.x == at.x && r.at.y == at.y;
}
function fdRm(where) {
    return rooms.find(r => rmCb(r, where));
}
function fdRmIdx(where) {
    return rooms.findIndex(r => rmCb(r, where));
}
function ldRm() {
    const rm = fdRm();
    coins = [];
    if (rm) {
        if (rm.e.length)
            scene.add(...rm.e);
        else
            ldExs();
        if (rm.welt)
            scene.add(...rm.welt);
        coins = [];
    }
}
function ldExs() {
    const rm = fdRm();
    if (rm) {
        scene.add(...rm.exit);
        // remove enemy objects (already defeated)
        rooms[fdRmIdx()].e = [];
    }
}
function bulGenr(x, y, rot, collide, spd) {
    return new BulletObject({ x, y, rot, height: 6, width: 18, scene, color: "#e2e603", collide, extLeft: 0, extRight: scene.width, extTop: 0, extBtm: scene.height, spd });
}
class WorldObj extends Entity {
    a;
    constructor(x, y, width, height, col, a, verif) {
        super({ x, y, width, height, color: "rgba(0, 0, 0, 0)", collide: (e) => {
                if (e == plr && ((verif ?? (() => true))(e))) {
                    this.rm();
                    col(e);
                }
            } });
        a.push(this);
        scene.add(this);
        this.a = a;
    }
    rm() {
        scene.rm(this);
        this.a.splice(this.a.indexOf(this));
    }
}
var coins = [];
class Coin extends WorldObj {
    static img = new Img("coin.png");
    constructor(x, y) {
        super(x, y, 10, 10, () => stat.mon++, coins);
        this.use("enhancedphys", { scene });
        const dir = Angle.toVector(Angle.rad(random(0, 361)));
        const v = 60;
        dir.scale(random(-v, v + 1));
        this.lerp("pos", scene, new Vector(this.x + dir.x, this.y + dir.y), "once", 0.25);
    }
    render() {
        scene.img(Coin.img, this.x, this.y, this.width, this.height);
    }
}
var shop = [];
class Shop extends WorldObj {
    img;
    constructor(x, y, cost, spr) {
        super(x, y, 20, 20, () => { plr.mon -= cost; stat.perks.push(this); }, shop, () => plr.mon >= cost);
        this.img = new Img(spr);
    }
    render() {
        scene.img(this.img, this.x, this.y, this.width, this.height);
    }
}
function ShopEx(x, y) { return new Shop(x, y, 1, "coin.png"); }
genRms();
ldRm();
// const startScrn = new SceneUI({ scene, w: scene.width, h: scene.height, color: "#000c49" });
// const ssStartBtn = new ButtonUI({ scene, w: 100, h: 75, styles: {
//     idle: "#41e50a",
//     hover: "#bc0b0b",
//     click: "#7a0707"
// }, x: startScrn.width / 2, click: () => {
//     genRms();
//     // const r = fdRm(new Vector());
//     // // remove all enemies from first room
//     // if(r) r.e = [];
//     ldRm();
//     hideStartScrn();
// } });
// const sssbText = new TextUI({ scene, tx: "Enter The Dungeon", x: ssStartBtn.x + ssStartBtn.width / 2 });
// function hideStartScrn() {
//     scene.rmUI(startScrn, ssStartBtn, sssbText);
// }
// function showStartScrn() {
//     scene.addUI(startScrn, ssStartBtn, sssbText);
// }
// showStartScrn();
scene.add(plr);
scene.on("click", () => {
    const o = bulGenr(plr.x, plr.y, scene.rotToMouse(plr), (e) => { if (objIs(e, Enemy)) {
        e.comp("health").hurt(stat.dmg);
        scene.rm(o);
    } }, stat.bspd);
    scene.add(o);
});
scene.start(() => {
    scene.bg("#003764");
    coins.forEach(c => c.render());
    shop.forEach(s => s.render());
});
