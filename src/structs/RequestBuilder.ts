import Request from "./Request";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
export type HeaderObject = {[key: string]: number | string | null };

export default class RequestBuilder {
    url: URL;
    method: string;

    private _headers: HeaderObject = {
        "User-Agent": "NodeJS-Flight/0.1.0",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
    };

    private _agent?: string;
    private _proxy?: {
        ip: string,
        port: string,
        auth?: { username: string, password: string }
    };

    constructor(link: string, method?: HttpMethod) {
        this.url = new URL(link);
        this.method = method ? method : "GET";
    }

    public get isHttp() { return this.url.protocol.startsWith("http") }
    public get isHttps() { return this.url.protocol.startsWith("https") }
    public get sentHeaders() { return {...this._headers }}

    public proxy(ip: string, port: string, auth?: { username: string, password: string }): RequestBuilder {
        this._proxy = {
            ip: ip,
            port: port,
            auth: auth
        };
        return this;
    }

    public agent(agent: string): RequestBuilder {
        this._agent = agent;
        return this;
    }

    
    public header(k: string, v: keyof HeaderObject) {
        this._headers.k = v;
    }
    
    public headers(obj: HeaderObject) {
        this._headers = { ...this._headers, ...obj };
    }
    
    public build(): Request {
        return new Request(this);
    }

}