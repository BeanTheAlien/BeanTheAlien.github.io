import { net } from "../../sv.js";

const uuid = document.getElementById("uuid");
const u = await net.json("user");
uuid.textContent = u?.u.steam_id ?? "no linked account";
const link = document.getElementById("link");
link.addEventListener("click", () => {
    const modal = document.createElement("dialog");
    modal.showModal();
    modal.innerHTML = `<h1>Link Account</h1>
    <p>You are linking a Steam account.</p>
    <p>not implemented yet :(</p>
    <button id="done">Done</button>`;
    document.getElementById("done").addEventListener("click", () => {
        modal.innerHTML = "";
        modal.close();
    });
});

// steam linking goes here