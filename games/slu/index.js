import { ButtonUI, Img, ImgUI, KeyedTextUI, Scene, SceneUI, TextUI } from "../../phantom2d.js";
const scene = new Scene({ canvas: "slu", w: 1250, h: 850, border: "2px solid red" });
const sd = 300;
const slup = new ButtonUI({ scene, click: () => slugs += cpc, w: sd, h: sd, x: scene.width / 2 - sd, y: scene.height / 2 - sd / 1.5 });
const slu = new ImgUI({ scene, img: new Img("slu.png"), w: sd, h: sd });
slup.addChild(slu);
const bw = 320;
const upgBox = new SceneUI({ scene, w: bw, h: scene.height, color: "gray", x: scene.width - bw });
var slugs = 0;
var cps = 0;
var cpc = 1;
function upgr(item, k, mo, next) {
    k.val = costMap[item];
    return () => {
        const cost = costMap[item];
        if (slugs >= cost) {
            if (mo == "s")
                cps += next;
            else
                cpc += next;
            slugs -= cost;
            costMap[item] *= 1.15;
            costMap[item] = Math.floor(costMap[item]);
            k.val = costMap[item];
        }
    };
}
const globalBS = {
    idle: "#0320a1",
    hover: "#0086d3",
    click: "#00eeff"
};
function upg(item, xOff, y, c1t, mo, next) {
    const u = new ButtonUI({ scene, styles: globalBS, w: bw / 1.45, h: bw / 4, x: upgBox.x + bw / 6, y });
    const kui = new KeyedTextUI({ scene, change: () => `${costMap[item]} / +${next} Mp${mo}`, x: u.width / 9, y: u.height - u.height / 5 });
    u.click = upgr(item, kui, mo, next);
    u.addChilds(new TextUI({ scene, tx: c1t, x: u.width / 4 - xOff, y: u.height - u.height / 1.75 }), kui);
    scene.addUI(u);
    return u;
}
scene.fontSize = "25px";
scene.addUI(upgBox);
const globalMarketpliers = 1.25;
var costMap = {
    mask: 10,
    nurse: 75,
    shift: 250,
    rooms: 500,
    hosp: 1200,
    union: 2000,
    fleet: 7500,
    out: 7500,
    rapid: 15000,
    staff: 30000,
    prio: 50000
};
for (const k of Object.keys(costMap))
    costMap[k] = Math.floor(costMap[k] * globalMarketpliers);
var ap = 0;
const pgs = [
    [
        upg("mask", 0, 50, "Mask", "c", 1),
        upg("nurse", 0, 150, "Nurse", "s", 1),
        upg("shift", 15, 250, "Extra Shift", "c", 5),
        upg("rooms", 20, 350, "More Rooms", "s", 5),
        upg("hosp", 15, 450, "Hospital", "s", 10),
        upg("union", 20, 550, "Labor Union", "c", 15),
        upg("fleet", 30, 650, "Ambulence Fleet", "c", 50)
    ],
    [
        upg("out", 25, 50, "Expand Outreach", "s", 50),
        upg("rapid", 20, 150, "Rapid Response", "s", 75),
        upg("staff", 25, 250, "Educated Staff", "c", 125),
        upg("prio", 35, 350, "Priority Response", "s", 150)
    ]
];
pgs.slice(1).forEach(x => scene.rmUI(...x));
const slugUI = new KeyedTextUI({ change: (v) => `Money ${v}`, scene, x: scene.width / 3, y: 50 });
slugUI.val = slugs;
scene.addUI(slup, slugUI);
const pageL = new ButtonUI({ scene, x: upgBox.x + 50, y: scene.height - 35, w: 50, h: 35, styles: globalBS });
pageL.addChild(new TextUI({ scene, tx: "<=", x: 10, y: 25 }));
const pageR = new ButtonUI({ scene, x: upgBox.x + 200, y: scene.height - 35, w: 50, h: 35, styles: globalBS });
pageR.addChild(new TextUI({ scene, tx: "=>", x: 10, y: 25 }));
scene.addUI(pageL, pageR);
pageL.click = () => {
    ap = Math.max(--ap, 0);
    pgs.forEach(x => scene.rmUI(...x));
    scene.addUI(...pgs[ap]);
};
pageR.click = () => {
    ap = Math.min(++ap, pgs.length - 1);
    pgs.forEach(x => scene.rmUI(...x));
    scene.addUI(...pgs[ap]);
};
setInterval(() => slugs += cps, 1000);
scene.start(() => slugUI.val = slugs);
