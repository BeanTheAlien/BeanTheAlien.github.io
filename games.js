import '/utils.js';
import { random, chance, getEl, wait, isTrue, isFalse, safeEval, RandomNums, ClickRegion, copyToClipboard, dist, mouse, lsGet, lsSet, quadratic, getQuerys } from '/utils.js';

const gamelist = document.createElement("div");
Object.assign(gamelist.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    margin: "auto"
});
const buttons = [
    { "filename": "flappybird", "name": "Flappy Bird", "win": `` }
];
buttons.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.name;
    btn.addEventListener("click", () => launch(b.win, b.filename));
    gamelist.appendChild(btn);
    const div = document.createElement("div");
    div.className = "space";
    gamelist.appendChild(div);
});
document.body.appendChild(gamelist);

function launch(wincontent, fname) {
    const win = window.open("about:blank");
    const down = `<div style="margin-bottom:10px;"></div><a id="down"></a><script>const el=getElementById("down");el.textContent="download";const blob=new Blob([${wincontent}], {type:"text/javascript"});const url=URL.createObjectURL(blob);el.href=url;el.download=${fname};`;
    win.document.writeln(wincontent + down);
    // win.close();
}

// see https://codehs.com/sandbox/bengoldstein/i-am-really-stupid