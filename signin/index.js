import { api } from "../api";

const sigin = document.getElementById("sigin");
sigin.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    api.sendPost("signin", { username, password });
    window.location.href = "../index.html";
});