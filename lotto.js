const canvas = document.createElement("canvas");

class Lotto {
    constructor(...items) {
        this.items = items;
    }
    next() {
        const r = () => Math.floor(Math.random() * this.items.length - 1);
        return [];
    }
}
class Item {
    constructor(ico) {
        this.img = new Image();
        this.img.src = ico;
    }
}
const itemFac = (src) => new Item(src);
const cheese = itemFac("missingtexture.png");
const lotto = new Lotto(cheese);