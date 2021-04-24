import RequestBuilder from "./structs/RequestBuilder";

export default class Flight extends RequestBuilder {
    static get(url: string) {
        return new RequestBuilder(url, "GET").build().send();
    }

    static create(url: string) {
        return new RequestBuilder(url);
    }
}