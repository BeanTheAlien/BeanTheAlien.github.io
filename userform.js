import { api } from "./api";

function handle(id, path) {
    import { api } from "../api";
    const form = document.getElementById(id);
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        await api.sendPost(path, { username, password });
        window.location.href = "../index.html";
    });
}