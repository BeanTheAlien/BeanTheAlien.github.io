const fs = require("fs");
const path = require("path");

const ghostmodule = {
    name: "io",
    desc: "The I/O module for GhostScript.",
    root: "ghost",
    reqroot: false,
    defroot: "io"
};

function writeFile(filepath, content) {
    fs.writeFile(path.join(__dirname, filepath), content);
}

function readFile(filepath) {
    return fs.readFile(path.join(__dirname, filepath));
}

function appendFile(filepath, content) {
    fs.appendFile(path.join(__dirname, filepath), content);
}

module.exports = { writeFile, readFile, appendFile };
