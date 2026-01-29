import "/utils.js";
import { random } from "/utils.js";

const append = (e) => document.body.appendChild(e);
const canvas = document.createElement("canvas");

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
}
const itemFac = (src) => new Item(src);
const cheese = itemFac("missingtexture.png");
const something = itemFac("missingtexture.png");
const lotto = new Lotto(cheese, something);
const out = lotto.next(3);
lotto.add(...out);
console.log(lotto.next().map(JSON.stringify));
console.log(document.body.children);