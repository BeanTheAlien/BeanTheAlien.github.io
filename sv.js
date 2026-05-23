import { AdvancedNetMap } from "./net.js";
const url = "https://beanthealien-server.onrender.com/";
const net = new AdvancedNetMap(url);
const adminNet = new AdvancedNetMap(url + "admin/");
const comNet = new AdvancedNetMap(url + "com/");
export { net, adminNet, comNet };
