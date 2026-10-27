import { Bone, ButtonUI, Color, Entity, FloorObject, Img, Joint, KeyedTextUI, objIs, Perlin, PlayableCharacter, random, Scene, SceneUI, Skeleton, Spawner, TextUI } from "../../phantom2d.js";
const scene = new Scene({ canvas: "deer", w: 1000, h: 600, border: "2px solid red" });

function Deer() {
    const sp = 20;
    const strength = 0.35;
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
class DeerEnt extends Entity {
    skeleton: Skeleton;
    hit: boolean;
    constructor(skeleton: Skeleton, x: number) {
        super({ color: "rgba(0,0,0,0)" });
        this.skeleton = skeleton;
        // Move both current and previous joint positions so the deer spawns at x.
        skeleton.joints.forEach(j => {
            j.x += x;
            j.ox += x;
        });
        this.#syncBounds();
        this.upd = () => this.#syncBounds();
        this.hit = false;
    }
    #syncBounds() {
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

function SpawnDeer(x: number) {
    if(scene.misc.stuff.length > 20) {
        scene.rmMisc(...scene.misc.stuff.slice(20));
        scene.misc.stuff.length = 20;
    }
    const skeleton = Deer();
    const render = skeleton.render.bind(skeleton);
    skeleton.render = () => {
        scene.ctx.save();
        scene.ctx.translate(scene.goff.x, 0);
        render();
        scene.ctx.restore();
    };
    const deer = new DeerEnt(skeleton, x);
    scene.addMisc(skeleton); // draw and update the skeleton
    scene.add(deer); // include hitbox in entity collisions
    return deer;
}
const car = new PlayableCharacter({ strength: 0.35, width: 85, height: 40, color: Color.invis, collide: (e) => {
    if(objIs(e, DeerEnt)) {
        e.skeleton.setSoft();
        e.skeleton.joints.forEach(j => j.strength = 0.15);
        if(!e.hit) {
            e.skeleton.joints.forEach(j => {
                j.damp = 0.95;
                j.vx += p.vx;
                j.vy += -p.vy - 15;
            });
            murder.val++;
        }
        e.hit = true;
        setTimeout(() => scene.rm(e), 7500);
    }
}, upd: () => {
    // const mx = Math.max(...gen.map(g => g.y));
    // if(car.y + car.height >= mx) {
    //     car.y = mx - car.height;
    //     car.onGround = true;
    // }
} });
var dir = 1;
interface CoreCar {
    benzin: number;
    rocket: number;
}
interface Car extends CoreCar {
    dd: number;
    fs: number;
}
const crsInit: CoreCar = {
    benzin: 100,
    rocket: 0
};
const crs: Car = {
    dd: 0,
    benzin: 100,
    rocket: 0,
    fs: 0.85
};
car.use("enhancedphys", { scene });
const p = car.comp("enhancedphys");
var inTheMenus = false;
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
SpawnDeer(200);
scene.add(car);
const spawner = () => setInterval(() => SpawnDeer(car.x + random(-scene.width / 2 + 100, scene.width / 2 - 100)), 5000);
const unspawner = () => clearInterval(spawn);
var spawn = spawner();
const murder = new KeyedTextUI<number>({ scene, change: (v) => `Murder: ${v}`, x: scene.width / 2, y: 50 });
murder.val = 0;
scene.font = "15px Comic Sans MS";
const time = new KeyedTextUI<number>({ scene, change: (v) => `Time: ${v}`, x: scene.width / 2, y: 75 });
time.val = 0;
setInterval(() => {
    time.val = time.val >= 24 ? 0 : time.val+1;
}, 1000);
scene.addUI(murder, time);
const perlin = Perlin.terrain1D({ frq: 0.003, amp: 10, bh: 20, fy: 0.5 });
const terrainSegmentWidth = 10;
let nextTerrainX = -scene.width / 2;
const gen: FloorObject[] = [];
const crsUISeries: KeyedTextUI<number>[] = [];
const nextCRS = (k: keyof Car, v: string) => new KeyedTextUI<number>({ scene, change: () => `${v}: ${crs[k]}`, x: scene.width / 2, y: 100 + (25 * crsUISeries.length) });
const meter = (k: keyof typeof p, v: string, ext: string) => new KeyedTextUI<number>({ scene, change: () => `${v}: ${Math.round(p[k] as number)} ${ext}`, x: scene.width / 2, y: 100 + (25 * crsUISeries.length) });
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

interface Upgrade {
    then: () => void;
    cnt: number;
    og: number;
}
const upgFactory = (k: string, then: Upgrade["then"], og: number): Upgrade => {
    return {
        then: () => {
            upgMap[k].cnt++;
            then();
        },
        cnt: 0,
        og
    };
}
const upgMap: Record<string, Upgrade> = {
    benzin: upgFactory("benzin", () => {
        crsInit.benzin += 50;
    }, 50),
    engine: upgFactory("engine", () => {
        crs.fs += 0.15;
    }, 100),
    rocket: upgFactory("rocket", () => {
        crsInit.rocket += 1;
    }, 150)
};
/**
 * The exponential growth factor; the r-value of `g_0(r)^n`
 */
const growthRate = 1.15;
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
        if(crs.dd < cost) return;
        v.then();
        crs.dd -= cost;
        refreshUpgUI.forEach(refresh => refresh());
        pointsHead.val = crs.dd;
    } });
    const updateUI = () => {
        const cost = v.og * (growthRate ** v.cnt);
        costText.tx = cost + " points";
        button.styles = {
            idle: crs.dd >= cost ? "#2ae409" : "#d80b0b",
            hover: crs.dd >= cost ? "#1fb105" : "#ab0303",
            click: crs.dd >= cost ? "#188f03" : "#800404"
        };
        console.log(button.styles);
    };
    const title = new TextUI({ scene, x: textX, y: y + 25, tx: k });
    updateUI();
    refreshUpgUI.push(updateUI);
    upgUI.push([button, title, costText]);
    i++;
}
const upgMenuOuter = new SceneUI({ scene, x: 0, y: 0, w: scene.width, h: scene.height, color: "#03552c" });
const pointsHead = new KeyedTextUI<number>({ scene, change: (v) => `${v} Points`, x: scene.width / 2, y: 100 });
const doneUpg = new ButtonUI({ scene, x: scene.width / 2 - 125, w: 250, h: 50, y: scene.height - 75, click: hideUpg, styles: {
    idle: "#06d444",
    hover: "#04a133",
    click: "#026921"
} });
const doneUpgText = new TextUI({ scene, x: scene.width / 2, y: scene.height - 50, tx: "Done" });
function showUpg() {
    scene.addUI(upgMenuOuter, doneUpg, doneUpgText);
    upgUI.forEach(u => scene.addUI(...u));
    pointsHead.val = crs.dd;
    scene.addUI(pointsHead);
    inTheMenus = true;
}
function hideUpg() {
    scene.rmUI(upgMenuOuter, doneUpg, doneUpgText, pointsHead);
    upgUI.forEach(u => scene.rmUI(...u));
    spawn = spawner();
    inTheMenus = false;
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
const scorePUI = nextScore();
scoreSeries.push(scorePUI);
const exitBut = new ButtonUI({ scene, x: scene.width / 2 - 250 / 2, y: scene.height / 2, w: 250, h: 50, styles: {
    idle: "#0c97d8", hover: "#014ad1", click: "#200cd8" }, click: () => {
        scoreQue = false;
        // set the ignore in case an update
        // passes while still processing
        scoreQueIgn = true;
        scene.rmUI(outer, ...scoreSeries, exitBut, seriousExit);
        // reset the values on crs to crsInit
        for(const [k, v] of Object.entries(crsInit)) {
            crs[k as keyof Car] = v;
        }
        // reset the ignore
        scoreQueIgn = false;
        already = false;
        dir = 1;
        car.setPosX(0);
        murder.val = 0;
        scene.rmMisc(...scene.misc.stuff);
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
}

function updateTerrain() {
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

scene.start(() => {
    scene.align = "center";
    scene.baseline = "middle";
    if(scoreQue && !already) {
        scene.addUI(outer);
        scoreUI.tx = "Score";
        scoreDUI.tx = "Distance: " + snapX;
        scoreMUI.tx = "Murder: " + murder.val;
        // convert snapX to centimeters
        // since the value is otherwise in pixels
        // use formula Pixels / 37.95276
        const pt = Math.floor(snapX / 37.95276) + murder.val;
        scorePUI.tx = "Points Earned: " + pt;
        scene.addUI(scoreUI, scoreDUI, scoreMUI, scorePUI, exitBut, seriousExit);
        crs.dd += pt;
        already = true;
    }
    scene.goff.x = scene.width / 2 - car.x;
    // 20 - 6 night
    // 7 - 10 dawn
    // 11 - 15 noon
    // 16 - 19 dusk
    const tmc = (20 <= time.val) || (0 <= time.val && time.val <= 6) ? "#033369" :
        (7 <= time.val && time.val <= 10) ? "#0052af" :
        (11 <= time.val && time.val <= 15) ? "#06c9a8" :
        (16 <= time.val && time.val <= 19) ? "#0052af" :
        "#fff";
    scene.bg(tmc);
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