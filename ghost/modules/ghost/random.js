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

function random(a = null, b = null) {
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

function chance(floor = 50) {
    return (random() <= floor);
}

module.exports = {
    random,
    chance,
    ghostmodule
};
