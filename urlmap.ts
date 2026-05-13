type OnElement = (element: HTMLElement, id: string) => string;
function map(ids: string[], onElement: OnElement) {
    ids.forEach(i => {
        const e = document.getElementById(i);
        if(e) e.addEventListener("click", () => window.location.href = onElement(e, i));
    });
}
function mapData(ids: string[], key: string, ifMissing: string | OnElement) {
    map(ids, (e, i) => e.dataset[key] ?? (typeof ifMissing == "string" ? ifMissing : ifMissing(e, i)));
}
export { map, mapData };