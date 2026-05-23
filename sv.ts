import { AdvancedNetMap } from "./net.js";
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
    steam_id: string | null;
    uuid: string;
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
interface Title {
    title: string;
}
interface Body {
    body: string;
}
interface PostMeta extends Title, Body {}
interface Post extends PostMeta {
    author: string;
    pinned: boolean;
}
type SSM = Suc | SucMsg;
interface Routes {
    signup: [User, SucMsg];
    signin: [Creds, SucMsg];
    verify: Result | (Result & { unm?: string });
    verifytk: Result;
    wakeup: never;
    user: { u: User } | undefined;
    sendemail: [{ from: string, to: string, subject: string, html: string }, SSM];
    getpfp: { pfp: string } | undefined;
    setpfp: [FormData, SSM];
    cookies: { c: string };
}
interface AdminRoutes {
    changerole: [Role & Username, SSM];
    delete: [Username, SSM];
    users: { u: User[] };
}
interface CommunityRoutes {
    post: [PostMeta, SSM];
    getposts: (Suc & { data: Post[] }) | SucMsg;
    pin: [Title, SSM];
    unpin: [Title, SSM];
}
const url = "https://beanthealien-server.onrender.com/";
const net = new AdvancedNetMap<Routes>(url);
const adminNet = new AdvancedNetMap<AdminRoutes>(url + "admin/");
const comNet = new AdvancedNetMap<CommunityRoutes>(url + "com/");
export { net, adminNet, comNet };