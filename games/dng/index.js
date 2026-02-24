const pre = performance.now();
const load = await import("../load.js");
const p2d = await load.load();
const pro = performance.now();
console.log(`Loaded Phantom2D in ${(pro-pre).toFixed(2)}ms.`);
const tileSize = 10;
const c = load.init(50 * tileSize, 50 * tileSize);
const ctx = load.ctx(c);
const overlay = document.createElement("div");
const stats = document.createElement("div");
stats.style.position = "relative";
document.body.appendChild(stats);
function isColliding(a, b) {
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}
class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = tileSize;
        this.h = tileSize;
        this.mag = 8;
        this.ammo = this.mag;
        this.dir = "x";
        this.cd = 100;
        this.scd = this.cd;
        this.rcd = this.cd;
        this.maxhp = 5;
        this.hp = 5;
        this.dmg = 1;
        this.tokens = 0;
    }
    upd() {
        this.scd--;
        this.rcd--;
        if(this.scd <= 0) this.scd = 0;
        if(this.rcd <= 0) this.rcd = 0;
        if(this.x < 0) this.x = 0;
        else if(this.x + 15 > c.width) this.x = c.width - 15;
        if(this.y < 0) this.y = 0;
        else if(this.y + 15 > c.height) this.y = c.height - 15;
        if(keys["w"] || keys["ArrowUp"]) {
            this.y--;
            this.dir = "-y";
        }
        if(keys["a"] || keys["ArrowLeft"]) {
            this.x--;
            this.dir = "-x";
        }
        if(keys["s"] || keys["ArrowDown"]) {
            this.y++;
            this.dir = "y";
        }
        if(keys["d"] || keys["ArrowRight"]) {
            this.x++;
            this.dir = "x";
        }
        if(keys["e"] && !keys["r"] && this.ammo > 0 && this.scd <= 0) {
            bullets.push(new Bullet(this.x, this.y, this.dir, this.dmg));
            this.scd = this.cd;
            this.ammo--;
        }
        if(keys["r"] && !keys["e"] && this.ammo < this.mag && this.rcd <= 0) {
            this.ammo++;
            this.rcd = this.cd;
        }
    }
    hurt(d) {
        this.hp -= d;
        if(this.hp <= 0) gameEnd(runtime, score, "dungeon-hs");
    }
    stats() {
        return `HP: ${this.hp}\nMax HP: ${this.maxhp}\nCooldown: ${this.cd}\nAmmo: ${this.ammo}\nMag: ${this.mag}\nDamage: ${this.dmg}\nTokens: ${this.tokens}`;
    }
}
class Enemy {
    constructor(x, y, w, h, hp, hurt, die, move, atk, check, cd) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.hp = hp;
        this.hurt = hurt;
        this.die = die;
        this.move = move;
        this.atk = atk;
        this.check = check;
        this.cd = cd / 0.005;
        this.timer = this.cd;
    }
    upd() {
        this.timer--;
        this.move();
        if(this.check() && this.timer <= 0) {
            this.atk();
            this.timer = this.cd;
        }
    }
}
class Basic extends Enemy {
    constructor(x, y) {
        super(x, y, tileSize, tileSize, 3, (d) => {
            this.hp -= d;
            if(this.hp <= 0) this.die();
        }, () => {
            enemies.splice(enemies.indexOf(this), 1);
            player.tokens++;
            score++;
        }, () => {
            if(delta % 2 == 0) {
                if(player.x < this.x) this.x--;
                else if(player.x > this.x) this.x++;
                if(player.y < this.y) this.y--;
                else if(player.y > this.y) this.y++;
            }
        }, () => {
            player.hurt(1);
        }, () => {
            return isColliding(this, player);
        }, 1);
    }
}
class Runny extends Enemy {
    constructor(x, y) {
        super(x, y, tileSize, tileSize, 1, (d) => {
            this.hp -= d;
            if(this.hp <= 0) this.die();
        }, () => {
            enemies.splice(enemies.indexOf(this), 1);
            player.tokens++;
            score++;
        }, () => {
            if(player.x < this.x) this.x -= 0.85;
            else if(player.x > this.x) this.x += 0.85;
            if(player.y < this.y) this.y -= 0.85;
            else if(player.y > this.y) this.y += 0.85;
        }, () => {
            player.hurt(1);
        }, () => {
            return isColliding(this, player);
        }, 0.5);
    }
}
class Brute extends Enemy {
    constructor(x, y) {
        super(x, y, tileSize * 2, tileSize * 3, 10, (d) => {
            this.hp -= d;
            if(this.hp <= 0) this.die();
        }, () => {
            enemies.splice(enemies.indexOf(this), 1);
            player.tokens++;
            score++;
        }, () => {
            if(player.x < this.x) this.x -= 0.5;
            else if(player.x > this.x) this.x += 0.5;
            if(player.y < this.y) this.y -= 0.5;
            else if(player.y > this.y) this.y += 0.5;
        }, () => {
            player.hurt(5);
        }, () => {
            return isColliding(this, player);
        }, 5);
    }
}
class Boss extends Enemy {
    constructor(x, y) {
        super(x, y, tileSize * 5, tileSize * 5, 20, (d) => {
            this.hp -= d;
            if(this.hp <= 0) this.die();
        }, () => {
            enemies.splice(enemies.indexOf(this), 1);
            player.tokens++;
            score++;
        }, () => {
            if(delta % 2 == 0) {
                if(player.x < this.x) this.x--;
                else if(player.x > this.x) this.x++;
                if(player.y < this.y) this.y--;
                else if(player.y > this.y) this.y++;
            }
        }, () => {
            player.hurt(5);
        }, () => {
            return isColliding(this, player);
        }, 5);
    }
}
class Tele extends Enemy {
    constructor(x, y) {
        super(x, y, tileSize, tileSize, 1, (d) => {
            this.hp -= d;
            if(this.hp <= 0) this.die();
        }, () => {
            enemies.splice(enemies.indexOf(this), 1);
            player.tokens++;
            score++;
        }, () => {
            if(delta % 150 == 0) {
                this.x = random(0, c.width);
                this.y = random(0, c.height);
            } else if(chance(80) && delta % 2 == 0) {
                if(player.x < this.x) this.x--;
                else if(player.x > this.x) this.x++;
                if(player.y < this.y) this.y--;
                else if(player.y > this.y) this.y++;
            }
        }, () => {
            player.hurt(1);
        }, () => {
            return isColliding(this, player);
        }, 2);
    }
}
class Bullet {
    constructor(x, y, dir, dmg) {
        this.x = x;
        this.y = y;
        this.w = tileSize;
        this.h = tileSize;
        this.dir = dir;
        this.dmg = dmg;
    }
    upd() {
        switch(this.dir) {
            case "x": this.x++; break;
            case "-x": this.x--; break;
            case "y": this.y++; break;
            case "-y": this.y--; break;
        }
        if(this.x < 0 || this.x + this.w > c.width || this.y < 0 || this.y + this.h > c.height) bullets.splice(bullets.indexOf(this), 1);
        if(enemies.some(e => isColliding(this, e))) {
            enemies.find(e => isColliding(this, e)).hurt(this.dmg);
            bullets.splice(bullets.indexOf(this), 1);
        }
    }
}
class Upgrade {
    constructor(name, desc, cost, effect) {
        this.w = tileSize * 3;
        this.h = tileSize * 5;
        this.name = name;
        this.desc = desc;
        this.cost = cost;
        this.effect = effect;
    }
    purchase() {
        player.tokens -= this.cost;
        this.effect();
    }
}
class Level {
    constructor(name, comp, bg) {
        this.name = name;
        this.comp = comp;
        this.bg = bg;
    }
}

function sqrCheck(initiator, target, radius) {
    return initiator.x - radius <= target.x && initiator.x + radius >= target.x && initiator.y - radius <= target.y && initiator.y + radius >= target.y
}

var player = new Player();
var enemies = [];
var bullets = [];
const lvls = [
    new Level("Dungeon 1", [new Basic(50, 10)], "#1b2052ff"),
    new Level("Dungeon 2", [new Basic(50, 10), new Basic(70, 30)], "#1b2052ff"),
    new Level("Dungeon 3", [new Runny(200, 200)], "#1b2052ff"),
    new Level("Dungeon 4", [new Brute(50, 50)], "#1b2052ff"),
    new Level("Dungeon 5", [new Boss(50, 50)], "#5b0000ff"),
    new Level("Dungeon 6", [new Tele(70, 70)], "#1b2052ff"),
    new Level("Dungeon 7", [new Tele(70, 70), new Tele(70, 70), new Tele(70, 70), new Tele(70, 70), new Tele(70, 70)], "#1b2052ff"),
    new Level("Dungeon 8", [new Brute(50, 50), new Brute(100, 100), new Basic(70, 80)], "#1b2052ff")
];
const upgs = [
    new Upgrade("Health", "Increases health.", 1, () => player.maxhp += 1),
    new Upgrade("Bandage", "Heal some health.", 1, () => {
        player.hp += 1;
        if(player.hp > player.maxhp) player.hp = player.maxhp;
    }),
    new Upgrade("Weapon Mastery", "Fires and reloads your gun faster.", 5, () => player.cd -= 1),
    new Upgrade("Damage", "Deal more damage.", 2, () => player.dmg++),
    new Upgrade("Mag Size", "Increase the size of your magazine.", 10,() => player.mag++)
];
var shopItems = [];
var stage = 0;
var inshop = false;
var keys = {};
var delta = 0;
var score = 0;

var runtime = null;

function game() {
    if(!lvls[stage]) {
        gameEnd(runtime, score, "dungeon-hs");
        return;
    }
    stats.textContent = player.stats();
    if(inshop) {
        drawShop();
        return;
    }
    if(enemies.length > 0) {
        player.upd();
        enemies.forEach(e => e.upd());
        bullets.forEach(b => b.upd());
        ctx.clearRect(0, 0, c.width, c.height);
        const l = lvls[stage];
        ctx.fillStyle = l.bg;
        ctx.beginPath();
        ctx.rect(0, 0, c.width, c.height);
        ctx.fill();
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.rect(player.x, player.y, player.w, player.h);
        ctx.fill();
        ctx.fillStyle = "red";
        ctx.beginPath();
        enemies.forEach(e => ctx.rect(e.x, e.y, e.w, e.h));
        ctx.fill();
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        bullets.forEach(b => ctx.rect(b.x, b.y, b.w, b.h));
        ctx.fill();
        delta++;
    } else {
        shop();
    }
}
function shop() {
    inshop = true;
    if(!overlay.parentNode) d2.appendChild(overlay);
    shopItems = [];
    while(shopItems.length < 3) {
        const upg = upgs[random(0, upgs.length)];
        if(!shopItems.includes(upg)) shopItems.push(upg);
    }
    Object.assign(overlay.style, {
        position: "absolute",
        left: "10px",
        top: "10px",
        padding: "10px",
        background: "rgba(0, 0, 0, 0.85)",
        color: "white",
        zIndex: 9999
    });
    overlay.innerHTML = ""; // clear previous content safely
    // create item cards properly (put text inside the clickable div)
    let i = 0;
    shopItems.forEach(s => {
        const div = document.createElement("div");
        div.id = `upg-${s.name}`;
        //div.className = "shop-item";
        div.style.cursor = "pointer";
        div.style.border = "1px solid rgba(255,255,255,0.1)";
        div.style.padding = "6px";
        div.style.marginBottom = "6px";
        //div.dataset.price = s.cost;

        const h3 = document.createElement("h3");
        h3.textContent = s.name;
        //h3.id = `h3-${i}`;
        const p = document.createElement("p");
        p.textContent = s.desc;
        p.style.margin = "4px 0";
        //p.id = `p-${i}`;
        const p2 = document.createElement("p");
        p2.textContent = `Cost: ${s.cost}`;
        p2.style.fontWeight = "bold";
        //p2.id = `p2-${i}`;
        [h3, p, p2].forEach(e => e.style.color = player.tokens >= s.cost ? "white" : "red");

        // build structure and then add listener to the container
        div.appendChild(h3);
        div.appendChild(p);
        div.appendChild(p2);
        div.addEventListener("click", shopPurchase);
        overlay.appendChild(div);
    });
    // make exit button without innerHTML (so we don't kill listeners)
    const button = document.createElement("button");
    button.id = "exit-shop";
    button.textContent = "Exit";
    button.style.backgroundColor = "red";
    button.style.color = "white";
    button.style.padding = "6px 10px";
    button.addEventListener("click", exitShop);
    overlay.appendChild(button);
}
function drawShop() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#160057ff";
    ctx.beginPath();
    ctx.rect(0, 0, c.width, c.height);
    ctx.fill();
}
function shopPurchase(e) {
    const el = e.currentTarget;
    const id = el.id;
    const name = id.replace("upg-", "");
    const item = shopItems.find(s => name == s.name);
    if(player.tokens < item.cost) return;
    item.purchase();
    el.style.opacity = "0.5";
    el.disabled = true;
    // for(let i = 0; i < 3; i++) {
    //     const els = ["h3", "p", "p2"].map(id => document.getElementById(`${id}-${i}`));
    //     if(el.dataset.price > player.tokens) {
    //         els.forEach(z => {
    //             if(z) z.style.color = "red"
    //         });
    //     }
    // }
}
function exitShop() {
    overlay.innerHTML = "";
    if(overlay.parentNode == d2) d2.removeChild(overlay);
    inshop = false;
    stage++;
    makeStage();
}
function makeStage() {
    const l = lvls[stage];
    if(!lvls[stage]) {
        gameEnd(runtime, score, "dungeon-hs");
        return;
    }
    player.x = 0;
    player.y = 0;
    for(let i = 0; i < l.comp.length; i++) enemies.push(l.comp[i]);
}
makeStage();
function setup() {
    runtime = setInterval(game, 5);
    document.addEventListener("keydown", (e) => keys[e.key] = true);
    document.addEventListener("keyup", (e) => keys[e.key] = false);
}
setup();
//TODO
/*
game levels + shop
stage
base off of the C++ one
make enemy templates (extend Enemy)
make makeStage actually work based on stage
*/