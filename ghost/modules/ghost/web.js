const fs = require("fs");
const cp = require("child_process");
const { GSVar, GSFunc, GSMethod, GSClass, GSType, GSProp, GSModifier, GSErr, GSEvent, GSGroup, GSOperator, GSDirective, GSArg, GSManager } = module_dev;

const ghostmodule = {
    name: "web",
    desc: "The Web module for GhostScript.",
    version: "1.0.0",
    author: "GhostScript",
    root: "ghost",
    reqroot: true,
    defroot: "web"
};

class WebDoc {
    constructor(content = []) {
        if(!Array.isArray(content)) throw new Error("Content must be an array!");
        this.content = content;
    }
    add(...stuff) {
        this.content.push(...stuff);
    }
    rem(...stuff) {
        for(let i = this.content.length - 1; i >= 0; i--) {
            if(stuff.includes(this.content[i])) {
                this.content.splice(i, 1);
            }
        }
    }
    set(c) {
        this.content = c;
    }
    get() {
        return this.content;
    }
    save() {
        fs.writeFile("temp.html", this.content.join(""));
    }
    launchWin() {
        cp.exec(`start "" "${__dirname}/temp.html"`);
    }
    launchMac() {
        cp.exec(`open "${__dirname}/temp.html"`);
    }
    launchLinux() {
        cp.exec(`xdg-open "${__dirname}/temp.html"`);
    }
}

exports = {
    WebDoc,
    ghostmodule
};