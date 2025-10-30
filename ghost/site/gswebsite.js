[
    ["About", `GhostScript is a free, open-source programming language designed to simplify your scripting experience and handle the hard parts for you.<br>Ghost offers an expansive preprocessor system to deal with dependencies before the script is executed.<br>Ghost also includes the Autodebugger API, Context Awareness API and Ghost Assistant API.<br>The Autodebugger API is AI-powered to analyze your script to solve errors and include documentation.<br>The Context Awareness API tries to figure out "what you meant".<br>The Ghost Assistant API is able to help you with development within Ghost - be it learning, scripting or anything else you might need.`],
    ["Why GhostScript", `GhostScript is built to make programming easier, not stricter. If you want something added at the core level, you can add it.<br>Where other languages punish mistakes or limit creativity, Ghost gives you total control.<br>Use the same name for a variable, function and method? Fine. Add spaces or symbols for readability? Go ahead. Want to <i><strong>create your own operator?</strong></i> Please do.<br>Ghost is alive and evolving - its creator, <a href="https://github.com/BeanTheAlien/">@BeanTheAlien</a>, keeps pushing updates that expand what a scripting language can do.<br>Got a project? Try GhostScript and see how much simpler coding can feel.`],
    ["Downloads", `<h3>Stable</h3>ghostscript@0.0.7 - <a href="https://github.com/BeanTheAlien/GhostScript/releases/tag/v0.0.7">download</a><br>ghostscript@0.0.6 - <a href="https://github.com/BeanTheAlien/GhostScript/releases/tag/v0.0.6">download</a>`],
    ["Install", `npm install @beanthealien/ghostscript`],
    ["Usage", `<h2>Running A Script</h2><strong>VS Code</strong><br>Navigate to your script.<br>Click <kbd>Run > Run and Debug</kbd> (select GhostScript as your running option if prompted).<br><strong>GhostScript IDE</strong><br>Navigate to your script.<br>Click <kbd>Run</kbd> or the green arrow.`]
].forEach(e => {
    const h2 = document.createElement("h2");
    const p = document.createElement("p");
    const div = document.createElement("div");
    h2.innerHTML = e[0];
    p.innerHTML = e[1];
    div.className = "space";
    document.body.appendChild(h2);
    document.body.appendChild(p);
    document.body.appendChild(div);
});