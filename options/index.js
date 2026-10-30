import { Local } from "../phantom2d.js";
const od = document.getElementById("option");
/**
 * @type {[string, (val: string) => string, () => void][]}
 */
const optsSrc = [["error-ignore", (v) => {
    return `<div>
        <strong>Ignored Errors</strong>
        <div>${(v ?? ["NONE"]).join("<div class='space'></div>")}</div>
        <div class="space"></div>
        <button id="add-err">Add Error</button>
        <button id="rm-err">Remove Error</button>
    </div>`;
}, () => {
    const ae = document.getElementById("add-err");
    const re = document.getElementById("rm-err");
    /**
     * @type {HTMLDialogElement | null}
     */
    let m = null;
    const prm = (name, init, then) => {
        if(!m) {
            m = document.createElement("dialog");
            document.body.appendChild(m);
            m.style.width = "90%";
            m.style.height = "90%";
            m.innerHTML = `<h3>${name} Error</h3><div class="space"></div>${init}<button id="close">Done</button>`;
            then();
            m.showModal();
            document.getElementById("close").addEventListener("click", () => {
                // cleanup and call refresh
                // since it should display new info
                document.body.removeChild(m);
                refresh();
            });
        }
    }
    ae.addEventListener("click", () => {
        prm("Add", `<!-- DROP HERE -->`, () => {});
    });
    re.addEventListener("click", () => {
        prm("Remove", `<!-- DROP HERE -->`, () => {});
    });
}]];
function refresh() {
    od.innerHTML = optsSrc.map(x => x[1](Local.get(x[0]))).join("<div class='space'></div>");
    optsSrc.forEach(x => x[2]());
}
refresh();