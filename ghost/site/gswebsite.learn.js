import { mk, add, rem, el, style } from "./htmlutils.js";
window.location.href = "gswebsite.construction.html";
const title = mk("h1", { textContent: "Learn GhostScript" });
const lessons = {};
const chapters = mk("select");
for(const { key, value } of Object.entries(lessons)) add(mk("option", { textContent: null, value: null }), chapters);