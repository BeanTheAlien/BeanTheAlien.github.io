import { api } from "./api.js";

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
document.body.prepend(topbarContainer);
(async () => {
    if((await (await api.sendPost("verify")).json()).r) {
        const user = document.createElement("div");
        user.className = "drop";
        user.innerHTML = `
        <ul>
        <li class="dropdown">
            <a class="dropbtn d-a">Yo, ${localStorage.getItem("username")}</a>
            <div class="dropdown-content">
            <a class="d-a" href="/profile">Profile</a>
            </div>
        </li>
        </ul>`;
        add([user]);
    } else {
        const signin = mk("Sign In", "/signin");
        add([signin]);
    }
})();