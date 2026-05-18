import { Angle, BulletObject, Constructor, Cooldown, Entity, Img, ImgUI, MenuUI, objIs, random, Scene, TextUI } from "../../phantom2d.js";

window.onerror = alert;
Img.config.set("root", "assets");
const tileSize = 50;

const scene = new Scene({ canvas: "pvz", w: 1000, h: 900 });
function onSpot<T extends Entity, E extends Entity>(source: T[], ent: E) {
    return source.some(x => x.x == ent.x && x.y == ent.y);
}
function spot<T extends Entity, E extends Entity>(source: T[], ent: E) {
    return source.find(x => x.x == ent.x && x.y == ent.y);
}
abstract class Base extends Entity {
    img: Img;
    constructor(x: number, y: number, img: string, mhp: number) {
        super({ x: (x - 1) * tileSize + (tileSize / 4), y: (y - 1) * tileSize + (tileSize / 4), width: tileSize / 2, height: tileSize / 2 });
        this.img = new Img(img);
        this.use("health", { mhp, hp: mhp });
    }
    shiftX(d: number) {
        this.x -= d * tileSize;
    }
    shiftY(d: number) {
        this.y -= d * tileSize;
    }
    abstract atk(): void;
}
abstract class Plant extends Base {
    cd: Cooldown;
    constructor(x: number, y: number, img: string, mhp: number, cdTime: number, initState = false) {
        super(x, y, img, mhp);
        this.comp("health").onDie = () => plants.splice(plants.indexOf(this), 1);
        this.cd = new Cooldown(cdTime, initState);
        plants.push(this);
    }
    touch(tg: Zombie) {}
}
abstract class Zombie extends Base {
    armor: number;
    mcd: Cooldown;
    cd: Cooldown;
    ma: boolean;
    mspd: number;
    dmg: number;
    constructor(x: number, y: number, img: string, mhp: number, mspd = 2500, armor = 0, dmg = 1) {
        super(x, y, img, mhp);
        this.armor = armor;
        this.mspd = mspd;
        this.mcd = new Cooldown(mspd);
        this.cd = new Cooldown(1000);
        this.ma = true;
        this.dmg = dmg;
        this.comp("health").onDie = () => zombs.splice(zombs.indexOf(this), 1);
        zombs.push(this);
    }
    next() {
        if(this.mcd.ready && this.ma) {
            this.mcd.consume();
            this.shiftX(1);
            if(onSpot(plants, this)) {
                (spot(plants, this) as Plant).touch(this);
            }
        }
        if(onSpot(plants, this)) {
            this.ma = false;
            if(this.cd.ready) {
                const p = spot(plants, this) as Plant;
                p.comp("health").hurt(this.dmg);
                this.cd.consume();
            }
        } else {
            this.ma = true;
        }
        if(this.x < 0) {
            scene.addUI(brains);
            scene.stop();
        }
    }
    injure(dmg: number) {
        if(this.armor > 0) {
            this.armor -= dmg;
        } else {
            this.comp("health").hurt(dmg);
        }
    }
}
class Peashooter extends Plant {
    constructor(x: number, y: number) {
        super(x, y, "peashooter.png", 5, 5000, true);
    }
    atk() {
        if(this.cd.ready && zombs.some(z => z.y == this.y)) {
            this.cd.consume();
            new Pea(this.x + tileSize, this.y);
        }
    }
}
class Sunflower extends Plant {
    constructor(x: number, y: number) {
        super(x, y, "sunflower.png", 5, 7500, false);
    }
    atk() {
        if(this.cd.ready) {
            this.cd.consume();
            sun += 25;
            refresh();
        }
    }
}
class NoAtkPlant extends Plant {
    atk() {}
}
class Walnut extends NoAtkPlant {
    constructor(x: number, y: number) {
        super(x, y, "walnut.png", 10, 999999);
    }
}
class Landmine extends NoAtkPlant {
    constructor(x: number, y: number) {
        super(x, y, "landmine.png", 5, 1000, false);
    }
    touch(z: Zombie) {
        if(this.cd.ready) {
            this.cd.consume();
            z.comp("health").die();
            plants.splice(plants.indexOf(this), 1);
        }
    }
}
class Pea extends Entity {
    img: Img;
    cd: Cooldown;
    constructor(x: number, y: number) {
        super({ x, y, width: tileSize / 5, height: tileSize / 5 });
        this.img = new Img("pea.png");
        this.cd = new Cooldown(1000);
        peas.push(this);
    }
    next() {
        if(this.cd.ready) {
            this.x += tileSize;
            this.cd.consume();
            if(onSpot(zombs, this)) {
                const z = spot(zombs, this) as Zombie;
                z.comp("health").hurt(1);
                peas.splice(peas.indexOf(this), 1);
            }
        }
    }
}
class NoAtkZomb extends Zombie {
    atk() {}
}
class Zomb extends NoAtkZomb {
    constructor(x: number, y: number) {
        super(x, y, "zomber.png", 1);
    }
}
class StrongZomb extends NoAtkZomb {
    constructor(x: number, y: number) {
        super(x, y, "strongzomb.png", 5, 3000, 0, 3);
    }
}
class FastZomb extends NoAtkZomb {
    constructor(x: number, y: number) {
        super(x, y, "fastzomb.png", 1, 1000);
    }
}
class ConeZomb extends NoAtkZomb {
    constructor(x: number, y: number) {
        super(x, y, "armorzomb.png", 1, 2500, 5);
    }
}
class BucketZomb extends NoAtkZomb {
    constructor(x: number, y: number) {
        super(x, y, "bucketzomb.png", 1, 2500, 10);
    }
}

var sun = 200;
const plants: Plant[] = [];
const zombs: Zombie[] = [];
const peas: Pea[] = [];

const brains = new ImgUI({ scene, w: scene.width, h: scene.height, img: new Img("brains.png") });

const plantMenu = new MenuUI({ y: 600, w: scene.width, scene });
const sunTx = new TextUI({ scene, color: "#fff", y: 800 });
function refresh() {
    sunTx.tx = `Sun ${sun}`;
}
refresh();
scene.fontSize = "24px";
function plantMenuOpt(src: string, x = 0) {
    return new ImgUI({ scene, img: new Img(src), w: 100, h: 175, x: x * 100 * 2 });
}
plantMenu.addChilds(
    plantMenuOpt("menu1.png"),
    plantMenuOpt("menu2.png", 1),
    plantMenuOpt("menu3.png", 2),
    plantMenuOpt("menu4.png", 3)
);
var plantingPlant: Constructor<Plant> | null = null;
var plantingSun = 0;
scene.on("click", (e) => {
    if(!plantingPlant) return;
    const v = scene.mouseAt(e);
    if(v.y <= boardHeight && sun >= plantingSun) {
        const sx = Math.floor(v.x / tileSize) + 1;
        const sy = Math.floor(v.y / tileSize) + 1;
        if(plants.some(p => p.x == sx && p.y == sy)) return;
        new plantingPlant(sx, sy);
        plantingPlant = null;
        sun -= plantingSun;
        refresh();
    }
});
plantMenu.bind("1", () => {
    plantingPlant = Peashooter;
    plantingSun = 25;
});
plantMenu.bind("2", () => {
    plantingPlant = Sunflower;
    plantingSun = 25;
});
plantMenu.bind("3", () => {
    plantingPlant = Walnut;
    plantingSun = 75;
});
plantMenu.bind("4", () => {
    plantingPlant = Landmine;
    plantingSun = 100;
});
scene.addUI(plantMenu, sunTx);

const boardHeight = 500;
function createZombie() {
    const z = [Zomb, StrongZomb, FastZomb, ConeZomb, BucketZomb];
    new (z[random(0, z.length)])(scene.width / tileSize, random(1, boardHeight / tileSize));
}
var zivTime = 2500;
var ziv = setInterval(createZombie, zivTime);
setInterval(() => {
    clearInterval(ziv);
    zivTime -= 100;
    zivTime = Math.max(zivTime, 100);
    ziv = setInterval(createZombie, zivTime);
}, 10000);

scene.start(() => {
    for(let i = 0; i <= scene.width; i += tileSize) {
        for(let j = 0; j <= boardHeight; j += tileSize) {
            const r = i / tileSize;
            const c = j / tileSize;
            scene.rect(i, j, tileSize, tileSize, (r + c) % 2 == 0 ? "#2b9900" : "#268500");
        }
    }
    [...plants, ...zombs, ...peas].forEach(p => scene.img(p.img, p.x, p.y, p.width, p.height));
    zombs.forEach(z => {
        z.atk();
        z.next();
    });
    plants.forEach(p => p.atk());
    peas.forEach(p => p.next());
});