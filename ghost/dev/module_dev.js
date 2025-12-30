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
     * @param {{ gsFuncDesire: boolean, gsFuncType: GSType, gsFuncName: string, gsFuncArgs: GSArg[], gsFuncBody: function }} s - The function settings.
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
     * @param {{ gsMethodDesire: boolean, gsMethodType: GSType, gsMethodName: string, gsMethodAttach: GSType|GSType[], gsMethodArgs: GSArg[], gsMethodBody: function }} s - The method settings.
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
 * Used for creating classes.
 * @class
 */
class GSClass {
    /**
     * The constructor for GhostScript classes.
     * @param {{ gsClassType: string, gsClassName: string, gsClassBuilder: function }} s - The class settings.
     */
    constructor(s) {
        this.gsClassType = s.gsClassType;
        this.gsClassName = s.gsClassName;
        this.gsClassBuilder = s.gsClassBuilder;
        this.gsClassData = {};
    }
}
/**
 * Used for creating types.
 * @class
 */
class GSType {
    /**
     * The constructor for GhostScript types.
     * @param {{ gsTypeName: string, gsTypeCheck: function }} s - The type settings.
     */
    constructor(s) {
        this.gsTypeName = s.gsTypeName;
        this.gsTypeCheck = s.gsTypeCheck;
    }
}
/**
 * Used for creating properties.
 * @class
 */
class GSProp {
    /**
     * The constructor for GhostScript properties.
     * @param {{ gsPropDesire: boolean, gsPropAttach: GSType|GSType[], gsPropName: string, gsPropGet: function, gsPropSet: function }} s - The property settings.
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
 * Used for creating modifier.
 * @class
 */
class GSModifier {
    /**
     * The constructor for GhostScript modifier.
     * @param {{ gsModifierAttach: GSType|GSType[], gsModifierName: string, gsModifierGet: function, gsModifierSet: function }} s - The modifier settings.
     */
    constructor(s) {
        this.gsModifierAttach = s.gsModifierAttach;
        this.gsModifierName = s.gsModifierName;
        this.gsModifierGet = s.gsModifierGet;
        this.gsModifierSet = s.gsModifierSet;
    }
}
/**
 * Used for creating errors.
 * @class
 */
class GSErr {
    /**
     * The constructor for GhostScript errors.
     * @param {string} nm - The error name.
     * @param {string} msg - The error message.
     */
    constructor(nm, msg) {
        this.gsErrName = nm;
        this.gsErrMsg = msg;
    }
    /**
     * Formats the token with line and column.
     * @param {Object} t - A GhostScript token.
     * @returns {String} The formatted version with line and column.
     */
    static tkFmt(t) {
        return `(ln ${t.ln}, col ${t.col})`;
    }
}
/**
 * Used for creating events.
 * @class
 */
class GSEvent extends CustomEvent {
    /**
     * The constructor for GhostScript event.
     * @param {{ detail: Object, bubbles: boolean, cancelable: boolean }} s - The event settings.
     */
    constructor(s) {
        super(s.name, {
            detail: s.detail,
            bubbles: s.bubbles,
            cancelable: s.cancelable
        });
    }
    /**
     * Dispatches the event.
     */
    dispatch() {
        window.dispatchEvent(this);
    }
}
/**
 * Used for creating group.
 * @class
 */
class GSGroup {
    /**
     * The constructor for GhostScript groups.
     * @param {{ gsGroupName: string, gsGroupType: GSType, gsGroupLimit: number }} s - The group settings.
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
 * Used for creating operators.
 * @class
 */
class GSOperator {
    /**
     * The constructor for GhostScript operators.
     * @param {{ gsOperatorName: string, gsOperatorExpression: string[], gsOperatorExec: function, gsOperatorType: GSType, gsOperatorDesire: boolean }} s - The operator settings.
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
 * Used for creating directives.
 * @class
 */
class GSDirective {
    /**
     * The constructor for GhostScript directives.
     * @param {{ gsDirectiveName: string, gsDirectiveExec: function }} s - The directive settings.
     */
    constructor(s) {
        this.gsDirectiveName = s.gsDirectiveName;
        this.gsDirectiveExec = s.gsDirectiveExec;
    }
}
/**
 * Used for creating arguments.
 * @class
 */
class GSArg {
    /**
     * The constructor for GhostScript arguments.
     * @param {{ gsArgName: string, gsArgVal: Object, gsArgDesire: boolean, gsArgType: GSType }} s - The argument settings.
     */
    constructor(s) {
        this.gsArgName = s.gsArgName;
        this.gsArgVal = s.gsArgVal;
        this.gsArgDesire  = s.gsArgDesire;
        this.gsArgType = s.gsArgType;
    }
}
/**
 * Used for creating managers.
 * @class
 */
class GSManager {
    /**
     * The constructor for GhostScript managers.
     * @param {{ gsManagerName: string, gsManagerVals: Object }} s - The manager settings.
     */
    constructor(s) {
        this.gsManagerName = s.gsManagerName;
        this.gsManagerVals = s.gsManagerVals;
    }
    /**
     * Gets an entry.
     * @param {string} name - The entry name.
     * @returns {Object|undefined} The entry value.
     */
    get(name) {
        return this.gsManagerVals[name];
    }
    /**
     * Sets an entry.
     * @param {string} name - The entry name.
     * @param {Object} val - The entry value.
     */
    set(name, val) {
        this.gsManagerVals[name] = val;
    }
    /**
     * Deletes an entry.
     * @param {string} name - The entry name.
     */
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