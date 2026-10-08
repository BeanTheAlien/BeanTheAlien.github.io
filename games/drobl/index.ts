import { Bone, Entity, FloorObject, Img, Joint, objIs, PlayableCharacter, Scene, Skeleton } from "../../phantom2d.js";
const scene = new Scene({ canvas: "deer", w: 600, h: 600, border: "2px solid red" });

function Deer() {
    const sp = 20;
    const strength = 0.35;
    const head = [
        // head 0
        new Joint(0, 0, strength),
        // head 1
        new Joint(sp, 0, strength),
        // head 2
        new Joint(0, sp, strength),
        // head 3
        new Joint(sp, sp, strength)
    ] as const;
    const neck = [
        // neck start
        new Joint(sp/2, sp+1, strength),
        // neck end
        new Joint(sp/2, sp+3, strength)
    ] as const;
    const body = [
        // body 0
        new Joint(0, sp+3, strength),
        // body 1
        new Joint(sp*3, sp+3, strength),
        // body 2
        new Joint(0, sp+8, strength),
        // body 3
        new Joint(sp*3, sp+8, strength)
    ] as const;
    const bodyLeg1 = new Joint(sp, sp+8, strength);
    const bodyLeg2 = new Joint(sp*2, sp+8, strength);
    const leg0 = [
        // leg 0 0
        new Joint(0, sp+17, strength),
        // leg 0 1
        new Joint(0, sp+19, strength)
    ] as const;
    const leg1 = [
        // leg 1 0
        new Joint(sp, sp+17, strength),
        // leg 1 1
        new Joint(sp, sp+19, strength)
    ] as const;
    const leg2 = [
        // leg 2 0
        new Joint(sp*2, sp+17, strength),
        // leg 2 1
        new Joint(sp*2, sp+19, strength)
    ] as const;
    const leg3 = [
        // leg 3 0
        new Joint(sp*3, sp+17, strength),
        // leg 3 1
        new Joint(sp*3, sp+19, strength)
    ] as const;
    const bones = [
        new Bone(head[0], head[1]),
        new Bone(head[0], head[2]),
        new Bone(head[1], head[3]),
        new Bone(head[2], head[3]),
        new Bone(head[0], head[3]),
        new Bone(head[2], neck[0]),
        new Bone(head[3], neck[0]),
        new Bone(neck[0], neck[1]),
        new Bone(neck[1], body[0]),
        new Bone(neck[1], body[1]),
        new Bone(body[0], body[1]),
        new Bone(body[0], body[2]),
        new Bone(body[1], body[3]),
        new Bone(body[2], body[3]),
        new Bone(body[0], body[3]),
        new Bone(body[2], bodyLeg1),
        new Bone(bodyLeg1, bodyLeg2),
        new Bone(bodyLeg2, body[3]),
        new Bone(body[0], bodyLeg2),
        new Bone(body[1], bodyLeg1),
        new Bone(body[2], leg0[0]),
        new Bone(bodyLeg1, leg1[0]),
        new Bone(bodyLeg2, leg2[0]),
        new Bone(body[3], leg3[0]),
        new Bone(leg0[0], leg0[1]),
        new Bone(leg1[0], leg1[1]),
        new Bone(leg2[0], leg2[1]),
        new Bone(leg3[0], leg3[1])
    ];
    return new Skeleton({
        bn: bones,
        pass: 50,
        bc: "#794a03",
        jc: "#ffd900",
        bw: 5,
        jr: 3,
        scene
    });
}
class DeerEnt extends Entity {
    skeleton: Skeleton;
    hit: boolean;
    constructor(skeleton: Skeleton, x: number) {
        super({ color: "rgba(0,0,0,0)" });
        this.skeleton = skeleton;
        // Move both current and previous joint positions so the deer spawns at x.
        skeleton.joints.forEach(j => {
            j.x += x;
            j.ox += x;
        });
        this.#syncBounds();
        this.upd = () => this.#syncBounds();
        this.mark = false;
        this.hit = false;
    }
    #syncBounds() {
        const xs = this.skeleton.joints.map(j => j.x);
        const ys = this.skeleton.joints.map(j => j.y);
        const minX = Math.min(...xs);
        const minY = Math.min(...ys);
        this.x = minX;
        this.y = minY;
        this.width = Math.max(...xs) - minX;
        this.height = Math.max(...ys) - minY;
    }
}

function SpawnDeer(x: number) {
    const skeleton = Deer();
    const deer = new DeerEnt(skeleton, x);
    scene.addMisc(skeleton); // Draw and update the skeleton
    scene.add(deer);         // Include its hitbox in entity collisions
    return deer;
}
const car = new PlayableCharacter({ strength: 0.35, render: () => {
    scene.img(carspr, car.x, car.y, car.width, car.height);
}, width: 15, height: 10, color: "rbga(0,0,0,0)", collide: (e) => {
    if(objIs(e, DeerEnt)) {
        e.skeleton.setSoft();
        if(!e.hit) {
            e.skeleton.joints.forEach(j => {
                j.damp = 0.95;
                j.vx += p.vx;
                j.vy += p.vy;
            });
        }
        e.hit = true;
    }
}, upd: () => {
    if(car.y + car.height >= scene.height) {
        car.y = scene.height - car.height;
        car.onGround = true;
    }
} });
car.use("enhancedphys", { scene });
const p = car.comp("enhancedphys");
const fs = 0.85;
car.binds(["a", () => {
    p.addForceX(-fs);
}], ["d", () => {
    p.addForceX(fs);
}], ["w", () => {
    if(!car.onGround) return;
    car.jump(fs*8);
    car.onGround = false;
}]);
Img.config.set("root", "assets");
const carspr = new Img("car/2012toyotacamry.jpg");
SpawnDeer(200);
scene.add(car);

scene.start(() => {
    scene.misc.forEach(deer => {
        const dr = deer as Skeleton;
        const lowestY = Math.max(...dr.joints.map(j => j.y));
        if(lowestY <= scene.height) return;
        const offset = scene.height - lowestY;
        dr.joints.forEach(j => {
            if(dr.soft) {
                if(j.y > scene.height) {
                    j.y = scene.height;
                    j.oy = scene.height;
                }
            } else {
                j.y += offset;
                j.oy += offset;
            }
        });
    });
});