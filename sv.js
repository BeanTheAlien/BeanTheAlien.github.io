import { AdvancedNetMap } from "./net.js";
const url = "https://beanthealien-server.onrender.com/";
const net = new AdvancedNetMap(url);
const adminNet = new AdvancedNetMap(url + "admin/");
const comNet = new AdvancedNetMap(url + "com/");
const annNet = new AdvancedNetMap(url + "anns/");
export { net, adminNet, comNet };
