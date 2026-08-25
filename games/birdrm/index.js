import { Img, Scene } from "../../phantom2d.js";
const scene = new Scene({ canvas: "bird", w: 0, h: 0 });
const bird = new Img("bird.png");
const bg = new Img("bg.jpg");
var x = 0;
var y = 0;
scene.start(() => {
    scene.img(bird, x, y, 100, 50);
    scene.img(bg, 0, 0, scene.width, scene.height);
});
