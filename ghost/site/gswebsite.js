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
}
main();