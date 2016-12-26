"use strict";

const util = require("util"),
    express = require("express"),
    routes = require("./routes"),
    plugin = require("./plugin");

const app = express(),
    port = routes.config.port,
    staticFiles = express.static,
    apiUrl = routes.config.apiUrl;

process.on("uncaughtException", err => {
    util.log(err);
});

app.use(staticFiles(routes.config.staticFiles));
app.use("/node_modules", staticFiles(routes.config.vendorFiles));
app.use(apiUrl, routes.apis);

app.listen(port, () => {
    util.log(`Argo listening on http://localhost:${port}`);
    util.log(`Argo listening apis on http://localhost:${port}${apiUrl}`);
}).on("upgrade", (request, socket, body) => {
    routes.stream.run(request, socket, body);

    util.log("Argo streaming prices and events on ws://localhost:" +
        `${port}${routes.config.streamUrl}`);
});

plugin.startBridge();
