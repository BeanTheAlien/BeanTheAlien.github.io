import { Angle, FloorObject, PlayableCharacter, Scene, StaticObject } from "../../../phantom2d.js";

const scene = new Scene({ canvas: "ibt", w: 1000, h: 650 });
const grnd = new FloorObject({ width: scene.width, height: 30, y: scene.height - 30, color: "#005004" });
const plr = new PlayableCharacter({ color: "red", width: 10, height: 15, strength: 0.65, custom: { go: 1.5, ts: 3 } });
plr.use("enhancedphys", { fric: 0.5, scene });
const ep = plr.comp("enhancedphys");
plr.binds(["w", () => ep.addForceX(plr.go)], ["s", () => ep.addForceX(-plr.go)], ["a", () => plr.rot -= Angle.rad(plr.ts)], ["d", () => plr.rot += Angle.rad(plr.ts)]);
scene.add(plr, grnd);
scene.start();