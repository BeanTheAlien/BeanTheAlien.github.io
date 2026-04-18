import { api } from "./api.js";

function handle(id) {
    const form = document.getElementById(id);
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        await api.sendPost(id, { username, password });
        localStorage.setItem("username", username);
        //window.location.href = "../index.html";
    });
}

export { handle };