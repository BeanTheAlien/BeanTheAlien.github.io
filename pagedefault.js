const mk = (text, link) => {
    const btn = document.createElement("button");
    btn.className = "cbtn";
    btn.textContent = text;
    btn.addEventListener("click", () => window.location.href = link);
    return btn;
}
const add = (els) => {
    for(const el of els) {
        topbarContainer.appendChild(el);
    }
}

const topbarContainer = document.createElement("div");
topbarContainer.className = "container";
const buttonHome = mk("Home", "../../");
const buttonGames = mk("Games", "../../games/");
const buttonProjects = mk("Projects", "projects.html");
const buttonResources = mk("Resources", "resources.html");
add([buttonHome, buttonGames, buttonProjects, buttonResources]);
document.body.appendChild(topbarContainer);