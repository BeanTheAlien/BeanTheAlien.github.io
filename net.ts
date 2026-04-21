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
    url: string;
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
    #prepare(arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): [InformalMethod, RequestInit] {
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
    #send(url: string | URL, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit) {
        const [method, opts] = this.#prepare(arg1, arg2);
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
        return (await this.#send(url, arg1, arg2)).text();
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
        return (await this.#send(url, arg1, arg2)).json();
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
        return (await this.#send(url, arg1, arg2)).arrayBuffer();
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
        return (await this.#send(url, arg1, arg2)).formData();
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
        return (await this.#send(url, arg1, arg2)).blob();
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
        return (await this.#send(url, arg1, arg2)).bytes();
    }
}
export { Net };