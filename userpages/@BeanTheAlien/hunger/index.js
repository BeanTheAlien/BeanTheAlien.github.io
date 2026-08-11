import { random } from "../../../phantom2d.js";

const hung = document.getElementById("hung");
const ro = document.getElementById("rollout");
const d20 = document.getElementById("d20");
const d10 = document.getElementById("d10");
const fx = document.getElementById("fx");

var hg = Number(localStorage.getItem("h") ?? 100);
function apply() {
    localStorage.setItem("h", JSON.stringify(hg));
    hung.innerText = hg;
    fxh();
}
apply();
function fxh() {
    fx.innerText = hg > 75 ? "no effects" :
        hg > 50 ? "eldritch blast 1d12 + 6" :
        hg > 25 ? "eldritch blast 1d12 + 6, kiss of mestopholiser 8d6 fire & 2d10 necro, strength -1" :
        hg > 10 ? "eldritch blast 1d12 + 6, kiss of mestopholiser 8d6 fire & 2d10 necro, roll at advantage, strength -1" :
        "eldritch blast 1d12 + 6, kiss of mestopholiser 8d6 fire & 2d10 necro, roll at advantage, strength -3";
}
d20.addEventListener("click", () => {
    const r = random(1, 21);
    const r2 = random(1, 11);
    if(r <= 5) hg -= r2
    apply();
    ro.innerText = r + ", " + r2;
});
d10.addEventListener("click", () => {
    const r = random(1, 11);
    hg -= r;
    apply();
    ro.innerText = r;
});