import { BulletObject, Cooldown, Entity, Img, Scene } from "../../phantom2d.js";
window.onerror = alert;
Img.config.set("root", "assets");
const tileSize = 50;
const scene = new Scene({ canvas: "pvz", w: 1000, h: 500 });
class Base extends Entity {
    img;
    constructor(x, y, img, mhp) {
        super({ x: (x - 1) * tileSize, y: (y - 1) * tileSize, width: tileSize / 2, height: tileSize / 2 });
        this.img = new Img(img);
        this.use("health", { mhp, hp: mhp });
    }
    shiftX(d) {
        this.x -= d * tileSize;
    }
    shiftY(d) {
        this.y -= d * tileSize;
    }
}
class Plant extends Base {
    constructor(x, y, img, mhp) {
        super(x, y, img, mhp);
        this.comp("health").onDie = () => plants.splice(plants.indexOf(this), 1);
        plants.push(this);
    }
}
class Zombie extends Base {
    armor;
    mcd;
    cd;
    ma;
    constructor(x, y, img, mhp, armor = 0) {
        super(x, y, img, mhp);
        this.armor = armor;
        this.mcd = new Cooldown(2500);
        this.cd = new Cooldown(1000);
        this.ma = true;
        this.comp("health").onDie = () => zombs.splice(zombs.indexOf(this), 1);
        zombs.push(this);
    }
    next() {
        if (this.mcd.ready && this.ma) {
            this.mcd.consume();
            this.shiftX(1);
        }
    }
}
class Peashooter extends Plant {
    cd;
    constructor(x, y) {
        super(x, y, "peashooter.png", 5);
        this.cd = new Cooldown(1000);
    }
    atk() {
        if (this.cd.ready) {
            this.cd.consume();
            new Pea(this.x + 1, this.y);
        }
    }
}
class Pea extends BulletObject {
    img;
    constructor(x, y) {
        super({ x, y, width: tileSize / 5, height: tileSize / 5, scene, rot: 0, spd: 3, collide: (o) => {
                if (o instanceof Zombie) {
                    this.destroy();
                    if (o.armor > 0)
                        o.armor--;
                    if (o.armor <= 0)
                        o.comp("health").hurt(1);
                }
            }, extLeft: 0, extRight: scene.width, extBtm: scene.height, extTop: 0 });
        this.img = new Img("pea.png");
        peas.push(this);
    }
}
class Zomb extends Zombie {
    constructor(x, y) {
        super(x, y, "zomber.png", 3);
    }
    atk() {
        if (plants.some(p => p.x == this.x)) {
            this.ma = false;
            if (this.cd.ready) {
                const p = plants.find(p => p.x == this.x);
                p.comp("health").hurt(1);
                this.cd.consume();
            }
        }
        else {
            this.ma = true;
        }
    }
}
const plants = [];
const zombs = [];
const peas = [];
new Peashooter(5, 5);
new Zomb(10, 5);
scene.start(() => {
    for (let i = 0; i <= scene.width; i += tileSize) {
        for (let j = 0; j <= scene.height; j += tileSize) {
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
    peas.forEach(p => p.x += tileSize);
});
