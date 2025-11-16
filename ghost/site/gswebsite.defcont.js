import { mk, add } from "./htmlutils.js";

const navbar = mk("ul", { className: "nb_ul" });
const link = (text, to) => `<li class="nb_li"><a class="nb_a" href="${to}">${text}</a></li>`;
const drop = (outer, text) => `<li class="nb_li dropdown"><a class="nb_a dropbtn" href="javascript:void(0)">${outer}</a><div class="dropdown-content">${text}</div></li>`;
const home = link("Home", "gswebsite.html");
const docs = link("Docs", "gswebsite.docs.html");
const down = link("Download", "gswebsite.dl.html");
const learn = link("Learn", "gswebsite.learn.html");
const community = link("Community", "gswebsite.community.html");
const apis = drop("APIs", `<a class="nb_a" href="gswebsite.gs.html">GhostScript</a><a class="nb_a" href="gswebsite.ctxawr.html">Context Awareness</a><a class="nb_a" href="gswebsite.autodbg.html">Autodebugger</a><a class="nb_a" href="gswebsite.ast.html">Ghost Assistant</a>`);
const github = link("GitHub", "https://github.com/BeanTheAlien/GhostScript");
navbar.innerHTML = [home, docs, down, learn, community, apis, github].join("");
add(navbar);