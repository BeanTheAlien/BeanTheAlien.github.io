import { Bone, Joint, Scene, Skeleton } from "../../phantom2d.js";
const scene = new Scene({ canvas: "deer", w: 600, h: 600 });
function Deer() {
    const sp = 20;
    const head = [
        // head 0
        new Joint(0, 0),
        // head 1
        new Joint(sp, 0),
        // head 2
        new Joint(0, sp),
        // head 3
        new Joint(sp, sp)
    ];
    const neck = [
        // neck start
        new Joint(sp / 2, sp + 1),
        // neck end
        new Joint(sp / 2, sp + 3)
    ];
    const body = [
        // body 0
        new Joint(0, sp + 3),
        // body 1
        new Joint(sp * 3, sp + 3),
        // body 2
        new Joint(0, sp + 8),
        // body 3
        new Joint(sp * 3, sp + 8)
    ];
    const leg0 = [
        // leg 0 0
        new Joint(0, sp + 17),
        // leg 0 1
        new Joint(0, sp + 19)
    ];
    const leg1 = [
        // leg 1 0
        new Joint(sp, sp + 17),
        // leg 1 1
        new Joint(sp, sp + 19)
    ];
    const leg2 = [
        // leg 2 0
        new Joint(sp * 2, sp + 17),
        // leg 2 1
        new Joint(sp * 2, sp + 19)
    ];
    const leg3 = [
        // leg 3 0
        new Joint(sp * 3, sp + 17),
        // leg 3 1
        new Joint(sp * 3, sp + 19)
    ];
    const bones = [
        new Bone(head[0], head[1]),
        new Bone(head[0], head[2]),
        new Bone(head[1], head[3]),
        new Bone(head[2], head[3]),
        new Bone(neck[0], neck[1]),
        new Bone(body[0], body[1]),
        new Bone(body[0], body[2]),
        new Bone(body[1], body[3]),
        new Bone(body[2], body[3]),
        new Bone(leg0[0], leg0[1]),
        new Bone(leg1[0], leg1[1]),
        new Bone(leg2[0], leg2[1]),
        new Bone(leg3[0], leg3[1])
    ];
    return new Skeleton({
        bn: bones,
        bc: "#794a03",
        jc: "#ffd900",
        bw: 5,
        jr: 3,
        scene
    });
}
scene.addMisc(Deer());
scene.start();
