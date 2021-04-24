const express = require("express");
const { default: Flight } = require("../dist/index");
const server = express();

server.use(express.json());

server.get("/response", (req, res) => {
    res.send("OK");
})

server.post("/response", (req, res) => {
    if (Object.keys(res.body).length > 0) {
        res.send("OK");
    } else {
        res.send("ERR");
    }
})

server.post("/test", async (req, res) => {
    try {
        await Flight.get(req.body.url, req.body.opts)
        res.send("OK");
    } catch (err) {
        console.log(err);
    }
})

server.listen("80");