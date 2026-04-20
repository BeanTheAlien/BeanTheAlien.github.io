import { getUser } from "../../api.js";
async function admin() {
    if(getUser().role != "admin") window.location.href = "/";
}
export { admin };