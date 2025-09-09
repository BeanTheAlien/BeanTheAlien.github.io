import '/utils.js';
import { random, chance, getEl, wait, isTrue, isFalse, safeEval, RandomNums, ClickRegion, copyToClipboard, dist, mouse, lsGet, lsSet, quadratic, getQuerys } from '/utils.js';

const home = getEl("home");
const games = getEl("games");
home.addEventListener("click", () => window.location.href = "index.html");
games.addEventListener("click", () => window.location.href = "games.html");
