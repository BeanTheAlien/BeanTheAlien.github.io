const fs = require("fs");
const path = require("path");
const [,, upd, ucmd, endings = "", ignore = "", ignoref = ""] = process.argv;
const clean = (x) => x ? x.split(",").map(e => e.trim()) : [];
const end = clean(endings);
const ign = clean(ignore);
const ign2 = clean(ignoref);
const site = fs.readdirSync("./", { encoding: "utf8", withFileTypes: true, recursive: true })
    .filter(f => {
        // 1. Only keep files
        if(!f.isFile()) return false;

        // 2. Normalize paths so they work on both Windows and Mac/Linux
        const normalizedPath = f.parentPath.replace(/\\/g, "/");
        const pathParts = normalizedPath.split("/");

        // 3. Global ignores (node_modules, .git)
        if(pathParts.includes("node_modules") || pathParts.includes(".git")) {
            return false;
        }

        // 4. Check user-defined ignored directories (checks if any parent folder matches)
        const isIgnoredDir = pathParts.some(part => ign.includes(part));
        if(isIgnoredDir) return false;
        console.log(ign2)
        if(ign2.some(x => f.name == x)) return false;

        // 5. Filter by file extensions (if extensions are provided)
        if(end.length > 0) {
            return end.some(e => path.extname(f.name) == e | f.name.endsWith(e));
        }

        return true;
    });
const updr = require(upd);
console.log(site);
site.forEach(f => {
    const fp = path.join(f.parentPath, f.name);
    const c = fs.readFileSync(fp, "utf8");
    console.log("Editing:", fp);
    fs.writeFileSync(fp, updr.default(c));
});