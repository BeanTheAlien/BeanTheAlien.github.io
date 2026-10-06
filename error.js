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
    left: "50%",
    transform: "translateX(-50%)",
    alignItems: "center",
    width: "min(600px, calc(100vw - 20px))",
    zIndex: "9999"
});
document.body.appendChild(div);
window.addEventListener("error", (e) => {
    const d = document.createElement("div");
    Object.assign(d.style, {
        backgroundColor: "#830000",
        border: "5px solid #570000",
        padding: "12px",
        boxSizing: "border-box",
        width: "100%",
        overflowWrap: "anywhere",
        pointerEvents: "auto",
        cursor: "pointer"
    });
    d.textContent = `${e.message}\n\n(at ln ${e.lineno}, col ${e.colno} in ${e.filename})\n\n${e.error.stack}`;
    d.style.whiteSpace = "pre-wrap";
    div.appendChild(d);
    const rms = () => d.remove();
    let t = setTimeout(rms, 10000);
    d.addEventListener("click", () => {
        if(t) {
            clearTimeout(t);
            t = null;
            d.style.backgroundColor = "#812500"
        } else {
            rms();
        }
    });
});