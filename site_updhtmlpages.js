function next(c, u) {
    const ln = c.split("\n");
    const l = ln.findIndex(x => (/\<body\>/).test(x.trim()));
    const l1 = l + 1;
    ln.splice(l1, 0, ln[l1].slice(0, ln[l1].indexOf("<")) + u);
    console.log(ln.join("\n"))
    return ln.join("\n");
}
module.exports = { default: next };