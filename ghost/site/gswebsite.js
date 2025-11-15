import { mk, add, rem, el, style } from "./htmlutils.js";
async function readme() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/BeanTheAlien/GhostScript/main/README.md");
        if(!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const text = await response.text();
        return text;
    } catch(e) {
        console.error(e);
    }
}
async function main() {
    const md = await readme();
    const html = marked.parse(md);
    const div = mk("div", { innerHTML: html });
    add(div);
    const navbar = mk("ul", { className: "nb_ul" });
    const link = (text, to) => `<li class="nb_li"><a class="nb_a" href="${to}">${text}</a></li>`;
    const drop = (outer, text) => `<li class="nb_li dropdown"><a class="nb_a dropbtn" href="javascript:void(0)">${outer}</a><div class="dropdown-content">${text}</div></li>`;
    const home = link("Home", "gswebsite.html");
    const docs = link("Docs", "gswebsite.docs.html");
    navbar.innerHTML = [home, docs].join("");
    add(navbar);
}
main();