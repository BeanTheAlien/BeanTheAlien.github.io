const { GSVar, GSFunc, GSMethod, GSClass, GSType, GSProp, GSModifier, GSErr, GSEvent, GSGroup, GSOperator, GSDirective, GSArg, GSManager } = module_dev;

const ghostmodule = {
    name: "format",
    desc: "The GhostScriptFormat module for GhostScript.",
    version: "1.0.0",
    author: "GhostScript",
    root: "ghost",
    reqroot: false,
    defroot: "format"
};

/*
--- Format Guide ---
#{...} - formatted region
== String ==
base: string
code: s
props:
len(int) - truncates the string to the passed max length
== Number ==
base: num
code: n
props:
round(int) - rounds the value to the passed places, uses Math.round if places <= 0
== Bool ==
base: bool
code: b
props:
none
== Array ==
base: array
code: a
props:
len(int) - truncates the array to the passed max length
== Object ==
base: obj
code: o
props:
none
*/

const format = new gs.GSFunc({
    gsFuncDesire: false,
    gsFuncType: String,
    gsFuncName: "format",
    gsFuncArgs: [
        new gs.GSArg({
            gsArgName: "val",
            gsArgVal: null,
            gsArgDesire: true,
            gsArgType: String
        })
    ],
    gsFuncBody: (val) => {}
});

module.exports = {
    format,
    ghostmodule
};