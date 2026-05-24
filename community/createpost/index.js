import { comNet } from "../../sv.js";

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    comNet.json("post", {
        title: document.getElementById("title").value,
        body: document.getElementById("body").value
    });
});