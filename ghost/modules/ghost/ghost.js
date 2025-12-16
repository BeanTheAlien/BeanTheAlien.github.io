const readline = require("readline");
const { GSVar, GSFunc, GSMethod, GSClass, GSType, GSProp, GSModifier, GSErr, GSEvent, GSGroup, GSOperator, GSDirective, GSArg, GSManager } = module_dev;

const ghostmodule = {
    name: "ghost",
    desc: "The GhostScript standard library.",
    version: "1.0.0",
    author: "GhostScript",
    root: "ghost",
    reqroot: false,
    defroot: "ghost"
};

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

/**
 * The entity type. Represents any value that is not null or undefined.
 */
const entity = createType({
    name: "entity",
    check: (val) => val != null && val != undefined
});
/**
 * The string type represents any value that has quotes.
 */
const string = createType({
    name: "string",
    check: (val) => typeof val == "string"
});
/**
 * Integers are a 1-step number value.
 * 
 * Integer values are limited to +-2.147.483.647.
 */
const int = createType({
    name: "int",
    check: (val) => typeof val == "number" && Number.isInteger(val)
});
/**
 * Floating-point values are double-accuracy decimals.
 * 
 * Float values are limited to +-1,7976931348623157E+308.
 */
const float = createType({
    name: "float",
    check: (val) => typeof val == "number" && !Number.isInteger(val)
});
/**
 * Number values are any value that is a numeric.
 */
const number = createType({
    name: "number",
    check: (val) => typeof val == "number"
});
/**
 * Booleans are a truthy value of true or false.
 */
const bool = createType({
    name: "bool",
    check: (val) => typeof val == "boolean"
});
/**
 * Arrays are a collection of values.
 * 
 * Arrays act like lists in other languages.
 */
const array = createType({
    name: "array",
    check: (val) => Array.isArray(val)
});
/**
 * Functions are re-usable pieces of code.
 */
const func = createType({
    name: "func",
    check: (val) => typeof val == "function"
});
const gsVoid = createType({
    name: "void",
    check: (val) => val === null || val === undefined
});
const types = [
    entity,
    string,
    int,
    float,
    number,
    bool,
    array,
    func,
    gsVoid
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

/**
 * The wait function forces the script thread to be paused.
 * @param {int} time - The milliseconds to wait.
 */
const wait = createFunc({
    name: "wait",
    args: [
        arg("time", null, int, true)
    ],
    type: int,
    desire: false,
    body: (time) => new Promise((resolve) => setTimeout(resolve, time))
});
/**
 * Prints a message to the console. No carriage return.
 * @param {...Object} msg - The message to be printed to the console.
 */
const print = createFunc({
    name: "print",
    args: [
        arg("msg", null)
    ],
    body: (...msg) => process.stdout.write(msg.map(m => m === null  ? "null" : m === undefined ? "undefined" : typeof m == "string" ? m : JSON.stringify(m)).join(""))
});
/**
 * Prints a message to the console. Carriage return.
 * @param {...Object} msg - The message to be printed to the console.
 */
const println = createFunc({
    name: "println",
    args: [
        arg("msg", null)
    ],
    body: (...msg) => console.log(msg.map(m => m === null ? "null" : m === undefined ? "undefined" : typeof m == "string" ? m : JSON.stringify(m)).join(""))
});
/**
 * Retrieves an input from the user.
 * @param {Object} msg - The question to ask the user.
 * @returns {string} The response from the user.
 */
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

/**
 * Applies uppercase format to a string.
 * @param {string} target - The string to convert.
 * @returns {string} The uppercase version of the string.
 */
const toUpper = createMethod({
    name: "toUpper",
    attach: string,
    type: string,
    body: (target) => target.toUpperCase()
});
/**
 * Applies lowercase format to a string.
 * @param {string} target - The string to convert.
 * @returns {string} The lowercase version of the string.
 */
const toLower = createMethod({
    name: "toLower",
    attach: string,
    type: string,
    body: (target) => target.toLowerCase()
});
/**
 * Applies titlecase format to a string.
 * @param {string} target - The string to convert.
 * @returns {string} The titlecase version of the string.
 */
const toTitle = createMethod({
    name: "toTitle",
    attach: string,
    type: string,
    body: (target) => target.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
});
/**
 * Finds the amount of occurences of the delimiter.
 * @param {string|Object[]} target - The source to check.
 * @param {Object} delim - The delimiter to check for.
 * @returns {number} The amount of times the delimiter appears.
 */
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
/**
 * Replaces an occurence of the pattern with the value.
 * @param {string} target - The target to check.
 * @param {RegExp|string} pattern - The pattern to match.
 * @param {Object} value - The value to use.
 */
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
/**
 * Finds the index of an item.
 * @param {string|Object[]} target - The source to check.
 * @param {int} [startpos=0] - The starting position.
 * @param {int} [endpos=Infinity] - The ending position.
 * @param {int} [occurence=1] - The occurence to find.
 * @returns {int} The index.
 */
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
/**
 * Substitue values within an array.
 * @param {Object[]} target - The source array.
 * @param {Object} olditem - The old item to remove.
 * @param {Object} newitem - The new item to insert.
 */
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
/**
 * Adds items to an array.
 * @param {Object[]} target - The source array to add to.
 * @param {...Object} items - The items to add.
 */
const add = createMethod({
    name: "add",
    attach: array,
    type: array,
    args: [
        arg("items")
    ],
    body: (target, items) => target.push(...items)
});
/**
 * Removes items from an array.
 * @param {Object[]} target - The source array to remove from.
 * @param {...Object} bad - The items to remove.
 */
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
/**
 * Turns an item into a string.
 * @param {Object} target - The item to stringify.
 * @returns {string} The target as a string.
 */
const toString = createMethod({
    name: "toString",
    type: string,
    body: (target) => String(target)
});
/**
 * Parses an item into an int.
 * @param {Object} target - The item to parse.
 * @param {int} [fallback=0] - The target to fall back to, if the parse returns NaN.
 * @returns {int} The parsed value.
 */
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
/**
 * Parses an item into a float.
 * @param {Object} target - The item to parse.
 * @param {float} [fallback=0] - The target to fall back to, if the parse returns NaN.
 * @returns {float} The parsed value.
 */
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
/**
 * Returns a number, floored.
 * @param {number} target - The source value.
 * @returns {int} The target, floored.
 */
const floor = createMethod({
    name: "floor",
    type: int,
    attach: number,
    body: (target) => Math.floor(target)
});
/**
 * Returns a number, ceiled.
 * @param {number} target - The source value.
 * @returns {int} The target, ceiled.
 */
const roof = createMethod({
    name: "roof",
    type: int,
    attach: number,
    body: (target) => Math.ceil(target)
});
/**
 * Rounds a number.
 * @param {number} target - The source value.
 * @param {int} [places=0] - The places to round to.
 * @returns {int} The value, rounded.
 */
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
/**
 * Returns whether an array contains the item(s) provided.
 * @param {Object[]} target - The source array.
 * @param {...Object} items - The items to check against the array.
 * @returns {boolean} Whether the array does or does not contain all the items provided.
 */
const has = createMethod({
    name: "has",
    type: bool,
    attach: array,
    args: [
        arg("items")
    ],
    body: (target, items) => items.every(i => target.includes(i))
});
/**
 * Adds a new event listener.
 * @param {Object} target - The target to apply the event.
 * @param {string} eventname - The name of the event.
 * @param {function} eventexec - The exec function of the event.
 */
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
/**
 * Removes an event listener.
 * @param {Object} target - The target to remove the event.
 * @param {string} eventname - The name of the event.
 * @param {function|undefined} eventexec - The exec function of the event.
 */
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
            target.eventStore[eventname].forEach(e => target.removeEventListener(eventname, e));
            delete target.eventStore[eventname];
        }
    }
});
/**
 * Clears the contents of an array.
 * @param {Object[]} target - The array to clear.
 */
const clear = createMethod({
    name: "clear",
    attach: array,
    body: (target) => target.splice(0, target.length)
});
/**
 * Inserts an element into an array at an index.
 * @param {Object[]} target - The target array.
 * @param {Object} item - The thing to insert.
 * @param {int} idx - The index to insert at.
 */
const insert = createMethod({
    name: "insert",
    attach: array,
    args: [
        arg("item"),
        arg("idx", null, int, true)
    ],
    body: (target, item, idx) => target.splice(idx, 0, item) 
});
/**
 * Finds the smallest value in the array.
 * @param {Object[]} target - The target array.
 * @param {int} [idx=0] - The nth smallest number to get.
 * @returns {number} The nth smallest value.
 */
const min = createMethod({
    name: "min",
    attach: array,
    args: [
        arg("idx", 0, int)
    ],
    body: (target, idx) => [...target].sort((a, b) => b - a)[idx]
});
/**
 * Finds the largest value in the array.
 * @param {Object[]} target - The target array.
 * @param {int} [idx=0] - The nth largest number to get.
 * @returns {number} The nth largest value.
 */
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

/**
 * The length of a value.
 */
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
    set: (target, fn) => target.onOverflow = fn
});
const onUnderflow = createProp({
    name: "onUnderflow",
    attach: func,
    get: (target) => target.onUnderflow,
    set: (target, fn) => target.onUnderflow = fn
});
const props = [
    length,
    onOverflow
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

const single = createMod({
    name: "single",
    attach: GSVar,
    get: (target) => {
        gsVarManager.del(target.gsVarName);
        return target.gsVarVal;
    },
    set: () => {
        // throw SingleSetError;
    }
});
const mods = [
    single
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
