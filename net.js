/**
 * Source for requests through the Fetch API.
 *
 * Useful for reducing overhead boilerplate and streamlining requests.
 *
 * @example Using `Net` with a server.
 * ```
 * import { Net } from "./net.js";
 * // create a Net object with the base URL
 * // pointing to the BeanTheAlien Server
 * const net = new Net("https://beanthealien-server.onrender.com/");
 * // assuming we're logged in on BeanTheAlien.github.io
 * // printing "/getuser" should print the active user
 * // since "/getuser" returns a JSON object, we can use
 * // the json method to get a JSON object returned
 * const user = await net.json("getuser");
 * console.log(user);
 * ```
 */
class Net {
    /**
     * The base URL to use.
     *
     * @example Pointing the URL to different locations.
     * ```
     * import { Net } from "./net.js";
     * const net = new Net();
     * // point at BeanTheAlien Server
     * net.url = "https://beanthealien-server.onrender.com/";
     * // ...now point at Cool Math Games
     * net.url = "https://coolmathgames.com/";
     * // ...finally, point at BeanTheAlien
     * net.url = "https://beanthealien.github.io/";
     * ```
     */
    url;
    /**
     * The default headers to use.
     *
     * @example Setting default headers.
     * ```
     * import { Net } from "./net.js";
     * const net = new Net();
     * // use some default headers
     * net.headers = {
     *  "credentials": "include",
     *  "headers": {
     *      "Content-Type": "application/json"
     *  }
     * };
     * ```
     */
    headers;
    constructor(urlOrHeader, header) {
        this.url = "";
        this.headers = {
            "credentials": "include",
            "headers": {
                "Content-Type": "application/json"
            }
        };
        if (urlOrHeader) {
            if (typeof urlOrHeader == "string" || urlOrHeader instanceof URL) {
                this.url = urlOrHeader.toString();
            }
            else if (this.isRequestInit(urlOrHeader)) {
                this.headers = urlOrHeader;
            }
        }
        if (header) {
            if (this.isRequestInit(header)) {
                this.headers = header;
            }
        }
    }
    isRequestInit(h) {
        return "method" in h || "headers" in h || "body" in h || "credentials" in h;
    }
    isMethod(m) {
        return m == "get" || m == "post" || m == "GET" || m == "POST";
    }
    formURL(url) {
        return `${this.url}${url}`;
    }
    formHeaders(method, headers) {
        return {
            "method": method,
            ...this.headers,
            ...(headers ?? {})
        };
    }
    get(url, headers) {
        return fetch(this.formURL(url.toString()), this.formHeaders("GET", headers));
    }
    post(url, headers) {
        return fetch(this.formURL(url.toString()), this.formHeaders("POST", headers));
    }
    __prepare(arg1, arg2) {
        let method = "POST"; // Default method
        let options = {};
        // Sort out the arguments
        if (this.isMethod(arg1)) {
            method = arg1;
            if (arg2 && !this.isMethod(arg2))
                options = arg2;
        }
        else if (arg1) {
            options = arg1;
            if (this.isMethod(arg2))
                method = arg2;
        }
        return [method, options];
    }
    __send(url, arg1, arg2) {
        const [method, opts] = this.__prepare(arg1, arg2);
        return fetch(this.formURL(url.toString()), this.formHeaders(method.toString().toUpperCase(), opts));
    }
    async text(url, arg1, arg2) {
        return (await this.__send(url, arg1, arg2)).text();
    }
    async json(url, arg1, arg2) {
        return (await this.__send(url, arg1, arg2)).json();
    }
    async buf(url, arg1, arg2) {
        return (await this.__send(url, arg1, arg2)).arrayBuffer();
    }
    async formData(url, arg1, arg2) {
        return (await this.__send(url, arg1, arg2)).formData();
    }
    async blob(url, arg1, arg2) {
        return (await this.__send(url, arg1, arg2)).blob();
    }
    async bytes(url, arg1, arg2) {
        return (await this.__send(url, arg1, arg2)).bytes();
    }
}
/**
 * Created as part of the Net API for mapped-out routes.
 *
 * Useful for when you already have routes setup.
 *
 * @example Using `NetMap` with a server.
 * ```
 * import { NetMap } from "./net.js";
 * // define some routes (sourced from BeanTheAlien Server)
 * interface Routes {
 *  getuser: { u: object };
 * }
 * // net object with mappings
 * const net = new NetMap<Routes>("https://beanthealien-server.onrender.com/");
 * // we can now see <"getuser", { u: object }> show up
 * // (promises a result of { u: object } as well)
 * const user = await net.json("getuser");
 * // user is an object
 * console.log(user);
 * ```
 */
class NetMap extends Net {
    constructor(urlOrHeaders, headers) {
        super(urlOrHeaders, headers);
    }
    get(url, headers) {
        return fetch(this.formURL(url.toString()), this.formHeaders("GET", headers));
    }
    post(url, headers) {
        return fetch(this.formURL(url.toString()), this.formHeaders("POST", headers));
    }
    async text(url, arg1, arg2) {
        return super.text(url, arg1, arg2);
    }
    async json(url, arg1, arg2) {
        return super.json(url, arg1, arg2);
    }
    async buf(url, arg1, arg2) {
        return super.buf(url, arg1, arg2);
    }
    async formData(url, arg1, arg2) {
        return super.formData(url, arg1, arg2);
    }
    async blob(url, arg1, arg2) {
        return super.blob(url, arg1, arg2);
    }
    async bytes(url, arg1, arg2) {
        return super.bytes(url, arg1, arg2);
    }
}
/**
 * Created as part of the Net API for mapped-out routes which may or may not contain a required body.
 *
 * Interfaces used with `AdvancedNetMap` should be `AnyMap` | [any, `RequestInit` | `AnyMap`]
 *
 * In a tuple, element 0 is the required body, element 1 is the return type.
 *
 * @example Using `AdvancedNetMap` with a server.
 * ```
 * import { AdvancedNetMap } from "./net.js";
 * // define some routes (sourced from BeanTheAlien Server)
 * interface Routes {
 *  signup: [{ username: string, email: string, password: string }, { success: boolean, message?: string }];
 * }
 * // net object with mappings
 * const net = new AdvancedNetMap<Routes>("https://beanthealien-server.onrender.com/");
 * // throws an error (property 'username' of type 'number' cannot be assigned to type 'string')
 * const out = net.json("signup", { username: 42, email: "hi", password: "123" });
 * // if username were a string, then we can print the output
 * console.log(out.success); // sample output: true
 * ```
 */
class AdvancedNetMap extends NetMap {
    async json(url, arg1, arg2) {
        // detect "modern" usage
        if (arg1 && typeof arg1 == "object" && !("method" in arg1) && !("headers" in arg1) && !("body" in arg1)) {
            // this is your tuple/body case fallback if needed
            return super.json(url, "POST", { body: arg1 });
        }
        // detect options object
        if (arg1 && typeof arg1 == "object" && ("body" in arg1 || "headers" in arg1 || "method" in arg1)) {
            const options = arg1;
            const req = {
                ...(options.headers || {}),
                ...(options.body ? { body: JSON.stringify(options.body) } : {})
            };
            return super.json(url, req, options.method);
        }
        // fallback: behave exactly like base class
        return super.json(url, arg1, arg2);
    }
}
export { Net, NetMap, AdvancedNetMap };
