import { Entity, objIs, PlayableCharacter, Scene, Vector, BulletObject, Angle, Cooldown, random } from "../../phantom2d.js";
const scene = new Scene({ canvas: "dng", w: 500, h: 500 });
const size = 10;
var stat = {
    dmg: 1,
    spd: 3,
    bspd: 4,
    hp: 5
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
    }, x: 5, y: 20 });
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
    constructor(x, y, rot, then) {
        super({ x, y, rot, width: 5, height: 20, color: "#a23c04", collide: (e) => {
                if (e != plr)
                    return;
                // unload previous exits
                const rm = fdRm();
                if (rm)
                    scene.rm(...rm.exit);
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
const rooms = [
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
    if (rm)
        scene.add(...rm.e);
}
function ldExs() {
    const rm = fdRm();
    if (rm)
        scene.add(...rm.exit);
}
function bulGenr(x, y, rot, collide, spd) {
    return new BulletObject({ x, y, rot, height: 6, width: 18, scene, color: "#e2e603", collide, extLeft: 0, extRight: scene.width, extTop: 0, extBtm: scene.height, spd });
}
ldRm();
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
});
