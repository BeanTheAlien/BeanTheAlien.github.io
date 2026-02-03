import { Scene } from "/phantom2d.js";

const config = {
    cleanup: false
};

const append = (e) => document.body.appendChild(e);
const create = document.createElement.bind(document);
const getEl = document.getElementById.bind(document);
const keys = Object.keys.bind(Object);
const onClick = (el, fn) => el.addEventListener("click", fn);
const canvas = create("canvas");
append(canvas);
canvas.style.border = "10px solid red";
const ctx = canvas.getContext("2d");
//const scene = new Scene(canvas, 1000, 1000, "100vw", "100vh");

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
    addClass(...cl) {
        this.el.classList.add(...cl);
    }
    rmClass(...cl) {
        this.el.classList.remove(...cl);
    }
    setProp(prop, val) {
        this.el.style.setProperty(prop, val);
    }
}
class Sound {
    constructor(src, mime) {
        this.el = create("audio");
        this.el.src = src;
        this.el.type = `audio/${mime}`;
        append(this.aud);
    }
    start() {
        this.el.play();
    }
    stop() {
        this.el.pause();
    }
    seek(h) {
        this.el.currentTime = h;
    }
    restart() {
        this.stop();
        this.seek(0);
        this.start();
    }
    get vol() {
        return this.el.volume;
    }
    set vol(n) {
        this.el.volume = n;
    }
}
class SFX {
    constructor(src) {
        this.aud = new AudioContext();
        this.aud.src = src;
        this.osci = this.aud.createOscillator();
        this.gain = this.aud.createGain();
        this.osci.connect(this.gain).connect(this.aud.destination);
    }
    start() {
        this.aud.resume();
    }
    stop() {
        this.aud.suspend();
    }
    get vol() {
        return this.gain.gain.value;
    }
    set vol(n) {
        this.gain.gain.value = n;
    }
    kill() {
        this.aud.close();
        this.osci = null;
        this.gain = null;
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
    }
    use(skill, ...args) {
        this.abls[skill].use(...args);
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
class BadGuy {
    constructor(name, desc, img, { hurt = () => {}, die = () => {}, upd, attack }, { x = 0, y = 0, hp }) {
        this.name = name;
        this.desc = desc;
        this.img = img;
        this.maxHp = hp;
        this.hp = this.maxHp;
        this.x = x;
        this.y = y;
        this.hurt = hurt;
        this.die = die;
        this.upd = upd;
        this.attack = attack;
    }
}
const char = (name, desc, img, abls) => class extends Char {
    constructor() {
        super(name, desc, img, abls);
        this.lvl = 1;
    }
}
const badguy = (name, desc, img, { hurt = () => {}, die = () => {}, upd, attack }, hp) => class extends BadGuy {
    constructor(x, y) {
        super(name, desc, img, { hurt, die, upd, attack }, { x, y, hp });
    }
}
const card = (c) => `<div><img src="${c.img}"><h1>${c.name}</h1><p><i>${c.desc}</i></p><ul>${keys(c.abls).map(k => {
    const s = c[k];
    return `<p><strong>${s.name}</strong></p><p><i>${s.desc}</i></p><p>CD: ${s.cd}</p>`;
})}</ul></div>`;
const txbox = (img, spek, cont, extra = null) => `<div class="txbox"><img src="${img}"><div class="inner"><div class="box"><p class="tx title">${spek}</p><p class="tx">${cont}</p></div>${extra ?? ""}</div></div>`;
const nextBtn = (txt) => `<br><button class="next-btn" id="next">${txt}</button>`;
const applyNextHandle = (fn) => onClick(getEl("next"), fn);
const Wizard = char("Wizard", "He may be old, but he has a cool hat.", "wizzy_the_wizard_happy.png", {
    "fball": new Skill(() => alert("fireball"), "Fireball", "Launch a powerful fireball at an enemy.", 1),
    "test": new Skill(() => {}, "TEST", "test", 1)
});
const Clubber = badguy("Clubber", "He's stylish, he's angry and he's here to hit you.", "clubber_angry.png", { upd: () => {}, attack: () => {} }, 10);
const Bower = badguy("Bower", "Nothing is going on inside his head, but he will shoot you.", "bower_angry.png", { upd: () => {}, attack: () => {} }, 10);
const BigGuy = badguy("Big Guy", "A hulking beast of a man, no one dares mess with this titan.", "big_guy_angry.png", { upd: () => {}, attack: () => {} }, 100);
const GraglonTheTerrible = badguy("Graglon The Terrible", "Angry, dangerous and ready to crush things.", "graglon_the_terrible_angry.png", { upd: () => {}, attack: () => {} }, 1000);
const getTeamIdx = (name) => team.indexOf(team.find(c => c.name == name));
const charList = [Wizard];

const titleScreen = new UI();
titleScreen.tx = `<div class="ts-bg"><h1 class="title-screen-title">Really Bad RPG</h1><div style="margin-bottom: 20px"></div><button class="start" id="start-btn">Start</button></div>`;
onClick(getEl("start-btn"), () => titleScreen.hide());
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
    "transform": "translate(50%, -50%)",
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
const skillMenuUI = new UI();
skillMenuUI.style({
    "top": "20%",
    "left": "30px",
    "display": "flex",
    "flexDirection": "column",
    "gap": "20px",
    "position": "fixed"
});
const teamSelectUI = new UI();
teamSelectUI.style({
    "top": "20px",
    "left": "20px",
    "display": "flex",
    "flexDirection": "column",
    "gap": "20px",
    "position": "fixed"
});
const team = [];
var activeChar = 0;
var activeSkill = 0;
const inputs = {};
const player = {
    x: 0, y: 0, spd: 2
};

const tut = new UI();
const tutOverlayUI = new UI();
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
    tutOverlayUI.rmClass("overlay");
    if(i == 2) {
        tutOverlayUI.addClass("overlay");
        tutUICircle(teamBtn);
    }
}
const rmOverlay = () => {
    tutOverlayUI.rmClass("overlay");
}
const nextBtnClick = () => {
    i++;
    tutUpd();
}
tutUpd();
const tutUICircle = (el) => {
    const rect = el.getBoundingClientRect();
    tutOverlayUI.setProp("--x", rect.left + rect.width / 2 + "px");
    tutOverlayUI.setProp("--y", rect.top + rect.height / 2 + "px");
}
onClick(getEl("team_btn"), rmOverlay);
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
    activeChar = 0;
}

const teamBtn = getEl("team_btn");
const openTeamMenu = () => {
    uiBtns.style({ "display": "none" });
    teamUI.tx = "<div>";
    for(let i = 0; i < 4; i++) {
        const t = team[i];
        if(!t) teamUI.tx += `<div class="team-slot empty"><p>Empty Slot</p><button class="team-slot-assign" id="empty-${i}">+</button></div>`;
        else teamUI.tx += `<div><img src="${t.img}"><p>${t.name}</p></div>`;
    }
    teamUI.tx += `<button class="save-lineup" id="close">Save</button></div>`;
    for(let i = 0; i < 4; i++) if(!team[i]) onClick(getEl(`empty-${i}`), assignToSlot);
    onClick(getEl("close"), closeTeamMenu);
    // if(i == 2) {
    //     const es = getEl("empty-0");
    //     tutOverlayUI.addClass("overlay");
    //     tutUICircle(es);
    //     onClick(es, rmOverlay);
    // }
}
const closeTeamMenu = () => {
    uiBtns.style({ "display": "flex" });
    teamUI.tx = "";
    teamSelectUI.show("flex");
    skillMenuUI.show("flex");
    refreshTeamSelect();
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
const refreshTeamSelect = () => {
    teamSelectUI.tx = team.map(c => `<div><button class="team-select" id="select-${c.name}"><p>${c.name}</p></button></div>`).join("");
    team.forEach(c => onClick(getEl(`select-${c.name}`), (e) => activeChar = getTeamIdx(e.currentTarget.id.split("select-")[1]) - 1));
    refreshSkillList();
}
const refreshSkillList = () => {
    const a = team[activeChar];
    if(!a) return;
    skillMenuUI.tx = keys(a.abls).map((k, i) => `<p ${i == activeSkill ? `class="active-skill"` : ""}>${a.abls[k].name}</p>`).join("");
}

canvas.addEventListener("click", () => {
    const a = team[activeChar];
    if(!a) return;
    const x = keys(a.abls)[activeSkill];
    if(!x) return;
    a.use(x);
});
document.addEventListener("keydown", (e) => inputs[e.code] = true);
document.addEventListener("keyup", (e) => inputs[e.code] = false);

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleInputs();
    ctx.fillStyle = "#5184f3";
    ctx.fillRect(player.x, player.y, 10, 20);
    refreshSkillList();
    requestAnimationFrame(render);
}
render();
function handleInputs() {
    for(let i = 1; i <= 9; i++) if(down(`Digit${i}`)) activeSkill = i-1;
    const shift = down("ShiftLeft") || down("ShiftRight");
    const spd = player.spd;
    const sspd = spd * 2;
    const move = !shift ? spd : sspd;
    if(down("KeyW")) player.y -= move;
    if(down("KeyA")) player.x -= move;
    if(down("KeyS")) player.y += move;
    if(down("KeyD")) player.x += move;
}
function down(k) {
    return inputs[k];
}

// cleanup listener; called when window is being closed
// see the 'cleanup' property as specified in config, it controls whether this will run
window.addEventListener("beforeunload", (e) => {
    if(!config.cleanup) return;
    e.preventDefault();
    // legacy support
    e.returnValue = true;
});