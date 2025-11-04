/**
 * Used for creating variables.
 * @class
 */
class GSVar {
    /**
     * The constructor for GhostScript variables.
     * @param {{ gsVarMods: GSModifier[], gsVarType: GSType, gsVarDesire: boolean, gsVarName: string, gsVarVal: Object }} s - The variable settings.
     */
    constructor(s) {
        this.gsVarMods = s.gsVarMods;
        this.gsVarType = s.gsVarType;
        this.gsVarDesire = s.gsVarDesire;
        this.gsVarName = s.gsVarName;
        this.gsVarVal = s.gsVarVal;
    }
}
/**
 * Used for creating functions.
 * @class
 */
class GSFunc {
    /**
     * The constructor for GhostScript functions.
     * @param {{ gsFuncDesire: boolean, gsFuncType: GSType, gsFuncName: string, gsFuncArgs: Object[], gsFuncBody: function }} s - The function settings.
     */
    constructor(s) {
        this.gsFuncDesire = s.gsFuncDesire;
        this.gsFuncType = s.gsFuncType;
        this.gsFuncName = s.gsFuncName;
        this.gsFuncArgs = s.gsFuncArgs;
        this.gsFuncBody = s.gsFuncBody;
    }
}
/**
 * Used for creating methods.
 * @class
 */
class GSMethod {
    /**
     * The constructor for GhostScript methods.
     * @param {{ gsMethodDesire: boolean, gsMethodType: GSType, gsMethodName: string, gsMethodAttach: GSType[], gsMethodArgs: Object[], gsMethodBody: function }} s - The method settings.
     */
    constructor(s) {
        this.gsMethodDesire = s.gsMethodDesire;
        this.gsMethodType = s.gsMethodType;
        this.gsMethodName = s.gsMethodName;
        this.gsMethodAttach = s.gsMethodAttach;
        this.gsMethodArgs = s.gsMethodArgs;
        this.gsMethodBody = s.gsMethodBody;
    }
}
/**
 * Used for creating functions.
 * @class
 */
class GSClass {
    /**
     * The constructor for GhostScript variables.
     * @param {{ gsVarMods: GSModifier[], gsVarType: GSType, gsVarDesire: boolean, gsVarName: string, gsVarVal: Object }} s - The variable settings.
     */
    constructor(s) {
        this.gsClassType = s.gsClassType;
        this.gsClassName = s.gsClassName;
        this.gsClassBuilder = s.gsClassBuilder;
        this.gsClassData = {};
    }
}
/**
 * Used for creating functions.
 * @class
 */
class GSType {
    /**
     * The constructor for GhostScript variables.
     * @param {{ gsVarMods: GSModifier[], gsVarType: GSType, gsVarDesire: boolean, gsVarName: string, gsVarVal: Object }} s - The variable settings.
     */
    constructor(s) {
        this.gsTypeName = s.gsTypeName;
        this.gsTypeCheck = s.gsTypeCheck;
    }
}
/**
 * Used for creating functions.
 * @class
 */
class GSProp {
    /**
     * The constructor for GhostScript variables.
     * @param {{ gsVarMods: GSModifier[], gsVarType: GSType, gsVarDesire: boolean, gsVarName: string, gsVarVal: Object }} s - The variable settings.
     */
    constructor(s) {
        this.gsPropDesire = s.gsPropDesire
        this.gsPropAttach = s.gsPropAttach;
        this.gsPropName = s.gsPropName;
        this.gsPropGet = s.gsPropGet;
        this.gsPropSet = s.gsPropSet;
    }
}
/**
 * Used for creating functions.
 * @class
 */
class GSModifier {
    /**
     * The constructor for GhostScript variables.
     * @param {{ gsVarMods: GSModifier[], gsVarType: GSType, gsVarDesire: boolean, gsVarName: string, gsVarVal: Object }} s - The variable settings.
     */
    constructor(s) {
        this.gsModifierAttach = s.gsModifierAttach;
        this.gsModifierName = s.gsModifierName;
        this.gsModifierGet = s.gsModifierGet;
        this.gsModifierSet = s.gsModifierSet;
    }
}
/**
 * Used for creating functions.
 * @class
 */
class GSErr extends Error {
    /**
     * The constructor for GhostScript variables.
     * @param {{ gsVarMods: GSModifier[], gsVarType: GSType, gsVarDesire: boolean, gsVarName: string, gsVarVal: Object }} s - The variable settings.
     */
    constructor(nm, msg) {
        super(`${nm}: ${msg}`);
    }
}
/**
 * Used for creating functions.
 * @class
 */
class GSEvent extends CustomEvent {
    /**
     * The constructor for GhostScript variables.
     * @param {{ gsVarMods: GSModifier[], gsVarType: GSType, gsVarDesire: boolean, gsVarName: string, gsVarVal: Object }} s - The variable settings.
     */
    constructor(s) {
        super(s.name, {
            detail: s.detail,
            bubbles: s.bubbles,
            cancelable: s.cancelable
        });
    }
}
/**
 * Used for creating functions.
 * @class
 */
class GSGroup {
    /**
     * The constructor for GhostScript variables.
     * @param {{ gsVarMods: GSModifier[], gsVarType: GSType, gsVarDesire: boolean, gsVarName: string, gsVarVal: Object }} s - The variable settings.
     */
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
/**
 * Used for creating functions.
 * @class
 */
class GSOperator {
    /**
     * The constructor for GhostScript variables.
     * @param {{ gsVarMods: GSModifier[], gsVarType: GSType, gsVarDesire: boolean, gsVarName: string, gsVarVal: Object }} s - The variable settings.
     */
    constructor(s) {
        this.gsOperatorName = s.gsOperatorName;
        this.gsOperatorExpression = s.gsOperatorExpression;
        this.gsOperatorExec = s.gsOperatorExec;
        this.gsOperatorType = s.gsOperatorType;
        this.gsOperatorDesire = s.gsOperatorDesire;
    }
}
/**
 * Used for creating functions.
 * @class
 */
class GSDirective {
    /**
     * The constructor for GhostScript variables.
     * @param {{ gsVarMods: GSModifier[], gsVarType: GSType, gsVarDesire: boolean, gsVarName: string, gsVarVal: Object }} s - The variable settings.
     */
    constructor(s) {
        this.gsDirectiveName = s.gsDirectiveName;
        this.gsDirectiveExec = s.gsDirectiveExec;
    }
}
/**
 * Used for creating functions.
 * @class
 */
class GSArg {
    /**
     * The constructor for GhostScript variables.
     * @param {{ gsVarMods: GSModifier[], gsVarType: GSType, gsVarDesire: boolean, gsVarName: string, gsVarVal: Object }} s - The variable settings.
     */
    constructor(s) {
        this.gsArgName = s.gsArgName;
        this.gsArgVal = s.gsArgVal;
        this.gsArgDesire  = s.gsArgDesire;
        this.gsArgType = s.gsArgType;
    }
}
/**
 * Used for creating functions.
 * @class
 */
class GSManager {
    /**
     * The constructor for GhostScript variables.
     * @param {{ gsVarMods: GSModifier[], gsVarType: GSType, gsVarDesire: boolean, gsVarName: string, gsVarVal: Object }} s - The variable settings.
     */
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

module.exports = {
    GSVar, GSFunc, GSMethod, GSClass,
    GSType, GSProp, GSModifier, GSErr,
    GSEvent, GSGroup, GSOperator,
    GSDirective, GSArg, GSManager
};