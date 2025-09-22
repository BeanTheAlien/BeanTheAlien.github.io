import '/utils.js';
import { random, chance, getEl, wait, isTrue, isFalse, safeEval, RandomNums, ClickRegion, copyToClipboard, dist, mouse, lsGet, lsSet, quadratic, getQuerys, isFactorable, makeEl } from '/utils.js';

/*
resc:
Geo Jump level designer
*/

window.addEventListener("error", (e) => alert(`msg: ${e.message}, ln: ${e.lineno}`));

window.addEventListener("load", () => {
    const querys = getQuerys();
    if(querys.has("id")) {
        const idx = parseInt(querys.get("id"));
        if(idx >= games.length) return;
        const item = games[idx];
        launch(item.exec, item.filename);
    }
});

const resourcelist = document.createElement("div");
Object.assign(resourcelist.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    margin: "auto",
    gap: "20px" // Added gap for spacing
});

const resources = [
    {
        // unfinished, i just dont wanna work on this rn :(
        "filename": "geojump_level_designer",
        "name": "Geo Jump Level Designer",
        "exec": (popup) => {
            const d1 = document.createElement("div");
            const d2 = document.createElement("div");
            d1.className = "score1";
            d2.className = "score2";
            const c = document.createElement("canvas");
            c.style.border = "2px solid black";
            c.width = 800;
            c.height = 600;
            d2.appendChild(c);
            popup.appendChild(d2);
            const ctx = c.getContext("2d");
            class Item {
                constructor(s) {
                    this.name = s.name;
                    this.icon = s.icon;
                    this.atts = s.atts;
                    this.loc = s.loc;
                    this.size = s.size;
                    this.colour = s.colour;
                }
                render() {
                    ctx.fillStyle = this.colour;
                    ctx.beginPath();
                    ctx.rect(this.loc.x, this.loc.y, this.size.w, this.size.h);
                    ctx.fill();
                }
            }
            class Spike extends Item {}
            class Pform extends Item {}
            class SFLag extends Item {}
            class EFlag extends Item {}
            var world = [];
            // world.forEach(w => w.render());
        }
    }
];

resources.forEach(r => {
    const b = document.createElement("button");
    b.textContent = r.name;
    b.addEventListener("click", () => launch(r.exec, r.filename));
    b.id = r.filename;
    resourcelist.appendChild(b);
});

document.body.appendChild(resourcelist);

function launch(exec, fname) {
    disableGL();
    const blob = new Blob([exec], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const popup = document.createElement("div");
    popup.className = "overlay";
    document.body.appendChild(popup);
    // const btn = document.createElement("button");
    // const a = document.createElement("a");
    // a.textContent = "download";
    // a.href = url;
    // a.download = fname + ".js";
    // btn.appendChild(a);
    // document.body.appendChild(btn);
    // TODO: fix CSS/JS so <div><button> instead of static pos of button
    exec(popup);
}

function disableGL() {
    resources.forEach(r => {
        const id = r.filename;
        const el = document.getElementById(id);
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        el.disabled = true;
    });
}
function enableGL() {
    resources.forEach(r => {
        const id = r.filename;
        const el = document.getElementById(id);
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
        el.disabled = false;
    });
}
