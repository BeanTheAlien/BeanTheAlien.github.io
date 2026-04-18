import { handle } from "../userform.js";
handle("signin");

// const sigin = document.getElementById("sigin");
// sigin.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;
//     await api.sendPost("signin", { username, password });
//     window.location.href = "../index.html";
// });