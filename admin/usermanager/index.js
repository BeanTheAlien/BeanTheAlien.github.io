import { adminNet } from "../../sv.js";
import { admin } from "../admin.js";

await admin();
const users = await adminNet.json("users", { method: "GET" });
const userEl = document.getElementById("users");
userEl.style.display = "flex";
userEl.style.flexDirection = "column";
userEl.style.gap = "10px";
userEl.innerHTML = users.u.map((_, i) => {
    return `<div class="u-disp">
        <h3 id="u-${i}">${_.username}</h3>
        <p>${_.email}</p>
        <p>${_.role}</p>
        <button id="del-${i}">Delete</button>
    </div>`
}).join("");
for(let i = 0; i < users.u.length; i++) {
    document.getElementById(`del-${i}`).addEventListener("click", (e) => {
        adminNet.json("delete", { username: document.getElementById(`u-${i}`).textContent });
    });
}