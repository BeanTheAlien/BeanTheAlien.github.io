function map(ids, onElement) {
    ids.forEach(i => {
        const e = document.getElementById(i);
        if (e)
            e.addEventListener("click", () => window.location.href = onElement(e, i));
    });
}
function mapData(ids, key, ifMissing) {
    map(ids, (e, i) => e.dataset[key] ?? (typeof ifMissing == "string" ? ifMissing : ifMissing(e, i)));
}
export { map, mapData };
