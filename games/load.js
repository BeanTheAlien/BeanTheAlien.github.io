async function load() {
    const el = document.getElementById("status");
    el.textContent = "Importing Phantom2D...";
    const p2d = await import("../phantom2d.js");
    el.textContent = "";
    return p2d;
}
function gameEnd(runtime, score, hsname) {
    clearInterval(runtime);
    const div = document.createElement("div");
    div.innerHTML = `<div class="score1"><div class="score2" id="scr"></div></div>`;
    document.body.appendChild(div);
    const display = document.getElementById("scr");
    let i = 0;
    const hs = parseInt(localStorage.getItem(hsname) ?? 0);
    const trophy = setInterval(() => {
        display.textContent = i;
        /*
        ranges:
        0 - 30 = bronze
        30 - 60 = silver
        60 - 90 = gold
        90 - 120 = purple
        120 - 150 = legend
        150+ = diamond
        */
        if(0 <= i && i <= 30) display.style.color = "#CD7F32";
        else if(30 <= i && i <= 60) display.style.color = "#C0C0C0";
        else if(60 <= i && i <= 90) display.style.color = "#FFD700";
        else if(90 <= i && i <= 120) display.style.color = "#9D00FF";
        else if(120 <= i && i <= 150) display.style.color = "#FF0000";
        else display.style.color = "#4EE2EC";
        display.style.fontSize = `clamp(10px, ${5 + i}px, 100px)`;
        if(i >= score) {
            clearInterval(trophy);
            if(hs < score) {
                localStorage.setItem(hsname, JSON.stringify(score));
                display.innerHTML = `${score}<br><div id="newhs"></div><br><button id="restart">Restart</button>`;
                const newhs = document.getElementById("newhs");
                newhs.style.fontSize = `clamp(10px, ${display.style.fontSize - 10}px, 80px)`;
                const text = "New Highscore!";
                const len = text.length;
                for(let i = 0; i < len; i++) {
                    newhs.innerHTML += `<span id="nhs_${i}" style="color: #0068e0; font-weight: bold">${text[i]}</span>`;
                }
                let waveIndex = 0;
                setInterval(() => {
                    for(let i = 0; i < len; i++) {
                        const char = document.getElementById(`nhs_${i}`);
                        if(char) {
                            if(i == waveIndex) {
                                char.style.color = "#489dff"; // teal focus
                            } else {
                                char.style.color = "#0068e0"; // default blue
                            }
                        }
                    }
                    waveIndex++;
                    if(waveIndex >= len) waveIndex = 0; // loop back for infinite wave
                }, 30);
            } else {
                display.innerHTML = `${score}<br><div>Highscore: ${parseInt(localStorage.getItem(hsname) ?? 0)}</div><br><button id="restart">Restart</button>`;
            }
            const restart = document.getElementById("restart");
            restart.addEventListener("click", () => window.location.reload());
        }
        else i++;
    }, 50);
}
export { load, gameEnd };