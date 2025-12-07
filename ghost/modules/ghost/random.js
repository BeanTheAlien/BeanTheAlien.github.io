const { GSVar, GSFunc, GSMethod, GSClass, GSType, GSProp, GSModifier, GSErr, GSEvent, GSGroup, GSOperator, GSDirective, GSArg, GSManager } = module_dev;
const { entity, string, int, float, number, bool, array, func, gsVoid } = runtime.scope;

const ghostmodule = {
    name: "random",
    desc: "The Random module for GhostScript.",
    version: "1.0.0",
    author: "GhostScript",
    root: "ghost",
    reqroot: false,
    defroot: "random"
};

const random = new GSFunc({
    gsFuncDesire: false,
    gsFuncType: int,
    gsFuncName: "random",
    gsFuncArgs: [
        new GSArg({ gsArgName: "a", gsArgVal: null, gsArgDesire: true, gsArgType: int }),
        new GSArg({ gsArgName: "b", gsArgVal: null, gsArgDesire: true, gsArgType: int })
    ],
    gsFuncBody: (a, b) => {
        if(a == null && b == null) {
            return Math.floor(Math.random() * 101);
        } else if(a != null && b == null) {
            return Math.floor(Math.random() * a);
        } else if(a != null && b != null) {
            let min;
            let max;
            if(a > b) {
                min = Math.ceil(b);
                max = Math.floor(a);
                return Math.floor(Math.random() * (max - min)) + min;
            } else if(a < b) {
                min = Math.ceil(a);
                max = Math.floor(b);
                return Math.floor(Math.random() * (max - min)) + min;
            } else {
                return Math.floor(Math.random() * a);
            }
        }
    }
});
const chance = new GSFunc({
    gsFuncDesire: false,
    gsFuncType: bool,
    gsFuncName: "chance",
    gsFuncArgs: [new GSArg({ gsArgName: "floor", gsArgVal: null, gsArgDesire: true, gsArgType: int })],
    gsFuncBody: (floor) => {
        return random.gsFuncBody() <= floor;
    }
});
const ranBool = new GSFunc({
    gsFuncDesire: false,
    gsFuncType: bool,
    gsFuncName: "ranBool",
    gsFuncArgs: [],
    gsFuncBody: () => {
        return chance.gsFuncBody(50);
    }
});
const ranFloat = new GSFunc({
    gsFuncDesire: false,
    gsFuncType: float,
    gsFuncName: "ranFloat",
    gsFuncArgs: [
        new GSArg({ gsArgName: "a", gsArgVal: null, gsArgDesire: true, gsArgType: float }),
        new GSArg({ gsArgName: "b", gsArgVal: null, gsArgDesire: true, gsArgType: float })
    ],
    gsFuncBody: (a, b) => {
        if(a == null && b == null) {
            return Math.random() * 101;
        } else if(a != null && b == null) {
            return Math.random() * a;
        } else if(a != null && b != null) {
            if(a > b) {
                return Math.random() * (a - b) + b;
            } else if(a < b) {
                return Math.random() * (b - a) + a;
            } else {
                return Math.random() * a;
            }
        }
    }
});
const ranChar = new GSFunc({
    gsFuncDesire: false,
    gsFuncType: string,
    gsFuncName: "ranChar",
    gsFuncArgs: [],
    gsFuncBody: () => {
        return String.fromCharCode(random.gsFuncBody(97, 123));
    }
});
const ranString = new GSFunc({
    gsFuncDesire: false,
    gsFuncType: string,
    gsFuncName: "ranString",
    gsFuncArgs: [new GSArg({ gsArgName: "len", gsArgVal: null, gsArgDesire: true, gsArgType: int })],
    gsFuncBody: (len) => {
        let c = [];
        for(let i = 0; i < len; i++) c.push(ranChar.gsFuncBody());
        return c.join("");
    }
});
// this.gsArgName = s.gsArgName;
// this.gsArgVal = s.gsArgVal;
// this.gsArgDesire  = s.gsArgDesire;
// this.gsArgType = s.gsArgType;

module.exports = {
    random,
    chance,
    ranBool,
    ranFloat,
    ranChar,
    ranString,
    ghostmodule
};
