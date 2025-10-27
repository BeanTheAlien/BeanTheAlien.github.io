const readline = require("readline");

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
        this.gsTypeName = s.gsTypeName;
        this.gsTypeCheck = s.gsTypeCheck;
    }
}
class GSProp {
    constructor(s) {
        this.gsPropDesire = s.gsPropDesire
        this.gsPropAttach = s.gsPropAttach;
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
class GSOperator {
    constructor(s) {
        this.gsOperatorName = s.gsOperatorName;
        this.gsOperatorExpression = s.gsOperatorExpression;
        this.gsOperatorExec = s.gsOperatorExec;
        this.gsOperatorType = s.gsOperatorType;
        this.gsOperatorDesire = s.gsOperatorDesire;
    }
}
class GSDirective {
    constructor(s) {
        this.gsDirectiveName = s.gsDirectiveName;
        this.gsDirectiveExec = s.gsDirectiveExec;
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
class GSManager {
    constructor(s) {
        this.gsManagerName = s.gsManagerName;
        this.gsManagerVals = s.gsManagerVals;
    }
    get(name) {
        return this.gsManagerVals[name];
    }
    set(name, val) {
        this.gsManagerVals[name] = val;
    }
    del(name) {
        delete this.gsManagerVals[name];
    }
}
// class GSConsole {
//     constructor() {}
//     write(...args) {
//         process.stdout.write(...args);
//     }
//     writeline(...args) {
//         console.log(...args);
//     }
// }
const gsVarManager = new GSManager({
    gsManagerName: "gsVarManager",
    gsManagerVals: {}
});

const entity = createType({
    name: "entity",
    check: (val) => val != null && val != undefined
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
const func = createType({
    name: "func",
    check: (val) => typeof val == "function"
});
const types = [
    entity,
    string,
    int,
    float,
    number,
    bool,
    array,
    func
];

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
function createProp({ name, attach = entity, desire = false, get, set }) {
    return new GSProp({
        gsPropDesire: desire,
        gsPropAttach: attach,
        gsPropName: name,
        gsPropGet: get,
        gsPropSet: set
    });
}
function createMod({ name, attach, get, set }) {
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
function createOperator({ name, exp, exec, type = entity, desire = false }) {
    return new GSOperator({
        gsOperatorName: name,
        gsOperatorExpression: exp,
        gsOperatorExec: exec,
        gsOperatorType: type,
        gsOperatorDesire: desire
    });
}
function createDirective({ name, exec }) {
    return new GSDirective({
        gsDirectiveName: name,
        gsDirectiveExec: exec
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

const wait = createFunc({
    name: "wait",
    args: [
        arg("time", null, int, true)
    ],
    type: int,
    desire: false,
    body: (time) => new Promise((resolve) => setTimeout(resolve, time))
});
const print = createFunc({
    name: "print",
    args: [
        arg("msg", null)
    ],
    body: (...msg) => process.stdout.write(msg.map(m => m === null  ? "null" : m === undefined ? "undefined" : typeof m == "string" ? m : JSON.stringify(m)).join(""))
});
const println = createFunc({
    name: "println",
    args: [
        arg("msg", null)
    ],
    body: (...msg) => console.log(msg.map(m => m === null ? "null" : m === undefined ? "undefined" : typeof m == "string" ? m : JSON.stringify(m)).join(""))
});
const prompt = createFunc({
    name: "prompt",
    args: [
        arg("msg", null)
    ],
    body: async (msg) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        const ask = (q) => new Promise(res => rl.question(q, res));
        const resp = await ask(msg ?? "");
        rl.close();
        return resp;
    }
});
const funcs = [
    wait,
    print,
    println,
    prompt
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
const remove = createMethod({
    name: "remove",
    attach: array,
    type: array,
    args: [
        arg("bad")
    ],
    body: (target, ...bad) => {
        for(let i = target.length - 1; i >= 0; i--) {
            if(bad.includes(target[i])) {
                target.splice(i, 1);
            }
        }
    }
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
        return parseInt(String(target)) || (fallback ?? 0);
    }
});
const toFloat = createMethod({
    name: "toFloat",
    type: float,
    args: [
        arg("fallback", 0, float)
    ],
    body: (target, fallback) => {
        return parseFloat(String(target)) || (fallback ?? 0);
    }
});
const floor = createMethod({
    name: "floor",
    type: int,
    attach: number,
    body: (target) => Math.floor(target)
});
const roof = createMethod({
    name: "roof",
    type: int,
    attach: number,
    body: (target) => Math.ceil(target)
});
const round = createMethod({
    name: "round",
    type: int,
    attach: number,
    args: [
        arg("places", 0, int)
    ],
    body: (target, places) => {
        if(places != 0) return target.toFixed(places);
        else return Math.round(target);
    }
});
const has = createMethod({
    name: "has",
    type: bool,
    attach: array,
    args: [
        arg("items")
    ],
    body: (target, items) => items.every(i => target.includes(i))
});
const addEvent = createMethod({
    name: "addEvent",
    args: [
        arg("eventname"),
        arg("eventexec")
    ],
    body: (target, eventname, eventexec) => {
        target.addEventListener(eventname, () => eventexec);
        if(!target.eventStore) target.eventStore = {};
        if(!target.eventStore[eventname]) target.eventStore[eventname] = [];
        target.eventStore[eventname].push(eventexec);
    }
});
const remEvent = createMethod({
    name: "remEvent",
    args: [
        arg("eventname"),
        arg("eventexec", null)
    ],
    body: (target, eventname, eventexec) => {
        if(eventexec) {
            target.removeEventListener(eventname, eventexec);
            target.eventStore[eventname].splice(target.eventStore[eventname].indexOf(eventexec), 1);
        }
        else {
            target.eventStore[eventname].forEach(e => target.removeEventListener(eventname, eventexec));
            delete target.eventStore[eventname];
        }
    }
});
const clear = createMethod({
    name: "clear",
    attach: array,
    body: (target) => target.splice(0, target.length)
});
const insert = createMethod({
    name: "insert",
    attach: array,
    args: [
        arg("item"),
        arg("idx", null, int, true)
    ],
    body: (target, item, idx) => target.splice(idx, 0, item) 
});
const min = createMethod({
    name: "min",
    attach: array,
    args: [
        arg("idx", 0, int)
    ],
    body: (target, idx) => [...target].sort((a, b) => b - a)[idx]
});
const max = createMethod({
    name: "max",
    attach: array,
    args: [
        arg("idx", 0, int)
    ],
    body: (target, idx) => [...target].sort((a, b) => a - b)[idx]
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
    remove,
    toString,
    toInt,
    toFloat,
    floor,
    roof,
    round,
    has,
    addEvent,
    remEvent,
    clear,
    insert,
    min,
    max
];

const classes = [];

const length = createProp({
    name: "length",
    attach: [string, array],
    get: (target) => target.length,
    set: (target, len) => target = target.slice(0, len)
});
const onOverflow = createProp({
    name: "onOverflow",
    attach: func,
    get: (target) => target.onOverflow,
    set: (target, func) => target.onOverflow = func
});
const props = [
    length,
    onOverflow
];

const single = createMod({
    name: "single",
    attach: GSVar,
    get: (target) => {
        gsVarManager.del(target.gsVarName);
        return target.gsVarVal;
    },
    set: () => {
        throw new SingleSetError();
    }
});
const mods = [
    single
];

// GhostScript
const InternalJavaScriptError = createErr("InternalJavaScriptError", "An internal JS error occured.");
const ImportMissingError = createErr("ImportMissingError", "Import does not exist.");
const ImportInternalError = createErr("ImportInternalError", "An internal error occured within an import.");
// Variables
const BadTypeError = createErr("BadTypeError", "Type does not exist.");
const TypeMismatchError = createErr("TypeMismatchError", "Value does not match variable type.");
const OutOfBoundsError = createErr("OutOfBoundsError", "Index does not exist.");
const SingleSetError = createErr("SingleSetError", "Cannot set a variable with modifier of single.");
const errors = [
    InternalJavaScriptError,
    ImportMissingError,
    ImportInternalError,
    BadTypeError,
    TypeMismatchError,
    OutOfBoundsError,
    SingleSetError
];

const events = [];

const somewhatLike = createOperator({
    name: "somewhatlike",
    exp: ["~="],
    exec: (lhs, rhs) => lhs == rhs || String(lhs).toLowerCase() == String(rhs).toLowerCase() || Math.abs((parseFloat(String(lhs)) || 0) - (parseFloat(String(rhs)) || 0)) <= 0.000001 || Math.abs(String(rhs).split("").filter(i => !String(lhs).includes(i)).length - String(lhs).split("").filter(i => !String(rhs).includes(i)).length) <= 3 || typeof lhs == typeof rhs,
    type: bool
});
const operators = [
    somewhatLike
];

const directives = [];

module.exports = {
    ...vars.reduce((acc, m) => (acc[m.gsVarName] = m, acc), {}),
    ...funcs.reduce((acc, m) => (acc[m.gsFuncName] = m, acc), {}),
    ...methods.reduce((acc, m) => (acc[m.gsMethodName] = m, acc), {}),
    ...classes.reduce((acc, m) => (acc[m.gsClassName] = m, acc), {}),
    ...types.reduce((acc, m) => (acc[m.gsTypeName] = m, acc), {}),
    ...props.reduce((acc, m) => (acc[m.gsPropName] = m, acc), {}),
    ...mods.reduce((acc, m) => (acc[m.gsModifierName] = m, acc), {}),
    ...errors.reduce((acc, m) => (acc[m.gsErrorName] = m, acc), {}),
    ...events.reduce((acc, m) => (acc[m.gsEventName] = m, acc), {}),
    ...operators.reduce((acc, m) => (acc[m.gsOperatorName] = m, acc), {}),
    ...directives.reduce((acc, m) => (acc[m.gsDirectiveName] = m, acc), {}),
    ghostmodule
};
