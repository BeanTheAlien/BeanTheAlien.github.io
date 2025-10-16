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
class GSArg {
    constructor(s) {
        this.gsArgName = s.gsArgName;
        this.gsArgVal = s.gsArgVal;
        this.gsArgDesire  = s.gsArgDesire;
        this.gsArgType = s.gsArgType;
    }
}
class toUpper extends GSMethod {
    constructor() {
        super({
            gsMethodDesire: false,
            gsMethodType: GSString,
            gsMethodName: "toUpper",
            gsMethodAttach: GSString,
            gsMethodArgs: null,
            gsMethodBody: (target) => {
                return target.toUpperCase();
            }
        });
    }
}
class toLower extends GSMethod {
    constructor() {
        super({
            gsMethodDesire: false,
            gsMethodType: GSString,
            gsMethodName: "toLower",
            gsMethodAttach: GSString,
            gsMethodArgs: null,
            gsMethodBody: (target) => {
                return target.toLowerCase();
            }
        });
    }
}
class toTitle extends GSMethod {
    constructor() {
        super({
            gsMethodDesire: false,
            gsMethodType: GSString,
            gsMethodName: "toTitle",
            gsMethodAttach: GSString,
            gsMethodArgs: null,
            gsMethodBody: (target) => {
                return target.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
            }
        });
    }
}
class count extends GSMethod {
    constructor() {
        super({
            gsMethodDesire: false,
            gsMethodType: GSInt,
            gsMethodName: "count",
            gsMethodAttach: [GSString, GSArray],
            gsMethodArgs: [{
                desire: true,
                type: GSString,
                name: "delim",
                def: null
            }],
            gsMethodBody: (target, delim) => {
                let result = 0;
                for(let i = 0; i < target.length; i++) if(target[i] == delim) result++;
                return result;
            }
        });
    }
}
class replace extends GSMethod {
    constructor() {
        super({
            gsMethodDesire: false,
            gsMethodType: GSBool,
            gsMethodName: "replace",
            gsMethodAttach: GSString,
            gsMethodArgs: [
                new GSArg({
                    gsArgName: "pattern",
                    gsArgVal: null,
                    gsArgDesire: true,
                    gsArgType: GSString
                },
                new GSArg({
                    gsArgName: "value",
                    gsArgVal: null,
                    gsArgDesire: false,
                    gsArgType: GSEntity
                })
            ],
            gsMethodBody: (target, pattern, value) => {
                return target.replace(pattern, value);
            }
        });
    }
}
class indexOf extends GSMethod {
    constructor() {
        super({
            gsMethodDesire: true,
            gsMethodType: GSInt,
            gsMethodName: "indexOf",
            gsMethodAttach: GSInt,
            gsMethodArgs: [
                new GSArg({
                    gsArgName: "item",
                    gsArgVal: null,
                    gsArgDesire: false,
                    gsArgType: GSEntity
                }),
                new GSArg({
                    gsArgName: "startidx",
                    gsArgVal: 0,
                    gsArgDesire: false,
                    gsArgType: GSInt
                }),
                new GSArg({
                    gsArgName: "endidx",
                    gsArgVal: Infinity,
                    gsArgDesire: false,
                    gsArgType: GSInt
                }),
                new GSArg({
                    gsArgName: "occurence",
                    gsArgVal: 1,
                    gsArgDesire: false,
                    gsArgType: GSInt
                })
            ],
            gsMethodBody: (target, item, startidx, endidx, occurence) => {
                //
            }
        });
    }
}
// class null extends GSMethod {
//     constructor() {
//         super({
//             gsMethodDesire: null,
//             gsMethodType: null,
//             gsMethodName: null,
//             gsMethodAttach: null,
//             gsMethodArgs: null,
//             gsMethodBody: null
//         });
//     }
// }
class GSClass {
    constructor(s) {
        this.gsClassType = s.gsClassType;
        this.gsClassName = s.gsClassName;
        this.gsClassBuilder = s.gsClassBuilder;
        this.gsClassVars = s.gsClassVars;
        this.gsClassFuncs = s.gsClassFuncs;
        this.gsClassMethods = s.gsClassMethods;
        this.gsClassClasses = s.gsClassClasses;
        this.gsClassTypes = s.gsClassTypes;
        this.gsClassProps = s.gsClassProps;
    }
}
class GSType {
    constructor(s) {
        this.gsTypeName = s.gsClassName;
        this.gsTypeCheck = s.gsTypeCheck;
    }
}
class GSEntity extends GSType {
    constructor() {
        super({
            gsTypeName: "entity",
            gsTypeCheck: (value) => {
                return typeof value == "object";
            }
        });
    }
}
class GSString extends GSType {
    constructor() {
        super({
            gsTypeName: "string",
            gsTypeCheck: (value) => {
                return typeof value == "string"
            }
        });
    }
}
class GSInt extends GSType {
    constructor() {
        super({
            gsTypeName: "int",
            gsTypeCheck: (value) => {
                return typeof value == "number" && Math.round(value) == value;
            }
        });
    }
}
class GSFloat extends GSType {
    constructor() {
        super({
            gsTypeName: "float",
            gsTypeCheck: (value) => {
                return typeof value == "number" && Math.round(value) != value;
            }
        });
    }
}
class GSNumber extends GSType {
    constructor() {
        super({
            gsTypeName: "number",
            gsTypeCheck: (value) => {
                return typeof value == "number";
            }
        });
    }
}
class GSBool extends GSType {
    constructor() {
        super({
            gsTypeName: "bool",
            gsTypeCheck: (value) => {
                return typeof value == "boolean";
            }
        });
    }
}
class GSArray extends GSType {
    constructor() {
        super({
            gsTypeName: "array",
            gsTypeCheck: (value) => {
                return Array.isArray(value);
            }
        });
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
class GSEvent extends CustomEvent {
    constructor(s) {
        super(s.name, {
            detail: s.detail,
            bubbles: s.bubbles,
            cancelable: s.cancelable
        });
    }
}

module.exports = {
    GSVar,
    GSFunc,
    GSMethod,
    toUpper,
    toLower,
    toTitle,
    count,
    replace,
    GSClass,
    GSType,
    GSEntity,
    GSString,
    GSInt,
    GSFloat,
    GSNumber,
    GSBool,
    GSArray,
    GSProp,
    GSModifier,
    GSErr,
    InternalJavaScriptError,
    ImportMissingError,
    ImportInternalError,
    BadTypeError,
    GSEvent,
    ghostmodule
};
