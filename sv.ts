import { AdvancedNetMap } from "./net";
interface Username {
    username: string;
}
interface Pass {
    password: string;
}
interface Creds extends Username, Pass {}
interface Role {
    role: "user" | "admin";
}
interface User extends Creds, Role {
    email: string;
    promotions: boolean;
}
interface Suc {
    success: boolean;
}
interface Msg {
    message: string;
}
interface SucMsg extends Suc, Msg {}
interface Result {
    r: boolean;
}
interface Routes {
    signup: [User, SucMsg];
    signin: [Creds, SucMsg];
    verify: Result | (Result & { unm?: string });
    verifytk: Result;
    wakeup: never;
    user: { u: User } | undefined;
    sendemail: [{ from: string, to: string, subject: string, html: string }, Suc | SucMsg];
    getpfp: { pfp: string } | undefined;
    setpfp: [FormData, Suc | SucMsg];
    cookies: { c: string };
}
interface AdminRoutes {
    changerole: [Role & Username, Suc | SucMsg];
    delete: [Username, Suc | SucMsg];
    users: { u: User[] };
}
const url = "https://beanthealien-server.onrender.com/";
const net = new AdvancedNetMap<Routes>(url);
const adminNet = new AdvancedNetMap<AdminRoutes>(url + "admin/");
export { net, adminNet };