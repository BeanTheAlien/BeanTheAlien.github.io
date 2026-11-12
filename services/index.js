window.onunhandledrejection = (e) => alert(e.reason);

const svRow = document.getElementById("serv-sv");

const exec = async (url, row) => {
    const td = (t) => {
        const x = document.createElement("td");
        x.textContent = t;
        row.appendChild(x);
    }
    const t0 = performance.now();
    let resp;
    try {
        resp = await fetch(url);
    } catch(err) {
        console.error("Fetch failed:", err);
    }
    const t1 = performance.now();
    td(resp?.ok ? "Available" : "Unavailable");
    td(((t1 - t0) / 1000).toFixed(2) + "s");
};

exec("https://beanthealien-server.onrender.com/wakeup/", svRow);