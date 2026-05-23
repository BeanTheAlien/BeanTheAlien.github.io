import { comNet } from "../../sv.js";

const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    comNet.json("post", {
        title: data.get("title").valueOf(),
        body: data.get("body").valueOf()
    });
});