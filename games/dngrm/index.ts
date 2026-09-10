import { DebugRay, Entity, objIs, PlayableCharacter, Scene, Vector, BulletObject, Angle, Raycast, Cooldown, random, Img, chance, ButtonUI, SceneUI, TextUI, Local, FilePicker, ImgUI } from "../../phantom2d.js";
Img.config.set("root", "assets");
window.addEventListener("error", (e) => alert(`${e.message}, ${e.lineno}`))
/**
 * TODO:
 * stat
 * shop
 * skill tree
 * objects that block vision
 * sprites
 * game init func
 */
const scene = new Scene({ canvas: "dng", w: 700, h: 700 });
const size = 10;
interface Stat {
    /**
     * The current XP points.
     */
    xp: number;
    /**
     * The current player level.
     * 
     * Required xp is `Math.floor(Math.pow(lvl, 1.85)) + 1`.
     */
    lvl: number;
    /**
     * The amount of damage dealt per bullet.
     */
    dmg: number;
    /**
     * The movement speed.
     */
    spd: number;
    /**
     * The speed the bullet travels at.
     */
    bspd: number;
    /**
     * The current HP.
     */
    hp: number;
    /**
     * The max HP.
     */
    mhp: number;
    /**
     * The chance to land a critical hit. (dmg x2)
     */
    crit: number;
    /**
     * Luck to get better items for purchase.
     */
    luck: number;
    /**
     * Damage resistence. Armor-piercing attacks ignore armor.
     */
    armor: number;
    /**
     * The chance to dodge an attack.
     */
    dodge: number;
    /**
     * Currency. Money dropped from enemy kills.
     */
    mon: number;
    /**
     * Perks unlocked during battle.
     */
    perks: Shop[];
    /**
     * Permanent skills.
     */
    skill: string[];
    /**
     * Adventure points (AP). Used to level up skills.
     */
    ap: number;
}
const nextXP = () => Math.floor(Math.pow(stat.lvl, 1.85)) + 1;
var stat: Stat = JSON.parse(Local.get("stat") ?? `{ "xp": 0, "lvl": 1, "dmg": 1, "spd": 3, "bspd": 4, "hp": 5, "mhp": 5, "crit": 0, "luck": 0, "armor": 0, "dodge": 0, "mon": 0, "perks": [], "skill": [], "ap": 0 }`) as Stat;
function dodged() {
    return stat.dodge && chance(stat.dodge);
}
const statDisp = document.getElementById("stat-disp") as HTMLDivElement;
statDisp.style.whiteSpace = "pre-wrap";
const lst = document.getElementById("lst") as HTMLDivElement;
lclSave();
const lsB = document.getElementById("ls") as HTMLButtonElement;
lsB.addEventListener("click", lclSave)
const pcsB = document.getElementById("pcs") as HTMLButtonElement;
pcsB.addEventListener("click", pcSave);
function dispStat() {
    const none = (a: any[]) => !a.length ? "none" : a;
    statDisp.textContent = `Level ${stat.lvl} (${stat.xp} / ${nextXP()} xp)\n
Damage: ${stat.dmg} (crit ${stat.crit})\n
Health: ${stat.hp} (max ${stat.mhp})\n
Armor: ${stat.armor} (dodge: ${stat.dodge})\n
Speed: ${stat.spd} / B-speed: ${stat.bspd}\n
Luck: ${stat.luck}\n
Money: ${stat.mon}\n
Perks: ${none(stat.perks)}\n
Skills: ${none(stat.skill)}\n
Adventure Points: ${stat.ap}`;
}
dispStat();
var rStat = resetRS();
function resetRS(): RunStat {
    return {
        kill: 0,
        hpl: 0,
        hpg: 0,
        dmg: 0,
        me: 0,
        ms: 0
    };
}
interface BObj {
    v: boolean;
}
const sHealthOpts = (hp: number, onDie: Function, controller: Vector, idleFrm: number, painFrm: () => number, invince?: BObj) => {
    return { hp, onDie, onHurt: () => {
        if(pDed || (invince && !invince.v)) return;
        controller.x = painFrm();
        setTimeout(() => {
            if(!pDed) controller.x = idleFrm;
        }, 125);
        stat.hp = plr.comp("health").hp;
    } } as any;
};
const healthOpts = (self: Entity, hp: number, onDie: Function, c1: string, c2: string = "#8b0b0b") => {
    return { hp, onDie, onHurt: () => {
        self.color = c2;
        setTimeout(() => self.color = c1, 125); 
    } } as any;
}
/**
 * HEROS:
 * Gun Fred
 * A bald man with a short temper. No one knows how he got here.
 * Wep: Pistol
 * 
 * George
 * G e o r g e.
 * Wep: Detached Arm
 * 
 * Splerb
 * Don't steal his pie.
 * Wep: Shotgun
 * 
 * John
 * Legend says he's still looking for that buried trasure.
 * Wep: Shovel
 * 
 * The Thing
 * Scary description text.
 * Wep: Explosive Burger
 * 
 * Coughing Baby
 * He's VERY evil.
 * Wep: Germs
 * 
 * Boring Bob
 * Zzz...
 * Wep: Boring
 * 
 * Marmaduke
 * Go go gadget amry!
 * Wep: Army
 * 
 * Ocean
 * Mmmm waves.
 * Wep: Waves
 * 
 * Axel Axton
 * Arrested 7 times for felony murder charges.
 * Wep: Car Axle
 * 
 * Chip Charles
 * Wields the magic of chip summoning.
 * Wep: Summons Bowls Of Chips
 */
const invis = "#0000";
const plr = new PlayableCharacter({ strength: 0, width: size * 3, height: size * 3, color: invis, upd: () => {
    //plr.rot = scene.rotToMouse(plr);
    const bound = (n: number, n0: number, n1: number) => n < n0 || n > n1 ? (n < n0 ? n0 : n1) : n;
    plr.x = bound(plr.x, 0, scene.width - plr.width);
    plr.y = bound(plr.y, 0, scene.height - plr.height);
}, x: 50, y: 50 });
var pDed = false;
function worldInit() {
    plr.x = 50;
    plr.y = 50;
    pDed = false;
    pCanHurt.v = true;
    plr.comp("health").hp = stat.mhp;
    stat.hp = stat.mhp;
    genRms();
}
/**
 * Global (player) sprite index.
 * 
 * x represents sheet, y represents index.
 */
var gsi = new Vector();
var pCanHurt: BObj = { v: true };
function getSI(...names: string[]) {
    return hero.spr.findIndex(s => names.some(n => s.id.startsWith(n)));
}
plr.use("health", sHealthOpts(stat.hp, () => {
    pDed = true;
    const rm = fdRm();
    if(rm) {
        scene.rm(...rm.e);
        // remove hostile bullets
        rm.e.filter(e => objIs(e, GunEnemy)).forEach(e => scene.rm(...e.bls));
    }
    plr.setMoveMode("fixed");
    scene.follow(plr);
    pCanHurt.v = false;
    gsi.x = hero.spr.length - 1;
    gsi.y = 0;
    noSFU();
    fps = 1.5;
    sfu = setSFU(false);
}, gsi, 0, () => getSI("hurt", "pain"), pCanHurt));
plr.binds(["w", () => {
    if(pDed) return;
    plr.moveY(-stat.spd);
    gsi.x = getSI("up");
    gsi.y = 0;
}], ["a", () => {
    if(pDed) return;
    plr.moveX(-stat.spd);
    gsi.x = getSI("left");
    gsi.y = 0;
}], ["s", () => {
    if(pDed) return;
    plr.moveY(stat.spd);
    gsi.x = getSI("down");
    gsi.y = 0;
}], ["d", () => {
    if(pDed) return;
    plr.moveX(stat.spd);
    gsi.x = getSI("right");
    gsi.y = 0;
}]);
interface Hero {
    nm: string;
    ds: string;
    spr: SpriteSheetID[];
    path: string;
    ico: string;
    atk: Function;
}
const buller = (func: (...args: any[]) => BulletObject, cnt: number, rot: () => number, life: number, spd: number) => {
    for(let i = 0; i < cnt; i++) {
        const o = func(plr.x, plr.y, rot(), (e: Entity) => { if(objIs(e, Enemy)) { e.comp("health").hurt(stat.dmg); scene.rm(o); } }, spd);
        scene.add(o);
        plrBuls.push(o);
        o.expire(life, scene);
    }
}
const heroGun = (shots: number, roff: number, life = 5000) => buller(bulGenr, shots, () => Angle.roff(scene.rotToMouse(plr), roff), life, stat.bspd);
const heroMel = (swings: number, life = 90) => buller(melGenr, swings, () => scene.rotToMouse(plr), life, stat.bspd * 1.5);
const heroGunFred: Hero = {
    nm: "Gun Fred",
    ds: "A bald man with a short temper. No one knows how he got here.",
    spr: [
        { id: "idle", cnt: 2 },
        { id: "left", cnt: 1 },
        { id: "right", cnt: 1 },
        { id: "down", cnt: 1 },
        { id: "up", cnt: 1 },
        { id: "fireleft", cnt: 1 },
        { id: "fireright", cnt: 1 },
        { id: "firedown", cnt: 1 },
        { id: "pain", cnt: 1 },
        { id: "die", cnt: 6 }
    ],
    path: "gunfred",
    ico: "fireright0",
    atk: () => heroGun(1, 0)
} as const;
const heroGeorge: Hero = {
    nm: "George",
    ds: "G e o r g e",
    spr: [
        { id: "idle", cnt: 1 },
        { id: "left", cnt: 1 },
        { id: "right", cnt: 1 },
        { id: "down", cnt: 1 },
        { id: "up", cnt: 1 },
        { id: "hurt", cnt: 1 },
        { id: "die", cnt: 4 }
    ],
    path: "george",
    ico: "idle0",
    atk: () => heroMel(1)
} as const;
const heroSet = [
    heroGunFred,
    heroGeorge
] as const;
const cycle = () => {
    const i = heroSet.indexOf(hero) + 1;
    if(i >= heroSet.length) hero = heroSet[0];
    else hero = heroSet[i];
    pss = setPSS();
    heroUIImg.img = pss[0][0];
}
var hero = heroGunFred;
interface SpriteSheetIDr {
    id: string;
}
interface SpriteSheetID extends SpriteSheetIDr {
    cnt: number;
}
/**
 * Player sprite sheet IDs.
 */
const pssID: SpriteSheetID[] = [
    { id: "idle", cnt: 2 },
    { id: "left", cnt: 1 },
    { id: "right", cnt: 1 },
    { id: "down", cnt: 1 },
    { id: "up", cnt: 1 },
    { id: "fireleft", cnt: 1 },
    { id: "fireright", cnt: 1 },
    { id: "firedown", cnt: 1 },
    { id: "pain", cnt: 1 },
    { id: "die", cnt: 6 }
];
const setPSS = () => hero.spr.map(s => {
    const img = [];
    for(let i = 0; i < s.cnt; i++) img.push(new Img(`${hero.path}/${s.id}${i}.png`));
    return img;
});
var pss = setPSS();
const applyPSS = () => {
    pss = setPSS();
    heroUIImg.img = pss[0][0];
}
/**
 * The global frames per second for updating sprites.
 * 
 * Changes sprite every `1000 / fps` seconds.
 */
var fps = 5;
function setSFU(loop = true) {
    return setInterval(() => {
        const next = gsi.y + 1;

        if(next >= pss[gsi.x].length) {
            if(loop) {
                gsi.y = 0;
            } else {
                gsi.y = pss[gsi.x].length - 1;
                noSFU();
            }
            return;
        }

        gsi.y = next;
    }, 1000 / fps);
}
function noSFU() {
    clearInterval(sfu);
}
var sfu = setSFU();
var pos = new Vector(0, 0);
type RoomTag = "nm" | "shop" | "boss";
interface Room {
    at: Vector;
    e: Enemy[];
    exit: Exit[];
    tg: RoomTag;
    welt?: WorldObj[];
}
class Enemy extends Entity {
    atkCd: Cooldown;
    val: number;
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, atk: Function, cd: number, spd = 1, sight = 300, val = 1) {
        super({ x, y, width: size * w, height: size * h, color: c, upd: () => {
            if(this.dp() <= sight) {
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
        this.val = val;
    }
    dp() {
        return Vector.dist(this.getPos(), plr.getPos());
    }
    kill() {
        const rm = this.rs();
        for(let i = 0; i < random(1, 5); i++) {
            new Coin(this.x, this.y);
        }
        if(rm?.e.length == 0) ldExs();
        stat.xp += this.val;
        if(stat.xp >= nextXP()) {
            stat.xp -= nextXP();
            stat.lvl++;
        }
    }
    rs() {
        scene.rm(this);
        const rm = fdRm();
        if(!rm) return;
        rm.e.splice(rm.e.indexOf(this), 1);
        return rm;
    }
}
class MeleeEnemy extends Enemy {
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number, range: number, cd: number, spd = 1, sight?: number, val?: number) {
        super(x, y, w, h, c, hp, () => {
            if(this.dp() <= range && pCanHurt.v) {
                if(dodged()) return;
                plr.comp("health").hurt(dmg);
            }
        }, cd, spd, sight, val);
    }
}
class GunEnemy extends Enemy {
    bls: BulletObject[];
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number, getRot: () => number, bspd: number, cd: number, asWell?: (e: Entity) => void, atkCount = 1, spd = 1, sight?: number, val?: number) {
        super(x, y, w, h, c, hp, () => {
            for(let i = 0; i < atkCount; i++) {
                const o = bulGenr(this.x, this.y, getRot(), (e) => {
                    if(e == plr && pCanHurt.v) {
                        scene.rm(o);
                        if(asWell) asWell(e);
                        if(dodged()) return;
                        e.comp("health").hurt(dmg);
                    }
                }, bspd);
                scene.add(o);
                // force expiration
                o.expire(5000, scene);
                this.bls.push(o);
            }
        }, cd, spd, sight, val);
        this.bls = [];
    }
}
class BasicMeleeEnemy extends MeleeEnemy {
    constructor(x: number, y: number) {
        super(x, y, 1, 2, "#ec0303", 5, 1, 50, 500);
    }
}
class CoreGunEnemy extends GunEnemy {
    rf: number;
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number, bspd: number, cd: number, roff = 10, asWell?: (e: Entity) => void, atkCount = 1, spd = 1, sight?: number, val?: number) {
        super(x, y, w, h, c, hp, dmg, () => this.bulRot(), bspd, cd, asWell, atkCount, spd, sight, val);
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
class MeleeBoss extends MeleeEnemy {
    constructor(x: number, y: number, w: number, h: number, c: string, hp = 50, dmg = 3, spd = 1, val = 3) {
        super(x, y, w, h, c, hp, dmg, 100, 100, spd, 500, val);
    }
    kill() {
        scene.rm(this);
        gss();
    }
}
class BulkBoss extends MeleeBoss {
    constructor(x: number, y: number) {
        super(x, y, 10, 10, "#3d2d0b", 50, 3, 0.85);
    }
}
class SprinterBoss extends MeleeBoss {
    constructor(x: number, y: number) {
        super(x, y, 5, 5, "#920d92", 10, 1, 2.35);
    }
}

class Exit extends Entity {
    constructor(x: number, y: number, rot: number, then: Vector, sp: Vector) {
        super({ x, y, rot, width: 5, height: 20, color: "#a23c04", collide: (e) => {
            if(e != plr) return;
            // unload previous exits and enemies
            const rm = fdRm();
            if(rm) {
                scene.rm(...rm.exit);
                scene.rm(...rm.e);
                if(rm.welt) rm.welt.forEach(r => r.rm());
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

const rooms: Room[] = [];
function getRmExits(room: Vector, rooms: Vector[]) {
    const hasRoom = (x: number, y: number) =>
        rooms.some(
            r => r.x == x && r.y == y
        );
    const exits: Exit[] = [];
    if(hasRoom(room.x - 1, room.y)) {
        exits.push(LeftExit());
    }
    if(hasRoom(room.x + 1, room.y)) {
        exits.push(RightExit());
    }
    // use standard coords
    // up => positive, down => negative
    // (at least for world pos)
    if(hasRoom(room.x, room.y + 1)) {
        exits.push(TopExit());
    }
    if(hasRoom(room.x, room.y - 1)) {
        exits.push(BtmExit());
    }
    return exits;
}
function genEnemyCtors() {
    const ec = [BasicMeleeEnemy, BasicGunEnemy, BulletSprayGunEnemy, SprintMeleeEnemy] as const;
    const out: (new (...arg: any[]) => Enemy)[] = [];
    for(let i = 0; i < random(1, 6); i++) out.push(ec[random(ec.length)]);
    return out;
}
function getBossCtor() {
    const bc = [BulkBoss, SprinterBoss] as const;
    return bc[random(bc.length)];
}
function genRmCoords() {
    const max = 20;
    const br = 85;
    const min = 10;

    const cord: Vector[] = [
        new Vector(0, 0)
    ];

    const stack: Vector[] = [
        new Vector(0, 0)
    ];

    const dirs = [
        new Vector(-1, 0),
        new Vector(1, 0),
        new Vector(0, 1),
        new Vector(0, -1)
    ] as const;

    while(stack.length > 0 && cord.length < max) {
        const current = stack[stack.length - 1];

        const available = dirs.filter(dir => {
            const next = new Vector(
                current.x + dir.x,
                current.y + dir.y
            );

            return !cord.some(
                p => p.x == next.x && p.y == next.y
            );
        });

        if(available.length == 0 || (!chance(br) && cord.length >= min)) {
            stack.pop();
            continue;
        }

        const dir = available[random(available.length)];

        const next = new Vector(
            current.x + dir.x,
            current.y + dir.y
        );
        cord.push(next);
        stack.push(next);
    }

    return cord;
}
/**
 * Generates a random 32-bit integer seed for generating dungeons.
 * @returns A 32-bit integer.
 */
function genDungSeed() {
    return Math.floor(Math.random() * 0x100000000) >>> 0;
}
function genRms() {
    rooms.splice(0);
    pos = new Vector();
    const cord = genRmCoords();
    const sc = 5;
    const bc = 5;
    let bcg = false;
    let scg = false;
    // todo: fix chances
    for(let i = 0; i < cord.length; i++) {
        const c = cord[i];
        const tag: RoomTag = (chance(bc) && i > 2 && !bcg) || (i == cord.length - 1 && !bcg) ? "boss" : /*(chance(sc) && !scg && i > 0) ? "shop" :*/ "nm";
        rooms.push({ at: c, e: genEnemyCtors().map(c => new c(0, 0)), exit: getRmExits(c, cord), tg: tag });
        // if(tag != "shop") sc++;
        // else sc = 5;
        if(tag == "boss") bcg = true;
        //else if(tag == "shop") scg = true;
    }
    // now clean rooms with shop / boss tag
    // boss logic not impl yet
    // but they cant have standard enemy spawn
    rooms.forEach(r => {
        if(r.tg == "nm") return;
        r.e = [];
        if(r.tg == "shop") r.welt = genShop();
        if(r.tg == "boss") r.e = [new (getBossCtor())(0, 0)];
    });
    const r = fdRm(new Vector());
    if(r) {
        r.e = [];
        r.tg = "nm";
        r.welt = [];
    }
}
function genShop() {
    const ctor: ((x: number, y: number) => Shop)[] = [ShopEx];
    const obj: Shop[] = [];
    const ct = 3;
    const sx = scene.width / ct;
    for(let i = 0; i < ct; i++) {
        obj.push(ctor[random(ctor.length)](sx * i, scene.height / 2));
    }
    return obj;
}
function rmCb(r: Room, at?: Vector) {
    at = at ?? pos;
    return r.at.x == at.x && r.at.y == at.y;
}
function fdRm(where?: Vector) {
    return rooms.find(r => rmCb(r, where));
}
function fdRmIdx(where?: Vector) {
    return rooms.findIndex(r => rmCb(r, where));
}
function ldRm() {
    const rm = fdRm();
    coins = [];
    scene.rm(...plrBuls);
    plrBuls.splice(0);
    if(rm) {
        if(rm.e.length) scene.add(...rm.e);
        else ldExs();
        if(rm.welt) {
            rm.welt.filter(r => objIs(r, Shop)).forEach(r => r.add());
            rm.welt.filter(r => !objIs(r, Shop)).forEach(r => scene.add(r));
        }
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
function melGenr(x: number, y: number, rot: number, collide: (e: Entity) => void, spd: number) {
    return new BulletObject({ x, y, rot, height: 25, width: 4, scene, color: "#a7a7a7", collide, extLeft: 0, extRight: scene.width, extTop: 0, extBtm: scene.height, spd });
}

abstract class WorldObj extends Entity {
    a: WorldObj[];
    constructor(x: number, y: number, width: number, height: number, col: (e: Entity) => void, render: Function, a: WorldObj[], auto = true, verif?: (e: Entity) => boolean) {
        super({ x, y, width, height, color: invis, collide: (e) => {
            if(e == plr && ((verif ?? (() => true))(e))) {
                this.rm();
                col(e);
            }
        }, render });
        this.a = a;
        if(auto) this.add();
    }
    rm() {
        scene.rm(this);
        this.a.splice(this.a.indexOf(this), 1);
    }
    add() {
        scene.add(this);
        this.a.push(this);
    }
}
var coins: Coin[] = [];
class Coin extends WorldObj {
    static img: Img = new Img("coin.png");
    constructor(x: number, y: number) {
        super(x, y, 10, 10, () => stat.mon++, () => this.rend(), coins);
        this.use("enhancedphys", { scene });
        const dir = Angle.toVector(Angle.rad(random(0, 361)));
        const v = 60;
        dir.scale(random(-v, v+1));
        this.lerp("pos", scene, new Vector(this.x + dir.x, this.y + dir.y), "once", 0.25);
    }
    rend() {
        scene.img(Coin.img, this.x, this.y, this.width, this.height);
    }
}
var shop: Shop[] = [];
class Shop extends WorldObj {
    img: Img;
    constructor(x: number, y: number, cost: number, spr: string) {
        super(x, y, 20, 20, () => { stat.mon -= cost; stat.perks.push(this); }, () => this.rend(), shop, false, () => stat.mon >= cost);
        this.img = new Img(spr);
    }
    rend() {
        scene.img(this.img, this.x, this.y, this.width, this.height);
    }
}
function ShopEx(x: number, y: number) { return new Shop(x, y, 1, "coin.png"); }
// genRms();
// ldRm();

const ovr = new SceneUI({ scene, w: scene.width, h: scene.height, color: "#000c49" });
function btn(click: Function, y: number, tx: string, x = 0, tex = 0) {
    const b = new ButtonUI({ scene, w: 200, h: 75, styles: {
        idle: "#00868a",
        hover: "#bc0b0b",
        click: "#7a0707"
    }, x: ovr.width / 2 - 100 - x, y: ovr.height / 2 - 50 + y, click });
    b.addChild(new TextUI({ scene, tx, x: b.width / 2 - 75 - tex, y: b.height / 2 }));
    return b;
}
const ssStartBtn = btn(() => {
    // genRms();
    // const r = fdRm(new Vector());
    // // remove all enemies from first room
    // if(r) r.e = [];
    worldInit();
    ldRm();
    hideSS();
    hideOvr();
    gmRn = true;
}, 0, "Enter The Dungeon");
const shopBtn = btn(showShop, 100, "Shop", 0, -50);
const treeBtn = btn(showTree, 200, "Tree", 0, -50);
const shopBk = btn(hideShop, 300, "Back", 230);
const treeBk = btn(hideTree, 300, "Back", 230);
const heroUIImg = new ImgUI({ img: pss[0][0], scene, x: scene.width - 100, y: 100, w: size * 5, h: size * 5, color: invis });
const heroUIImgBtn = new ButtonUI({ scene, color: invis, x: heroUIImg.x, y: heroUIImg.y, w: heroUIImg.width, h: heroUIImg.height, click: showHero });
const heroBk = btn(hideHero, 200, "Back", 50);
const heroUISet: [ImgUI, TextUI, /*TextUI,*/ ButtonUI][] = [];
const columns = 3;
const spacingX = 250;
const spacingY = 40;
for(let i = 0; i < heroSet.length; i++) {
    const h = heroSet[i];
    const col = i % columns;
    const row = Math.floor(i / columns);
    const w = size * 5;
    const x = col * (w + spacingX);
    const y = row * (w + spacingY + 100);
    const ix = x + 27;
    const iy = y + 20;
    heroUISet.push([
        new ImgUI({ img: new Img(h.path + "/" + h.ico + ".png"), scene, x: ix, y: iy, w, h: w, color: invis }),
        new TextUI({ scene, x: x + w / 2, y: y + w + 50, tx: h.nm }),
        //new TextUI({ scene, x: x + w / 2, y: y + w + 100, tx: h.ds }),
        new ButtonUI({ scene, x: ix, y: iy, w, h: w, color: invis, click: () => {
                hero = h;
                applyPSS();
            } })
    ]);
}
function showShop() {
    hideSS();
    showOvr();
    scene.addUI(shopBk);
}
function hideShop() {
    scene.rmUI(shopBk);
    showSS();
}
interface Tree {
    nm: string;
    ico: string;
    fx: () => void;
}
const trees: Tree[] = [
    { nm: "hi", ico: "tree", fx: () => {} }
] as const;
const treeUIs: [ImgUI, TextUI][] = [];
const arwu = new ImgUI({ scene, img: new Img("icons/uparrow.png"), x: scene.width - 100, y: scene.height - 100, w: 50, h: 50 });
const arwub = new ButtonUI({ scene, x: scene.width - 100, y: scene.height - 100, w: 50, h: 50, click: () => treeUIs.forEach(x => x.forEach(y => y.y += 5)) });
const arwd = new ImgUI({ scene, img: new Img("icons/downarrow.png"), x: scene.width - 100, y: scene.height - 170, w: 50, h: 50 });
const arwdb = new ButtonUI({ scene, x: scene.width - 100, y: scene.height - 170, w: 50, h: 50, click: () => treeUIs.forEach(x => x.forEach(y => y.y -= 5)) });
for(let i = 0; i < trees.length; i++) {
    const t = trees[i];
    const y = 100 + i * 80; // Added top offset so items don't render off-screen at y=0
    const imgUI = new ImgUI({ img: new Img(`perks/${t.ico}.png`), scene, x: scene.width / 2 - 25, y, w: 50, h: 50 });
    const textUI = new TextUI({ scene, x: scene.width / 2 + 1, y: y + 55, tx: t.nm });
    treeUIs.push([imgUI, textUI]);
}
function showTree() {
    hideSS();
    showOvr();
    scene.addUI(treeBk, arwu, arwub, arwd, arwdb);
    treeUIs.forEach(x => scene.addUI(...x));
}
function hideTree() {
    scene.rmUI(treeBk, arwu, arwub, arwd, arwdb);
    treeUIs.forEach(x => scene.rmUI(...x));
    showSS();
}
function showHero() {
    hideSS();
    showOvr();
    scene.addUI(heroBk);
    heroUISet.forEach(x => scene.addUI(...x));
}
function hideHero() {
    scene.rmUI(heroBk);
    heroUISet.forEach(x => scene.rmUI(...x));
    applyPSS();
    showSS();
}
scene.font = "16px Comic Sans MS";
function showOvr() {
    scene.addUI(ovr);
}
function hideOvr() {
    scene.rmUI(ovr);
}
const ssBtns = [ssStartBtn, shopBtn, treeBtn, heroUIImg, heroUIImgBtn];
function hideSS() {
    hideOvr();
    scene.rmUI(...ssBtns);
}
function showSS() {
    showOvr();
    scene.addUI(...ssBtns);
}
showSS();
function gss() {
    showOvr();
    gmRn = false;
    const hideAll = () => {
        hideOvr();
        scene.rmUI(b, b2, ...s);
    }
    const b = btn(() => {
        hideAll();
        worldInit();
    }, 120, "Continue");
    const b2 = btn(() => {
        hideAll();
        showSS();
    }, 200, "Main Menu");
    const s = genStatText(rStat);
    scene.addUI(...s, b, b2);
    rStat = resetRS();
}
interface RunStat {
    kill: number;
    hpl: number;
    hpg: number;
    dmg: number;
    me: number;
    ms: number;
}
function genStatText(s: RunStat) {
    const out: TextUI[] = [];
    const e = Object.entries(s);
    for(let i = 0; i < e.length; i++) {
        const [ka, v]: [string, RunStat[keyof RunStat]] = e[i];
        const k = ka as keyof RunStat;
        out.push(new TextUI({ scene, tx: `${k == "kill" ? "Kills" : k == "hpl" ? "Health Lost" : k == "hpg" ? "Health Gained" : k == "dmg" ? "Damage" : k == "me" ? "Money Earned" : k == "ms" ? "Money Spent" : "unknown"}: ${v}`, x: 100, y: 50 + i * 50 }));
    }
    return out;
}

var gmRn = false;

function nextSave() {
    Local.set("lst", (new Date()).toISOString());
    lst.textContent = Local.get("lst") ?? "never";
}
function lclSave() {
    Local.set("stat", stat);
    nextSave();
}
function pcSave() {
    (new FilePicker()).handle({ accept: [{ accept: { "text/json": [".json"] } }], all: false, mult: false })
        .then(h => h[0])
        .then(h => h.createWritable())
        .then(w => {
            w.write(JSON.stringify(stat));
            return w;
        })
        .then(w => w.close());
    nextSave();
}
// leave this cmtd until testing
// pcSave();

const plrBuls: BulletObject[] = [];

scene.add(plr);
scene.on("click", () => {
    if(!gmRn) return;
    hero.atk();
});
scene.start(() => {
    scene.bg("#003764");
    coins.forEach(c => c.render());
    shop.forEach(s => s.render());
    // failsafe for y going over anyway
    if(gsi.y >= pss[gsi.x].length) gsi.y = 0;
    try {
        scene.img(pss[gsi.x][gsi.y], plr.x, plr.y, plr.width, plr.height);
    } catch(e) {
        if(objIs(e, TypeError)) {
            console.warn(`Scene Sprite Rendering Error:\n${e.message}\n${e.stack}\nValues at time:\nx=${gsi.x}, y=${gsi.y}\nsheets=${pss.length}`);
        } else console.error(e);
    }
    if(gsi.x == hero.spr.length - 1 && gsi.y == pss[gsi.x].length - 1) {
        setTimeout(gss, 1000);
    }
    dispStat();
    // TEST ONLY
    // scene.img(pss[gsi.x][gsi.y], 70, scene.height - 70, 50, 50);
});
