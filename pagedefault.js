import { net } from "./sv.js";

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
const buttonHome = mk("Home", "/");
const buttonGames = mk("Games", "/games/");
const buttonProjects = mk("Projects", "/projects/");
const buttonResources = mk("Resources", "/resources.html");
add([buttonHome, buttonGames, buttonProjects, buttonResources]);
document.body.prepend(topbarContainer);
(async () => {
    if((await net.json("verify")).r) {
        const user = document.createElement("div");
        user.className = "drop";
        const u = (await net.json("user")).u;
        const username = u.username;
        const pfp = (await net.json("getpfp"))?.pfp.pfp ?? "/missingcontent.png";
        const isAdmin = u.role == "admin";
        user.innerHTML = `
            <ul>
                <li class="dropdown">
                    <a class="dropbtn d-a">Yo, ${username}</a>
                    <div class="dropdown-content">
                    <a class="d-a" href="/profile">Profile</a>
                    ${isAdmin ? `
                        <br><a class="d-a" href="/admin/usermanager">User Manager</a>
                    ` : ""}
                    </div>
                </li>
            </ul>
            <img src="${pfp}">`;
        add([user]);
    } else {
        const signin = mk("Sign In", "/signin");
        add([signin]);
    }
})();