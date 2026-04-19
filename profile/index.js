import { api } from "../api.js";

const user = await api.sendPost("user");
const username = document.getElementById("username");
const pfp = document.getElementById("pfp");
username.innerText = (await user.json()).u?.username;
const pfpHex = (await (await api.sendPost("getpfp")).json()).pfp;
if(pfpHex) { const hex = Uint8Array.fromHex(pfpHex); if(hex) pfp.src = (new TextDecoder()).decode(hex); }