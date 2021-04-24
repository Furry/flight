import zlib from "zlib";

export class Compression {
    static gzip(data: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            zlib.gunzip(data, (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer.toString("utf8"));
                }
            })
        })
    }

    static br(data: Buffer): Promise<string> {
        return new Promise((resolve, reject) => {
            zlib.brotliDecompress(data, (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(buffer.toString("utf8"));
                }
            })
        })
    }
}