const ghostmodule = {
    name: "ghost",
    desc: "The GhostScript standard library.",
    version: "1.0.0",
    author: "GhostScript",
    root: "ghost",
    reqroot: false,
    defroot: "ghost"
};

class GSVar {
    constructor(s) {
        this.gsVarMods = s.gsVarMods;
        this.gsVarType = s.gsVarType;
        this.gsVarName = s.gsVarName;
        this.gsVarVal = s.gsVarVal;
    }
}
class GSFunc {}
class GSMethod {}
class GSClass {}
class GSType {}
class GSProp {}
class GSErr extends Error {
    constructor(nm, msg) {
        super(`${nm}: ${msg}`);
    }
}
// GhostScript
class InternalJavaScriptError extends GSErr {
    constructor() {
        super("InternalJavaScriptError", "An internal JS error occured.");
    }
}
class ImportMissingError extends GSErr {
    constructor(imp) {
        super("ImportMissingError", `Import '${imp}' does not exist.`)
    }
}
class ImportInternalError extends GSErr {
    constructor() {
        super("ImportInternalError", "An internal error occured within an import.");
    }
}
// Variables
class BadTypeError extends GSErr {
    constructor(tp) {
        super("BadTypeError", `Type '${tp}' does not exist.`)
    }
}

module.exports = {
    GSVar,
    GSFunc,
    GSMethod,
    GSClass,
    GSType,
    GSProp,
    GSErr,
    InternalJavaScriptError,
    ImportMissingError,
    ImportInternalError,
    BadTypeError,
    ghostmodule
};