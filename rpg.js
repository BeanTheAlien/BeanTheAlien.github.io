import { Scene } from "/phantom2d.js";

const append = (e) => document.body.appendChild(e);
const create = document.createElement.bind(document);
const getEl = document.getElementById.bind(document);
const onClick = (el, fn) => el.addEventListener("click", fn);
const canvas = create("canvas");
const scene = new Scene(canvas, 1000, 1000, "100vw", "100vh");

class UI {
    constructor() {
        this.txt = "";
        this.el = create("div");
        append(this.el);
    }
    get tx() {
        return this.txt;
    }
    set tx(txt) {
        this.txt = txt;
        this.refresh();
    }
    style(s) {
        Object.assign(this.el.style, s);
    }
    refresh() {
        this.el.innerHTML = this.txt;
    }
    show(style) {
        this.style({ "display": style });
    }
    hide() {
        this.style({ "display": "none" });
    }
}
class PathBase {
    constructor(base, end) {
        this.base = base;
        this.end = end;
    }
    gen(path) {
        return `${this.base}${path}.${this.end}`;
    }
}
class Char {
    constructor(name, desc, img, abls) {
        this.name = name;
        this.desc = desc;
        this.img = img;
        this.abls = abls;
        for(const [k, v] of Object.entries(abls)) this[k] = v;
    }
    use(skill, ...args) {
        this[skill].use(...args);
    }
}
class Skill {
    constructor(act, name, desc, cd) {
        this.act = act;
        this.name = name;
        this.desc = desc;
        this.cd = cd;
        this.ready = true;
        this.itv = setInterval(() => this.ready = true, this.cd * 1000);
    }
    use(...args) {
        if(!this.ready) return;
        this.act(...args);
    }
}
const char = (name, desc, img, abls) => class extends Char {
    constructor() {
        super(name, desc, img, abls);
        this.lvl = 1;
    }
}
const card = (c) => `<div><img src="${c.img}"><h1>${c.name}</h1><p><i>${c.desc}</i></p><ul>${Object.keys(c.abls).map(k => {
    const s = c[k];
    return `<p><strong>${s.name}</strong></p><p><i>${s.desc}</i></p><p>CD: ${s.cd}</p>`;
})}</ul></div>`;
const txbox = (img, spek, cont, extra = null) => `<div class="txbox"><img src="${img}"><div class="inner"><div class="box"><p class="tx title">${spek}</p><p class="tx">${cont}</p></div>${extra ?? ""}</div></div>`;
const nextBtn = (txt) => `<br><button class="next-btn" id="next">${txt}</button>`;
const applyNextHandle = (fn) => onClick(getEl("next"), fn);
const Wizard = char("Wizard", "He may be old, but he has a cool hat.", "wizzy_the_wizard_happy.png", {
    "fball": new Skill(() => alert("fireball"), "Fireball", "Launch a powerful fireball at an enemy.", 1)
});
const charList = [Wizard];

const wiz = new Wizard();
//wiz.use("fball");
const ui = new UI();
//ui.tx = card(wiz);
const teamUI = new UI();
const uiBtns = new UI();
uiBtns.style({
    "top": "20px",
    "left": "50vw",
    "position": "fixed",
    "display": "flex",
    "flexDirection": "row",
    "gap": "10px"
});
uiBtns.tx = `<button id="team_btn">Team</button>`;
const pickerUI = new UI();
pickerUI.style({
    "top": "50%",
    "left": "50%",
    "width": "40vw",
    "height": "40vh",
    "backgroundColor": "#bdbdbd",
    "display": "none",
    "gridTemplateRows": `repeat(${charList.length}, 1fr)`,
    "gridTemplateColumns": `repeat(${charList.length}, 1fr)`,
    "gap": "20px",
    "position": "fixed",
    "zIndex": "999"
});
const team = [];

const tut = new UI();
const wtwBase = new PathBase("wizzy_the_wizard_", "png");
var i = 0;
const tutTxts = [["happy", "HELLO I AM WIZZY THE WIZARD."], ["happy", "LETS START BY ADDING ME TO YOUR TEAM.<br>CLICK THE \"TEAM\" BUTTON."], ["happy", "CLICK THE PLUS SYMBOL ON THE FIRST OPEN SLOT.<br>THEN CLICK MY PORTRAIT FROM THE PICKER."], ["scared", "!!!"]];
const tutUpd = () => {
    if(i >= tutTxts.length) {
        tut.tx = "";
        tut.hide();
        i = 0;
        fredTextsUpd();
        return;
    }
    const x = tutTxts[i];
    tut.tx = txbox(wtwBase.gen(x[0]), "Wizzy The Wizard", x[1], nextBtn("Next"));
    applyNextHandle(nextBtnClick);
}
const nextBtnClick = () => {
    i++;
    tutUpd();
}
tutUpd();
const fredScene = new UI();
const fredPath = "fred_the_cat.png";
const fredSceneTexts = ["it is i fred", "i have come to take over your planet cuz i am very evil"];
const fredTextsUpd = () => {
    if(i >= fredSceneTexts.length) {
        fredScene.tx = "";
        fredScene.hide();
        i = 0;
        tutPostUpd();
        return;
    }
    const x = fredSceneTexts[i];
    fredScene.tx = txbox(fredPath, "Fred The Cat", x, nextBtn("Next"));
    applyNextHandle(fredNextBtnClick);
}
const fredNextBtnClick = () => {
    i++;
    fredTextsUpd();
}
const tutPostFred = new UI();
const tutPostTxts = [["scared", "WE MUST STOP HIM!"], ["scared", "MOVE USING WASD.<br>YOU CAN USE A SKILL BY CLICKING MOUSE 1 WHILE THE SKILL IS ACTIVE."], ["scared", "SWAP ACTIVE CHARACTER BY USING THE SIDE BAR.<br>CLICK A CHARACTER TO USE THEM."], ["scared", "SWAP ACTIVE SKILL BY PRESSING THE NUMBER KEYS."], ["happy", "NOW GO! FIGHT! HERE COMES AN ENEMY NOW!"]];
const tutPostUpd = () => {
    if(i >= tutPostTxts.length) {
        tutPostFred.tx = "";
        tutPostFred.hide();
        i = 0;
        showClubberPopup();
        return;
    }
    const x = tutPostTxts[i];
    tutPostFred.tx = txbox(wtwBase.gen(x[0]), "Wizzy The Wizard", x[1], nextBtn("Next"));
    applyNextHandle(tutPostFredClick);
}
const tutPostFredClick = () => {
    i++;
    tutPostUpd();
}
const clubberPopup = new UI();
const showClubberPopup = () => {
    clubberPopup.tx = txbox("clubber_angry.png", "Clubber", "OOGA BOOGA.", nextBtn("Next"));
    applyNextHandle(closeClubberPopup);
}
const closeClubberPopup = () => {
    clubberPopup.tx = "";
    clubberPopup.hide();
}

const teamBtn = getEl("team_btn");
const openTeamMenu = () => {
    uiBtns.style({ "display": "none" });
    teamUI.tx = "<div>";
    for(let i = 0; i < 4; i++) {
        const t = team[i];
        if(!t) teamUI.tx += `<div class="team-slot empty"><p>Empty Slot</p><button class="team-slot-assign" id="empty-${i}">+</button>`;
        else teamUI.tx += `<div><img src="${t.img}"><p>${t.name}</p></div>`;
    }
    teamUI.tx += "</div>";
    for(let i = 0; i < 4; i++) if(!team[i]) onClick(getEl(`empty-${i}`), assignToSlot);
}
const closeTeamMenu = () => {
    uiBtns.style({ "display": "flex" });
    teamUI.tx = "";
}
const assignToSlot = (e) => {
    const assignTo = Number(e.currentTarget.id.split("empty-")[1]);
    const handleChoose = (e) => {
        const id = e.currentTarget.id;
        const real = charInst.find(c => c.name == id);
        team[assignTo] = real;
        closeTeamMenu();
        openTeamMenu();
        pickerUI.style({ "display": "none" });
    }
    pickerUI.style({ "display": "grid" });
    const charInst = charList.map(c => new c());
    pickerUI.tx = charInst.map(c => `<div><button id="${c.name}"><img src="${c.img}"><p>${c.name}</p></button></div>`).join("");
    charInst.forEach(c => onClick(getEl(c.name), handleChoose));
}
onClick(teamBtn, openTeamMenu);