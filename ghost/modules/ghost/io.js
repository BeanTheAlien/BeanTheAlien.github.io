const fs = require("fs");
const { GSVar, GSFunc, GSMethod, GSClass, GSType, GSProp, GSModifier, GSErr, GSEvent, GSGroup, GSOperator, GSDirective, GSArg, GSManager } = module_dev;
const { entity, string, int, float, number, bool, array, func, gsVoid } = runtime.scope;

const ghostmodule = {
    name: "io",
    desc: "The I/O module for GhostScript.",
    version: "1.0.0",
    author: "GhostScript",
    root: "ghost",
    reqroot: false,
    defroot: "io"
};

const write = new GSFunc({
    gsFuncDesire: false, gsFuncType: gsVoid,
    gsFuncName: "write", gsFuncArgs: [
        new GSArg({
            gsArgName: "filepath", gsArgVal: null, gsArgDesire: true, gsArgType: string
        }),
        new GSArg({
            gsArgname: "cont", gsArgVal: null, gsArgDesire: true, gsArgType: string
        })
    ],
    gsFuncBody: fs.writeFileSync
});
const read = new GSFunc({
    gsFuncDesire: false, gsFuncType: string,
    gsFuncName: "read", gsFuncArgs: [new GSArg({ gsArgName: "filepath", gsArgVal: null, gsArgDesire: true, gsArgType: string })],
    gsFuncBody: fs.readFileSync
});
const append = new GSFunc({
    gsFuncDesire: false, gsFuncType: gsVoid,
    gsFuncName: "append", gsFuncArgs: [
        new GSArg({
            gsArgName: "filepath", gsArgVal: null, gsArgDesire: true, gsArgType: string
        }),
        new GSArg({
            gsArgname: "cont", gsArgVal: null, gsArgDesire: true, gsArgType: string
        })
    ],
    gsFuncBody: fs.appendFileSync
});
const exists = new GSFunc({
    gsFuncDesire: false, gsFuncType: bool,
    gsFuncName: "exists", gsFuncArgs: [new GSArg({ gsArgName: "filepath", gsArgVal: null, gsArgDesire: true, gsArgType: string })],
    gsFuncBody: fs.existsSync
});
const mkdir = new GSFunc({
    gsFuncDesire: false, gsFuncType: gsVoid,
    gsFuncName: "mkdir", gsFuncArgs: [new GSArg({ gsArgName: "filepath", gsArgVal: null, gsArgDesire: true, gsArgType: string })],
    gsFuncBody: fs.mkdirSync
});
const readdir = new GSFunc({
    gsFuncDesire: false, gsFuncType: string,
    gsFuncName: "readdir", gsFuncArgs: [new GSArg({ gsArgName: "dirpath", gsArgVal: null, gsArgDesire: true, gsArgType: string })],
    gsFuncBody: fs.readdirSync
});
const rem = new GSFunc({
    gsFuncDesire: false, gsFuncType: gsVoid,
    gsFuncName: "rem", gsFuncArgs: [new GSArg({ gsArgName: "filepath", gsArgVal: null, gsArgDesire: true, gsArgType: string })],
    gsFuncBody: fs.rmSync
});
const remdir = new GSFunc({
    gsFuncDesire: false, gsFuncType: gsVoid,
    gsFuncName: "remdir", gsFuncArgs: [new GSArg({ gsArgName: "dirpath", gsArgVal: null, gsArgDesire: true, gsArgType: string })],
    gsFuncBody: fs.rmdirSync
});
const cp = new GSFunc({
    gsFuncDesire: false, gsFuncType: gsVoid,
    gsFuncName: "cp", gsFuncArgs: [
        new GSArg({ gsArgName: "sourcefile", gsArgVal: null, gsArgDesire: true, gsArgType: string }),
        new GSArg({ gsArgName: "destinationfile", gsArgVal: null, gsArgDesire: true, gsArgType: string })
    ],
    gsFuncBody: fs.copyFileSync
});
const json = {
    read: new GSFunc({
        gsFuncDesire: false, gsFuncType: string,
        gsFuncName: "json.read", gsFuncArgs: [new GSArg({ gsArgName: "filepath", gsArgVal: null, gsArgDesire: true, gsArgType: string })],
        gsFuncBody: (filepath) => JSON.parse(fs.readFileSync(filepath))
    }),
    write: new GSFunc({
        gsFuncDesire: false, gsFuncType: gsVoid,
        gsFuncName: "json.write", gsFuncArgs: [
            new GSArg({ gsArgName: "filepath", gsArgVla: null, gsArgDesire: true, gsArgType: string }),
            new GSArg({ gsArgName: "content", gsArgVal: null, gsArgDesire: true, gsArgType: entity })
        ],
        gsFuncBody: (filepath, content) => fs.writeFileSync(filepath, JSON.stringify(content))
    })
};

module.exports = {
    read, write,
    readdir, append,
    cp, rem, remdir,
    exists, mkdir, ...json,
    ghostmodule
};
