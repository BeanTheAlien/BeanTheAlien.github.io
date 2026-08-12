import { Angle, ButtonUI, chance, Entity, KeyedTextUI, random, Scene, SceneUI, TextUI } from "../../../phantom2d.js";
const scene = new Scene({ canvas: "nk", w: 1250, h: 850, border: "2px solid red" });
const nk = new Entity({ color: "#b90707", x: 600, y: scene.height - 75, width: 100, height: 75 });
const tr = new Entity({ color: "#0081a8", x: 50, y: scene.height - 75, width: 50, height: 75 });
var strength = 8;
var randOff = 25;
var gain = 1;
var multi = 0;
var multiCn = 1;
var mony = 0;
scene.on("click", () => {
    const next = () => {
        const e = new Entity({ x: tr.x + tr.width, y: tr.y, width: 10, height: 10, color: "#ddec0a" });
        e.use("arcmovesling", { strength: 0.1 });
        console.log(scene.rotToMouse(tr));
        const r = scene.rotToMouse(tr);
        e.comp("arcmovesling").launch(8, Angle.rad(random(Angle.deg(r) - randOff, Angle.deg(r) + randOff)));
        e.collide = (v) => {
            if (v != nk)
                return;
            scene.rm(e);
            mony += gain;
        };
        setTimeout(() => scene.rm(e), 5000);
        scene.add(e);
    };
    next();
    if (multi > 0 && chance(multi * 10, 1000))
        for (let i = 0; i < multiCn; i++)
            next();
});
scene.add(nk, tr);
var gdy = 50;
function disp(x, v) {
    const j = new KeyedTextUI({ scene, change: (v) => `${x}: ${v}`, y: gdy, x: 15 });
    j.val = v;
    gdy += 50;
    return j;
}
const moneyDisp = disp("Money", mony);
const strengthDisp = disp("Strength", strength);
const randOffDisp = disp("Random Offset", randOff);
const gainDisp = disp("Gain", gain);
const multiDisp = disp("Multishot", multi);
const multiCnDisp = disp("Multishot Count", multiCn);
scene.addUI(moneyDisp, strengthDisp, randOffDisp, gainDisp, multiDisp, multiCnDisp);
const bw = 320;
const upgBox = new SceneUI({ scene, w: bw, h: scene.height, color: "gray", x: scene.width - bw });
function upgr(item, k, mo, next) {
    k.val = costMap[item];
    return () => {
        const cost = costMap[item];
        if (mony >= cost) {
            if (mo == "s") {
                strength += next;
                strength = Number(strength.toFixed(1));
            }
            else if (mo == "r")
                randOff += next;
            else if (mo == "g")
                gain += next;
            else if (mo == "m")
                multi += next;
            else
                multiCn += next;
            mony -= cost;
            costMap[item] *= 1.15;
            costMap[item] = Math.floor(costMap[item]);
            k.val = costMap[item];
        }
    };
}
const globalBS = {
    idle: "#7e1300",
    hover: "#d3a200",
    click: "#fffb00"
};
function upg(item, xOff, y, c1t, mo, lbl, next) {
    const u = new ButtonUI({ scene, styles: globalBS, w: bw / 1.45, h: bw / 4, x: upgBox.x + bw / 6, y });
    const kui = new KeyedTextUI({ scene, change: () => `${costMap[item]} / +${next} ${lbl}`, x: u.width / 9, y: u.height - u.height / 5 });
    u.click = upgr(item, kui, mo, next);
    u.addChilds(new TextUI({ scene, tx: c1t, x: u.width / 4 - xOff, y: u.height - u.height / 1.75 }), kui);
    scene.addUI(u);
    return u;
}
scene.fontSize = "25px";
scene.addUI(upgBox);
const globalMarketpliers = 1;
var costMap = {
    str: 50,
    ro: 100,
    g: 500,
    m: 250,
    mc: 300
};
for (const k of Object.keys(costMap))
    costMap[k] = Math.floor(costMap[k] * globalMarketpliers);
upg("str", 0, 50, "Strength", "s", "strength", 0.1);
upg("ro", 20, 150, "Random Offset", "r", "randoff", -1);
upg("g", 0, 250, "Gain", "g", "gain", 1);
upg("m", 0, 350, "Multishot", "m", "mult", 0.1);
upg("mc", 15, 450, "Multishot Count", "mc", "multcn", 1);
scene.start(() => {
    moneyDisp.val = mony;
    strengthDisp.val = strength;
    randOffDisp.val = randOff;
    gainDisp.val = gain;
    multiDisp.val = multi;
    multiCnDisp.val = multiCn;
});
