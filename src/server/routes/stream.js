"use strict";

exports.start = start;
exports.run = run;

var WebSocket = require("faye-websocket"),
    request = require("request"),
    config = require("./config");

var wss = [];

function start(options) {
    var port = config.port,
        environment = options && options.environment || config.environment,
        accessToken = options && options.accessToken || config.accessToken,
        accountId = options && options.accountId || config.accountId,
        sessionId = options && options.sessionId || config.sessionId,
        instruments = options && options.instruments || config.instruments;

    request({
        "url": config.getUrl(environment, "stream") + "/v1/prices",
        "qs": {
            accountId: accountId,
            sessionId: sessionId,
            instruments: instruments
        },
        "headers": {
            "Authorization": "Bearer " + accessToken
        }
    }).on("data", processChunk);

    request({
        "url": config.getUrl(environment, "stream") + "/v1/events",
        "qs": {
            accountIds: accountId
        },
        "headers": {
            "Authorization": "Bearer " + accessToken
        }
    }).on("data", processChunk);

    console.log("Argo streaming prices and events on http://localhost:" + port +
        config.streamUrl);
}

function processChunk(chunk) {
    var data = chunk.toString().split("\r\n").slice(0, -1);

    data.forEach(function (el) {
        try {
            processData(JSON.parse(el));
        } catch(e) {
            console.log("ERROR", chunk.toString());
        }
    });
}

function processData(data) {
    wss.forEach(function (ws) {
        if (ws) {
            ws.send(data);
        }
    });
}

function run(req, socket, body) {
    var url = req.url,
        streamUrl = config.streamUrl,
        ws;

    if (url === streamUrl && WebSocket.isWebSocket(req)) {
        ws = new WebSocket(req, socket, body);

        ws.on("close", function() {
            ws = null;
        });

        wss.push(ws);
    }
}
