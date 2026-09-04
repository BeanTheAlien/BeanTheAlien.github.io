import "/utils.js";
import { random, chance, getEl, wait, isTrue, isFalse, RandomNums, ClickRegion, copyToClipboard, dist, mouse, lsGet, lsSet, quadratic, getQuerys } from "/utils.js";
import { annNet } from "./sv.js";

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
const res = await annNet.json("select");
const anns = document.getElementById("anns");
if("data" in res) anns.innerHTML = `<h3>${res.data[0].title}</h3><p>${res.data[0].body}</p>`;
else anns.textContent = "Failed to fetch announcements.";