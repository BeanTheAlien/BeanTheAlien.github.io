import { ButtonUI, Img, ImgUI, KeyedTextUI, Scene, SceneUI, TextUI } from "../../phantom2d.js";
const scene = new Scene({ canvas: "slu", w: 1250, h: 850, border: "2px solid red" });
const sd = 300;
const slu = new ImgUI({ scene, img: new Img("slu.png"), w: sd, h: sd, x: scene.width / 2 - sd, y: scene.height / 2 - sd / 1.5 });
const bw = 320;
const upgBox = new SceneUI({ scene, w: bw, h: scene.height, color: "gray", x: scene.width - bw });
var slugs = 0;
function upg(click: Function, y: number, c1t: string, c2t: string) {
    const u = new ButtonUI({ scene, click, styles: {
        idle: "#0320a1",
        hover: "#0086d3",
        click: "#00eeff"
    }, w: bw / 2, h: bw / 4, x: upgBox.x + bw / 4, y });
    u.addChilds(new TextUI({ scene, tx: c1t, x: u.width / 4, y: u.height - u.height / 1.75 }), new TextUI({ scene, tx: c2t, x: u.width / 4, y: u.height - u.height / 5 }));
    scene.addUI(u);
}
scene.fontSize = "25px";
scene.addUI(upgBox);
upg(() => console.log("hi"), 100, "hi", "test");
const slugUI = new KeyedTextUI<number>({ change: (v) => `Money ${v}`, scene, x: scene.width / 3, y: 50 });
slugUI.val = slugs;
scene.addUI(slu, slugUI);

scene.start();