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

module.exports = {
    GSVar, GSFunc, GSMethod, GSClass,
    GSType, GSProp, GSModifier, GSErr,
    GSEvent, GSGroup, GSOperator,
    GSDirective, GSArg, GSManager
};