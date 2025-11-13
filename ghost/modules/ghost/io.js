const fs = require("fs");
const { GSFunc, GSArg } = require("../../dev/module_dev");

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
    gsFuncDesire: false, gsFuncType: "void",
    gsFuncName: "write", gsFuncArgs: [
        new GSArg({
            gsArgName: "filepath", gsArgVAL: null, gsArgDesire: true, gsArgType: "string"
        }),
        new GSArg({
            gsArgname: "cont", gsArgVal: null, gsArgDesire: true, gsArgType: "string"
        })
    ],
    gsFuncBody: fs.writeFileSync
});
const read = new GSFunc({
    gsFuncDesire: false, gsFuncType: "string",
    gsFuncName: "read", gsFuncArgs: [new GSArg({ gsArgName: "filepath", gsArgVAL: null, gsArgDesire: true, gsArgType: "string" })],
    gsFuncBody: fs.readFileSync
});
const append = new GSFunc({
    gsFuncDesire: false, gsFuncType: "void",
    gsFuncName: "append", gsFuncArgs: [
        new GSArg({
            gsArgName: "filepath", gsArgVAL: null, gsArgDesire: true, gsArgType: "string"
        }),
        new GSArg({
            gsArgname: "cont", gsArgVal: null, gsArgDesire: true, gsArgType: "string"
        })
    ],
    gsFuncBody: fs.appendFileSync
});
const exists = new GSFunc({
    gsFuncDesire: false, gsFuncType: "bool",
    gsFuncName: "exists", gsFuncArgs: [new GSArg({ gsArgName: "filepath", gsArgVAL: null, gsArgDesire: true, gsArgType: "string" })],
    gsFuncBody: fs.existsSync
});
const mkdir = new GSFunc({
    gsFuncDesire: false, gsFuncType: "void",
    gsFuncName: "mkdir", gsFuncArgs: [new GSArg({ gsArgName: "filepath", gsArgVAL: null, gsArgDesire: true, gsArgType: "string" })],
    gsFuncBody: fs.mkdirSync
});
const readdir = new GSFunc({
    gsFuncDesire: false, gsFuncType: "string",
    gsFuncName: "readdir", gsFuncArgs: [new GSArg({ gsArgName: "dirpath", gsArgVAL: null, gsArgDesire: true, gsArgType: "string" })],
    gsFuncBody: fs.readdirSync
});
const rem = new GSFunc({
    gsFuncDesire: false, gsFuncType: "void",
    gsFuncName: "rem", gsFuncArgs: [new GSArg({ gsArgName: "filepath", gsArgVAL: null, gsArgDesire: true, gsArgType: "string" })],
    gsFuncBody: fs.rmSync
});
const remdir = new GSFunc({
    gsFuncDesire: false, gsFuncType: "void",
    gsFuncName: "remdir", gsFuncArgs: [new GSArg({ gsArgName: "dirpath", gsArgVAL: null, gsArgDesire: true, gsArgType: "string" })],
    gsFuncBody: fs.rmdirSync
});
const cp = new GSFunc({
    gsFuncDesire: false, gsFuncType: "void",
    gsFuncName: "cp", gsFuncArgs: [
        new GSArg({ gsArgName: "sourcefile", gsArgVAL: null, gsArgDesire: true, gsArgType: "string" }),
        new GSArg({ gsArgName: "destinationfile", gsArgVAL: null, gsArgDesire: true, gsArgType: "string" })
    ],
    gsFuncBody: fs.copyFileSync
});
const json = {
    read: new GSFunc({
        gsFuncDesire: false, gsFuncType: "string",
        gsFuncName: "read", gsFuncArgs: [new GSArg({ gsArgName: "filepath", gsArgVAL: null, gsArgDesire: true, gsArgType: "string" })],
        gsFuncBody: (fpath) => JSON.parse(fs.readFileSync(fpath))
    })
};

module.exports = {
    read, write,
    readdir, writedir,
    append, cp, rem, remdir,
    exists, mkdir,
    ghostmodule
};
