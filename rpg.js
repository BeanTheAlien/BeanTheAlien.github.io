import "/utils.js";
import { random } from "/utils.js";

const append = (e) => document.body.appendChild(e);
const canvas = document.createElement("canvas");

class Char {
    constructor(name, role) {
        this.name = name;
        this.role = role;
    }
    use(skill, ...args) {
        this.role[skill](...args);
    }
}
class User extends Char {
    constructor(name, role, money) {
        super(name, role);
        this.money = money;
        this.inv = [];
    }
    earn(n) {
        this.money += n;
    }
    spend(n) {
        this.money -= n;
    }
    add(i) {
        if(this.inv.includes(i)) {
            i.comp(this);
            return;
        }
        this.inv.push(i);
    }
    rm(i) {
        if(!this.inv.includes(i)) {
            return;
        }
        this.inv.splice(this.inv.indexOf(i), 1);
    }
}
class Enemy extends Char {
    constructor(name, role) {
        super(name, role);
    }
}
class Role {
    constructor(name, abls) {
        this.name = name;
        for(const [k, v] of Object.entries(abls)) this[k] = v;
    }
}

class Lotto {
    constructor(...items) {
        this.items = items;
    }
    /**
     * Summons a set of n items and returns them.
     * @param {int} d - The amount of times to summon items.
     * @returns {Item[]} The summoned items.
     */
    next(d) {
        const res = [];
        for(let i = 0; i < d; i++) res.push(this.items[random(0, this.items.length)]);
        return res;
    }
    add(...els) {
        els.forEach((e) => append(e.el()));
    }
}
class Item {
    constructor(ico) {
        this.img = new Image();
        this.img.src = ico;
        this.img.width = 100;
        this.img.height = 100;
        Object.assign(this.img.style, {
            marginRight: "10px"
        });
    }
    el() {
        return this.img;
    }
    comp(u) {
        u.earn(1);
    }
}
const itemFac = (src) => new Item(src);
const cheese = itemFac("missingtexture.png");
const something = itemFac("missingtexture.png");
const lotto = new Lotto(cheese, something);
const out = lotto.next(3);
lotto.add(...out);
const Wizard = new Role("Wizard", {
    "fball": () => alert("fireball")
});
// alert(lotto.next(3).map(JSON.stringify));
// alert(JSON.stringify(Array.from(document.body.children)));
const user = new User("USER", Wizard, 0);
user.use("fball");