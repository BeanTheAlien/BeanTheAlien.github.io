import { Scene, Entity, Aircraft } from "../../../phantom2d.js";
const scene = new Scene({ canvas: "ltf", w: 1000, h: 850 });
/**scene: Scene;
    wing: number;
    grav: number;
    drag: number;
    stall?: number;
    air: number;
    mass: number;
    thrust?: number; */
const pln = new Aircraft({ width: 100, height: 50, color: "#807c7c", scene, wing: 50, grav: 0.15, drag: 0.35, air: 1, stall: 80, mass: 10, thrust: 10 });
const sea = new Entity({ width: scene.width, height: 100, y: scene.height - 100, color: "#0c0173", collide: (e) => {
    if(e == pln) scene.rm(pln);
} });
const cloudGen = (x: number, y: number) => new Entity({ width: 100, height: 50, x, y, color: "#dedede" });
scene.add(pln, sea);
scene.follow(pln);
setInterval(() => {
    if(chance(10)) scene.add(cloudGen(random(0, scene.w), 1000));
}, 50);

scene.start(() => {
    scene.bg("#00b5b5");
});