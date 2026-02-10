// import { Scene } from "/phantom2d.js";

//window.addEventListener("error", (e) => alert(`msg: ${e.message}, ln: ${e.lineno}`));

const params = new URLSearchParams(window.location.search);

class InvalidNameError extends Error {
    constructor(charName) {
        super(`Character '${charName}' does not exist.`);
        this.name = "InvalidNameError";
    }
}

const configStr = localStorage.getItem("config");
if(configStr == null) console.warn("Config not present, loading defaults instead.");
const config = configStr != null ? JSON.parse(configStr) : {
    cleanup: false,
    resolution: 1080,
    quality: "med",
    master: 100,
    sfx: 100,
    music: 100
};

const append = (e) => document.body.appendChild(e);
const create = document.createElement.bind(document);
const getEl = document.getElementById.bind(document);
const keys = Object.keys.bind(Object);
/**
 * Applies a click listener.
 * @param {HTMLElement} el - The element.
 * @param {function} fn - The callback function.
 * @returns {void}
 */
const onClick = (el, fn) => el.addEventListener("click", fn);
const perfNow = performance.now.bind(performance);
const canvas = create("canvas");
append(canvas);
Object.assign(canvas.style, {
    "border": "5px solid red",
    "width": "60vw",
    "height": "60vh",
    "margin": "0",
    "padding": "0"
});
canvas.width = 2000;
canvas.height = 2000;
const ctx = canvas.getContext("2d");
//const scene = new Scene(canvas, 1000, 1000, "100vw", "100vh");

/**
 * A useful class for creating UI elements.
 * @class
 */
class UI {
    /**
     * The constructor for UI elements.
     */
    constructor() {
        /**
         * The innerHTML.
         * @type {string}
         * @prop
         */
        this.txt = "";
        /**
         * The actual element.
         * @type {HTMLDivElement}
         * @prop
         */
        this.el = create("div");
        append(this.el);
    }
    /**
     * GET the innerHTML.
     * @returns {string} The current innerHTML.
     */
    get tx() {
        return this.txt;
    }
    /**
     * SET the innerHTML.
     * @prop {string} txt - The new innerHTML.
     */
    set tx(txt) {
        this.txt = txt;
        this.refresh();
    }
    /**
     * Applies styles to the element.
     * @param {CSSStyleDeclaration} s - The new styles to apply.
     */
    style(s) {
        Object.assign(this.el.style, s);
    }
    /**
     * Refreshs the innerHTML content of the element.
     */
    refresh() {
        this.el.innerHTML = this.txt;
    }
    /**
     * Sets the display property of this element.
     * @param {"block" | "default" | "flex" | "grid" | "compact" | "inherit" | "inital" | "inline" | "inline-block" | "inline-flex" | "inline-grid" | "inline-table" | "marker" | "run-in" | "table" | "table-caption" | "table-cell" | "table-column" | "table-column-group" | "table-footer-group" | "table-header-group" | "table-row" | "table-row-group" | "none"} style - The new display style.
     */
    show(style) {
        this.style({ "display": style });
    }
    /**
     * Hides this element.
     */
    hide() {
        this.style({ "display": "none" });
    }
    /**
     * Adds classes to the classlist.
     * @param  {...string} cl - The new class(es) to be added.
     */
    addClass(...cl) {
        this.el.classList.add(...cl);
    }
    /**
     * Removes classes from the classlist.
     * @param  {...string} cl - The class(es) to be removed.
     */
    rmClass(...cl) {
        this.el.classList.remove(...cl);
    }
    /**
     * Assigns a property on this element's style.
     * @param {string} prop - The property name.
     * @param {string} val - The new property value.
     */
    setProp(prop, val) {
        this.el.style.setProperty(prop, val);
    }
}
/**
 * Used to create long-lasting audio pieces.
 * @class
 */
class Sound {
    /**
     * The constructor for Sound elements.
     * @param {string} src - The source for the audio.
     * @param {"wav" | "mpeg" | "mp4" | "webm" | "ogg" | "aac" | "aacp" | "x-caf" | "flac"} mime - The MIME type of the audio.
     */
    constructor(src, mime) {
        /**
         * The audio element.
         * @type {HTMLAudioElement}
         * @prop
         */
        this.el = create("audio");
        this.el.src = src;
        this.el.type = `audio/${mime}`;
        append(this.aud);
    }
    /**
     * Plays this audio.
     */
    start() {
        this.el.play();
    }
    /**
     * Pauses this audio.
     */
    stop() {
        this.el.pause();
    }
    /**
     * Seeks a new head time.
     * @param {int} h - The new head time.
     */
    seek(h) {
        this.el.currentTime = h;
    }
    /**
     * Sets the head time to 0 and re-plays it.
     */
    restart() {
        this.stop();
        this.seek(0);
        this.start();
    }
    /**
     * Returns the current volume.
     * @returns {int} The volume.
     */
    get vol() {
        return this.el.volume;
    }
    /**
     * Sets the current volume.
     * @param {int} n - The new volume to be applied.
     */
    set vol(n) {
        this.el.volume = n;
    }
}
/**
 * A useful class for creating short sound effects.
 * @class
 */
class SFX {
    /**
     * The constructor for SFX elements.
     * @param {string} src - The source of the SFX's audio.
     */
    constructor(src) {
        /**
         * The actual AudioContext.
         * @type {AudioContext}
         * @prop
         */
        this.aud = new AudioContext();
        this.aud.src = src;
        /**
         * The Oscillator for this audio.
         * @type {OscillatorNode}
         * @prop
         */
        this.osci = this.aud.createOscillator();
        /**
         * The gain controller for this audio.
         * @type {GainNode}
         * @prop
         */
        this.gain = this.aud.createGain();
        this.osci.connect(this.gain).connect(this.aud.destination);
    }
    /**
     * Continues playback.
     */
    start() {
        this.aud.resume();
    }
    /**
     * Stops playback.
     */
    stop() {
        this.aud.suspend();
    }
    /**
     * Returns this gain's volume.
     * @returns {int} The volume.
     */
    get vol() {
        return this.gain.gain.value;
    }
    /**
     * Sets this gain's volume.
     * @param {int} n - The new volume to be applied.
     */
    set vol(n) {
        this.gain.gain.value = n;
    }
    /**
     * Cleanup for this sound effect.
     * 
     * Closes the `AudioContext` and sets the `OscillatorNode` and
     * `GainNode` to `null` to be trash collected.
     */
    kill() {
        this.aud.close();
        this.osci = null;
        this.gain = null;
    }
}
/**
 * A simple utility class for generating paths.
 * @class
 */
class PathBase {
    /**
     * The constructor for `PathBase`.
     * @param {string} base - The pre-pended content.
     * @param {string} end - The post-pended content (the file extension).
     */
    constructor(base, end) {
        /**
         * The pre-pended content.
         * @type {string}
         * @prop
         */
        this.base = base;
        /**
         * The post-pended content (the file extension).
         * @type {string}
         * @prop
         */
        this.end = end;
    }
    /**
     * Generates a path.
     * @param {string} path - The path.
     * @returns {string} The generated path.
     */
    gen(path) {
        return `${this.base}${path}.${this.end}`;
    }
}
/**
 * A class to represent a game character.
 */
class Char {
    /**
     * The constructor for characters.
     * @param {string} name - The name of the character.
     * @param {string} desc - The description of the character.
     * @param {string} img - The path to the character's display image.
     * @param {Map<string, Skill>} abls - The abilities (skills) of the character.
     */
    constructor(name, desc, img, abls) {
        /**
         * The name of the character.
         * @type {string}
         * @prop
         */
        this.name = name;
        /**
         * The description of the character.
         * @type {string}
         * @prop
         */
        this.desc = desc;
        /**
         * The character's image.
         * @type {HTMLImageElement}
         * @prop
         */
        this.img = new Image();
        /**
         * The source to the character's image.
         * @type {string}
         * @prop
         */
        this.src = img;
        /**
         * The abilities (skills) of the character.
         * @type {Map<string, Skill>}
         * @prop
         */
        this.abls = abls;
        this.img.src = img;
        this.img.width = 3;
        this.img.height = 5;
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
        this.ready = false;
    }
}
class BadGuy {
    constructor(name, desc, img, { hurt = () => {}, die = () => {}, upd, attack }, { x = 0, y = 0, w, h, hp }) {
        this.name = name;
        this.desc = desc;
        this.img = new Image();
        this.src = img;
        this.maxHp = hp;
        this.hp = this.maxHp;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.hurt = hurt;
        this.die = die;
        this.upd = upd;
        this.attack = attack;
        this.img.src = img;
        this.img.width = this.w;
        this.img.height = this.h;
    }
}
class Geom {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
    upd() {
        const n = 100;
        if(this.x + n < 0 || this.x - n > canvas.width || this.y + n < 0 || this.y - n > canvas.width) {
            this.destroy();
        }
    }
    render() {
        ctx.fillStyle = this.color;
    }
    destroy() {
        geom.splice(geom.indexOf(this), 1);
    }
    isCol(o) {}
    col(o) {}
}
class Circle extends Geom {
    constructor(x, y, rad, color) {
        super(x, y, color);
        this.rad = rad;
    }
    render() {
        super.render();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2, false);
        ctx.fill();
    }
    isCol(o) {
        if(!(o instanceof Char || o instanceof Circle)) return;
        const t = o instanceof Char ? 0 : 1;
        const w1 = this.rad;
        const h1 = this.rad;
        const x1 = this.x;
        const y1 = this.y;
        const w2 = t == 0 ? o.img.width : o.rad;
        const h2 = t == 0 ? o.img.height : o.rad;
        const x2 = o.x;
        const y2 = o.y;
        return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
    }
}
class Fireball extends Circle {
    constructor(x, y, rad) {
        super(x, y, rad, "red");
        this.spd = 5;
        this.dir = 0;
        this.dir = Math.atan2(mouse.y - this.x, mouse.x - this.y);
    }
    upd() {
        super.upd();
        this.x += this.spd * Math.cos(this.dir);
        this.y += this.spd * Math.sin(this.dir);
    }
    col() {
        this.destroy();
    }
}
class ShopItem {
    constructor(name, desc, img, cost, onBuy) {
        this.name = name;
        this.desc = desc;
        this.img = img;
        this.cost = cost;
        this.onBuy = onBuy;
    }
    canBuy() {
        return this.cost <= gold;
    }
    buy() {
        if(!this.canBuy()) return;
        gold -= this.cost;
        this.onBuy();
    }
}
const char = (name, desc, img, abls) => class extends Char {
    constructor() {
        super(name, desc, img, abls);
        this.lvl = 1;
    }
}
const badguy = (name, desc, img, { hurt = () => {}, die = () => {}, upd, attack }, { w, h, hp }) => class extends BadGuy {
    constructor(x, y) {
        super(name, desc, img, { hurt, die, upd, attack }, { x, y, w, h, hp });
    }
}
const shopitem = (name, desc, img, cost, onbuy) => new ShopItem(name, desc, img, cost, onbuy);
const card = (c) => `<div><img src="${c.src}"><h1>${c.name}</h1><p><i>${c.desc}</i></p><ul>${keys(c.abls).map(k => {
    const s = c[k];
    return `<p><strong>${s.name}</strong></p><p><i>${s.desc}</i></p><p>CD: ${s.cd}</p>`;
})}</ul></div>`;
const txbox = (img, spek, cont, extra = null) => `<div class="txbox"><img src="${img}"><div class="inner"><div class="box"><p class="tx title">${spek}</p><p class="tx">${cont}</p></div>${extra ?? ""}</div></div>`;
const nextBtn = (txt) => `<br><button class="next-btn" id="next">${txt}</button>`;
const applyNextHandle = (fn) => onClick(getEl("next"), fn);
const Wizard = char("Wizard", "He may be old, but he has a cool hat.", "wizzy_the_wizard_happy.png", {
    "fball": new Skill(() => {
        const { x, y } = player;
        const a = getChar();
        if(!a) return;
        const w = a.img.width;
        const h = a.img.height;
        geom.push(new Fireball(x + w / 2, y + h / 2, 100));
    }, "Fireball", "Launch a powerful fireball at an enemy.", 0.5)
});
const Clubber = badguy("Clubber", "He's stylish, he's angry and he's here to hit you.", "clubber_angry.png", { upd: (t) => {
    const r = 100;
    const s = 5;
    if(Math.hypot(player.x - t.x, player.y - t.y) <= Math.pow(r, 2)) {
        t.x += player.x > t.x ? s : player.x < t.x ? -(s) : 0;
        t.y += player.y > t.y ? s : player.y < t.y ? -(s) : 0;
    } else {
        t.x++;
        t.y++;
    }
}, attack: (t) => {} }, { w: 10, h: 30, hp: 10 });
const Bower = badguy("Bower", "Nothing is going on inside his head, but he will shoot you.", "bower_angry.png", { upd: (t) => {}, attack: (t) => {} }, { w: 10, h: 30, hp: 10 });
const BigGuy = badguy("Big Guy", "A hulking beast of a man, no one dares mess with this titan.", "big_guy_angry.png", { upd: (t) => {}, attack: (t) => {} }, { w: 20, h: 30, hp: 100 });
const GraglonTheTerrible = badguy("Graglon The Terrible", "Angry, dangerous and ready to crush things.", "graglon_the_terrible_angry.png", { upd: (t) => {}, attack: (t) => {} }, { w: 50, h: 70, hp: 1000 });
const BiggerBalls = shopitem("Bigger Balls", "Make your balls bigger. And 19,48% more lethal.", "bigger_balls_upg.png", 100, () => {});
const WarmerFire = shopitem("Warmer Fire", "Make your fires 22% warmer. Use responsibly.", "warm_fire_upg.png", 100, () => {});
const PhoenixsWrath = shopitem("Phoenix's Wrath", "It's a bird! It's a plane! It's a Phoenix made of molten lava!", "phoenixs_wrath_upg.png", 1000, () => {});
const PurePlasma = shopitem("Pure Plasma", "Sucked souls are now purer. Now that's a lot of plasma.", "pure_plasma_upg.png", 100, () => {});
const MoreTroops = shopitem("More Troops", "And what army?", "more_troops_upg.png", 100, () => {});
const SharpSwords = shopitem("Sharp Swords", "Sharper <i>and</i> stabbier. Leaks blood of enemies more effectively.", "sharp_swords_upg.png", 100, () => {});
const CovertOps = shopitem("Covert Ops", "A RED Spy is in the base?!", "covert_ops_upg.png", 2000, () => {});
const getTeamIdx = (name) => team.indexOf(team.find(c => c.name == name));
/**
 * A list of all the avalible characters.
 * @type {Char[]}
 */
const charList = [Wizard];
/**
 * The components of the scene.
 * @type {BadGuy[]}
 */
const scene = [];
/**
 * Various geometric elements.
 * @type {Geom[]}
 */
const geom = [];
/**
 * All the shop items.
 * @type {ShopItem[]}
 */
const shopItems = [BiggerBalls, WarmerFire, PhoenixsWrath, PurePlasma, MoreTroops, SharpSwords, CovertOps];

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
    "top": "50%",
    "left": "50%",
    "transform": "translate(-50%, -50%)",
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
const settings = new UI();
settings.style({
    "left": "50%",
    "top": "50%",
    "transform": "translate(-50%, -50%)",
    "display": "flex",
    "position": "fixed",
    "flexDirection": "column",
    "gap": "20px",
    "backgroundColor": "#757575",
    "padding": "50px"
});
const shopIcon = new UI();
shopIcon.style({
    "left": "50px",
    "bottom": "50px",
    "position": "fixed"
});
shopIcon.tx = `<img src="shop_icon.png" width="80px" height="70px">`;
const shopUI = new UI();
shopUI.style({
    "position": "fixed",
    "left": "0",
    "top": "0",
    "width": "100vw",
    "height": "100vh",
    "display": "none"
});
const showShopUI = () => {
    const ran = () => Math.floor(Math.random() * shopItems.length);
    let idx;
    const resIdx = [];
    while(resIdx.length < 3) {
        idx = ran();
        if(resIdx.includes(idx)) continue;
        resIdx.push(idx);
    }
    const outItems = [shopItems[resIdx[0]], shopItems[resIdx[1]], shopItems[resIdx[2]]];
    shopUI.tx = `<div style="display: flex; flex-direction: column;"><img src="shop_icon.png" style="width: 15vw; height: 15vw; left: 50vw; top: 50vh;" style="position: fixed"><div style="flex-direction: row">${outItems.map(s => `<img src="${s.img}" id="shop_item_${s.name}" style="bottom: 5%; margin-right: 50px; width: 100px; height: 100px;">`).join("")}</div></div><button id="close_shop">Close</button>`;
    shopUI.show("block");
    onClick(getEl("close_shop"), hideShopUI);
    const purchases = (e) => {
        const x = outItems.find(i => i.name == e.target.id.split("shop_item_")[1]);
        const el = getEl(`shop_item_${x.name}`);
        x.buy();
        if(!x.canBuy()) return;
        el.style.display = "none";
        el.removeEventListener("click", purchases);
    }
    outItems.forEach(s => onClick(getEl(`shop_item_${s.name}`), purchases));
}
const hideShopUI = () => {
    shopUI.tx = "";
    shopUI.hide();
}
onClick(shopIcon.el, showShopUI);
const settingsField = (text, extra) => {
    const tc = text.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const id = text.replace(/\s/g, "_");
    return [`<div style="flex-direction: row"><p>${tc}: <span id="${id}">loading...</span></p>${extra}</div>`, id];
}
let settingsHtml = "<h1>Settings</h1>";
const [fieldCleanupOnClose, fieldCleanupOnCloseId] = settingsField("cleanup on close", `<button id="toggle_cleanup_on_close">Toggle</button>`);
settingsHtml += fieldCleanupOnClose;
const [fieldResolution, fieldResolutionId] = settingsField("resolution", `<select id="resolution_opts"><option value="1080">1920x1080 (1080p)</option><option value="1440">2560x1440 (1440p)</option><option value="720">1280x720 (720p)</option><option value="360">640x360 (360p)</option></select>`);
settingsHtml += fieldResolution;
const [fieldQuality, fieldQualityId] = settingsField("quality", `<select id="quality_opts"><option value="qultrahigh">Ultra High</option><option value="qhigh">High</option><option value="qmed">Medium (recommended)</option><option value="qlow">Low</option><option value="qultralow">Ultra Low</option></select>`);
settingsHtml += fieldQuality;
const [fieldMasterVol, fieldMasterVolId] = settingsField("master volume", `<input type="range" min="0" max="100" value="100" id="master_vol_slider">`);
settingsHtml += fieldMasterVol;
const [fieldSFXVol, fieldSFXVolId] = settingsField("sound effects volume", `<input type="range" min="0" max="100" value="100" id="sfx_vol_slider">`);
settingsHtml += fieldSFXVol;
const [fieldMusicVol, fieldMusicVolId] = settingsField("music volume", `<input type="range" min="0" max="100" value="100" id="music_vol_slider">`);
settingsHtml += fieldMusicVol;
settingsHtml += `<button id="import-game">Import</button>`;
settingsHtml += `<button id="export-game">Export</button>`;
settingsHtml += `<button id="settings-done">Done</button>`;
settings.tx = settingsHtml;
const fieldCleanupOnCloseDisplay = getEl(fieldCleanupOnCloseId);
const toggleCleanupOnClose = getEl("toggle_cleanup_on_close");
const setFieldCleanupOnCloseDisplayVal = () => fieldCleanupOnCloseDisplay.textContent = config.cleanup;
const toggleFieldCleanupOnClose = () => config.cleanup = !config.cleanup;
const fieldCleanupOnCloseNext = () => {
    toggleFieldCleanupOnClose();
    setFieldCleanupOnCloseDisplayVal();
}
const fieldResolutionDisplay = getEl(fieldResolutionId);
const fieldResolutionSelect = getEl("resolution_opts");
const setFieldResolutionVal = () => { fieldResolutionDisplay.textContent = config.resolution; fieldResolutionSelect.value = config.resolution; }
const applyFieldResolution = () => config.resolution = Number(fieldResolutionSelect.value);
const fieldResolutionNext = () => {
    applyFieldResolution();
    setFieldResolutionVal();
}
const fieldQualityDisplay = getEl(fieldQualityId);
const fieldQualitySelect = getEl("quality_opts");
const setFieldQualityVal =  () => { fieldQualityDisplay.textContent = { "uhigh": "ultra high", "high": "high", "med": "medium", "low": "low", "ulow": "ultra low" }[config.quality]; fieldQualitySelect.value = { "uhigh": "qultrahigh", "high": "qhigh", "med": "qmed", "low": "qlow", "ulow": "qultralow" }[config.quality]; }
const applyFieldQuality = () => config.quality = { "qultrahigh": "uhigh", "qhigh": "high", "qmed": "med", "qlow": "low", "qultralow": "ulow" }[fieldQualitySelect.value];
const fieldQualityNext = () => {
    applyFieldQuality();
    setFieldQualityVal();
}
const fieldMasterVolDisplay = getEl(fieldMasterVolId);
const fieldMasterVolSlider = getEl("master_vol_slider");
const setFieldMasterVolVal = () => { fieldMasterVolDisplay.textContent = config.master; fieldMasterVolSlider.value = config.master; }
const applyFieldMasterVol = () => config.master = fieldMasterVolSlider.value;
const fieldMasterVolNext = () => {
    applyFieldMasterVol();
    setFieldMasterVolVal();
}
const fieldSFXVolDisplay = getEl(fieldSFXVolId);
const fieldSFXVolSlider = getEl("sfx_vol_slider");
const setFieldSFXVolVal = () => { fieldSFXVolDisplay.textContent = config.sfx; fieldSFXVolSlider.value = config.sfx; }
const applyFieldSFXVol = () => config.sfx = fieldSFXVolSlider.value;
const fieldSFXVolNext = () => {
    applyFieldSFXVol();
    setFieldSFXVolVal();
}
const fieldMusicVolDisplay = getEl(fieldMusicVolId);
const fieldMusicVolSlider = getEl("music_vol_slider");
const setFieldMusicVolVal = () => { fieldMusicVolDisplay.textContent = config.music; fieldMusicVolSlider.value = config.music; }
const applyFieldMusicVol = () => config.music = fieldMusicVolSlider.value;
const fieldMusicVolNext = () => {
    applyFieldMusicVol();
    setFieldMusicVolVal();
}
onClick(toggleCleanupOnClose, fieldCleanupOnCloseNext);
fieldResolutionSelect.addEventListener("change", fieldResolutionNext);
fieldQualitySelect.addEventListener("change", fieldQualityNext);
fieldMasterVolSlider.addEventListener("change", fieldMasterVolNext);
fieldSFXVolSlider.addEventListener("change", fieldSFXVolNext);
fieldMusicVolSlider.addEventListener("change", fieldMusicVolNext);
setFieldCleanupOnCloseDisplayVal();
setFieldResolutionVal();
setFieldQualityVal();
setFieldMasterVolVal();
setFieldSFXVolVal();
setFieldMusicVolVal();
const createPicker = async () => {
    if(!window.showOpenFilePicker) return alert("Your browser does not support the File System API.");
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            "excludeAcceptAllOption": true,
            "types": [{ "accept": { "application/json": [".json"] } }]
        });
        const file = await fileHandle.getFile();
        return await file.text();
    } catch(e) {
        if(e.name == "AbortError") {
            alert("Load fail: aborted.");
        }
        else alert(`Load fail: ${e.name}`);
    }
}
const dataImport = async () => {
    const pre = perfNow();
    console.log("Loading picker...");
    const jsonRaw = await createPicker();
    const pro1 = perfNow();
    console.log(`Got input file. (in ${pro1 - pre}ms)`);
    console.log("Generating content...");
    const json = JSON.parse(jsonRaw);
    // critical player keys:
    // x, y, activechar, activeskill
    // critical team values:
    // the char name (that will be mapped to re-generate)
    // note: charList exists, search from charList to re-generate
    // critical misc keys:
    // gold
    player.x = json.x;
    player.y = json.y;
    for(const t of json.team) {
        // find the matching character; throw if not exists
        // create new instances and just use name property
        // test trim for better support
        // char will be Char | undefined
        const inst = charList.map(c => new c());
        const char = inst.find(c => c.name.trim() == t.trim());
        if(char) {
            team.push(char);
        } else {
            throw new InvalidNameError(t);
        }
    }
    gold = json.gold;
    const pro = perfNow();
    console.log(`Loaded save. (in ${pro - pre}ms)`);
}
const genJSONFile = () => {
    const pre = perfNow();
    console.log("Generating export save...");
    const json = JSON.stringify({
        "x": player.x, "y": player.y, "activechar": activeChar, "activeskill": activeSkill,
        "team": team.map(c => c.name), "gold": gold
    }, null, 4);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = create("a");
    a.href = url;
    a.download = "really-bad-rpg-export.json";
    append(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    const pro = perfNow();
    console.log(`Created export save. (in ${pro - pre}ms)`);
}
const importBtn = getEl("import-game");
const exportBtn = getEl("export-game");
onClick(importBtn, dataImport);
onClick(exportBtn, genJSONFile);
const settingsScreenDone = () => {
    console.log("Saving preferences...");
    const pre = perfNow();
    localStorage.setItem("config", JSON.stringify(config));
    const pro = perfNow();
    console.log(`Saved successfully. (in ${pro - pre}ms)`);
    settings.hide();
}
onClick(getEl("settings-done"), settingsScreenDone);
settings.hide();
/**
 * The characters assigned onto the player's team.
 * @type {Char[]}
 */
const team = [];
var activeChar = 0;
var activeSkill = 0;
const inputs = {};
const player = {
    x: 0, y: 0, spd: 5
};
const mouse = { x: 0, y: 0 };
var gold = 0;
const getChar = () => team[activeChar];

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
    scene.push(new Clubber(10, 10));
}

const teamBtn = getEl("team_btn");
const openTeamMenu = () => {
    uiBtns.style({ "display": "none" });
    teamUI.tx = "<div>";
    for(let i = 0; i < 4; i++) {
        const t = team[i];
        if(!t) teamUI.tx += `<div class="team-slot empty"><p>Empty Slot</p><button class="team-slot-assign" id="empty-${i}">+</button></div>`;
        else teamUI.tx += `<div><img src="${t.src}"><p>${t.name}</p></div>`;
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
    pickerUI.tx = charInst.map(c => `<div><button id="${c.name}"><img src="${c.src}"><p>${c.name}</p></button></div>`).join("");
    charInst.forEach(c => onClick(getEl(c.name), handleChoose));
}
onClick(teamBtn, openTeamMenu);
const refreshTeamSelect = () => {
    teamSelectUI.tx = team.map(c => `<div><button class="team-select" id="select-${c.name}"><img src="${c.src}" style="border-radius: 50%; width: 70px; height: 70px"></button></div>`).join("");
    team.forEach(c => onClick(getEl(`select-${c.name}`), (e) => activeChar = getTeamIdx(e.currentTarget.id.split("select-")[1]) - 1));
    refreshSkillList();
}
const refreshSkillList = () => {
    const a = team[activeChar];
    if(!a) return;
    skillMenuUI.tx = keys(a.abls).map((k, i) => `<p ${i == activeSkill ? `class="active-skill"` : ""}>${a.abls[k].name}</p>`).join("");
}
if(!params.has("skip") || params.get("skip") != "true") {
    tutUpd();
} else {
    tut.hide();
    team.push(new Wizard());
    refreshTeamSelect();
    refreshSkillList();
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
    const a = team[activeChar];
    if(a) {
        ctx.drawImage(a.img, player.x, player.y);
    }
    scene.forEach(e => {
        e.upd(e);
        ctx.drawImage(e.img, e.x, e.y);
    });
    geom.forEach(g => {
        g.upd();
        g.render();
    });
    geom.forEach(g1 => {
        geom.forEach(g2 => {
            if(g1 == g2) return;
            if(g1.isCol(g2)) g1.col(g2);
        });
    });
    refreshSkillList();
    requestAnimationFrame(render);
}
render();
function handleInputs() {
    if(down("Escape")) settings.show("flex");
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
window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    mouse.x = (e.clientX - rect.left) * sx;
    mouse.y = (e.clientY - rect.top) * sy;
});