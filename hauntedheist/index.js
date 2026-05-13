["about", "link", "wiki"].forEach(i => {
    const e = document.getElementById(i);
    e.addEventListener("click", () => window.location.href = e.dataset.url ?? `/hauntedheist/${i}/`);
});