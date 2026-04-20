type AnyMap = { [x: string]: any };

class Net {
    url: string;
    headers: Headers;
    constructor();
    constructor(baseURL: string);
    constructor(baseURL: URL);
    constructor(defaultHeaders: Headers);
    constructor(defaultHeaders: AnyMap);
    constructor(baseURL: string, defaultHeaders: Headers);
    constructor(baseURL: URL, defaultHeaders: Headers);
    constructor(baseURL: string, defaultHeaders: AnyMap);
    constructor(baseURL: URL, defaultHeaders: AnyMap);
    constructor(urlOrHeader?: string | URL | Headers | AnyMap, header?: Headers | AnyMap) {
        this.url = "";
        this.headers = new Headers();
        if(urlOrHeader) {
            if(typeof urlOrHeader == "string") {
                this.url = urlOrHeader;
            } else if(urlOrHeader instanceof URL) {
                this.url = urlOrHeader.toString();
            } else if(urlOrHeader instanceof Headers) {
                this.headers = urlOrHeader;
            } else {
                this.headers = new Headers(urlOrHeader);
            }
        }
        if(header) {
            if(header instanceof Headers) {
                this.headers = header;
            } else {
                this.headers = new Headers(header);
            }
        }
    }
}