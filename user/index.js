const uuid = (new URLSearchParams(window.location.search)).get("uuid");
const res = await fetch(`https://beanthealien-server.onrender.com/meta/${uuid}`);
const u = await res.json();
document.getElementById("u").textContent = u.username;