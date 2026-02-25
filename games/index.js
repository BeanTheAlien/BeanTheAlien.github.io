const gamelist = document.createElement("div");
Object.assign(gamelist.style, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
    margin: "auto",
    gap: "20px"
});

const games = [["Flappy Bird", "bird"], ["Dungeon", "dng"], ["Pong", "pong"], ["Snake", "snake"], ["RPG", "rpg"]];
games.forEach(g => {
    const b = document.createElement("button");
    b.textContent = g[0];
    b.addEventListener("click", () => window.location.href = g[1]);
    gamelist.appendChild(b);
});
document.body.appendChild(gamelist);