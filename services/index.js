const svAvb = document.getElementById("serv-sv-a");
const svTm = document.getElementById("serv-sv-t");
const exec = async (url, avb, tm) => {
    const t0 = performance.now();
    const resp = await fetch(url);
    const t1 = performance.now();
    avb.innerHTML = resp.ok ? "Available" : "Unavailable";
    tm.innerHTML = (t1 - t0) + "s";
};
exec("https://beanthealien-server.onrender.com/wakeup/", svAvb, svTm);