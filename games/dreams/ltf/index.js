import { Scene, Entity, random, chance, Angle } from "../../../phantom2d.js";
const scene = new Scene({ canvas: "ltf", w: 1000, h: 850 });
/**scene: Scene;
    wing: number;
    grav: number;
    drag: number;
    stall?: number;
    air: number;
    mass: number;
    thrust?: number; */
const pln = new Entity({ width: 100, height: 50, color: "#807c7c", x: 15, y: 30 }); //ing: 30, grav: 0.98, drag: 0.5, air: 1, mass: 1
pln.use("arcmovesling", { strength: 0.000000035 });
const sling = pln.comp("arcmovesling");
sling.launch(45, Angle.rad(15));
const sea = new Entity({ width: 9999999999, height: 9999999999, y: scene.height - 150, color: "#0c0173", collide: (e) => {
        if (e == pln)
            scene.rm(pln);
    } });
const cloudGen = (x, y) => new Entity({ width: 100, height: 50, x, y, color: "#dedede" });
scene.add(pln, sea);
scene.follow(pln);
setInterval(() => {
    if (chance(10))
        scene.add(cloudGen(random(0, scene.width), 0));
}, 50);
scene.start(() => {
    scene.bg("#00b5b5");
});
