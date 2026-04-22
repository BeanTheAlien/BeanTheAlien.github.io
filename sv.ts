import { AdvancedNetMap } from "./net";
interface Username {
    username: string;
}
interface Pass {
    password: string;
}
interface Creds extends Username, Pass {}
interface User extends Creds {
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
    verify: Result | Result & { unm?: string };
    verifytk: Result;
    wakeup: never;
    user: User | undefined;
    sendemail: [{ from: string, to: string, subject: string, html: string }, never];
    getpfp: string | undefined;
    setpfp: [FormData, Suc | SucMsg];
}
const net = new AdvancedNetMap<Routes>("https://beanthealien-server.onrender.com/");
export { net };