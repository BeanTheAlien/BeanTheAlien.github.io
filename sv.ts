import { AdvancedNetMap } from "./net";
interface User {
    username: string;
    email: string;
    password: string;
    promotions: boolean;
}
interface Suc {
    success: boolean;
}
interface Msg {
    message: string;
}
interface SucMsg extends Suc, Msg {}
interface Routes {
    signup: [User, SucMsg];
    signin: [{ username: string, password: string }, SucMsg];
}
const net = new AdvancedNetMap<Routes>("https://beanthealien-server.onrender.com/");
export { net };