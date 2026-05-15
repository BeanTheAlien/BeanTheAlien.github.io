import { Angle, BulletObject, Cooldown, Entity, Img, ImgUI, objIs, Scene } from "../../phantom2d.js";

window.onerror = alert;
Img.config.set("root", "assets");
const tileSize = 50;

const scene = new Scene({ canvas: "pvz", w: 1000, h: 500 });
function onSpot<T extends Entity, E extends Entity>(source: T[], ent: E) {
    return source.some(x => x.x == ent.x && x.y == ent.y);
}
function spot<T extends Entity, E extends Entity>(source: T[], ent: E) {
    return source.find(x => x.x == ent.x && x.y == ent.y);
}
abstract class Base extends Entity {
    img: Img;
    constructor(x: number, y: number, img: string, mhp: number) {
        super({ x: (x - 1) * tileSize, y: (y - 1) * tileSize, width: tileSize / 2, height: tileSize / 2 });
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
    constructor(x: number, y: number, img: string, mhp: number) {
        super(x, y, img, mhp);
        this.comp("health").onDie = () => plants.splice(plants.indexOf(this), 1);
        plants.push(this);
    }
}
abstract class Zombie extends Base {
    armor: number;
    mcd: Cooldown;
    cd: Cooldown;
    ma: boolean;
    mspd: number;
    constructor(x: number, y: number, img: string, mhp: number, mspd = 2500, armor = 0) {
        super(x, y, img, mhp);
        this.armor = armor;
        this.mspd = mspd;
        this.mcd = new Cooldown(mspd);
        this.cd = new Cooldown(1000);
        this.ma = true;
        this.comp("health").onDie = () => zombs.splice(zombs.indexOf(this), 1);
        zombs.push(this);
    }
    next() {
        if(this.mcd.ready && this.ma) {
            this.mcd.consume();
            this.shiftX(1);
        }
    }
}
class Peashooter extends Plant {
    cd: Cooldown;
    constructor(x: number, y: number) {
        super(x, y, "peashooter.png", 5);
        this.cd = new Cooldown(5000, true);
    }
    atk() {
        if(this.cd.ready && zombs.some(z => z.y == this.y)) {
            this.cd.consume();
            new Pea(this.x + tileSize, this.y);
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
class Zomb extends Zombie {
    constructor(x: number, y: number) {
        super(x, y, "zomber.png", 1);
    }
    atk() {
        if(onSpot(plants, this)) {
            this.ma = false;
            if(this.cd.ready) {
                const p = spot(plants, this) as Plant;
                p.comp("health").hurt(1);
                this.cd.consume();
            }
        } else {
            this.ma = true;
        }
        if(this.x <= 0) {
            alert("die");
        }
    }
}
class FastZomb extends Zombie {
    constructor(x: number, y: number) {
        super(x, y, "zomber.png", 1, 1000);
    }
    atk() {
        if(onSpot(plants, this)) {
            this.ma = false;
            if(this.cd.ready) {
                const p = spot(plants, this) as Plant;
                p.comp("health").hurt(1);
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
}

const plants: Plant[] = [];
const zombs: Zombie[] = [];
const peas: Pea[] = [];

const brains = new ImgUI({ scene, w: scene.width, h: scene.height, img: new Img("brains.png") });

new Peashooter(5, 5);
new Zomb(10, 5);
new FastZomb(10, 6);

scene.start(() => {
    for(let i = 0; i <= scene.width; i += tileSize) {
        for(let j = 0; j <= scene.height; j += tileSize) {
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