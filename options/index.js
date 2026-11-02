import { Local } from "../phantom2d.js";
const od = document.getElementById("option");
const errorTypes = [
    { value: "err-fetch-failed", label: "Fetch Failed Errors", group: "Net Errors" },
    { value: "err-proc-ex", label: "Process Already Exists Error", group: "PhantomJS" }
];
const getIgnoredErrors = (value = Local.get("error-ignore")) => {
    const parsed = typeof value == "string" ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
};
/**
 * @type {[string, (val: string) => string, () => void][]}
 */
const optsSrc = [["error-ignore", (v) => {
    const ignoredErrors = getIgnoredErrors(v);
    return `<div>
        <strong>Ignored Errors</strong>
        <div>${(ignoredErrors.length ? ignoredErrors : ["NONE"]).join("<div class='space'></div>")}</div>
        <div class="space"></div>
        <button id="add-err">Add Error</button>
        <button id="rm-err">Remove Error</button>
    </div>`;
}, () => {
    const ae = document.getElementById("add-err");
    const re = document.getElementById("rm-err");
    const showErrorDialog = (action) => {
        const ignoredErrors = getIgnoredErrors();
        const availableErrors = action == "add"
            ? errorTypes.filter(error => !ignoredErrors.includes(error.value))
            : errorTypes.filter(error => ignoredErrors.includes(error.value));
        const groups = [...new Set(availableErrors.map(error => error.group))];
        const options = groups.map(group => `<optgroup label="${group}">${availableErrors
            .filter(error => error.group == group)
            .map(error => `<option value="${error.value}">${error.label}</option>`)
            .join("")}</optgroup>`).join("");
        const dialog = document.createElement("dialog");
        dialog.style.width = "90%";
        dialog.style.height = "90%";
        dialog.innerHTML = `<h3>${action == "add" ? "Add" : "Remove"} Error</h3>
            <div class="space"></div>
            ${availableErrors.length ? `<select>${options}</select>` : "<p>No errors available.</p>"}
            <button type="button" class="apply" ${availableErrors.length ? "" : "disabled"}>${action == "add" ? "Add" : "Remove"}</button>
            <button type="button" class="close">Done</button>`;
        document.body.appendChild(dialog);
        const select = dialog.querySelector("select");
        dialog.querySelector(".apply").addEventListener("click", () => {
            const selectedError = select.value;
            const currentErrors = getIgnoredErrors();
            const nextErrors = action == "add"
                ? [...new Set([...currentErrors, selectedError])]
                : currentErrors.filter(error => error != selectedError);
            Local.set("error-ignore", nextErrors);
            dialog.close();
        });
        dialog.querySelector(".close").addEventListener("click", () => dialog.close());
        dialog.addEventListener("close", () => {
            dialog.remove();
            refresh();
        }, { once: true });
        dialog.showModal();
    };
    ae.addEventListener("click", () => showErrorDialog("add"));
    re.addEventListener("click", () => showErrorDialog("remove"));
}]];
function refresh() {
    od.innerHTML = optsSrc.map(x => x[1](Local.get(x[0]))).join("<div class='space'></div>");
    optsSrc.forEach(x => x[2]());
}
refresh();