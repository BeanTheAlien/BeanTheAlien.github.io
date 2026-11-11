import { Bone, ButtonUI, chance, clamp, Color, Constructor, Entity, FloorObject, Img, ImgUI, Joint, KeyedTextUI, Local, objIs, Perlin, PlayableCharacter, randItem, random, Scene, SceneUI, ScreenUI, Skeleton, Spawner, Tag, TextUI, Vector } from "../../phantom2d.js";
const scene = new Scene({ canvas: "deer", w: 1000, h: 600, border: "2px solid red" });

const sp = 20;
const strength = 0.35;
function Deer() {
    const head = [
        // head 0
        new Joint(0, 0, strength),
        // head 1
        new Joint(sp, 0, strength),
        // head 2
        new Joint(0, sp, strength),
        // head 3
        new Joint(sp, sp, strength)
    ] as const;
    const neck = [
        // neck start
        new Joint(sp/2, sp+1, strength),
        // neck end
        new Joint(sp/2, sp+3, strength)
    ] as const;
    const body = [
        // body 0
        new Joint(0, sp+3, strength),
        // body 1
        new Joint(sp*3, sp+3, strength),
        // body 2
        new Joint(0, sp+8, strength),
        // body 3
        new Joint(sp*3, sp+8, strength)
    ] as const;
    const bodyLeg1 = new Joint(sp, sp+8, strength);
    const bodyLeg2 = new Joint(sp*2, sp+8, strength);
    const leg0 = [
        // leg 0 0
        new Joint(0, sp+17, strength),
        // leg 0 1
        new Joint(0, sp+19, strength)
    ] as const;
    const leg1 = [
        // leg 1 0
        new Joint(sp, sp+17, strength),
        // leg 1 1
        new Joint(sp, sp+19, strength)
    ] as const;
    const leg2 = [
        // leg 2 0
        new Joint(sp*2, sp+17, strength),
        // leg 2 1
        new Joint(sp*2, sp+19, strength)
    ] as const;
    const leg3 = [
        // leg 3 0
        new Joint(sp*3, sp+17, strength),
        // leg 3 1
        new Joint(sp*3, sp+19, strength)
    ] as const;
    const bones = [
        new Bone(head[0], head[1]),
        new Bone(head[0], head[2]),
        new Bone(head[1], head[3]),
        new Bone(head[2], head[3]),
        new Bone(head[0], head[3]),
        new Bone(head[2], neck[0]),
        new Bone(head[3], neck[0]),
        new Bone(neck[0], neck[1]),
        new Bone(neck[1], body[0]),
        new Bone(neck[1], body[1]),
        new Bone(body[0], body[1]),
        new Bone(body[0], body[2]),
        new Bone(body[1], body[3]),
        new Bone(body[2], body[3]),
        new Bone(body[0], body[3]),
        new Bone(body[2], bodyLeg1),
        new Bone(bodyLeg1, bodyLeg2),
        new Bone(bodyLeg2, body[3]),
        new Bone(body[0], bodyLeg2),
        new Bone(body[1], bodyLeg1),
        new Bone(body[2], leg0[0]),
        new Bone(bodyLeg1, leg1[0]),
        new Bone(bodyLeg2, leg2[0]),
        new Bone(body[3], leg3[0]),
        new Bone(leg0[0], leg0[1]),
        new Bone(leg1[0], leg1[1]),
        new Bone(leg2[0], leg2[1]),
        new Bone(leg3[0], leg3[1])
    ];
    return new Skeleton({
        bn: bones,
        pass: 50,
        bc: "#794a03",
        jc: "#ffd900",
        bw: 5,
        jr: 3,
        scene
    });
}
function Box() {
    const core = [
        new Joint(0, 0, strength),
        new Joint(sp * 2, 0, strength),
        new Joint(0, sp * 2, strength),
        new Joint(sp * 2, sp * 2, strength)
    ] as const;
    // 0 1
    // 0 2
    // 1 3
    // 2 3
    // 0 3
    // 2 1
    const bones = [
        new Bone(core[0], core[1]),
        new Bone(core[0], core[2]),
        new Bone(core[1], core[3]),
        new Bone(core[2], core[3]),
        // cross-section for stability
        new Bone(core[0], core[3]),
        new Bone(core[2], core[1])
    ];
    return new Skeleton({
        bn: bones,
        pass: 50,
        bc: "#794a03",
        jc: "#a96703",
        bw: 5,
        jr: 3,
        scene
    });
}
const DeerNametag = new Tag("Deer");
const OldDeerNameTag = new Tag("Old Deer");
const TrumpDeerNameTag = new Tag("Trump Deer");
const CommieDeerNameTag = new Tag("Communist Deer");
const GermanDeerNameTag = new Tag("German Deer");
const BoxNametag = new Tag("Box");
class SkeleEnt extends Entity {
    skeleton: Skeleton;
    hit: boolean;
    constructor(skeleton: Skeleton, x: number, y?: number) {
        super({ color: "rgba(0,0,0,0)" });
        this.skeleton = skeleton;
        // Move both current and previous joint positions so the skeleton spawns at x.
        skeleton.joints.forEach(j => {
            j.x += x;
            j.ox += x;
            if(y !== undefined) {
                j.y += y;
                j.oy += y;
            }
        });
        this.syncBounds();
        this.upd = () => this.syncBounds();
        this.hit = false;
    }
    syncBounds() {
        const xs = this.skeleton.joints.map(j => j.x);
        const ys = this.skeleton.joints.map(j => j.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        this.x = minX;
        this.y = minY;
        this.width = Math.max(...xs) - minX;
        this.height = Math.max(...ys) - minY;
    }
}

const boxes: SkeleEnt[] = [];
const deerEntities: SkeleEnt[] = [];
var GlobalCullCeil = 20;
function SpawnDeer(x: number) {
    for(let i = deerEntities.length - 1; i >= 0; i--) {
        if(!scene.has(deerEntities[i]!)) deerEntities.splice(i, 1);
    }
    if(deerEntities.length >= GlobalCullCeil) {
        const oldestDeer = deerEntities.shift();
        if(oldestDeer) {
            scene.rm(oldestDeer);
            scene.rmMisc(oldestDeer.skeleton);
        }
    }
    const skeleton = Deer();
    const render = skeleton.render.bind(skeleton);
    skeleton.render = () => {
        scene.ctx.save();
        scene.ctx.translate(scene.goff.x, 0);
        render();
        if(deer.tags.has(OldDeerNameTag)) DeerDrawing.beard(skeleton);
        else if(deer.tags.has(TrumpDeerNameTag)) DeerDrawing.trump(skeleton);
        else if(deer.tags.has(CommieDeerNameTag)) DeerDrawing.commie(skeleton);
        scene.ctx.restore();
    };
    const deer = new SkeleEnt(skeleton, x);
    scene.addMisc(skeleton); // draw and update the skeleton
    scene.add(deer); // include hitbox in entity collisions
    deer.tags.add(DeerNametag);
    // possible special tag
    const spawnRates = [
        [10, OldDeerNameTag],
        [5, TrumpDeerNameTag],
        [3, CommieDeerNameTag],
        [1, GermanDeerNameTag]
    ] as const;
    spawnRates.some(r => {
        if(chance(r[0])) {
            deer.tags.add(r[1]);
            console.log("Deer spawned with special tag:", r[1].get())
            return true;
        }
        return false;
    });
    deerEntities.push(deer);
    return deer;
}
const DeerDrawing = {
    beard: (skeleton: Skeleton) => {
        // Choose joints that match the deer face/neck area.
        // For this deer, the head cluster is at the front of the skeleton.
        const head0 = skeleton.joints[0];
        const head1 = skeleton.joints[1];
        const neck0 = skeleton.joints[5]; // neck start
        const neck1 = skeleton.joints[6]; // neck end
        const x1 = (head0.x + head1.x) / 2;
        const y1 = (head0.y + head1.y) / 2;
        const x2 = (neck0.x + neck1.x) / 2;
        const y2 = (neck0.y + neck1.y) / 2;
        scene.ctx.save();
        scene.ctx.strokeStyle = "#a5a5a5";
        scene.ctx.lineWidth = 4;
        scene.ctx.beginPath();
        scene.ctx.moveTo(x1, y1);
        scene.ctx.quadraticCurveTo(
            x1 - 12, y1 + 10,
            x2 - 4, y2 + 8
        );
        scene.ctx.moveTo(x1 + 2, y1);
        scene.ctx.quadraticCurveTo(
            x1 + 10, y1 + 12,
            x2 + 4, y2 + 8
        );
        scene.ctx.stroke();
        scene.ctx.restore();
    },
    trump: (skeleton: Skeleton) => {
        const h0 = skeleton.joints[0];
        const h1 = skeleton.joints[1];
        const x1 = (h0.x + h1.x) / 2;
        const y1 = (h0.y + h1.y) / 2;
        scene.ctx.save();
        scene.color = "orange";
        const s = 35;
        scene.rectc(x1 - s / 2, y1 - (s / 2.5), s, s / 2.5);
        scene.ctx.restore();
    },
    commie: (skeleton: Skeleton) => {
        skeleton.jc = "#9c0000";
        skeleton.bc = "#4e0000";
    },
    german: (skeleton: Skeleton) => {
        const h0 = skeleton.joints[0];
        const h1 = skeleton.joints[1];
        const x1 = (h0.x + h1.x) / 2;
        const y1 = (h0.y + h1.y) / 2;
        scene.ctx.save();
        scene.color = "green";
        const bw = 15;
        const bh = 10;
        const uw = bw - 2.5;
        const uh = 15;
        scene.rectc(x1 - bw / 2, y1 - bh / 2, bw, bh);
        scene.rectc(x1 - bw / 2 + uw / 2, y1 - bh - uh / 2, uw, uh);
        scene.ctx.restore();
    }
} as const;
function SpawnBox(x: number, y?: number) {
    const skeleton = Box();
    const render = skeleton.render.bind(skeleton);
    skeleton.render = () => {
        scene.ctx.save();
        scene.ctx.translate(scene.goff.x, 0);
        render();
        scene.ctx.restore();
    }
    const box = new SkeleEnt(skeleton, x, y);
    scene.addMisc(skeleton);
    scene.add(box);
    box.tags.add(BoxNametag);
    boxes.push(box);
    return box;
}
function moveBox(box: SkeleEnt, x: number, y: number) {
    box.skeleton.joints.forEach(j => {
        j.x += x;
        j.ox += x;
        j.y += y;
        j.oy += y;
    });
    box.syncBounds();
}
function collideBoxes() {
    const leftEdge = car.x - scene.width / 2 - boxSize * 2;
    for(let i = boxes.length - 1; i >= 0; i--) {
        const box = boxes[i];
        if(box && (!scene.has(box) || box.x + box.width < leftEdge)) {
            scene.rm(box);
            scene.rmMisc(box.skeleton);
            boxes.splice(i, 1);
        }
    }
    for(let i = 0; i < boxes.length; i++) {
        const a = boxes[i];
        if(!a || !scene.has(a)) continue;
        for(let j = i + 1; j < boxes.length; j++) {
            const b = boxes[j];
            if(!b || !scene.has(b)) continue;
            a.syncBounds();
            b.syncBounds();
            const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
            const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
            if(overlapX <= 0 || overlapY <= 0) continue;

            const horizontal = overlapX < overlapY;
            const normalX = horizontal ? (b.x + b.width / 2 < a.x + a.width / 2 ? -1 : 1) : 0;
            const normalY = horizontal ? 0 : (b.y + b.height / 2 < a.y + a.height / 2 ? -1 : 1);
            const overlap = horizontal ? overlapX : overlapY;
            moveBox(a, -normalX * overlap / 2, -normalY * overlap / 2);
            moveBox(b, normalX * overlap / 2, normalY * overlap / 2);

            const averageVelocity = (box: SkeleEnt, axis: "x" | "y") =>
                box.skeleton.joints.reduce((sum, joint) => sum + joint[axis] - joint[axis == "x" ? "ox" : "oy"], 0) / box.skeleton.joints.length;
            const relativeVelocity = (averageVelocity(b, "x") - averageVelocity(a, "x")) * normalX
                + (averageVelocity(b, "y") - averageVelocity(a, "y")) * normalY;
            if(relativeVelocity < 0) {
                const impulse = -(1.1 * relativeVelocity) / 2;
                a.skeleton.joints.forEach(j => {
                    j.ox += impulse * normalX;
                    j.oy += impulse * normalY;
                });
                b.skeleton.joints.forEach(j => {
                    j.ox -= impulse * normalX;
                    j.oy -= impulse * normalY;
                });
            }
        }
    }
}
const car = new PlayableCharacter({ strength: 0.35, width: 85, height: 40, color: Color.invis, collide: (e) => {
    if(objIs(e, SkeleEnt)) {
        e.skeleton.setSoft();
        if(e.tags.has(BoxNametag)) {
            // remove cross-section stability bones
            e.skeleton.bn.splice(4, 2);
        }
        e.skeleton.joints.forEach(j => j.strength = 0.15);
        if(!e.hit) {
            e.skeleton.joints.forEach(j => {
                j.damp = 0.95;
                j.vx += p.vx;
                j.vy += -p.vy - 15;
            });
            if(e.tags.has(DeerNametag)) murder.val++;
            else destruct.val++;
            // then also add to KC
            if(e.tags.has(DeerNametag)) {
                // then get the toString
                // of the last tag
                // (either Deer or special)
                kopdr(e.tags[e.tags.length - 1].get());
            }
            // also slow down the player (why the wedge exists)
            // slowing factor
            const slow = 2.5;
            // only apply when existing
            // velocity is positive
            // Math.sign(p.vx) == 1
            // FIX: while existing approach
            // was good, it doesn't consider
            // the aftermath being negative
            // (ie v could be 0.0001, which)
            // (would cause a negative v)
            const bf = -(slow / (crs.wedge + 1));
            if(Math.sign(p.vx + bf) == 1) {
                // divide by wedge + 1 to avoid NaN
                p.addForceX(bf);
            } else if(Math.sign(p.vx) == 1) {
                // make the vx zero
                // since the vx is positive
                p.vx = 0;
            } else if(Math.sign(p.vx) == -1) {
                // push backwards (backwards backwards)
                // (since vx is already negative)
                // (pushing by bf would increase speed)
                p.addForceX(-bf);
            }
            // FIX: avoid creating new timeouts
            // for already-hit elements
            setTimeout(() => {
                scene.rm(e);
                scene.rmMisc(e.skeleton);
            }, 7500);
        }
        e.hit = true;
    }
}, upd: () => {
    // prevent falling through floor
    if(car.y + car.height >= scene.height) {
        car.y = 100;
    }
    // const mx = Math.max(...gen.map(g => g.y));
    // if(car.y + car.height >= mx) {
    //     car.y = mx - car.height;
    //     car.onGround = true;
    // }
} });
// create symbolic tag to avoid removing
// when cleaning up terrain chunks
const CarTag = new Tag("Car");
car.tags.add(CarTag);
var dir = 1;
enum Wedge {
    None,
    Small,
    Big
}
interface CoreCar {
    benzin: number;
    rocket: number;
    wedge: Wedge;
}
interface Car extends CoreCar {
    dd: number;
    fs: number;
}
const crsInit: CoreCar = {
    benzin: 100,
    rocket: 0,
    wedge: Wedge.None
};
const crs: Car = {
    dd: 0,
    benzin: 100,
    rocket: 0,
    fs: 0.85,
    wedge: Wedge.None
};
function saveCRS() {
    Local.set("drobl-saved-game", { ...crsInit, fs: crs.fs, dd: crs.dd });
    console.log("Game saved");
}
function loadCRS() {
    const out = Local.get("drobl-saved-game");
    if(out) {
        const p = JSON.parse(out);
        crsInit.benzin = p.benzin;
        crsInit.rocket = p.rocket;
        crsInit.wedge = p.wedge;
        crs.fs = p.fs;
        crs.dd = p.dd;
        Object.assign(crs, crsInit);
        console.log("Loaded old save");
    } else {
        console.log("No save detected; no content loaded");
    }
}
// autosave every min
setInterval(saveCRS, 60000);
car.use("enhancedphys", { scene });
const p = car.comp("enhancedphys");
var inTheMenus = true;
car.binds(["a", () => {
    if(inTheMenus) return;
    if(crs.benzin <= 0) return;
    p.addForceX(-crs.fs);
    dir = -1;
    crs.benzin -= 1;
}], ["d", () => {
    if(inTheMenus) return;
    if(crs.benzin <= 0) return;
    p.addForceX(crs.fs);
    dir = 1;
    crs.benzin -= 1;
}], ["w", () => {
    if(inTheMenus) return;
    if(crs.benzin <= 0) return;
    if(!car.onGround) return;
    car.jump(crs.fs*8);
    car.onGround = false;
    crs.benzin -= 1;
}], ["lshift", () => {
    if(inTheMenus) return;
    if(crs.rocket <= 0) return;
    p.addForceX(crs.fs * 10);
    crs.rocket -= 1;
}]);
Img.config.set("root", "assets");
const carspr = new Img("car/2012toyotacamry.jpg");
//SpawnDeer(200);
//scene.add(car);
var GlobalSpawnRate = 2500;
const GenericDeerSpawn = () => SpawnDeer(car.x + random(-scene.width / 2 + 100, scene.width / 2 - 100));
const spawner = () => setInterval(GenericDeerSpawn, GlobalSpawnRate);
const unspawner = () => clearInterval(spawn);
var spawn = spawner();
unspawner();
const murder = new KeyedTextUI<number>({ scene, change: (v) => `Murder: ${v}`, x: scene.width / 2, y: 50 });
murder.val = 0;
const destruct = new KeyedTextUI<number>({ scene, change: (v) => `Destruction: ${v}`, x: scene.width / 2, y: 75 });
destruct.val = 0;
scene.font = "15px Comic Sans MS";
const time = new KeyedTextUI<number>({ scene, change: (v) => `Time: ${v}`, x: scene.width / 2, y: 100 });
time.val = 0;
setInterval(() => {
    time.val = time.val >= 24 ? 0 : time.val+1;
}, 1000);
scene.addUI(murder, destruct, time);
const perlin = Perlin.terrain1D({ frq: 0.003, amp: 10, bh: 20, fy: 0.5 });
const terrainSegmentWidth = 10;
let nextTerrainX = -scene.width / 2;
const gen: FloorObject[] = [];
const crsUISeries: KeyedTextUI<number>[] = [];
const nextCRS = (k: keyof Car, v: string) => new KeyedTextUI<number>({ scene, change: () => `${v}: ${crs[k]}`, x: scene.width / 2, y: 125 + (25 * crsUISeries.length) });
const meter = (k: keyof typeof p, v: string, ext: string) => new KeyedTextUI<number>({ scene, change: () => `${v}: ${Math.round(p[k] as number)} ${ext}`, x: scene.width / 2, y: 125 + (25 * crsUISeries.length) });
const spedometer = meter("vx", "Velocity", "m/s");
spedometer.val = 0;
crsUISeries.push(spedometer);
const benzinUI = nextCRS("benzin", "Benzin");
benzinUI.val = 0;
crsUISeries.push(benzinUI);
const rocketUI = nextCRS("rocket", "Rocket");
rocketUI.val = 0;
crsUISeries.push(rocketUI);
scene.addUI(...crsUISeries);

window.addEventListener("keydown", (e) => {
    if(e.code == "Slash") {
        const h = prompt("Enter Hack") ?? "";
        if(h == "" || !h.length) return;
        const s = h.split(" ");
        const co = <T>(map: Readonly<Record<string, T>>, callCtor: (v: unknown) => T) => s[1] in map ? map[s[1]] : callCtor(s[1]);
        // numeric branch
        if(s[0] == "benzin") {
            crs.benzin = Number(s[1]);
        } else if(s[0] == "giveme") {
            crs.dd = Number(s[1]);
        } else if(s[0] == "rate") {
            GlobalSpawnRate = co({
                slow: 10000,
                med: 5000,
                fast: 1000,
                blitz: 100
            }, Number);
            unspawner();
            spawn = spawner();
        } else if(s[0] == "cull") {
            GlobalCullCeil = co({
                low: 10,
                some: 20,
                many: 50,
                huge: 100,
                inf: 1000000
            }, Number);
        } else if(s[0] == "sped") {
            p.addForceX(Number(s[1]));
        }
        // tag branch
        else if(s[0] == "summon") {
            const tag = co({
                deer: DeerNametag,
                old: OldDeerNameTag,
                trump: TrumpDeerNameTag,
                commie: CommieDeerNameTag,
                german: GermanDeerNameTag
            }, () => new Tag(s.slice(1).join(" ")));
            const spawn = GenericDeerSpawn();
            if(!spawn.tags.has(tag)) spawn.tags.add(tag);
        }
        // void branch
        else if(s[0] == "killmenow") {
            crs.benzin = -10000;
        }
    }
});

interface Upgrade {
    then: () => void;
    cnt: number;
    og: number;
    max?: number;
}
const upgFactory = (k: string, then: Upgrade["then"], og: number, max?: number): Upgrade => {
    return {
        then: () => {
            if(max && upgMap[k].cnt >= max) return;
            upgMap[k].cnt++;
            then();
            saveCRS();
        },
        cnt: 0,
        og,
        max
    };
}
const upgMap: Record<string, Upgrade> = {
    benzin: upgFactory("benzin", () => {
        crsInit.benzin += 35;
    }, 50),
    engine: upgFactory("engine", () => {
        crs.fs += 0.25;
    }, 100),
    rocket: upgFactory("rocket", () => {
        crsInit.rocket += 5;
    }, 150),
    wedge: upgFactory("wedge", () => {
        crsInit.wedge = clamp(crsInit.wedge + 1, Wedge.None, Wedge.Big);
    }, 250, Wedge.Big)
};
/**
 * The exponential growth factor; the r-value of `g_0(r)^n`
 * 
 * Changed from 1.15 since it wasn't enough growth
 */
const growthRate = 1.35;
/**
 * The upgrade UI.
 * 
 * [0] => Button.
 * [1] => Header text.
 * [2] => Value text.
 */
const upgUI: [ButtonUI, TextUI, TextUI][] = [];
let i = 0;
const upgradeWidth = 250;
const upgradeGap = 30;
const upgradeCount = Object.keys(upgMap).length;
const upgradeRowWidth = upgradeCount * upgradeWidth + (upgradeCount - 1) * upgradeGap;
const refreshUpgUI: (() => void)[] = [];
for(const [K, v] of Object.entries(upgMap)) {
    const k = K.charAt(0).toUpperCase() + K.slice(1);
    const x = (scene.width - upgradeRowWidth) / 2 + i * (upgradeWidth + upgradeGap);
    const y = scene.height / 2 - 50;
    const textX = x + upgradeWidth / 2;
    const costText = new TextUI({ scene, x: textX, y: y + 50 });
    const button = new ButtonUI({ scene, x, y, w: upgradeWidth, h: 100, click: () => {
        const cost = Math.ceil(v.og * (growthRate ** v.cnt));
        if(crs.dd < cost || (v.max && v.cnt >= v.max)) return;
        v.then();
        crs.dd -= cost;
        refreshUpgUI.forEach(refresh => refresh());
        pointsHead.val = crs.dd;
    } });
    const updateUI = () => {
        const cost = Math.ceil(v.og * (growthRate ** v.cnt));
        const rmx = v.max && v.cnt >= v.max;
        costText.tx = !rmx ? cost + " points" : "";
        button.styles = {
            idle: !rmx ? (crs.dd >= cost ? "#25cf07" : "#d80b0b") : "#979797",
            hover: !rmx ? (crs.dd >= cost ? "#1fb105" : "#ab0303") : "#6b6b6b",
            click: !rmx ? (crs.dd >= cost ? "#188f03" : "#800404") : "#3f3f3f"
        };
    };
    const title = new TextUI({ scene, x: textX, y: y + 25, tx: k });
    updateUI();
    refreshUpgUI.push(updateUI);
    upgUI.push([button, title, costText]);
    i++;
}
const upgMenuOuter = new SceneUI({ scene, x: 0, y: 0, w: scene.width, h: scene.height, color: "#03552c" });
const pointsHead = new KeyedTextUI<number>({ scene, change: (v) => `${v} Points`, x: scene.width / 2, y: 100 });
const doneUpg = new ButtonUI({ scene, x: scene.width / 2 - 125, w: 250, h: 50, y: scene.height - 150, click: hideUpg, styles: {
    idle: "#06d444",
    hover: "#04a133",
    click: "#026921"
} });
const doneUpgText = new TextUI({ scene, x: scene.width / 2, y: doneUpg.y + doneUpg.height / 2, tx: "Done" });
const mainUpg = new ButtonUI({ scene, x: scene.width / 2 - 125, w: 250, h: 50, y: scene.height - 75, click: () => {
    scene.rmUI(upgMenuOuter, doneUpg, doneUpgText, pointsHead, mainUpg, mainUpgText);
    upgUI.forEach(u => scene.rmUI(...u));
    scene.addUI(bgUI);
    unspawner();
    inTheMenus = true;
    // restore init state
    // and cleanup dependencies
    car.x = 0;
    car.y = 50;
    crs.benzin = crsInit.benzin;
    crs.rocket = crsInit.rocket;
    waitDontTerrain = true;
    scene.rm(car);
    mainMenu.show();
}, styles: {
    idle: "#06d444",
    hover: "#04a133",
    click: "#026921"
} });
const mainUpgText = new TextUI({ scene, x: scene.width / 2, y: mainUpg.y + mainUpg.height / 2, tx: "Home" });
function showUpg() {
    scene.addUI(upgMenuOuter, doneUpg, doneUpgText, mainUpg, mainUpgText);
    upgUI.forEach(u => scene.addUI(...u));
    pointsHead.val = crs.dd;
    scene.addUI(pointsHead);
    inTheMenus = true;
    refreshUpgUI.forEach(r => r());
}
function hideUpg() {
    scene.rmUI(upgMenuOuter, doneUpg, doneUpgText, pointsHead, mainUpg, mainUpgText);
    upgUI.forEach(u => scene.rmUI(...u));
    spawn = spawner();
    inTheMenus = false;
    // restore init state
    car.x = 0;
    car.y = 50;
    crs.benzin = crsInit.benzin;
    crs.rocket = crsInit.rocket;
    waitDontTerrain = false;
}

const scoreSeries: TextUI[] = [];
const nextScore = () => new TextUI({ scene, x: scene.width / 2, y: scene.height / 2 - 100 + (25 * scoreSeries.length) });
const outer = new SceneUI({ scene, x: scene.width / 2 - 250, w: 500, h: 500, color: "#076fb4", colorsk: "#001275", y: scene.height / 2 - 250 });
const scoreUI = nextScore();
scoreSeries.push(scoreUI);
const scoreDUI = nextScore();
scoreSeries.push(scoreDUI);
const scoreMUI = nextScore();
scoreSeries.push(scoreMUI);
const scoreDDUI = nextScore();
scoreSeries.push(scoreDDUI);
const scorePUI = nextScore();
scoreSeries.push(scorePUI);
/**
 * Extra flag to prevent terrain generation.
 * 
 * Just cuz terain gen might still break through, even
 * with the bug fix put in place, so this flag
 * further prevents terrain from being generated.
 */
var waitDontTerrain = true;
const exitBut = new ButtonUI({ scene, x: scene.width / 2 - 250 / 2, y: scene.height / 2 + 50, w: 250, h: 50, styles: {
    idle: "#0c97d8", hover: "#014ad1", click: "#200cd8" }, click: () => {
        scoreQue = false;
        // set the ignore in case an update
        // passes while still processing
        scoreQueIgn = true;
        scene.rmUI(outer, ...scoreSeries, exitBut, seriousExit);
        scene.rm(...boxes);
        // remove skeletons
        scene.rmMisc(...boxes.map(b => b.skeleton));
        boxes.length = 0;
        // move cleanup logic to prevent
        // insane terrain gen which
        // kills performance
        // clean up old misc
        scene.rmMisc(...scene.misc);
        // clean up old terrain / ents
        scene.rm(...scene.filter(x => !x.tags.has(CarTag)));
        boxes.length = 0;
        deerEntities.length = 0;
        gen.length = 0;
        nextTerrainX = -scene.width / 2;
        nextBoxSpawnCheckX = -scene.width / 2;
        waitDontTerrain = true;
        // reset the values on crs to crsInit
        for(const [k, v] of Object.entries(crsInit)) {
            crs[k as keyof Car] = v;
        }
        // reset the ignore
        scoreQueIgn = false;
        already = false;
        dir = 1;
        car.setPos(new Vector(0, 50));
        murder.val = 0;
        destruct.val = 0;
        unspawner();
        showUpg();
    }
});
const seriousExit = new TextUI({ scene, tx: "Done", x: exitBut.x + exitBut.width / 2, y: exitBut.y + 25 });
/**
 * Whether the `scoreUI` is already queued to be appended to the scene on the next pass.
 */
var scoreQue = false;
/**
 * Whether the value of `scoreQue` should be ignored.
 */
var scoreQueIgn = false;
/**
 * Whether things already got dealt with post-game-end.
 */
var already = false;
var snapX = 0;
// TODO
// old deer
// trump deer
// communist deer
// german deer

/** Box layouts use offsets measured in box widths and heights. */
const boxSize = sp * 2;
const boxSpawnCheckSpacing = boxSize * 8;
let nextBoxSpawnCheckX = -scene.width / 2;
const pattern = [
    //   [ ]
    // [ ][ ][ ]
    [[0, 0], [1, 0], [2, 0], [1, 1]],
    // [ ][ ]
    // [ ][ ]
    [[0, 0], [1, 0], [0, 1], [1, 1]],
    // [ ][ ][ ]
    [[0, 0], [1, 0], [2, 0]]
];

function addTerrainSegment(x: number, atStart = false) {
    const height = perlin.next(x);
    const floor = new FloorObject({
        x,
        y: scene.height - height,
        width: terrainSegmentWidth,
        height,
        color: "#0d6e04"
    });
    if(atStart) gen.unshift(floor);
    else gen.push(floor);
    scene.add(floor);
    if(!atStart && x >= nextBoxSpawnCheckX) {
        nextBoxSpawnCheckX = x + boxSpawnCheckSpacing;
        if(chance(25)) {
            // choose a pattern
            const p = randItem(pattern);
            p.forEach(([offsetX, offsetY]) => {
                SpawnBox(x + offsetX * boxSize, floor.y - (offsetY + 1) * boxSize);
            });
        }
    }
}
function updateTerrain() {
    if(waitDontTerrain) return;
    const leftEdge = car.x - scene.width / 2;
    const rightEdge = car.x + scene.width / 2;
    while(nextTerrainX <= rightEdge) {
        addTerrainSegment(nextTerrainX);
        nextTerrainX += terrainSegmentWidth;
    }
    while(gen.length > 0 && gen[0].x > leftEdge) {
        addTerrainSegment(gen[0].x - terrainSegmentWidth, true);
    }
    while(gen.length > 0 && gen[0].x + gen[0].width < leftEdge - terrainSegmentWidth) {
        const oldFloor = gen.shift();
        if(oldFloor) scene.rm(oldFloor);
    }
}

const bgUI = new SceneUI({ scene, w: scene.width, h: scene.height, color: "#00337b" });
// main menu
const mainMenu = new ScreenUI(scene,
    new TextUI({ scene, x: scene.width / 2, y: 100, tx: "Deer Obliterator: The Final Drive" }),
    new ButtonUI({ scene, x: scene.width / 2 - 150 / 2, w: 150, h: 75, y: 250,
        styles: {
            idle: "#00b575",
            hover: "#007b50",
            click: "#005537"
        }, click: () => {
            mainMenu.hide();
            scene.rmUI(bgUI);
            loadCRS();
            inTheMenus = false;
            waitDontTerrain = false;
            scene.add(car);
        }
    }),
    new TextUI({ scene, x: scene.width / 2, y: 250 + 75 / 2, tx: "Play" }),
    new ButtonUI({ scene, x: scene.width / 2 - 150 / 2, w: 150, h: 75, y: 350, styles: {
        idle: "#00b575",
        hover: "#7b0800",
        click: "#3d0400"
    }, click: () => {
        mainMenu.hide();
        scene.rmUI(bgUI);
        Local.rm("drobl-saved-game");
        inTheMenus = false;
        waitDontTerrain = false;
        scene.add(car);
        console.log("Saved data deleted");
    } }),
    new TextUI({ scene, x: scene.width / 2, y: 350 + 75 / 2, tx: "Delete Savedata" }),
    new ButtonUI({ scene, x: scene.width / 2 - 150 / 2, w: 150, h: 75, y: 440, styles: {
        idle: "#00b575",
        hover: "#007b50",
        click: "#005537"
    }, click: () => {
        mainMenu.hide();
        killopedia.show();
        changeKOPP(0);
    } }),
    new TextUI({ scene, x: scene.width / 2, y: 440 + 75 / 2, tx: "Kill-o-pedia" }),
    new ImgUI({ scene, x: scene.width / 2 - 460, y: 380, w: 200, h: 200, img: new Img("drobl-thumb.png") })
);
scene.addUI(bgUI);
mainMenu.show();
var kopPg = 0;
const kopAva = () => kopDeer.filter(x => !!x.kc);
const changeKOPP = (dir: number) => {
    kopActive.hide();
    kopPg += dir;
    kopPg = kopPg >= kopAva().length ? 0 : kopPg;
    if(kopAva().length == 0) {
        kopActive = new ScreenUI(scene, new TextUI({ scene, x: scene.width / 2, y: scene.height / 2, tx: "No deer to show. Kill a deer to discover it!" }));
        return kopActive.show();
    }
    const a = kopAva()[kopPg];
    kopActive = new ScreenUI(scene,
        new ImgUI({ scene, img: Img.from("deer/" + a.thumb), x: scene.width / 2 - 150 / 2, y: scene.height / 2 - 50, w: 150, h: 150 }),
        new TextUI({ scene, x: scene.width / 2, y: 100, tx: a.name }),
        new TextUI({ scene, x: scene.width / 2, y: 150, tx: `Killcount: ${a.kc}` }),
        new TextUI({ scene, x: scene.width / 2, y: scene.height - 150, tx: a.desc })
    );
    kopActive.show();
};
interface KOPDeer {
    thumb: string;
    name: string;
    desc: string;
    kc: number;
}
const kopdr = (name: string) => {
    const e = kopDeer.find(x => x.name == name);
    if(e) {
        e.kc++;
        const ent: Record<string, number> = {};
        kopDeer.forEach(x => ent[x.name] = x.kc)
        Local.set("drobl-kc", ent);
    }
};
const kopDeer: KOPDeer[] = [
    { thumb: "placeholder.jpg", name: "Deer", desc: "Just a deer.", kc: 0 },
    { thumb: "placeholder.jpg", name: "Old Deer", desc: "Ancient, to say the least.", kc: 0 },
    { thumb: "placeholder.jpg", name: "Trump Deer", desc: "The best deer. The very best.", kc: 0 },
    { thumb: "placeholder.jpg", name: "Communist Deer", desc: "SPREAD THE WEALTH!", kc: 0 },
    { thumb: "placeholder.jpg", name: "German Deer", desc: "Schlag mich? Nee. Ich schlag *dich*.", kc: 0 }
];
if(Local.has("drobl-kc")) {
    const kc = JSON.parse(Local.get("drobl-kc") as string) as Record<string, number>;
    Object.entries(kc).forEach(x => {
        const k = kopDeer.find(y => y.name == x[0]);
        if(k) {
            k.kc = x[1];
        }
    });
}
var kopActive: ScreenUI = new ScreenUI(scene);
const killopedia = new ScreenUI(scene,
    new ButtonUI({ scene, x: scene.width / 2 - 150 / 2, w: 150, h: 75, y: scene.height - 80, styles: {
        idle: "#00b575",
        hover: "#007b50",
        click: "#005537"
    }, click: () => {
        mainMenu.show();
        killopedia.hide();
        kopActive.hide();
    } }),
    new TextUI({ scene, x: scene.width / 2, y: scene.height - 80 + 75 / 2, tx: "Exit" }),
    new ButtonUI({ scene, x: 50, y: scene.height / 2, w: 50, h: 50, color: Color.invis, click: () => changeKOPP(-1) }),
    new ImgUI({ scene, x: 50, y: scene.height / 2, w: 50, h: 50, img: Img.from("icon/leftarrow.png") }),
    new ButtonUI({ scene, x: scene.width - 85, y: scene.height / 2, w: 50, h: 50, color: Color.invis, click: () => changeKOPP(1) }),
    new ImgUI({ scene, x: scene.width - 85, y: scene.height / 2, w: 50, h: 50, img: Img.from("icon/rightarrow.png") })
);

const backgroundColors = ["#033369", "#0052af", "#06c9a8", "#0052af"] as const;
type BackgroundColorIndex = 0 | 1 | 2 | 3;
function backgroundColor(time: number) {
    const hour = ((time % 24) + 24) % 24;
    let from: BackgroundColorIndex;
    let to: BackgroundColorIndex;
    let progress: number;
    if(hour >= 20) {
        from = 0;
        to = 1;
        progress = (hour - 20) / 11;
    } else if(hour < 7) {
        from = 0;
        to = 1;
        progress = (hour + 4) / 11;
    } else if(hour < 11) {
        from = 1;
        to = 2;
        progress = (hour - 7) / 4;
    } else if(hour < 16) {
        from = 2;
        to = 3;
        progress = (hour - 11) / 5;
    } else {
        from = 3;
        to = 0;
        progress = (hour - 16) / 4;
    }
    const color = Color.lerp(backgroundColors[from], backgroundColors[to], progress);
    return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`;
}

scene.start(() => {
    scene.align = "center";
    scene.baseline = "middle";
    if(scoreQue && !already) {
        scene.addUI(outer);
        scoreUI.tx = "Score";
        scoreDUI.tx = "Distance: " + snapX;
        scoreMUI.tx = "Murder: " + murder.val;
        scoreDDUI.tx = "Destruction: " + destruct.val;
        // convert snapX to centimeters
        // since the value is otherwise in pixels
        // use formula Pixels / 37.95276
        // also gain 1 pt for each 10 destructions
        const pt = Math.floor(snapX / 37.95276) + murder.val + Math.floor(destruct.val / 10);
        scorePUI.tx = "Points Earned: " + pt;
        scene.addUI(scoreUI, scoreDUI, scoreMUI, scoreDDUI, scorePUI, exitBut, seriousExit);
        crs.dd += pt;
        already = true;
    }
    scene.goff.x = scene.width / 2 - car.x;
    // 20 - 6 night
    // 7 - 10 dawn
    // 11 - 15 noon
    // 16 - 19 dusk
    scene.bg(backgroundColor(time.val));
    updateTerrain();
    scene.misc.forEach(deer => {
        const dr = deer as Skeleton;
        dr.joints.forEach(j => {
            const floor = gen.find(g => j.x >= g.x && j.x < g.x + g.width);
            if(!floor || j.y <= floor.y) return;
            j.y = floor.y;
            j.oy = floor.y;
            j.vy = 0;
        });
    });
    collideBoxes();
    scene.ctx.save();
    // 1. Move the context origin to the center of the car
    scene.ctx.translate(scene.width / 2 + car.width / 2, car.y + car.height / 2);
    // 2. Flip horizontally (-1) and keep vertical scale normal (1)
    scene.ctx.scale(-dir, 1);
    // 3. Draw the image offset by half its size so it centers on the origin
    scene.img(carspr, -car.width / 2, -car.height / 2, car.width, car.height);
    scene.ctx.restore();
    if(!scene.col(car)) car.onGround = false;
    spedometer.val = 0;
    benzinUI.val = 0;
    rocketUI.val = 0;
    if(crs.benzin <= 0 && Math.floor(p.vx) <= 0 && !scoreQue && !scoreQueIgn) {
        scoreQue = true;
        // retain x on this pass
        snapX = Math.round(car.x);
    }
});