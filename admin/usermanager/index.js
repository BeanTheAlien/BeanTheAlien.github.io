import { adminNet } from "../../sv.js";
import { admin } from "../admin.js";

await admin();
const users = await adminNet.json("users");
const userEl = document.getElementById("users");
userEl.style.display = "flex";
userEl.style.flexDirection = "column";
userEl.style.gap = "10px";
console.log(users.u);
userEl.innerHTML = users.u.map(_ => {
    return `<div>
        <h3>${_.username}</h3>
        <p>${_.email}</p>
        <p>${_.role}</p>
    </div>`
}).join("");