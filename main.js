import "/utils.js";
import { random, chance, getEl, wait, isTrue, isFalse, RandomNums, ClickRegion, copyToClipboard, dist, mouse, lsGet, lsSet, quadratic, getQuerys } from "/utils.js";

const title = document.getElementById("title");
var epic = 0;
const text = title.innerHTML;
var x;
title.addEventListener("click", () => {
    if(epic == 0) {
        epic = 1;
        const len = text.length;
        title.innerHTML = "";
        for(let i = 0; i < len; i++) {
            title.innerHTML += `<span id="span-${i}" style="color: #0068e0; font-weight: bold">${text[i]}</span>`;
        }
        let wv = 0;
        x = setInterval(() => {
            for(let i = 0; i < len; i++) {
                const char = document.getElementById(`span-${i}`);
                char.style.color = wv == i ? "#489dff" : "#0068e0";
            }
            wv++;
            if(wv >= len) wv = 0;
        }, 10);
    } else {
        epic = 0;
        title.innerHTML = text;
        if(x) clearInterval(x);
    }
});