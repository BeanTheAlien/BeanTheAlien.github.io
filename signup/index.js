import { api } from "../api";

const signup = document.getElementById("signup");
signup.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    api.sendPost("signup", { username, password });
    window.location.href = "../index.html";
});