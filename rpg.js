const append = (e) => document.body.appendChild(e);
const create = (tag) => document.createElement(tag);
const canvas = create("canvas");
const ui = create("div");
const teamDisp = create("div");
const team = [];

class Char {
    constructor(name, desc, abls) {
        this.name = name;
        this.desc = desc;
        this.abls = abls;
        for(const [k, v] of Object.entries(abls)) this[k] = v;
    }
    use(skill, ...args) {
        this[skill].use(...args);
    }
}
class Skill {
    constructor(act, cd) {
        this.act = act;
        this.cd = cd;
        this.ready = true;
        this.itv = setInterval(() => this.ready = true, this.cd * 1000);
    }
    use(...args) {
        if(!this.ready) return;
        this.act(...args);
    }
}
const char = (name, desc, abls) => class extends Char {
    constructor() {
        super(name, desc, abls);
        this.lvl = 1;
    }
}
const card = (c) => `<div><h1>${c.name}</h1><p><i>${c.desc}</i></p><ul>${c.abls.map(a => {
    return `<p></p>`;
})}</ul></div>`;
const Wizard = char("Wizard", "He may be old, but he has a cool hat.", {
    "fball": new Skill(() => alert("fireball"), 1)
});

const wiz = new Wizard();
wiz.use("fball");