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
        this.gsVarDesire = s.gsVarDesire;
        this.gsVarName = s.gsVarName;
        this.gsVarVal = s.gsVarVal;
    }
}
class GSFunc {
    constructor(s) {
        this.gsFuncDesire = s.gsFuncDesire;
        this.gsFuncType = s.gsFuncType;
        this.gsFuncName = s.gsFuncName;
        this.gsFuncArgs = s.gsFuncArgs;
        this.gsFuncBody = s.gsFuncBody;
    }
}
class GSMethod {
    constructor(s) {
        this.gsMethodDesire = s.gsMethodDesire;
        this.gsMethodType = s.gsMethodType;
        this.gsMethodName = s.gsMethodName;
        this.gsMethodAttach = s.gsMethodAttach;
        this.gsMethodArgs = s.gsMethodArgs;
        this.gsMethodBody = s.gsMethodBody;
    }
}
class GSClass {
    constructor(s) {
        this.gsClassType = s.gsClassType;
        this.gsClassName = s.gsClassName;
        this.gsClassBuilder = s.gsClassBuilder;
        this.gsClassData = {};
    }
}
class GSType {
    constructor(s) {
        this.gsTypeName = s.gsClassName;
        this.gsTypeCheck = s.gsTypeCheck;
    }
}
class GSProp {
    constructor(s) {
        this.gsPropDesire = s.gsPropDesire
        this.gsPropType = s.gsPropType;
        this.gsPropName = s.gsPropName;
        this.gsPropGet = s.gsPropGet;
        this.gsPropSet = s.gsPropSet;
    }
}
class GSModifier {
    constructor(s) {
        this.gsModifierAttach = s.gsModifierAttach;
        this.gsModifierName = s.gsModifierName;
        this.gsModifierGet = s.gsModifierGet;
        this.gsModifierSet = s.gsModifierSet;
    }
}
class GSErr extends Error {
    constructor(nm, msg) {
        super(`${nm}: ${msg}`);
    }
}
class GSEvent extends CustomEvent {
    constructor(s) {
        super(s.name, {
            detail: s.detail,
            bubbles: s.bubbles,
            cancelable: s.cancelable
        });
    }
}
class GSGroup {
    constructor(s) {
        this.gsGroupName = s.gsGroupName;
        const {
            gsGroupName,
            gsGroupType = entity,
            gsGroupLimit = Infinity
        } = s.gsGroupOptions;
        this.gsGroupName = gsGroupName;
        this.gsGroupType = gsGroupType;
        this.gsGroupLimit = gsGroupLimit;
    }
}
class GSArg {
    constructor(s) {
        this.gsArgName = s.gsArgName;
        this.gsArgVal = s.gsArgVal;
        this.gsArgDesire  = s.gsArgDesire;
        this.gsArgType = s.gsArgType;
    }
}

function createVar({ name, val = null, mods = [], type = entity, desire = false }) {
    return new GSVar({
        gsVarMods: mods,
        gsVarType: type,
        gsVarDesire: desire,
        gsVarName: name,
        gsVarVal: val
    });
}
function createFunc({ name, args = [], type = entity, desire = false, body }) {
    return new GSFunc({
        gsFuncDesire: desire,
        gsFuncType: type,
        gsFuncName: name,
        gsFuncArgs: args,
        gsFuncBody: body
    });
}
function createMethod({ name, attach = entity, type = entity, args = [], desire = false, body }) {
    return new GSMethod({
        gsMethodName: name,
        gsMethodAttach: attach,
        gsMethodType: type,
        gsMethodArgs: args,
        gsMethodDesire: desire,
        gsMethodBody: body
    });
}
function createClass({ name, type = null, builder }) {
    return new GSClass({
        gsClassType: type,
        gsClassName: name,
        gsClassBuilder: builder
    });
}
function createType({ name, check }) {
    return new GSType({
        gsTypeName: name,
        gsTypeCheck: check
    });
}
function createProp({ name, type = entity, desire = false, get, set }) {
    return new GSProp({
        gsPropDesire: desire,
        gsPropType: type,
        gsPropName: name,
        gsPropGet: get,
        gsPropSet: set
    });
}
function createMod({ name, attach = entity, get, set }) {
    return new GSModifier({
        gsModifierAttach: attach,
        gsModifierName: name,
        gsModifierGet: get,
        gsModifierSet: set
    });
}
function createErr(nm, msg) {
    return new GSErr(nm, msg);
}
function createEvent({ name, detail, bubbles, cancelable }) {
    return new GSEvent({
        name, detail, bubbles, cancelable
    });
}
function arg(name, val = null, type = entity, desire = false) {
    return new GSArg({
        gsArgName: name,
        gsArgVal: val,
        gsArgType: type,
        gsArgDesire: desire
    });
}

const vars = [];

const funcs = [
    wait
];
const wait = createFunc({
    name: "wait",
    args: [
        arg("time", null, int, true)
    ],
    type: int,
    desire: false,
    body: (time) => new Promise((resolve) => setTimeout(resolve, time))
});

const methods = [
    toUpper,
    toLower,
    toTitle,
    count,
    replace,
    indexOf,
    sub,
    add,
    toString,
    toInt,
    toFloat
];
const toUpper = createMethod({
    name: "toUpper",
    attach: string,
    type: string,
    body: (target) => target.toUpperCase()
});
const toLower = createMethod({
    name: "toLower",
    attach: string,
    type: string,
    body: (target) => target.toLowerCase()
});
const toTitle = createMethod({
    name: "toTitle",
    attach: string,
    type: string,
    body: (target) => target.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
});
const count = createMethod({
    name: "count",
    attach: [string, array],
    type: int,
    args: [
        arg("delim", null, string, true)
    ],
    body: (target, delim) => {
        let r = 0;
        for(let i = 0; i < target.length; i++) if(target[i] == delim) r++;
        return r;
    }
});
const replace = createMethod({
    name: "replace",
    attach: string,
    type: string,
    args: [
        arg("pattern"),
        arg("value")
    ],
    body: (target, pattern, value) => target.replace(pattern, value)
});
const indexOf = createMethod({
    name: "indexOf",
    attach: [string, array],
    type: int,
    args: [
        arg("item"),
        arg("startpos", 0, int),
        arg("endpos", Infinity, int),
        arg("occurence", 1, int)
    ],
    body: (target, item, startpos, endpos, occurence) => {
        let o = 0;
        for(let i = startpos; i < target.length && i < endpos; i++) if(target[i] == item) o++; if(o == occurence) return i;
        return -1;
    }
});
const sub = createMethod({
    name: "sub",
    attach: array,
    type: array,
    args: [
        arg("olditem"),
        arg("newitem")
    ],
    body: (target, olditem, newitem) => {
        for(let i = 0; i < target.length; i++) if(target[i] == olditem) target[i] = newitem;
    }
});
const add = createMethod({
    name: "add",
    attach: array,
    type: array,
    args: [
        arg("items")
    ],
    body: (target, items) => target.push(...items)
});
const toString = createMethod({
    name: "toString",
    type: string,
    body: (target) => String(target)
});
const toInt = createMethod({
    name: "toInt",
    type: int,
    args: [
        arg("fallback", 0, int)
    ],
    body: (target, fallback) => {
        let str = String(target);
        let d = 0;
        for(let i = 0; i < str.length; i++) if(str[i] == ".") d++;
        while(d > 1) {
            str = str.replace(".", "");
            d--;
        }
        try {
            return parseInt(str);
        } catch(e) {
            console.error(e);
            return fallback;
        }
    }
});
const toFloat = createMethod({
    name: "toFloat",
    type: float,
    args: [
        arg("fallback", 0, float)
    ],
    body: (target, fallback) => {
        let str = String(target);
        let d = 0;
        for(let i = 0; i < str.length; i++) if(str[i] == ".") d++;
        while(d > 1) {
            str = str.replace(".", "");
            d--;
        }
        try {
            return parseFloat(str);
        } catch(e) {
            console.error(e);
            return fallback;
        }
    }
});

const classes = [];

const types = [
    entity,
    string,
    int,
    float,
    number,
    bool,
    array
];
const entity = createType({
    name: "entity",
    check: (val) => typeof val == "object"
});
const string = createType({
    name: "string",
    check: (val) => typeof val == "string"
});
const int = createType({
    name: "int",
    check: (val) => typeof val == "number" && Number.isInteger(val)
});
const float = createType({
    name: "float",
    check: (val) => typeof val == "number" && !Number.isInteger(val)
});
const number = createType({
    name: "number",
    check: (val) => typeof val == "number"
});
const bool = createType({
    name: "bool",
    check: (val) => typeof val == "boolean"
});
const array = createType({
    name: "array",
    check: (val) => Array.isArray(val)
});

const props = [];

const mods = [];

const errors = [
    InternalJavaScriptError,
    ImportMissingError,
    ImportInternalError,
    BadTypeError
];
// GhostScript
const InternalJavaScriptError = createErr("InternalJavaScriptError", "An internal JS error occured.");
const ImportMissingError = createErr("ImportMissingError", "Import does not exist.");
const ImportInternalError = createErr("ImportInternalError", "An internal error occured within an import.");
// Variables
const BadTypeError = createErr("BadTypeError", "Type does not exist.");

const events = [];

module.exports = {
    ...vars.reduce((acc, m) => (acc[m.gsVarName] = m, acc), {}),
    ...funcs.reduce((acc, m) => (acc[m.gsFuncName] = m, acc), {}),
    ...methods.reduce((acc, m) => (acc[m.gsMethodName] = m, acc), {}),
    ...classes.reduce((acc, m) => (acc[m.gsClassName] = m, acc), {}),
    ...types.reduce((acc, m) => (acc[gsTypeName] = m, acc), {}),
    ...props.reduce((acc, m) => (acc[gsPropName] = m, acc), {}),
    ...mods.reduce((acc, m) => (acc[gsModName] = m, acc), {}),
    ...errors.reduce((acc, m) => (acc[gsErrorName] = m, acc), {}),
    ...events.reduce((acc, m) => (acc[gsEventName] = m, acc), {}),
    ghostmodule
};
