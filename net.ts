type AnyMap = { [x: string]: any };
type FormalMethod = "GET" | "POST"
type InformalMethod = "get" | "post" | FormalMethod;

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
    url: string;
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
    headers: RequestInit;
    /**
     * Creates a net object.
     * @default url ""
     * @default headers { "credentials": "include", "headers": { "Content-Type": "application/json" } }
     */
    constructor();
    /**
     * Creates a net object with a URL.
     * @param baseURL The URL to use.
     * @default headers { "credentials": "include", "headers": { "Content-Type": "application/json" } }
     */
    constructor(baseURL: string);
    /**
     * Creates a net object with a URL.
     * @param baseURL The URL to use.
     * @default headers { "credentials": "include", "headers": { "Content-Type": "application/json" } }
     */
    constructor(baseURL: URL);
    /**
     * Creates a net object with headers.
     * @param defaultHeaders The headers to use.
     * @default url ""
     */
    constructor(defaultHeaders: RequestInit);
    /**
     * Creates a net object with headers.
     * @param defaultHeaders The headers to use.
     * @default url ""
     */
    constructor(defaultHeaders: AnyMap);
    /**
     * Creates a net object with a URL and headers.
     * @param baseURL The URL to use.
     * @param defaultHeaders The headers to use.
     */
    constructor(baseURL: string, defaultHeaders: RequestInit);
    /**
     * Creates a net object with a URL and headers.
     * @param baseURL The URL to use.
     * @param defaultHeaders The headers to use.
     */
    constructor(baseURL: URL, defaultHeaders: RequestInit);
    /**
     * Creates a net object with a URL and headers.
     * @param baseURL The URL to use.
     * @param defaultHeaders The headers to use.
     */
    constructor(baseURL: string, defaultHeaders: AnyMap);
    /**
     * Creates a net object with a URL and headers.
     * @param baseURL The URL to use.
     * @param defaultHeaders The headers to use.
     */
    constructor(baseURL: URL, defaultHeaders: AnyMap);
    constructor(urlOrHeader?: string | URL | RequestInit | AnyMap, header?: RequestInit | AnyMap) {
        this.url = "";
        this.headers = {
            "credentials": "include",
            "headers": {
                "Content-Type": "application/json"
            }
        };
        if(urlOrHeader) {
            if(typeof urlOrHeader == "string" || urlOrHeader instanceof URL) {
                this.url = urlOrHeader.toString();
            } else if(this.isRequestInit(urlOrHeader)) {
                this.headers = urlOrHeader;
            }
        }
        if(header) {
            if(this.isRequestInit(header)) {
                this.headers = header;
            }
        }
    }
    isRequestInit(h: AnyMap): h is RequestInit {
        return "method" in h || "headers" in h || "body" in h || "credentials" in h;
    }
    isMethod(m: any): m is InformalMethod {
        return m == "get" || m == "post" || m == "GET" || m == "POST";
    }
    formURL(url: string) {
        return `${this.url}${url}`
    }
    formHeaders(method: FormalMethod, headers?: RequestInit): RequestInit {
        return {
            "method": method,
            ...this.headers,
            ...(headers ?? {})
        }
    }
    /**
     * Sends a GET request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * @param url The URL to request.
     */
    get(url: string): Promise<Response>;
    /**
     * Sends a GET request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * @param url The URL to request.
     */
    get(url: URL): Promise<Response>;
    /**
     * Sends a GET request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    get(url: string, headers: RequestInit): Promise<Response>;
    /**
     * Sends a GET request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    get(url: URL, headers: RequestInit): Promise<Response>;
    get(url: string | URL, headers?: RequestInit) {
        return fetch(this.formURL(url.toString()), this.formHeaders("GET", headers));
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * @param url The URL to request.
     */
    post(url: string): Promise<Response>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * @param url The URL to request.
     */
    post(url: URL): Promise<Response>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    post(url: string, headers: RequestInit): Promise<Response>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    post(url: URL, headers: RequestInit): Promise<Response>;
    post(url: string | URL, headers?: RequestInit) {
        return fetch(this.formURL(url.toString()), this.formHeaders("POST", headers));
    }
    __prepare(arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): [InformalMethod, RequestInit] {
        let method: InformalMethod = "POST"; // Default method
        let options: RequestInit = {};

        // Sort out the arguments
        if(this.isMethod(arg1)) {
            method = arg1;
            if(arg2 && !this.isMethod(arg2)) options = arg2;
        } else if(arg1) {
            options = arg1;
            if(this.isMethod(arg2)) method = arg2;
        }
        return [method, options];
    }
    __send(url: string | URL, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit) {
        const [method, opts] = this.__prepare(arg1, arg2);
        return fetch(this.formURL(url.toString()), this.formHeaders(method.toString().toUpperCase() as FormalMethod, opts));
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     */
    text(url: string): Promise<string>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     */
    text(url: URL): Promise<string>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    text(url: string, headers: RequestInit): Promise<string>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    text(url: URL, headers: RequestInit): Promise<string>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    text(url: string, method: InformalMethod): Promise<string>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    text(url: URL, method: InformalMethod): Promise<string>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    text(url: string, headers: RequestInit, method: InformalMethod): Promise<string>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    text(url: URL, headers: RequestInit, method: InformalMethod): Promise<string>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    text(url: string, method: InformalMethod, headers: RequestInit): Promise<string>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    text(url: URL, method: InformalMethod, headers: RequestInit): Promise<string>;
    async text(url: string | URL, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<string> {
        return (await this.__send(url, arg1, arg2)).text();
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     */
    json(url: string): Promise<any>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     */
    json(url: URL): Promise<any>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    json(url: string, headers: RequestInit): Promise<any>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    json(url: URL, headers: RequestInit): Promise<any>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    json(url: string, method: InformalMethod): Promise<any>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    json(url: URL, method: InformalMethod): Promise<any>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    json(url: string, headers: RequestInit, method: InformalMethod): Promise<any>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    json(url: URL, headers: RequestInit, method: InformalMethod): Promise<any>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    json(url: string, method: InformalMethod, headers: RequestInit): Promise<any>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    json(url: URL, method: InformalMethod, headers: RequestInit): Promise<any>;
    async json(url: string | URL, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<any> {
        return (await this.__send(url, arg1, arg2)).json();
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     */
    buf(url: string): Promise<ArrayBuffer>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     */
    buf(url: URL): Promise<ArrayBuffer>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    buf(url: string, headers: RequestInit): Promise<ArrayBuffer>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    buf(url: URL, headers: RequestInit): Promise<ArrayBuffer>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    buf(url: string, method: InformalMethod): Promise<ArrayBuffer>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    buf(url: URL, method: InformalMethod): Promise<ArrayBuffer>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    buf(url: string, headers: RequestInit, method: InformalMethod): Promise<ArrayBuffer>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    buf(url: URL, headers: RequestInit, method: InformalMethod): Promise<ArrayBuffer>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    buf(url: string, method: InformalMethod, headers: RequestInit): Promise<ArrayBuffer>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    buf(url: URL, method: InformalMethod, headers: RequestInit): Promise<ArrayBuffer>;
    async buf(url: string | URL, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<ArrayBuffer> {
        return (await this.__send(url, arg1, arg2)).arrayBuffer();
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     */
    formData(url: string): Promise<FormData>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     */
    formData(url: URL): Promise<FormData>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    formData(url: string, headers: RequestInit): Promise<FormData>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    formData(url: URL, headers: RequestInit): Promise<FormData>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    formData(url: string, method: InformalMethod): Promise<FormData>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    formData(url: URL, method: InformalMethod): Promise<FormData>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    formData(url: string, headers: RequestInit, method: InformalMethod): Promise<FormData>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    formData(url: URL, headers: RequestInit, method: InformalMethod): Promise<FormData>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    formData(url: string, method: InformalMethod, headers: RequestInit): Promise<FormData>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    formData(url: URL, method: InformalMethod, headers: RequestInit): Promise<FormData>;
    async formData(url: string | URL, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<FormData> {
        return (await this.__send(url, arg1, arg2)).formData();
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Blob`.
     * @param url The URL to request.
     */
    blob(url: string): Promise<Blob>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Blob`.
     * @param url The URL to request.
     */
    blob(url: URL): Promise<Blob>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Blob`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    blob(url: string, headers: RequestInit): Promise<Blob>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Blob`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    blob(url: URL, headers: RequestInit): Promise<Blob>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Blob`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    blob(url: string, method: InformalMethod): Promise<Blob>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Blob`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    blob(url: URL, method: InformalMethod): Promise<Blob>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Blob`.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    blob(url: string, headers: RequestInit, method: InformalMethod): Promise<Blob>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Blob`.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    blob(url: URL, headers: RequestInit, method: InformalMethod): Promise<Blob>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    blob(url: string, method: InformalMethod, headers: RequestInit): Promise<Blob>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    blob(url: URL, method: InformalMethod, headers: RequestInit): Promise<Blob>;
    async blob(url: string | URL, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<Blob> {
        return (await this.__send(url, arg1, arg2)).blob();
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     */
    bytes(url: string): Promise<Uint8Array>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     */
    bytes(url: URL): Promise<Uint8Array>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    bytes(url: string, headers: RequestInit): Promise<Uint8Array>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    bytes(url: URL, headers: RequestInit): Promise<Uint8Array>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    bytes(url: string, method: InformalMethod): Promise<Uint8Array>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    bytes(url: URL, method: InformalMethod): Promise<Uint8Array>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    bytes(url: string, headers: RequestInit, method: InformalMethod): Promise<Uint8Array>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    bytes(url: URL, headers: RequestInit, method: InformalMethod): Promise<Uint8Array>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    bytes(url: string, method: InformalMethod, headers: RequestInit): Promise<Uint8Array>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    bytes(url: URL, method: InformalMethod, headers: RequestInit): Promise<Uint8Array>;
    async bytes(url: string | URL, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<Uint8Array> {
        return (await this.__send(url, arg1, arg2)).bytes();
    }
}
type Key<T> = Extract<keyof T, string>;
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
class NetMap<R extends AnyMap> extends Net {
    constructor();
    constructor(baseURL: string);
    constructor(baseURL: URL);
    constructor(baseURL: Key<R>);
    constructor(defaultHeaders: RequestInit);
    constructor(defaultHeaders: AnyMap);
    constructor(baseURL: Key<R>, defaultHeaders: RequestInit);
    constructor(baseURL: Key<R>, defaultHeaders: AnyMap);
    constructor(urlOrHeaders?: Key<R> | RequestInit | AnyMap, headers?: RequestInit | AnyMap) {
        super(urlOrHeaders as any, headers as any);
    }
    /**
     * Sends a GET request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * @param url The URL to request.
     */
    get<U extends Key<R>>(url: U): Promise<Response>;
    /**
     * Sends a GET request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    get<U extends Key<R>>(url: U, headers: RequestInit): Promise<Response>;
    get<U extends Key<R>>(url: U, headers?: RequestInit) {
        return fetch(this.formURL(url.toString()), this.formHeaders("GET", headers));
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * @param url The URL to request.
     */
    post<U extends Key<R>>(url: U): Promise<Response>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    post<U extends Key<R>>(url: U, headers: RequestInit): Promise<Response>;
    post<U extends Key<R>>(url: U, headers?: RequestInit) {
        return fetch(this.formURL(url.toString()), this.formHeaders("POST", headers));
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     */
    text<U extends Key<R>>(url: U): Promise<string>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    text<U extends Key<R>>(url: U, headers: RequestInit): Promise<string>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    text<U extends Key<R>>(url: U, method: InformalMethod): Promise<string>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    text<U extends Key<R>>(url: U, headers: RequestInit, method: InformalMethod): Promise<string>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's text.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    text<U extends Key<R>>(url: U, method: InformalMethod, headers: RequestInit): Promise<string>;
    async text<U extends Key<R>>(url: U, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<string> {
        return super.text(url as any, arg1 as any, arg2 as any);
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     */
    json<U extends Key<R>, O extends R[U]>(url: U): Promise<O>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    json<U extends Key<R>, O extends R[U]>(url: U, headers: RequestInit): Promise<O>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    json<U extends Key<R>, O extends R[U]>(url: U, method: InformalMethod): Promise<O>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    json<U extends Key<R>, O extends R[U]>(url: U, headers: RequestInit, method: InformalMethod): Promise<O>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's JSON.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    json<U extends Key<R>, O extends R[U]>(url: U, method: InformalMethod, headers: RequestInit): Promise<O>;
    async json<U extends Key<R>, O extends R[U]>(url: U, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<O> {
        return super.json(url as any, arg1 as any, arg2 as any);
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     */
    buf<U extends Key<R>>(url: U): Promise<ArrayBuffer>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    buf<U extends Key<R>>(url: U, headers: RequestInit): Promise<ArrayBuffer>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    buf<U extends Key<R>>(url: U, method: InformalMethod): Promise<ArrayBuffer>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    buf<U extends Key<R>>(url: U, headers: RequestInit, method: InformalMethod): Promise<ArrayBuffer>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `ArrayBuffer`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    buf<U extends Key<R>>(url: U, method: InformalMethod, headers: RequestInit): Promise<ArrayBuffer>;
    async buf<U extends Key<R>>(url: U, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<ArrayBuffer> {
        return super.buf(url as any, arg1 as any, arg2 as any);
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     */
    formData<U extends Key<R>>(url: U): Promise<FormData>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    formData<U extends Key<R>>(url: U, headers: RequestInit): Promise<FormData>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    formData<U extends Key<R>>(url: U, method: InformalMethod): Promise<FormData>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    formData<U extends Key<R>>(url: U, headers: RequestInit, method: InformalMethod): Promise<FormData>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    formData<U extends Key<R>>(url: U, method: InformalMethod, headers: RequestInit): Promise<FormData>;
    async formData<U extends Key<R>>(url: U, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<FormData> {
        return super.formData(url as any, arg1 as any, arg2 as any);
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Blob`.
     * @param url The URL to request.
     */
    blob<U extends Key<R>>(url: U): Promise<Blob>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Blob`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    blob<U extends Key<R>>(url: U, headers: RequestInit): Promise<Blob>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Blob`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    blob<U extends Key<R>>(url: U, method: InformalMethod): Promise<Blob>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Blob`.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    blob<U extends Key<R>>(url: U, headers: RequestInit, method: InformalMethod): Promise<Blob>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `FormData`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    blob<U extends Key<R>>(url: U, method: InformalMethod, headers: RequestInit): Promise<Blob>;
    async blob<U extends Key<R>>(url: U, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<Blob> {
        return super.blob(url as any, arg1 as any, arg2 as any);
    }
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     */
    bytes<U extends Key<R>>(url: U): Promise<Uint8Array>;
    /**
     * Sends a POST request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     * @param headers The headers to include.
     */
    bytes<U extends Key<R>>(url: string, headers: RequestInit): Promise<Uint8Array>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     */
    bytes<U extends Key<R>>(url: string, method: InformalMethod): Promise<Uint8Array>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     * @param headers The headers to include.
     * @param method The method to use (GET/POST).
     */
    bytes<U extends Key<R>>(url: U, headers: RequestInit, method: InformalMethod): Promise<Uint8Array>;
    /**
     * Sends a request to the URL provided.
     * 
     * Uses the syntax `${baseURL}${url}`.
     * 
     * Returns the response's `Uint8Array`.
     * @param url The URL to request.
     * @param method The method to use (GET/POST).
     * @param headers The headers to include.
     */
    bytes<U extends Key<R>>(url: U, method: InformalMethod, headers: RequestInit): Promise<Uint8Array>;
    async bytes<U extends Key<R>>(url: U, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<Uint8Array> {
        return super.bytes(url as any, arg1 as any, arg2 as any);
    }
}

type Simple<R> = { [K in keyof R]: R[K] extends any[] ? never : R[K] extends AnyMap ? K : never }[keyof R] & string;
type Tuple<R> = { [K in keyof R]: R[K] extends [any, AnyMap] ? K : never }[keyof R] & string;
type Result<R, K extends keyof R> = R[K] extends [any, infer Res] ? Res : R[K];
type Payload<R, K extends keyof R> = R[K] extends [infer Pay, any] ? Pay : never;
type JsonOptions<R, K extends keyof R> = R[K] extends [infer Pay, any] ? { body: Pay; headers?: RequestInit; method?: InformalMethod; } : { headers?: RequestInit; method?: InformalMethod; };
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
class AdvancedNetMap<R extends AnyMap> extends NetMap<R> {
    json<K extends Key<R>>(url: K, body: Payload<R, K>): Promise<Result<R, K>>;
    json<K extends Key<R>>(url: K, options?: JsonOptions<R, K>): Promise<Result<R, K>>;
    // compatibility overload (matches base class chaos)
    json<K extends Key<R>>(url: K, arg1?: RequestInit | InformalMethod, arg2?: InformalMethod | RequestInit): Promise<Result<R, K>>;
    async json<K extends Key<R>>(url: K, arg1?: any, arg2?: any): Promise<Result<R, K>> {
        // detect "modern" usage
        if(arg1 && typeof arg1 == "object" && !("method" in arg1) && !("headers" in arg1) && !("body" in arg1)) {
            // this is your tuple/body case fallback if needed
            return super.json(url as any, "POST", { body: arg1 });
        }
        // detect options object
        if (arg1 && typeof arg1 == "object" && ("body" in arg1 || "headers" in arg1 || "method" in arg1)) {
            const options = arg1;
            const req: RequestInit = {
                ...(options.headers || {}),
                ...(options.body ? { body: JSON.stringify(options.body) } : {})
            };
            return super.json(url as any, req, options.method as any);
        }
        // fallback: behave exactly like base class
        return super.json(url as any, arg1, arg2);
    }
}
export { Net, NetMap, AdvancedNetMap };