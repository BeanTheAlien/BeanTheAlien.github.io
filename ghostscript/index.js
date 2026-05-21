const about = document.getElementById("sec_about");
about.innerHTML = [
    "GhostScript is the language of the future.",
    "GhostScript is built to make programming easier, not stricter. If you want something added at the <i>core level<i>, you can add it.",
    "Where other languages punish mistakes or limit creativity, GhostScript gives you total control.",
    "Use the same name for a variable, function and method? Fine.",
    "Add spaces or symbols for readability? Go ahead.",
    "Want to <strong><i>create your own operator?</i></strong> Please do.",
    `GhostScript is alive and evolving - its creator, <a href="https://github.com/BeanTheAlien/" target="_blank">@BeanTheAlien</a>, keeps pushing updates that expand what a scripting language can do.`,
    "Got a project? Try GhostScript and see how much simpler coding can feel."
].map(e => `<p>${e}</p>`).join("");