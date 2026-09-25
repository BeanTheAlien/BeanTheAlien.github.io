import { DebugRay, Entity, objIs, PlayableCharacter, Scene, Vector, BulletObject, Angle, Raycast, Cooldown, random, Img, chance, ButtonUI, SceneUI, TextUI, Local, FilePicker, ImgUI, isCol, randItem, mulberry32, mulberrySeed, randomx } from "../../phantom2d.js";
Img.config.set("root", "assets");
//window.addEventListener("error", (e) => alert(`${e.message}, ${e.lineno}`))
// Local.del("stat");
/**
 * TODO:
 * shop
 * objects that block vision
 * sprites
 * game init func
 * fix cont / mm
 * mulberry random
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
     * Permanent game skills.
     */
    dskill: DTree[];
    /**
     * Adventure points (AP). Used to level up skills.
     */
    ap: number;
    /**
     * Shot count. How many times to repeat attack.
     */
    sc: number;
    /**
     * Purchased and unlocked weapons.
     */
    armory: Weapon[];
    /**
     * Bullet count. How many bullets to fire per shot.
     */
    bc: number;
}
type VoidFunc = () => void;
const nextXP = () => Math.floor(Math.pow(stat.lvl, 1.85)) + 1;
const parseStat = () => JSON.parse(Local.get("stat") ?? `{ "xp": 0, "lvl": 1, "dmg": 1, "spd": 3, "bspd": 4, "hp": 5, "mhp": 5, "crit": 0, "luck": 0, "armor": 0, "dodge": 0, "mon": 0, "perks": [], "skill": [], "dskill": [], "ap": 0, "sc": 1, "armory": [], "bc": 0 }`, (k, v) => {
    return typeof v == "string" && (v.startsWith("function") || v.includes("=>")) ? eval(v) : v;
}) as Stat;
var stat: Stat = parseStat();
function dodged() {
    return stat.dodge && chance(stat.dodge);
}
function pHeal(x: number) {
    plr.comp("health").heal(x);
    stat.hp = plr.comp("health").hp;
}
const statDisp = document.getElementById("stat-disp") as HTMLDivElement;
statDisp.style.whiteSpace = "pre-wrap";
const lst = document.getElementById("lst") as HTMLDivElement;
lclSave();
const lsB = document.getElementById("ls") as HTMLButtonElement;
lsB.addEventListener("click", lclSave)
const pcsB = document.getElementById("pcs") as HTMLButtonElement;
pcsB.addEventListener("click", pcSave);
const clsB = document.getElementById("cls") as HTMLButtonElement;
clsB.addEventListener("click", () => {
    Local.del("stat");
    stat = parseStat();
    // force a clean load
    window.location.reload();
});
const sdv = document.getElementById("seed-view") as HTMLDivElement;
const ldB = document.getElementById("ld") as HTMLButtonElement;
ldB.addEventListener("click", () => {
    // force in-dungeon
    if(!gmRn) return;
    gss();
    // ran for cleanup
    // (theoretically, player could "leave" in room with enemies)
    // (process would still be running, and player could die)
    // (would dupe call gss)
    rooms.splice(0);
});
function dispStat() {
    const none = (a: any[]) => !a.length ? "none" : a;
    statDisp.textContent = `Level ${stat.lvl} (${stat.xp} / ${nextXP()} xp)\n
Damage: ${stat.dmg} (crit ${stat.crit})\n
Health: ${stat.hp} (max ${stat.mhp})\n
Armor: ${stat.armor} (dodge: ${stat.dodge})\n
Speed: ${stat.spd} / B-speed: ${stat.bspd}\n
Luck: ${stat.luck}\n
Money: ${stat.mon}\n
Perks: ${none(stat.perks.map(s => s.nm))}\n
Skills: ${none(stat.skill)}\n
DSkill: ${none(stat.dskill.map(x => x.nm))}\n
Armory: ${none(stat.armory.map(x => x.nm))}\n
Bullet Count: ${stat.bc}\n
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
const getDSkillType = (typ: DTreeExecutionScope) => stat.dskill.filter(x => x.sp == typ);
const getDSkillRType = <T extends boolean>(typ: DTreeExecutionScope, r: T) => getDSkillType(typ).filter(x => x.rf == r) as (T extends true ? RefutableDTree : NonRefutableDTree)[];
const sHealthOpts = (hp: number, onDie: Function, controller: Vector, idleFrm: number, painFrm: () => number, invince?: BObj) => {
    return { hp, onDie, onHurt: () => {
        if(pDed || (invince && !invince.v)) return;
        if(getDSkillRType("hurt", true).some(x => x.fn())) return;
        controller.x = painFrm();
        setTimeout(() => {
            if(!pDed) controller.x = idleFrm;
        }, 125);
        stat.hp = plr.comp("health").hp;
        getDSkillRType("hurt", false).forEach(x => x.fn());
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
window.addEventListener("keypress", (e) => {
    if(e.code == "Slash") {
        const cheat = (prompt("Enter a cheat:") ?? "").split(" ").map(x => x.trim());
        const cheats = [
            "earn",
            "give"
        ] as const;
        const [ch, ...arg] = [cheat[0] as (typeof cheats)[number], ...cheat.slice(1)];
        if(ch == "earn") {
            stat.mon += Number(arg[0]);
        } else if(ch == "give") {
            const w = wepSet.find(wp => wp.cn == arg[0]);
            if(w) {
                stat.armory.push(w);
            }
        }
    }
});
var pDed = false;
var gssQue = false;
var worldSeed: number | null = null;
var worldMul: (() => number) | null = null;
function worldInit() {
    scene.unfollow();
    rooms.forEach(rm => {
        scene.rm(...rm.exit, ...rm.e);
        rm.e.filter(e => objIs(e, GunEnemy)).forEach(e => scene.rm(...e.bls));
        scene.rm(...(rm.welt ?? []));
    });
    scene.rm(...plrBuls, ...coins);
    plrBuls.splice(0);
    coins = [];
    shop = [];
    // cleanup shop skills
    stat.perks.forEach(s => s.clean());
    stat.perks = [];
    noSFU();
    fps = 5;
    sfu = setSFU();
    plr.x = 50;
    plr.y = 50;
    pDed = false;
    gssQue = false;
    pCanHurt.v = true;
    plr.comp("health").hp = stat.mhp;
    stat.hp = stat.mhp;
    gsi = new Vector();
    plr.setMoveMode("move");
    gmRn = true;
    worldSeed = mulberrySeed();
    worldMul = mulberry32(worldSeed);
    sdv.textContent = `Seed: ${worldSeed}`;
    genRms();
    ldRm();
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
    if(getDSkillRType("die", true).some(x => x.fn())) return;
    pDed = true;
    getDSkillRType("die", false).forEach(x => x.fn());
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
    ao?: Function;
    dw: Weapon;
}
type WeaponCategory = "ps" | "st" | "rf" | "sp" | "sw";
interface Weapon {
    typ: WeaponCategory;
    ch: (typeof heroSet)[number]["nm"];
    dmg: number;
    bul: number;
    bspd: number;
    wg: number;
    ico: string;
    nm: string;
    cn: string;
    fs: number;
}
interface Pistol extends Weapon {
    typ: "ps";
}
interface Shotgun extends Weapon {
    typ: "st";
}
interface Rifle extends Weapon {
    typ: "rf";
}
interface Special extends Weapon {
    typ: "sp";
    atk: Function;
}
interface Sword extends Weapon {
    typ: "sw";
}
const createWepFunc = <T extends WeaponCategory, K extends (T extends "ps" ? Pistol : T extends "st" ? Shotgun : T extends "rf" ? Rifle : T extends "sp" ? Special : T extends "sw" ? Sword : never), O extends (K extends Special ? Function : undefined)>(typ: T) => {
    return (nm: string, cn: string, ch: ActualCharName, dmg: number, wg: number, bspd: number, bul: number, fs: number, ico: string, ovr = undefined as O) => {
        const __core = { nm, cn, ch, dmg, wg, bspd, fs, bul, ico, typ } as K;
        if(typ != "sp") return __core;
        return { ...__core, atk: ovr } as K;
    }
}
const wepPistol = createWepFunc("ps");
const wepSword = createWepFunc("sw");
const wepSpecial = createWepFunc("sp");
const buller = (func: (...args: any[]) => BulletObject, cnt: number, rot: () => number, life: number, spd: number, includeBC: boolean, then?: Function) => {
    for(let j = 0; j < stat.sc; j++) for(let i = 0; i < cnt + (includeBC ? stat.bc : 0); i++) {
        const o = func(plr.x, plr.y, rot(), (e: Entity) => { if(objIs(e, Enemy)) { e.comp("health").hurt(stat.crit && chance(stat.crit) ? stat.dmg * 2 : stat.dmg); scene.rm(o); } }, spd);
        scene.add(o);
        plrBuls.push(o);
        o.expire(life, scene);
        then?.();
    }
}
const heroGun = (shots: number, roff: number, life = 5000, then?: Function) => buller(bulGenr, shots, () => Angle.roff(scene.rotToMouse(plr), roff), life, stat.bspd, true, then);
const heroMel = (swings: number, life = 90, then?: Function) => buller(melGenr, swings, () => scene.rotToMouse(plr), life, stat.bspd * 1.5, false, then);
const heroRayGun = (roff: number, then?: Function) => buller(rayGenr, 30, () => Angle.roff(scene.rotToMouse(plr), roff), 500, stat.bspd * 5, false, then);
const heroFlamer = (then?: Function) => buller(fireGenr, 50, () => Angle.roff(scene.rotToMouse(plr), 30), 50, stat.bspd * 5, false, then);
const heroBeam = (then?: Function) => buller(beamGenr, 25, () => Angle.rad(random(0, 361)), 500, stat.bspd * 3.5, true, then);
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
    atk: () => heroGun(1, 0),
    dw: wepPistol("Generic Pistol", "generic", "gunfred", 0, 0, 0, 0, 200, "pistol")
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
    atk: () => heroMel(1),
    dw: wepSword("Generic Sword", "generic", "george", 0, 0, 0, 0, 200, "knife")
} as const;
const heroSet = [
    heroGunFred,
    heroGeorge
] as const;
type ActualCharName = "gunfred" | "george";
const wepSet = [
    wepPistol("KelTec P32", "keltec", "gunfred", 0, -1.25, 0, 0, 200, "p250"),
    wepPistol("SIG Sauer P250", "p250", "gunfred", 1, 0, -0.05, 0, 200, "p250"),
    wepPistol("Desert Eagle", "deagle", "gunfred", 3, 0.5, 0, 0, 200, "deagle"),
    wepSpecial("Raygun", "ray", "gunfred", 0, 0, 0, 0, 30, "raygun", () => heroRayGun(5)),
    wepSpecial("Flamethrower", "flame", "gunfred", 0, 0, 0, 0, 10, "flamethrower", () => heroFlamer()),
    wepSpecial("Wrath Sword", "wrathsword", "george", 3, 0, 0, 3, 180, "wrathsword", () => heroMel(3, undefined, () => {
        const v = Angle.toVector(scene.rotToMouse(plr));
        v.scale(1.65);
        v.add(plr.getPos());
        plr.setPos(v);
    })),
    wepSpecial("Annihilator", "anh", "gunfred", 0, -2, 5, 0, 300, "anher", () => heroBeam())
] as const;
var eqWep: Weapon = wepSet[0];
const equip = (wep: Weapon) => {
    stat.dmg -= eqWep.dmg;
    stat.bspd -= eqWep.bspd;
    stat.sc -= eqWep.bul;
    stat.spd += eqWep.wg;
    hero.ao = undefined;
    eqWep = wep;
    stat.dmg += eqWep.dmg;
    stat.bspd += eqWep.bspd;
    stat.sc += eqWep.bul;
    stat.spd -= eqWep.wg;
    if(wep.typ == "sp") {
        hero.ao = (wep as Special).atk;
    }
}
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
        if(getDSkillRType("kill", true).some(x => x.fn())) return;
        const rm = this.rs();
        for(let i = 0; i < random(1, 5); i++) {
            new Coin(this.x, this.y);
        }
        if(rm?.e.length == 0) ldExs();
        stat.xp += this.val;
        if(stat.xp >= nextXP()) {
            stat.xp -= nextXP();
            stat.lvl++;
            stat.ap++;
        }
        getDSkillRType("kill", false).forEach(x => x.fn());
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
        super(x, y, 1, 2, "#be2b2b", 5, 1, 3, 500, 10, () => {}, 5);
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
        stat.mon += 5;
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
class ShottyEnemy extends CoreGunEnemy {
    constructor(x: number, y: number) {
        super(x, y, 1, 2, "#f8a025", 3, 1, 1.25, 600, 20, () => {}, 6);
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
function LeftExit() { return new Exit(0, scene.height / 2, 0, new Vector(-1, 0), new Vector(scene.width - 50, scene.height / 2)); }
function RightExit() { return new Exit(scene.width - 5, scene.height / 2, 0, new Vector(1, 0), new Vector(50, scene.height / 2)); }
function TopExit() { return new Exit(scene.width / 2, 0, Angle.rad(90), new Vector(0, 1), new Vector(scene.width / 2, scene.height - 50)); }
function BtmExit() { return new Exit(scene.width / 2, scene.height - 15, Angle.rad(90), new Vector(0, -1), new Vector(scene.width / 2, 50)); }

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
    const ec = [BasicMeleeEnemy, BasicGunEnemy, BulletSprayGunEnemy, SprintMeleeEnemy, ShottyEnemy] as const;
    const out: (new (...arg: any[]) => Enemy)[] = [];
    for(let i = 0; i < random(1, 6); i++) out.push(ec[randomx(worldMul as (() => number), 0, ec.length)]);
    return out;
}
function getBossCtor() {
    const bc = [BulkBoss, SprinterBoss] as const;
    return bc[randomx(worldMul as (() => number), 0, bc.length)];
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

        const dir = available[randomx(worldMul as (() => number), 0, available.length)];

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
        const tag: RoomTag = (chance(bc) && i > 2 && !bcg) || (i == cord.length - 1 && !bcg) ? "boss" : (chance(sc) && !scg && i > 0) ? "shop" : "nm";
        rooms.push({ at: c, e: genEnemyCtors().map(c => {
            const x = new c(0, 0);
            const rp = () => new Vector(random(0, scene.width - x.width), random(0, scene.height - x.height));
            x.setPos(rp());
            while(isCol(x, plr)) x.setPos(rp());
            return x;
        }), exit: getRmExits(c, cord), tg: tag });
        // if(tag != "shop") sc++;
        // else sc = 5;
        if(tag == "boss") bcg = true;
        else if(tag == "shop") scg = true;
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
    console.assert(!rooms.some(r => r.tg == "shop"), "shop:", rooms.find(r => r.tg == "shop")?.at.x, ",", rooms.find(r => r.tg == "shop")?.at.y);
}
function locateRoom(room: RoomTag) {
    const rm = (r: Room) => r.tg == room;
    const r = rooms.find(rm) as Room;
    console.assert(!rooms.some(rm), room + ":", r.at.x + ", " + r.at.y);
}
function genShop() {
    const ctor: ((x: number, y: number) => Shop)[] = [ShopEx, ShopArmor, ShopDmg];
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
    const pr = fdRm();
    if(pr) {
        pr.e.filter(e => objIs(e, GunEnemy)).forEach(e => scene.rm(...e.bls));
    }
    const rm = fdRm();
    scene.rm(...coins);
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
const __stdBG = (width: number, height: number, color: string) => {
    return (x: number, y: number, rot: number, collide: (e: Entity) => void, spd: number) => new BulletObject({ x, y, rot, width, height, scene, color, collide, extLeft: 0, extRight: scene.width, extTop: 0, extBtm: scene.height, spd });
}
const bulGenr = __stdBG(18, 6, "#e2e603");
const melGenr = __stdBG(4, 25, "#a7a7a7");
const rayGenr = __stdBG(20, 10, "#9400c1");
const fireGenr = __stdBG(10, 10, "#d40e0e");
const beamGenr = __stdBG(5, 5, "#27bcc2");

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
type ShopDeclarerType = "st" | "dt";
interface StatControllingShop {
    on: VoidFunc;
    off: VoidFunc;
}
class Shop extends WorldObj {
    img: Img;
    nm: string;
    clean: VoidFunc;
    constructor(x: number, y: number, cost: number, spr: string, name: string, typ: "st", effect: VoidFunc, cleanup: VoidFunc);
    constructor(x: number, y: number, cost: number, spr: string, name: string, typ: "st", scs: StatControllingShop);
    constructor(x: number, y: number, cost: number, spr: string, name: string, typ: "dt", dtree: DTree);
    constructor(x: number, y: number, cost: number, spr: string, name: string, typ: ShopDeclarerType, fx?: VoidFunc | DTree | StatControllingShop, cleanup?: VoidFunc) {
        super(x, y, 20, 20, () => {
            stat.mon -= cost;
            stat.perks.push(this);
            if(typ == "st") {
                if(fx && "on" in fx) fx.on();
                else (fx as VoidFunc)();
            } else {
                stat.dskill.push(fx as DTree);
            }
        }, () => this.rend(), shop, false, () => stat.mon >= cost);
        this.img = new Img(spr + ".png");
        this.clean = typ == "dt" && !!cleanup ? () => {
            stat.dskill.splice(stat.dskill.indexOf(fx as DTree), 1);
        } : (typ == "st" ? ((fx as StatControllingShop).off) : cleanup as VoidFunc);
        this.nm = name;
    }
    rend() {
        scene.img(this.img, this.x, this.y, this.width, this.height);
    }
}
type AbsoluteSCSMakerChanger = "a" | "s";
function SCSMaker<T extends keyof Stat, K extends Stat[T]>(k: T, v: K, f: AbsoluteSCSMakerChanger = "a") {
    return { on: () => stat[k] = ((stat[k] as number) + (f == "a" ? (v as number) : -(v as number))) as Stat[T], off: () => stat[k] = ((stat[k] as number) + (f == "a" ? -(v as number) : (v as number))) as Stat[T] };
}
function ShopEx(x: number, y: number) { return new Shop(x, y, 1, "coin", "test", "st", () => alert("H{WE{IOWE[EWFPOIFEWI{EWF{OWFE[oWFEo[kfEW"), () => {}); }
function ShopArmor(x: number, y: number) { return new Shop(x, y, 3, "coin", "Shield Potion", "st", SCSMaker("armor", 3)); }
function ShopDmg(x: number, y: number) { return new Shop(x, y, 5, "coin", "Damage Potion", "st", SCSMaker("dmg", 1)); }
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
    hideSS();
    hideOvr();
    gmRn = true;
}, 0, "Enter The Dungeon");
const shopBtn = btn(showShop, 100, "Shop", 0, -50);
const treeBtn = btn(showTree, 200, "Tree", 0, -50);
const shopBk = btn(hideShop, 300, "Back", 230);
const treeBk = btn(hideTree, 300, "Back", 230);
const armBtn = btn(showArmory, 300, "Armory", 0, -50);
const armBk = btn(hideArmory, 300, "Back", 230);
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
interface Purchase {
    nm: string;
    path: string;
    ico: string;
    ct: number;
    fx: VoidFunc;
    rr: number;
}
const pchsWep = (cat: WeaponCategory, inWeaponName: string) => stat.armory.push(wepSet.filter(w => w.typ == cat).find(w => w.cn == inWeaponName) as Weapon);
const gradedWepFn = (rr: number) => (nm: string, ico: string, desc: WeaponCategory, cn: string, ct: number, _rr = rr) => {
    return { nm, path: "weapons", ico, ct, fx: () => pchsWep(desc, cn), rr: _rr };
}
const comWep = gradedWepFn(50);
const ucomWep = gradedWepFn(40);
const rareWep = gradedWepFn(20);
const epicWep = gradedWepFn(10);
const supWep = gradedWepFn(5);
const pchs: Purchase[] = [
    supWep("Raygun", "raygun", "sp", "ray", 50),
    supWep("Flamethrower", "flamethrower", "sp", "flame", 100),
    ucomWep("SIG Sauer P250", "p250", "ps", "p250", 20),
    epicWep("Desert Eagle", "deagle", "ps", "deagle", 20),
    rareWep("KelTec P32", "p250", "ps", "keltec", 15),
    supWep("Wrath Sword", "wrathsword", "sp", "wrathsword", 50),
    supWep("Anhiliator", "anher", "sp", "anh", 50)
] as const;
const pchsUI: SceneUI[][] = [];
const shopRFB = btn(() => {
    if(stat.mon >= 5) {
        stat.mon -= 5;
        pchsUI.forEach(p => scene.rmUI(...p));
        pchsUI.splice(0);
        hideShop();
        showShop();
    }
}, 300, "Refresh", -50);
function newPchUIs() {
    if(pchsUI.length) return;
    const pchsOut: Purchase[] = [];
    const pass = () => pchs.find(p => chance(p.rr));
    for(let i = 0; i < 5; i++) {
        var out;
        do {
            out = pass();
        } while(!out);
        pchsOut.push(out);
    }
    for(let i = 0; i < pchsOut.length; i++) {
        const p = pchsOut[i];
        const col = i % 5;
        const w = size * 5;
        const x = col * (w + 100);
        const y = scene.height / 2 - w;
        const ix = x + 27;
        const iy = y + 20;
        const uis = [
            new ImgUI({ img: new Img(p.path + "/" + p.ico + ".png"), scene, x: ix, y: iy, w, h: w, color: invis }),
            new TextUI({ scene, x: x + w / 2, y: y + w + 50, tx: p.nm }),
            new TextUI({ scene, x: x + w / 2, y: y + w + 75, tx: String(p.ct) }),
            new ButtonUI({ scene, x: ix, y: iy, w, h: w, color: invis, click: () => {
                if(stat.mon >= p.ct) {
                    stat.mon -= p.ct;
                    p.fx();
                    scene.rmUI(...uis);
                    pchsUI.splice(pchsUI.indexOf(uis), 1);
                }
            } })
        ];
        pchsUI.push(uis);
    }
}
function showShop() {
    hideSS();
    showOvr();
    scene.addUI(shopBk);
    newPchUIs();
    pchsUI.forEach(x => scene.addUI(...x));
    scene.addUI(shopRFB);
}
function hideShop() {
    scene.rmUI(shopBk, shopRFB);
    pchsUI.forEach(x => scene.rmUI(...x));
    hideOvr();
    showSS();
}
const armoryUI: SceneUI[][] = [];
function showArmory() {
    hideSS();
    showOvr();
    scene.addUI(armBk);
    const ws = [hero.dw, ...stat.armory.filter(w => w.ch == hero.path)];
    armoryUI.splice(0);
    for(let i = 0; i < ws.length; i++) {
        const h = ws[i];
        const col = i % columns;
        const row = Math.floor(i / columns);
        const w = size * 5;
        const x = col * (w + spacingX);
        const y = row * (w + spacingY + 100);
        const ix = x + 27;
        const iy = y + 20;
        armoryUI.push([
            new ImgUI({ img: new Img("weapons/" + h.ico + ".png"), scene, x: ix, y: iy, w, h: w, color: invis }),
            new TextUI({ scene, x: x + w / 2, y: y + w + 50, tx: h.nm }),
            //new TextUI({ scene, x: x + w / 2, y: y + w + 100, tx: h.ds }),
            new ButtonUI({ scene, x: ix, y: iy, w, h: w, color: invis, click: () => equip(h) })
        ]);
    }
    armoryUI.forEach(a => scene.addUI(...a));
}
function hideArmory() {
    scene.rmUI(armBk);
    armoryUI.forEach(a => scene.rmUI(...a));
    hideOvr();
    showSS();
}
type TreeSkillType = "sk" | "gm";
interface Tree {
    nm: string;
    ico: string;
    fx: VoidFunc;
    ct: number;
    typ: TreeSkillType;
    sp?: DTreeExecutionScope;
    rf?: boolean;
}
type DTreeExecutionScope = "hurt" | "die" | "kill";
interface DTree<T extends void | boolean = void> {
    nm: string;
    fn: () => T;
    sp: DTreeExecutionScope;
    rf: boolean;
}
interface NonRefutableDTree extends DTree<void> {}
interface RefutableDTree extends DTree<boolean> {}
const trees: Tree[] = [
    { nm: "Phoenix's Grace", ico: "phoneix", ct: 5, fx: () => chance(5), typ: "gm", sp: "die", rf: true },
    { nm: "Lifestal", ico: "lifestal", ct: 10, fx: () => pHeal(1), typ: "gm", sp: "kill", rf: false }
] as const;
const treeUIs: [SceneUI, ImgUI, ButtonUI, TextUI][] = [];
const arwu = new ImgUI({ scene, img: new Img("icons/uparrow.png"), x: scene.width - 100, y: scene.height - 100, w: 50, h: 50 });
const shift = 15;
const arwub = new ButtonUI({ scene, x: scene.width - 100, y: scene.height - 100, w: 50, h: 50, click: () => treeUIs.forEach(x => x.forEach(y => y.y += shift)) });
const arwd = new ImgUI({ scene, img: new Img("icons/downarrow.png"), x: scene.width - 100, y: scene.height - 170, w: 50, h: 50 });
const arwdb = new ButtonUI({ scene, x: scene.width - 100, y: scene.height - 170, w: 50, h: 50, click: () => treeUIs.forEach(x => x.forEach(y => y.y -= shift)) });
for(let i = 0; i < trees.length; i++) {
    const t = trees[i];
    const rfc = <T extends string[] | DTree[]>(src: T, array: (x: T[number]) => boolean) => !!src.find(array) ? "#056700" : invis;
    const rfc1 = () => rfc(stat.skill, x => x == t.nm);
    const rfc2 = () => rfc(stat.dskill, x => x.nm == t.nm);
    const y = 100 + i * 125; // Added top offset so items don't render off-screen at y=0
    const backr = new SceneUI({ scene, x: scene.width / 2 - 32.5, y: y - 7.5, w: 65, h: 65, color: rfc(stat.skill, x => x == t.nm) });
    const ix = scene.width / 2 - 25;
    const imgUI = new ImgUI({ img: new Img(`perks/${t.ico}.png`), scene, x: ix, y, w: 50, h: 50 });
    const btnUI = new ButtonUI({ scene, x: ix, y, w: 50, h: 50, color: invis, click: () => {
        if(stat.ap < t.ct) return;
        stat.ap -= t.ct;
        if(t.typ == "sk") {
            // prevent re-appensions
            if(stat.skill.find(x => x == t.nm)) return;
            t.fx();
            stat.skill.push(t.nm);
            backr.color = rfc1();
        } else if(t.typ == "gm") {
            // prevent re-appensions
            if(stat.dskill.find(x => x.nm == t.nm)) return;
            stat.dskill.push({ nm: t.nm, fn: t.fx, sp: t.sp as DTreeExecutionScope, rf: t.rf as boolean });
            backr.color = rfc2();
        }
    } });
    const textUI = new TextUI({ scene, x: scene.width / 2 - 5, y: y + 85, tx: t.nm });
    treeUIs.push([backr, imgUI, btnUI, textUI]);
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
    hideOvr();
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
const ssBtns = [ssStartBtn, shopBtn, treeBtn, heroUIImg, heroUIImgBtn, armBtn];
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
    sdv.textContent = "";
    return out;
}

var gmRn = false;

function nextSave() {
    Local.set("lst", (new Date()).toISOString());
    lst.textContent = Local.get("lst") ?? "never";
}
function statString() {
    return JSON.stringify(stat, (k, v) => typeof v == "function" ? v.toString() : v);
}
function lclSave() {
    Local.set("stat", statString());
    nextSave();
}
// start local autosave
setInterval(lclSave, 60000);
// save properly before closing
window.addEventListener("close", lclSave);
function pcSave() {
    (new FilePicker()).handle({ accept: [{ accept: { "text/json": [".json"] } }], all: false, mult: false })
        .then(h => h[0])
        .then(h => h.createWritable())
        .then(w => {
            w.write(statString());
            return w;
        })
        .then(w => w.close());
    nextSave();
}
// leave this cmtd until testing
// pcSave();

const plrBuls: BulletObject[] = [];

scene.add(plr);
var sceneClickFunc = () => {
    if(!gmRn) return;
    if(hero.ao) hero.ao();
    else hero.atk();
}
var sceneMDI = -1;
scene.on("click", sceneClickFunc);
scene.on("mousedown", () => sceneMDI = setInterval(sceneClickFunc, eqWep.fs));
scene.on("mouseup", () => clearInterval(sceneMDI));
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
    if(gsi.x == hero.spr.length - 1 && gsi.y == pss[gsi.x].length - 1 && !gssQue) {
        gssQue = true;
        setTimeout(gss, 1000);
    }
    dispStat();
    // TEST ONLY
    // scene.img(pss[gsi.x][gsi.y], 70, scene.height - 70, 50, 50);
});
