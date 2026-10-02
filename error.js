const div = document.createElement("div");
Object.assign(div.style, {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    fontSize: "12px",
    color: "white",
    position: "fixed",
    top: "10px",
    pointerEvents: "none",
    left: "50vw"
});
document.body.appendChild(div);
window.addEventListener("error", (e) => {
    const d = document.createElement("div");
    Object.assign(d.style, {
        backgroundColor: "#830000",
        border: "5px solid #570000",
        padding: "12px"
    });
    d.innerHTML = `${e.message}<br><br>(at ln ${e.lineno}, col ${e.colno})`;
    div.appendChild(d);
    const rms = () => div.removeChild(d);
    setTimeout(rms, 5000);
});