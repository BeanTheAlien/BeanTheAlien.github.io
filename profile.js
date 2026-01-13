async function getCookie(k) {
    return await cookieStore.get(k)?.value;
}
async function setCookie(k, v) {
    await cookieStore.set(k, v);
}
function sessionGet(k) {
    return sessionStorage.getItem(k);
}
function sessionSet(k, v) {
    sessionStorage.setItem(k, v);
}

if(!sessionGet("in")) window.location.href = "index.html";