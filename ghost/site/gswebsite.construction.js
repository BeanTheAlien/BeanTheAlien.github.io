import { mk, add, rem, el, style } from "./htmlutils.js";
add(mk("h1", { textContent: "Under Construction" }));
add(mk("p", { textContent: "The page you tried to access is under construction." }));
add(mk("p", { innerHTML: `<i style="font-size: 12px">Please try again later.</i>` }));