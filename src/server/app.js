"use strict";

const express = require("express");

const routes = require("./routes");
const plugin = require("./plugin");
const util = require("./util");

const app = express();
const port = routes.config.port;
const staticFiles = express.static;
const apiUrl = routes.config.apiUrl;

process.on("uncaughtException", err => {
    util.log(err.toString());
});

app.use(staticFiles(routes.config.staticFiles));
app.use("/node_modules", staticFiles(routes.config.vendorFiles));
app.use("/build", staticFiles(routes.config.buildFiles));
app.use(apiUrl, routes.apis);

app.listen(port, async() => {
    const ipaddress = await util.getIP();

    util.log(`Argo listening on http://${ipaddress}:${port}`);
    util.log(`Argo listening apis on http://${ipaddress}:${port}${apiUrl}`);
}).on("upgrade", async(request, socket, body) => {
    const ipaddress = await util.getIP();

    routes.stream.run(request, socket, body);

    util.log(`Argo streaming prices and events on ws://${ipaddress}:${port}${routes.config.streamUrl}`);
});

plugin.startBridge();
