import { api } from "../api.js";
import { net } from "../sv.js";

const username = document.getElementById("username");
const pfp = document.getElementById("pfp");
const role = document.getElementById("role");
const user = (await net.json("user")).u;
username.innerText = user?.username;
role.innerText = user?.role;
await updPfp();
pfp.addEventListener("click", async () => {
    const [handle] = await window.showOpenFilePicker({
        excludeAcceptAllOption: true,
        types: [{ accept: { "image/*": [".avif", ".jpg", ".jpeg", ".jfif", ".pjpeg", ".pjp", ".png", ".svg", ".webp"] } }]
    });
    const file = await handle.getFile();
    const max = 1024 * 1024;
    if(file.size > max) return alert(`File size exceeds limit of 1 MB! (size: ${file.size}, over: ${file.size - max})`);
    const compress = async () => {
        const url = URL.createObjectURL(file);
        const img = document.createElement("img");
        img.src = url;
        await img.decode();
        const canvas = document.createElement("canvas");
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, size, size);
        return await new Promise((r) => {
            canvas.toBlob(r, "image/webp", 0.7);
        });
    }
    const form = new FormData();
    form.append("file", file);
    await fetch("https://beanthealien-server.onrender.com/setpfp", { method: "POST", credentials: "include", body: form });
    await updPfp();
});
async function updPfp() {
    const p = ((await (await api.sendPost("getpfp")).json())).pfp?.pfp;
    if(p?.length) pfp.src = p;
}
// document.getElementById("del").addEventListener("click", (e) => {
//     //
// });