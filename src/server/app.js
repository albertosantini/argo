"use strict";

var util = require("util"),
    express = require("express"),
    routes = require("./routes");

var app = express(),
    port = routes.config.port,
    staticFiles = express.static,
    apiUrl = routes.config.apiUrl;

process.on("uncaughtException", function (err) {
    console.log(err);
});

app.use(staticFiles(routes.config.staticFiles));
app.use(apiUrl, routes.apis);

app.listen(port, function () {
    util.log("Argo listening on http://localhost:" + port);
    util.log("Argo listening apis on http://localhost:" + port + apiUrl);
}).on("upgrade", function (request, socket, body) {
    routes.stream.run(request, socket, body);

    util.log("Argo streaming prices and events on ws://localhost:" +
        port + routes.config.streamUrl);
});
