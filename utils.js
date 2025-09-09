export function random(a = 0, b = 101) {
    const x = Math.min(a, b);
    const y = Math.max(a, b);
    return Math.floor(Math.random() * (Math.floor(y) - Math.ceil(x)) + Math.ceil(x));
}

export function chance(floor = 50) {
    return (random() <= floor);
}

export function inRange(a = 0, b = 100) {
    const x = Math.min(a, b);
    const y = Math.max(a, b);
    return (x <= this && this <= y);
}

Number.prototype.inRange = inRange;

export function toUpper() {
    return this.toUpperCase();
}

String.prototype.toUpper = toUpper;

export function toLower() {
    return this.toLowerCase();
}

String.prototype.toLower = toLower;

export function toTitle() {
    return this.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase());
}

String.prototype.toTitle = toTitle;

export function repeat(times) {
    for(let i = 0; i < times; i++) {
        try {
            this();
        } catch(error) {
            console.log(error);
        }
    }
}

Function.prototype.repeat = repeat;

export function big(n = 1) {
    return this.sort((a, b) => a - b)[n - 1];
}

Array.prototype.big = big;

export function toInt(fb = null) {
    let cleaned = String(this).replace(/[^0-9\.\-]/g, "");
    let result = [];
    let c = cleaned.split('');
    for(let i = 0; i < c.length; i++) {
        if(i != 0 && c[i] != "-") result.push(c[i]);
        else if(i == 0 && c[i] == "-") result.push(c[i]);
    }
    let dots = 0;
    for(let i = 0; i < result.length; i++) if(result[i] == ".") dots++;
    let m = result.join('');
    for(let i = 0; i < (dots - 1); i++) {
        m = m.replace(".", "");
    }
    try {
        return parseInt(m);
    } catch {
        return fb ?? 0;
    }
}

export function toFloat(fb = null) {
    let cleaned = String(this).replace(/[^0-9\.\-]/g, "");
    let result = [];
    let c = cleaned.split('');
    for(let i = 0; i < c.length; i++) {
        if(i != 0 && c[i] != "-") result.push(c[i]);
        else if(i == 0 && c[i] == "-") result.push(c[i]);
    }
    let dots = 0;
    for(let i = 0; i < result.length; i++) if(result[i] == ".") dots++;
    let m = result.join('');
    for(let i = 0; i < (dots - 1); i++) {
        m = m.replace(".", "");
    }
    try {
        return parseFloat(m);
    } catch {
        return fb ?? 0;
    }
}

Object.prototype.toInt = toInt;
Object.prototype.toFloat = toFloat;

export function floor() {
    return Math.floor(this);
}

Number.prototype.floor = floor;

export function roof() {
    return Math.ceil(this);
}

Number.prototype.roof = roof;

Object.defineProperty(Array.prototype, "indexAs", {
    get() {
        return this._indexAs;
    },
    set(n) {
        if(typeof n != "number") return;
        this._indexAs = Math.round(n);
    }
});

export function getIndex(index) {
    return this[this.indexAs * index];
}

Array.prototype.getIndex = getIndex;

export function splitAll(delimiter) {
    return this.map(item => item.split(delimiter));
}

Array.prototype.splitAll = splitAll;

export function sub(Old, New) {
    return this.map(item => item == Old ? New : item);
}

Array.prototype.sub = sub;

export function remove(...bad) {
    for(let i = this.length - 1; i >= 0; i--) {
        if(bad.includes(this[i])) {
            this.splice(i, 1);
        }
    }
    return this;
}

Array.prototype.remove = remove;

export function add(...vals) {
    vals.forEach(val => this.push(val));
    return this;
}

Array.prototype.add = add;

export function toHTML() {
    function parseComponents(data) {
        function check(r, z) {
            const match = r.match(new RegExp(`${z}\\n*=\\n*(.+)`));
            return `${z}=${match[1]}`;
        }
        function chuck(r, z) { return (r.match(new RegExp(`${z}\\n*=\\n*(.+)`))); }
        let comps = [];
        const d = data.split(",").map(r => r.trim());
        const things = ["id", "style", "class", "type", "placeholder", "onclick", "src", "href", "target", "width", "height"];
        for(let i = 0; i < d.length; i++) {
            const x = d[i];
            things.forEach(thing => {
                if(chuck(x, thing)) comps.push(check(x, thing));
            });
        }
    }
    let content = this;
    // Paragraph spacing
    content = content.replace(/\n/g, `<div style="margin-bottom: 10px;"></div>`);
    content = content.trim();
    content = content.replace(/\s*/, "");
    const regex = "[(.+?)({(.*?(?:,(?!}))?)})?](.*?)?[/(.+?)]";
    const repl = (_, type, comps, content) => `<${type} ${parseComponents(comps ?? "")}>${content}<${type}>`;
    while(true) {
        if(!regex.test(content)) break;
        content = content.replace(regex, repl);
    }
    return content;
}

String.prototype.toHTML = toHTML;

export function getEl(id) {
    return document.getElementById(id);
}

export function clickEvent(execute) {
    try {
        this.addEventListener("click", execute);
    } catch(error) {
    }
}

Element.prototype.clickEvent = clickEvent;

export function hoverEvent(start, end) {
    try {
        this.addEventListener("mouseover", start);
        this.addEventListener("mouseout", end);
    } catch(error) {
        console.log(error);
    }
}

Element.prototype.hoverEvent = hoverEvent;

export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function shuffle() {
    for(let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
}

Array.prototype.shuffle = shuffle;

export function beginsWith(...starts) {
    return starts.some(start => this.startsWith(start));
}

String.prototype.beginsWith = beginsWith;

export function toBool() {
    return !!this;
}

Object.prototype.toBool = toBool;

export function isTrue(...conds) {
    return conds.every(cond => safeEval(cond));
}

export function isFalse(...conds) {
    return conds.every(cond => !safeEval(cond));
}

export function safeEval(value) {
    try {
        return (new Function(`return (${value})`))();
    } catch {
        return value;
    }
}

export function bkgColor() {
    return this.style.backgroundColor;
}

Element.prototype.bkgColor = bkgColor;

export function randomItem() {
    return this[random(0, this.length)];
}

Array.prototype.randomItem = randomItem;

export function randomKey() {
    return Object.keys(this)[random(0, Object.keys(this).length)];
}

Object.prototype.randomKey = randomKey;

export function randomValue() {
    return Object.values(this)[random(0, Object.values(this).length)];
}

Object.prototype.randomValue = randomValue;

export function randomEntry() {
    return Object.entries(this)[random(0, Object.entries(this).length)];
}

Object.prototype.randomEntry = randomEntry;

export function clamp(a = 0, b = 100) {
    const x = a;
    const y = b;
    a = Math.min(x, y);
    b = Math.max(x, y);
    return Math.min(Math.max(this, a), b);
}

Number.prototype.clamp = clamp;

export function keys(fb = null) {
    try {
        return Object.keys(this);
    } catch(e) {
        console.log(e);
        return fb ?? [];
    }
}

Object.prototype.keys = keys;

export function values(fb = null) {
    try {
        return Object.values(this);
    } catch(e) {
        console.log(e);
        return fb ?? [];
    }
}

Object.prototype.values = values;

export function items(fb = null) {
    try {
        return Object.entries(this);
    } catch(e) {
        console.log(e);
        return fb ?? [];
    }
}

Object.prototype.items = items;

export function squish() {
    return this.flat(Infinity);
}

Array.prototype.squish = squish;

export function FadeIn(speed = "1s", time = 2000, resolveSpeed = 1000) {
    return new Promise(resolve => {
        this.style.transition = `opacity ${speed} forward`;
        this.style.opacity = "1";
        setTimeout(resolve, time + resolveSpeed);
    });
}

Element.prototype.FadeIn = FadeIn;

export function FadeOut(speed = "1s", time = 2000, resolveSpeed = 1000) {
    return new Promise(resolve => {
        this.style.transition = `opacity ${speed} forward`;
        this.style.opacity = "0";
        setTimeout(resolve, time + resolveSpeed);
    });
}

Element.prototype.FadeOut = FadeOut;

export function sum() {
    return this.reduce((a, b) => a + b, 0);
}

Array.prototype.sum = sum;

export function avg() {
    return this.sum() / this.length;
}

Array.prototype.avg = avg;

export function RandomNums(floor, roof, times, ordered = false) {
    let gen = [];
    const f = function() {
        let n = random(floor, roof + 1);
        while(gen.includes(n)) {
            n = random(floor, roof + 1);
        }
        gen.push(n);
    }
    f.repeat(times);
    if(ordered) {
        return gen.sort((a, b) => a - b);
    }
    return gen;
}

export function numSort() {
    return this.sort((a, b) => a - b);
}

Array.prototype.numSort = numSort;

export function ToString() {
    return typeof this != "string" ? JSON.stringify(this) : this;
}

Object.prototype.ToString = ToString;

export class ClickRegion {
    constructor(top, left, width, height, action) {
        this.regtop = top;
        this.regleft = left;
        this.regwidth = width;
        this.regheight = height;
        this.regact = action;
        this.region = document.createElement("div");
        this.region.style.top = `${top}px`;
        this.region.style.left = `${left}px`;
        this.region.width = `${width}px`;
        this.region.height = `${height}px`;
        this.region.addEventListener("click", this.regact);
    }
    create() {
        document.body.appendChild(this.region);
    }
    destroy() {
        document.body.removeChild(this.region);
    }
}

export function count(char, start = 0, end = this.length) {
    let result = 0;
    for(let i = start; i < end; i++) if(this[i] == char) result++;
    return result;
}

String.prototype.count = count;
Array.prototype.count = count;

export function lastItem() {
    return this[this.length - 1];
}

String.prototype.lastItem = lastItem;
Array.prototype.lastItem = lastItem;

export async function copyToClipboard(content) {
    try {
        await navigator.clipboard.writeText(content);
    } catch(e) {
        console.log(e);
    }
}

export function isEven() {
    return (this % 2) == 0;
}

export function isOdd() {
    return (this % 2) != 0;
}

export function isPrime() {
    if(this <= 1) return false;
    for(let i = 2; i <= Math.sqrt(this); i++) if((this % 2) == 0) return false;
    return true;
}

Number.prototype.isEven = isEven;
Number.prototype.isOdd = isOdd;
Number.prototype.isPrime = isPrime;

export function hide() {
    this.style.opacity = "0";
    this.style.display = "none";
}

Element.prototype.hide = hide;

export function has(x) {
    return this.includes(x);
}

Array.prototype.has = has;

Object.defineProperty(Set.prototype, "length", {
    get() {
        return this.size;
    }
});

export function hasAll(...content) {
    return content.every(t => this.includes(t));
}

Array.prototype.hasAll = hasAll;

export function hasOne(...content) {
    return content.some(t => this.includes(t));
}

Array.prototype.hasOne = hasOne;

export function round(p = null) {
    if(p == null) return Math.round(this);
    return this.toFixed(p);
}

Number.prototype.round = round;

export function toArray(fb = null) {
    try {
        return new Array(this);
    } catch {
        return fb ?? [];
    }
}

Object.prototype.toArray = toArray;

export function setup(vals) {
    for(let i = 0; i < Object.entries(vals).length; i++) localStorage.setItem(JSON.stringify(Object.entries(vals)[i][0]), JSON.stringify(Object.entries(vals)[i][1]));
}

Storage.prototype.setup = setup;

export function toPos() {
    return Math.abs(this);
}

export function toNeg() {
    return -(Math.abs(this));
}

Number.prototype.toPos = toPos;
Number.prototype.toNeg = toNeg;

export function roundMult(n) {
    return Math.round(this / n) * n;
}

Number.prototype.roundMult = roundMult;

export function closest(string, count = this.length) {
    let result = this.map(item => {
        const stringItem = typeof item == "string" ? item : JSON.stringify(item);
        let score = 0;
        if(stringItem == string) score++;
        for(let i = 0; i < string.length; i++) {
            if(stringItem.substring(i, i + string.length) == string) score++;
        }
        for(let i = 0; i < stringItem.length; i++) {
            for(let n = 0; n < string.length; n++) {
                if(stringItem[i] == string[n]) score++;
            }
        }
        return { item, score };
    });
    result.sort((a, b) => b.score - a.score);
    return result.slice(0, count);
}

Array.prototype.closest = closest;

export function sqrt() {
    return Math.sqrt(this);
}

export function pow(n = 2) {
    return Math.pow(this, 2);
}

Number.prototype.sqrt = sqrt;
Number.prototype.pow = pow;

export function dist(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

export class mouse {
    static getPos() {
        return new Promise((resolve) => {
            const getPos = function(event) {
                document.removeEventListener("mousemove", getPos);
                const x = event.clientX;
                const y = event.clientY;
                resolve({ x, y });
            }
            document.addEventListener("mousemove", getPos);
        });
    }
    static getRelRot(target) {
        return new Promise((resolve) => {
            const getPos = function(event) {
                document.removeEventListener("mousemove", getPos);
                const mouseX = event.clientX;
                const mouseY = event.clientY;
                const targetX = target.x;
                const targetY = target.y;
                const dx = mouseX - targetX;
                const dy = mouseY - targetY;
                const rot = Math.atan2(dy, dx);
                resolve(rot);
            }
            document.addEventListener("mousemove", getPos);
        });
    }
    static getRelCenter(el) {
        return new Promise((resolve) => {
            const getPos = function(event) {
                document.removeEventListener("mousemove", getPos);
                const mouseX = event.clientX;
                const mouseY = event.clientY;
                const elementX = el.x;
                const elementY = el.y;
                const center = { "x": (el.height / 2), "y": (el.width / 2) };
                const dist = Math.hypot(mouseX - center.x, mouseY - center.y);
                resolve(dist);
            }
            document.addEventListener("mousemove", getPos);
        })
    }
}

export function remDupes(start = 0, end = this.length) {
    for(let i = start; i < end; i++) {
        for(let j = i + 1; j < this.length; j++) {
            if(this[j] == this[i]) {
                this.splice(j, 1);
                j--;
            }
        }
    }
    return this;
}

Array.prototype.remDupes = remDupes;

export function remOutliers() {
    const arr = [...this].sort((a, b) => a - b);
    const n = arr.length;
    if(n < 4) return arr;
    const q1 = arr[Math.floor(n / 4)];
    const q3 = arr[Math.ceil(n * (3 / 4))];
    const iqr = q3 - q1;
    const lower = q1 - 1.5 * iqr;
    const upper = q3 + 1.5 * iqr;
    const result = arr.filter(x => lower <= x && x <= upper);
    for(let i = 0; i < arr.length; i++) if(!result.includes(arr[i])) this.splice(i, 1);
    return this;
}

Array.prototype.remOutliers = remOutliers;

export function lsGet(k) {
    return localStorage.getItem(k);
}

export function lsSet(k, v) {
    localStorage.setItem(k, typeof v == "string" ? v : JSON.stringify(v));
}

export function remAt(i) {
    this.splice(i, 1);
    return this;
}

Array.prototype.remAt = remAt;

export function copy(start = 0, end = this.length) {
    return this.slice(start, end);
}

Array.prototype.copy = copy;

export function cut(start = 0, end = this.length) {
    this.splice(start, end - start);
    return this;
}

Array.prototype.cut = cut;

export function insert(item, index) {
    this.splice(index, 0, item);
    return this;
}

Array.prototype.insert = insert;

export function insStart(...items) {
    for(let i = 0; i < items.length; i++) this.splice(i, 0, items[i]);
    return this;
}

export function insEnd(...items) {
    for(let i = 0; i < items.length; i++) this.splice(this.length, 0, items[i]);
    return this;
}

Array.prototype.insStart = insStart;
Array.prototype.insEnd = insEnd;

export function same(keys, val) {
    for(const key of keys) this[key] = val;
}

Object.prototype.same = same;

// export function similar(a, b) {
//     let score;
// }

export function quadratic(a, b, c) {
    const n = Math.sqrt(Math.pow(b, 2) - (4 * a * c));
    let ans1 = (-(b) + n) / (2 * a);
    let ans2 = (-(b) - n) / (2 * a);
    return { ans1, ans2 };
}

export class Keybinds {
    constructor(s) {
        this.keys = {};
        this.keybinds = s;
        /*
        --- Expected Fields ---
        action (function)
        consume (bool)
        */
        document.addEventListener("keydown", (e) => this.keys[e] = true);
        document.addEventListener("keyup", (e) => this.keys[e] = false);
        requestAnimationFrame(this.update);
    }
    update() {
        const entries = Object.entries(this.keybinds);
        for(let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if(keys[entry[0]]) {
                if(!entry.action || !entry.consume) {
                    if(!entry.action && !entry.consume) throw new Keybinds.BadBind("Missing action and consume values.");
                    if(!entry.action && entry.consume) throw new Keybinds.BadBind("Missing consume value.");
                    if(entry.action && !entry.consume) throw new Keybinds.BadBind("Missing action value.");
                }
                if(entry[1].consume) keys[entry[0]] = false;
                entry[1].action();
            }
        }
    }
}
Keybinds.BadBind = class extends Error {
    constructor(fail) {
        const message = `Got a bad bind.\n${fail}.`;
        super(message);
        this.name = "KeybindsBadBind";
    }
}

export function getQuerys(url = null) {
    return new URLSearchParams(url != null ? new URL(url).search : window.location.search);
}

export function toBin() {
    return ({ "number": () => this.toString(2), "string": () => this.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join('') }[typeof this])();
}

Number.prototype.toBin = toBin;
String.prototype.toBin = toBin;

export function toHex() {
    return ({ "number": () => this.toString(16), "string": () => this.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, "0")).join('') }[typeof this])();
}

Number.prototype.toHex = toHex;
String.prototype.toHex = toHex;

export function gstFormat() {
    let result = this;
    const repls = [
        { "base": "string", "code": "s", "props": { "maxlen": { "type": "int", "exec": (args)  => { return args[0].substring(0, args[1]); } } } },
        { "base": "num", "code": "n", "props": { "round": { "type": "int", "exec": (args) => { return args[0].toFixed(args[1]); } } } }
    ];
    result = result.replace(/\s*/, "");
    const regex = new RegExp("#{(.*)?}");
    while(true) {
        if(!regex.test(result)) break;
        const match = result.match(regex);
        break;
    }
}

String.prototype.gstFormat = gstFormat;

async function getIP() {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch(e) {
        console.error(`Error fetching IP: ${e}`);
        return null;
    }
}

export function isInt() {
    return Math.round(this) == this;
}

export function isFloat() {
    return Math.round(this) != this;
}

export function isArr() {
    return Array.isArray(this);
}

Number.prototype.isInt = isInt;
Number.prototype.isFloat = isFloat;
Object.prototype.isArr = isArr;

// export class Point {
//     constructor(x, y) {
//         this.x = x;
//         this.y = y;
//     }
//     dist(x, y) {}
// }

// export class Vector {
//     constructor(x, y, z) {
//         this.x = x;
//         this.y = y;
//         this.z = z;
//     }
//     dist(x, y, z) {}
// }

// export function splice(start, rem, ...add) {
//     return this.split('').splice()
// }

//class MouseTracker
//constructor(enabled = false) => { this.enabled = enabled; this.cords = { x: 0, y: 0 }; this.track = function(e) { this.cords.x = e.clientX; this.cords.y = e.clientY; } }
//enable() => { this.enabled = true; document.addEventListener("mousemove", this.track); }
//disable() => { this.enabled = false; document.removeEventListener("mousemove", this.track); }
//cords() => { const x = this.cords.x; const y = this.cords.y; return { x, y }; }

//function isColliding, (a, b)
/*

const aW = a.width;
const aH = a.height;
const aX = a.x;
const aY = a.y;
const bW = b.width;
const bH = b.height;
const bX = b.x;
const bY = b.y;
const collide = bX < aX + aW && bX + bW > aX && bY < aY + aH && bY + bH > aY;
return collide;
*/

//class Stopwatch
//constructor() => this._time, this._interval
//start() => starts
//stop() => stops

/*
import '/functionpack.js';
import { random, chance, getEl, wait, isTrue, isFalse, safeEval, RandomNums, ClickRegion, copyToClipboard, dist, mouse, lsGet, lsSet, quadratic, getQuerys } from '/functionpack.js';
*/