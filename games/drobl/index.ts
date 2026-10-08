import { Bone, Joint, Scene, Skeleton } from "../../phantom2d.js";
const scene = new Scene({ canvas: "deer", w: 600, h: 600 });

function Deer() {
    const sp = 20;
    const strength = 0.65;
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
        pass: 12,
        bc: "#794a03",
        jc: "#ffd900",
        bw: 5,
        jr: 3,
        scene
    });
}
const deer = Deer();
scene.addMisc(deer);

scene.start(() => {
    const lowestY = Math.max(...deer.joints.map(j => j.y));
    if(lowestY <= scene.height) return;
    const offset = scene.height - lowestY;
    deer.joints.forEach(j => {
        if(deer.soft) {
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