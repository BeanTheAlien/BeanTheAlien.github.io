import { net } from "../sv.js";
async function admin() {
    if((await net.json("user"))?.u.role != "admin") window.location.href = "/";
}
export { admin };