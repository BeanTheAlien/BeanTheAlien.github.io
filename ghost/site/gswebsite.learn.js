import { mk, add, rem, el, style } from "./htmlutils.js";
window.location.href = "gswebsite.construction.html";
const title = mk("h1", { textContent: "Learn GhostScript" });
const lessonsOpts = [
  { section: "test", items: [] }
];
const lessons = {
  "1.1": {
    title: "",
    body: ""
  }
};
const chapters = mk("select");
for(const { section, items } of lessonsOpts) {
  const optgroup = mk("optgroup");
  for(const { title, val } of items) add(mk("option", { textContent: title, value: val }), optgroup);
  add(optgroup, chapters);
}
