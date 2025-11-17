const { GSVar, GSFunc, GSMethod, GSClass, GSType, GSProp, GSModifier, GSErr, GSEvent, GSGroup, GSOperator, GSDirective, GSArg, GSManager } = module_dev;

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
    gsFuncType: "int",
    gsFuncName: "random",
    gsFuncArgs: [
        new GSArg({ gsArgName: "a", gsArgVal: null, gsArgDesire: true, gsArgType: "int" }),
        new GSArg({ gsArgName: "b", gsArgVal: null, gsArgDesire: true, gsArgType: "int" })
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
    gsFuncType: "bool",
    gsFuncName: "chance",
    gsFuncArgs: [new GSArg({ gsArgName: "floor", gsArgVal: null, gsArgDesire: true, gsArgType: "int" })],
    gsFuncBody: (floor) => {
        return random.gsFuncBody() <= floor;
    }
});
const ranBool = new GSFunc({
    gsFuncDesire: false,
    gsFuncType: "bool",
    gsFuncName: "ranBool",
    gsFuncArgs: [],
    gsFuncBody: () => {
        return chance.gsFuncBody(50);
    }
});
// this.gsArgName = s.gsArgName;
// this.gsArgVal = s.gsArgVal;
// this.gsArgDesire  = s.gsArgDesire;
// this.gsArgType = s.gsArgType;

module.exports = {
    random,
    chance,
    ghostmodule
};
