import { Scene } from "../../phantom2d.js";
window.onerror = alert;
const tileSize = 50;
const size = 750;
const scene = new Scene({ canvas: "chess", w: size, h: size });
scene.start(() => {
    for (let i = 0; i <= scene.width; i += tileSize) {
        for (let j = 0; j <= scene.height; j += tileSize) {
            const r = i / tileSize;
            const c = j / tileSize;
            scene.rect(i, j, tileSize, tileSize, (r + c) % 2 == 0 ? "#1a5a00" : "#fff4e8");
        }
    }
});
