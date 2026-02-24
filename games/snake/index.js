const pre = performance.now();
const load = await import("../load.js");
const p2d = await load.load();
const pro = performance.now();
console.log(`Loaded Phantom2D in ${(pro-pre).toFixed(2)}ms.`);