import '/utils.js';
import { random, chance, getEl, wait, isTrue, isFalse, safeEval, RandomNums, ClickRegion, copyToClipboard, dist, mouse, lsGet, lsSet, quadratic, getQuerys } from '/utils.js';

window.addEventListener("error", (e) => alert(e.message));

const gamelist = document.createElement("div");
Object.assign(gamelist.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    margin: "auto"
});
const buttons = [
    { "name": "Flappy Bird", "win": `` }
];
buttons.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.name;
    btn.addEventListener("click", () => launch(b.win));
    gamelist.appendChild(btn);
    const div = document.createElement("div");
    div.className = "space";
    gamelist.appendChild(div);
});
document.body.appendChild(gamelist);

function launch(wincontent) {
    const win = window.open("about:blank");
    win.document.writeln(wincontent);
    // win.close();
}

// see https://codehs.com/sandbox/bengoldstein/i-am-really-stupid