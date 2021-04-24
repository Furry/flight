import Request from "./Request";
import http from "http"

export default class Response {
    constructor(public request: Request, public response: http.IncomingMessage, private data: string) {

    }

    get headers() { return this.response; }
    get body() { return this.data; }
    get json() {
        try {
            return JSON.parse(this.body);
        } catch (_) {
            return {}
        }
    }
}