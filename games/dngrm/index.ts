import { DebugRay, Entity, objIs, PlayableCharacter, Scene, Vector, BulletObject, Angle, Raycast, Cooldown, random, Img, chance, ButtonUI, SceneUI, TextUI, Local, FilePicker } from "../../phantom2d.js";
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
interface Stat {
    xp: number;
    lvl: number;
    dmg: number;
    spd: number;
    bspd: number;
    hp: number;
    mhp: number;
    crit: number;
    luck: number;
    armor: number;
    dodge: number;
    mon: number;
    perks: Shop[];
    skill: never[];
    ap: number;
}
var stat: Stat = {
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
const sHealthOpts = (hp: number, onDie: Function, controller: Vector, idleFrm: number, painFrm: number, invince?: BObj) => {
    return { hp, onDie, onHurt: () => {
        if(pDed || (invince && !invince.v)) return;
        controller.x = painFrm;
        setTimeout(() => {
            if(!pDed) controller.x = idleFrm;
        }, 125); 
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
/**
 * Global (player) sprite index.
 * 
 * x represents sheet, y represents index.
 */
var gsi = new Vector();
var pCanHurt: BObj = { v: true };
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
    gsi.x = 9;
    gsi.y = 0;
    noSFU();
    fps = 1.5;
    sfu = setSFU(false);
}, gsi, 0, 8, pCanHurt));
plr.binds(["w", () => {
    if(pDed) return;
    plr.moveY(-stat.spd);
    gsi.x = 4;
}], ["a", () => {
    if(pDed) return;
    plr.moveX(-stat.spd);
    gsi.x = 1;
}], ["s", () => {
    if(pDed) return;
    plr.moveY(stat.spd);
    gsi.x = 3;
}], ["d", () => {
    if(pDed) return;
    plr.moveX(stat.spd);
    gsi.x = 2;
}]);
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
const pss = pssID.map(s => {
    const img = [];
    for(let i = 0; i < s.cnt; i++) img.push(new Img(`gunfred/${s.id}${i}.png`));
    return img;
});
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
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, atk: Function, cd: number, spd = 1, sight = 300) {
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
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number, range: number, cd: number, spd = 1, sight?: number) {
        super(x, y, w, h, c, hp, () => {
            if(this.dp() <= range && pCanHurt.v) {
                plr.comp("health").hurt(dmg);
            }
        }, cd, spd, sight);
    }
}
class GunEnemy extends Enemy {
    bls: BulletObject[];
    constructor(x: number, y: number, w: number, h: number, c: string, hp: number, dmg: number, getRot: () => number, bspd: number, cd: number, asWell?: (e: Entity) => void, atkCount = 1, spd = 1, sight?: number) {
        super(x, y, w, h, c, hp, () => {
            for(let i = 0; i < atkCount; i++) {
                const o = bulGenr(this.x, this.y, getRot(), (e) => {
                    if(e == plr && pCanHurt.v) {
                        e.comp("health").hurt(dmg);
                        scene.rm(o);
                        if(asWell) asWell(e);
                    }
                }, bspd);
                scene.add(o);
                // force expiration
                o.expire(5000, scene);
                this.bls.push(o);
            }
        }, cd, spd, sight);
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
class MeleeBoss extends MeleeEnemy {
    constructor(x: number, y: number, w: number, h: number, c: string, hp = 50, dmg = 3, spd = 1) {
        super(x, y, w, h, c, hp, dmg, 100, 100, spd, 500);
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

abstract class WorldObj extends Entity {
    a: WorldObj[];
    constructor(x: number, y: number, width: number, height: number, col: (e: Entity) => void, a: WorldObj[], auto = true, verif?: (e: Entity) => boolean) {
        super({ x, y, width, height, color: invis, collide: (e) => {
            if(e == plr && ((verif ?? (() => true))(e))) {
                this.rm();
                col(e);
            }
        } });
        this.a = a;
        if(auto) this.add();
    }
    abstract render(): void;
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
        super(x, y, 10, 10, () => stat.mon++, coins);
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
var shop: Shop[] = [];
class Shop extends WorldObj {
    img: Img;
    constructor(x: number, y: number, cost: number, spr: string) {
        super(x, y, 20, 20, () => { stat.mon -= cost; stat.perks.push(this); }, shop, false, () => stat.mon >= cost);
        this.img = new Img(spr);
    }
    render() {
        scene.img(this.img, this.x, this.y, this.width, this.height);
    }
}
function ShopEx(x: number, y: number) { return new Shop(x, y, 1, "coin.png"); }
genRms();
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
    ldRm();
    hideSS();
    gmRn = true;
}, 0, "Enter The Dungeon");
const shopBtn = btn(showShop, 100, "Shop", 0, -50);
const treeBtn = btn(showTree, 200, "Tree", 0, -50);
const shopBk = btn(hideShop, 200, "Back", 50);
const treeBk = btn(hideTree, 200, "Back", 50);
function showShop() {
    hideSS();
    showOvr();
    scene.addUI(shopBk);
}
function hideShop() {
    scene.rmUI(shopBk);
    showSS();
}
function showTree() {
    hideSS();
    showOvr();
    scene.addUI(treeBk);
}
function hideTree() {
    scene.rmUI(treeBk);
    showSS();
}
scene.font = "16px Comic Sans MS";
function showOvr() {
    scene.addUI(ovr);
}
function hideOvr() {
    scene.rmUI(ovr);
}
const ssBtns = [ssStartBtn, shopBtn, treeBtn];
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
        genRms();
        ldRm();
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

function lclSave() {
    Local.set("stat", stat);
}
function pcSave() {
    (new FilePicker()).handle({ accept: [{ accept: { "text/json": ["*.json"] } }] })
}

scene.add(plr);
scene.on("click", () => {
    if(!gmRn) return;
    const o = bulGenr(plr.x, plr.y, scene.rotToMouse(plr), (e) => { if(objIs(e, Enemy)) { e.comp("health").hurt(stat.dmg); scene.rm(o); } }, stat.bspd);
    scene.add(o);
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
            console.warn(`Scene Sprite Rendering Error:\n${e.message}\n${e.stack}\nValues at time:\nx=${gsi.x}, y=${gsi.y}\nsheets=${pssID.length}`);
        }
    }
    if(gsi.x == 9 && gsi.y == pss[gsi.x].length - 1) {
        setTimeout(gss, 1000);
    }
    // TEST ONLY
    // scene.img(pss[gsi.x][gsi.y], 70, scene.height - 70, 50, 50);
});
