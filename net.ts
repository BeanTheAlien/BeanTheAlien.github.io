type AnyMap = { [x: string]: any };
type FormalMethod = "GET" | "POST"
type InformalMethod = "get" | "post" | FormalMethod;

class Net {
    url: string;
    headers: RequestInit;
    constructor();
    constructor(baseURL: string);
    constructor(baseURL: URL);
    constructor(defaultHeaders: RequestInit);
    constructor(defaultHeaders: AnyMap);
    constructor(baseURL: string, defaultHeaders: RequestInit);
    constructor(baseURL: URL, defaultHeaders: RequestInit);
    constructor(baseURL: string, defaultHeaders: AnyMap);
    constructor(baseURL: URL, defaultHeaders: AnyMap);
    constructor(urlOrHeader?: string | URL | RequestInit | AnyMap, header?: RequestInit | AnyMap) {
        this.url = "";
        this.headers = {
            "credentials": "include",
            "headers": {
                "Content-Type": "application/json"
            }
        };
        const isRequestInit = (h: AnyMap) => "method" in h || "headers" in h || "body" in h || "credentials" in h;
        if(urlOrHeader) {
            if(typeof urlOrHeader == "string" || urlOrHeader instanceof URL) {
                this.url = urlOrHeader.toString();
            } else if(isRequestInit(urlOrHeader)) {
                this.headers = urlOrHeader;
            }
        }
        if(header) {
            if(isRequestInit(header)) {
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
    get(url: string): Promise<Response>;
    get(url: URL): Promise<Response>;
    get(url: string, headers: RequestInit): Promise<Response>;
    get(url: URL, headers: RequestInit): Promise<Response>;
    get(url: string | URL, headers?: RequestInit) {
        return fetch(this.formURL(url.toString()), this.formHeaders("GET", headers));
    }
    post(url: string): Promise<Response>;
    post(url: URL): Promise<Response>;
    post(url: string, headers: RequestInit): Promise<Response>;
    post(url: URL, headers: RequestInit): Promise<Response>;
    post(url: string | URL, headers?: RequestInit) {
        return fetch(this.formURL(url.toString()), this.formHeaders("POST", headers));
    }
    #prepare(arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit) {
        let method: InformalMethod = "POST"; // Default method
        let options: RequestInit = {};

        // 1. Sort out the arguments
        if(this.isMethod(arg1)) {
            method = arg1;
            if(arg2 && !this.isMethod(arg2)) options = arg2;
        } else if(arg1) {
            options = arg1;
            if(this.isMethod(arg2)) method = arg2;
        }
        return [method, options];
    }
    text(url: string): Promise<string>;
    text(url: URL): Promise<string>;
    text(url: string, headers: RequestInit): Promise<string>;
    text(url: URL, headers: RequestInit): Promise<string>;
    text(url: string, method: InformalMethod): Promise<string>;
    text(url: URL, method: InformalMethod): Promise<string>;
    text(url: string, headers: RequestInit, method: InformalMethod): Promise<string>;
    text(url: URL, headers: RequestInit, method: InformalMethod): Promise<string>;
    text(url: string, method: InformalMethod, headers: RequestInit): Promise<string>;
    text(url: URL, method: InformalMethod, headers: RequestInit): Promise<string>;
    async text(url: string | URL, arg1?: InformalMethod | RequestInit, arg2?: InformalMethod | RequestInit): Promise<string> {
        let method: InformalMethod = "POST"; // Default method
        let options: RequestInit = {};

        // 1. Sort out the arguments
        if(this.isMethod(arg1)) {
            method = arg1;
            if(arg2 && !this.isMethod(arg2)) options = arg2;
        } else if(arg1) {
            options = arg1;
            if(this.isMethod(arg2)) method = arg2;
        }

        // 2. Prepare the request
        const finalUrl = this.formURL(url.toString());
        const finalHeaders = this.formHeaders(
            method.toString().toUpperCase() as FormalMethod, 
            options
        );
        // 3. Execute
        const response = await fetch(finalUrl, finalHeaders);
        return response.text();
    }
    json(url: string): Promise<any>;
    json(url: URL): Promise<any>;
    json(url: string, headers: RequestInit): Promise<any>;
    json(url: URL, headers: RequestInit): Promise<any>;
    async json(url: string | URL, headers?: RequestInit): Promise<any> {
        return (await fetch(this.formURL(url.toString()), this.formHeaders("POST", headers))).json();
    }
    buf(url: string): Promise<ArrayBuffer>;
    buf(url: URL): Promise<ArrayBuffer>;
    buf(url: string, headers: RequestInit): Promise<ArrayBuffer>;
    buf(url: URL, headers: RequestInit): Promise<ArrayBuffer>;
    async buf(url: string | URL, headers?: RequestInit): Promise<ArrayBuffer> {
        return (await fetch(this.formURL(url.toString()), this.formHeaders("POST", headers))).arrayBuffer();
    }
    formData(url: string): Promise<FormData>;
    formData(url: URL): Promise<FormData>;
    formData(url: string, headers: RequestInit): Promise<FormData>;
    formData(url: URL, headers: RequestInit): Promise<FormData>;
    async formData(url: string | URL, headers?: RequestInit): Promise<FormData> {
        return (await fetch(this.formURL(url.toString()), this.formHeaders("POST", headers))).formData();
    }
    blob(url: string): Promise<Blob>;
    blob(url: URL): Promise<Blob>;
    blob(url: string, headers: RequestInit): Promise<Blob>;
    blob(url: URL, headers: RequestInit): Promise<Blob>;
    async blob(url: string | URL, headers?: RequestInit): Promise<Blob> {
        return (await fetch(this.formURL(url.toString()), this.formHeaders("POST", headers))).blob();
    }
    bytes(url: string): Promise<Uint8Array>;
    bytes(url: URL): Promise<Uint8Array>;
    bytes(url: string, headers: RequestInit): Promise<Uint8Array>;
    bytes(url: URL, headers: RequestInit): Promise<Uint8Array>;
    async bytes(url: string | URL, headers?: RequestInit): Promise<Uint8Array> {
        return (await fetch(this.formURL(url.toString()), this.formHeaders("POST", headers))).bytes();
    }
}