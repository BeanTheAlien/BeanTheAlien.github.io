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
padS(string, int) - pads the string's start with string for int
padE(string, int) - pads the string's end with string for int

*/

function format() {}

module.exports = {
    format,
    ghostmodule
};
