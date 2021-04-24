import * as http2 from "http2";
import * as https from "https";
import * as http from "http";
import { URL } from "url";

import RequestBuilder from "./RequestBuilder";
import Response from "./Response";
import { isRedirect } from "../utils/status";
import { Compression } from "../utils/Compression";

export default class Request {

    private engine: typeof https | typeof http;
    private data: Buffer[] = [];
    private decodedBody: string = "";

    constructor(private component: RequestBuilder, public redirects: URL[] = []) {
        this.engine = component.isHttps ? https : http;
    }

    private get config(): http.RequestOptions | https.RequestOptions {
        return {
            host: this.component.url.hostname,
            path: this.component.url.pathname,
            protocol: this.component.url.protocol,
            method: this.component.method,
            headers: this.component.sentHeaders as any,
            port: this.component.url.port
        }
    }

    async send(): Promise<Response> {
        const wrapper: Response = await new Promise((resolve, reject) => {
            let response: http.IncomingMessage;
            console.log(this.config.host)
            this.engine.request(this.config, (request) => {
                request
                .on("data", (buffer) => {
                    this.data.push(buffer);
                })
                .once("end", async () => {
                    switch (response.headers["content-encoding"]) {
                        case "gzip": {
                            this.decodedBody = await Compression.gzip(Buffer.concat(this.data));
                        }; break;

                        case "br": {
                            this.decodedBody = await Compression.br(Buffer.concat(this.data));
                        }; break;

                        default: {
                            this.decodedBody = Buffer.concat(this.data).toString("utf8");
                        }
                    }
                    resolve(new Response(this, response, this.decodedBody));
                })
                .once("error", (err) => {
                    reject(err);
                })
            })
            .once("response", (resp) => {
                response = resp;
            }).end();
        })
    
        if (isRedirect(wrapper.response.statusCode) && wrapper.response.headers.location) {
            this.component.url = new URL(wrapper.response.headers.location);
            this.redirects.push(this.component.url);
            return new Request(this.component, this.redirects).send();
        }

        return wrapper;
    }

}