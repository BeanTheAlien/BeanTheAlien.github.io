import '/utils.js';
import { random, chance, getEl, wait, isTrue, isFalse, safeEval, RandomNums, ClickRegion, copyToClipboard, dist, mouse, lsGet, lsSet, quadratic, getQuerys } from '/utils.js';

const projlist = document.createElement("div");
Object.assign(gamelist.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    margin: "auto"
});
const projs = [
    { "name": "Haunted Heist", "win": "" }
];
projs.forEach(p => {
    const proj = document.createElement("div");
    proj.textContent = p.name;
    projlist.appendChild(proj);
    const div = document.createElement("div");
    div.className = "space";
    projlist.appendChild(div);
});
document.body.appendChild(projlist);