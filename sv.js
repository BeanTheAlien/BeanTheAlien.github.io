import { AdvancedNetMap } from "./net.js";
const url = "https://beanthealien-server.onrender.com/";
const net = new AdvancedNetMap(url);
const adminNet = new AdvancedNetMap(url + "admin/");
export { net, adminNet };
