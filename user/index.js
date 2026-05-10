const uuid = window.location.pathname.split("/")[2];
const res = await fetch(`/meta/${uuid}`);
const u = await res.json();
document.getElementById("u").textContent = u.username;