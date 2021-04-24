export default class CookieManager {
    _cache = [];
    constructor(parent?: CookieManager) {
        if (parent) {
            this._cache = parent._cache;
        }
    }
}