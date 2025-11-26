import { mk, add, rem, el, style } from "./htmlutils.js";
window.location.href = "gswebsite.construction.html";
const title = mk("h1", { textContent: "Learn GhostScript" });
const lessonsOpts = [
  { section: "Chapter 1 - Getting Started With Ghost", items: [{ title: "1.1 - Welcome To Ghost", val: "1.1" }] }
];
const lessons = {
  "1.1": { title: "Welcome To Ghost", body: "hello" },
  "1.2": { title: "Environment Setup", body: "hello" },
  "1.3": { title: "Hello, World!", body: "hello" }
};
const chapters = mk("select");
for(const { section, items } of lessonsOpts) {
  const optgroup = mk("optgroup", { label: section });
  for(const { title, val } of items) add(mk("option", { textContent: title, value: val }), optgroup);
  add(optgroup, chapters);
}
add(title);
const body = mk("p");
add(body);
add(chapters);
const go = add(mk("button", { textContent: "Go" }));
go.addEventListener("click", () => {
  go.disabled = true;
  go.style.display = "none";
  chapters.disabled = true;
  chapters.style.display = "none";
  const v = lessons[chapters.value];
  title.textContent = v.title;
  body.textContent = v.body;
});