import { ButtonUI, Img, ImgUI, Scene, SceneUI, TextUI } from "../../phantom2d.js";
const scene = new Scene({ canvas: "slu", w: 1250, h: 850, border: "2px solid red" });
const sd = 300;
const slu = new ImgUI({ scene, img: new Img("slu.png"), w: sd, h: sd, x: scene.width / 2 - sd, y: scene.height / 2 - sd / 1.5 });
const bw = 320;
const upgBox = new SceneUI({ scene, w: bw, h: scene.height, color: "gray", x: scene.width - bw });
const u1 = new ButtonUI({ scene, click: () => console.log("hi"), styles: {
        idle: "#0320a1",
        hover: "#0086d3",
        click: "#00eeff"
    }, w: bw / 2, h: bw / 4, x: upgBox.x + bw / 4, y: 100 });
scene.fontSize = "25px";
u1.addChilds(new TextUI({ scene, tx: "hello", x: u1.width / 4 - scene.ctx.measureText("hello").width, y: u1.height - u1.height / 1.75 }), new TextUI({ scene, tx: "$120", x: u1.width / 4, y: u1.height - u1.height / 5 }));
scene.addUI(slu, upgBox, u1);
scene.start();
