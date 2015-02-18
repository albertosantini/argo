"use strict";

var express = require("express"),
    WebSocket = require("faye-websocket"),
    routes = require("./routes"),
    stream = require("./routes/stream");

var app = express(),
    port = process.env.PORT || 8000,
    staticFiles = express.static,
    apiUrl = "/api",
    streamUrl = "/stream";

app.use(staticFiles("./src/client/"));
app.use(apiUrl, routes);

app.listen(port, function () {
    console.log("Argo listening on http://localhost:" + port);
    console.log("APIs on http://localhost:" + port + apiUrl);
})
.on("upgrade", function(request, socket, body) {
    var ws;

    // on client side
    // var ws = new WebSocket("ws://localhost:8000/stream");
    // ws.onmessage = function(event) {console.log(event);}
    // ws.send(JSON.stringify({foo: 1}));

    if (request.url === streamUrl && WebSocket.isWebSocket(request)) {
        ws = new WebSocket(request, socket, body);

        ws.on("message", function(event) {
            stream(ws, event);
        });

        ws.on("close", function(event) {
            console.log("Close streaming", event.code, event.reason);
            ws = null;
        });

        console.log("Argo streaming on http://localhost:" + port + streamUrl);
    }
});
