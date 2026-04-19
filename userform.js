import { api } from "./api.js";

function handle(id, isSignup = false) {
    const form = document.getElementById(id);
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const base = { username, password };
        const r = await api.sendPost(id, !isSignup ? base : { ...base, email: document.getElementById("email").value, promotions: document.getElementById("check").value });
        if(r.ok) window.location.href = "../index.html";
    });
}

export { handle };