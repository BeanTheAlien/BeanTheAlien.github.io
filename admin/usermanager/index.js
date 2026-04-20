import { api } from "../../api.js";
import { admin } from "../admin.js";

await admin();
const users = await api.sendPost("admin/users");
const userEl = document.getElementById("users");
userEl.style.display = "flex";
userEl.style.flexDirection = "column";
userEl.style.gap = "10px";
userEl.innerHTML = users.u.map(_ => {
    return `<div>
        <h3>${_.username}</h3>
        <p>${_.email}</p>
        <p>${_.role}</p>
    </div>`
}).join("");