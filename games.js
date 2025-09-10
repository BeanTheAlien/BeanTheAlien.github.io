import '/utils.js';
import { random, chance, getEl, wait, isTrue, isFalse, safeEval, RandomNums, ClickRegion, copyToClipboard, dist, mouse, lsGet, lsSet, quadratic, getQuerys } from '/utils.js';

window.addEventListener("error", (e) => alert(e.message));

const gamelist = document.createElement("div");
Object.assign(gamelist.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    margin: "auto",
    gap: "20px" // Added gap for spacing
});

const buttons = [{
    "filename": "flappybird",
    "name": "Flappy Bird",
    "win": `
        const c = document.createElement("canvas");
        c.style.border = "2px solid black";
        document.body.appendChild(c);
        // The rest of the flappy bird game code would go here
    `
}];

buttons.forEach(b => {
    const btn = document.createElement("button");
    btn.textContent = b.name;
    btn.addEventListener("click", () => launch(b.win, b.filename));
    gamelist.appendChild(btn);
});

document.body.appendChild(gamelist);

function launch(wincontent, fname) {
    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${fname}</title>
                <style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }</style>
            </head>
            <body>
                <script>
                    ${wincontent}
                </script>
            </body>
            </html>
        `);
        newWindow.document.close();
    } else {
        alert("Pop-up blocked! Please allow pop-ups for this site to launch the game.");
    }
}


// see https://codehs.com/sandbox/bengoldstein/i-am-really-stupid

// const querys = getQuerys()
// if(querys.has("id")) { const g = buttons[parseInt(querys.get("id"))]; launch(g.win, g.filename) }
/*
const blob = new Blob([wincontent], { type: "text/javascript" }); const url = URL.createObjectURL(blob);
*/