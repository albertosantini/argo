"use strict";

exports.start = start;
exports.run = run;
exports.sendMessage = sendMessage;

var WebSocket = require("faye-websocket"),
    request = require("request"),
    config = require("./config"),
    plugin = require("../plugin/plugin");

var pricesStreaming,
    eventsStreaming,
    initialSnapshots = [],
    ws;

function start(options, callback) {
    var environment = options && options.environment || config.environment,
        accessToken = options && options.accessToken || config.accessToken,
        accountId = options && options.accountId || config.accountId,
        instruments = options && options.instruments || config.instruments,
        pricesUrl = config.getUrl(environment, "stream") + "/v3/accounts/" +
            accountId + "/pricing/stream",
        eventsUrl = config.getUrl(environment, "stream") + "/v3/accounts/" +
            accountId + "/transactions/stream",
        authHeader = {
            "Authorization": "Bearer " + accessToken
        };

    if (pricesStreaming && eventsStreaming) {
        pricesStreaming.abort();
        eventsStreaming.abort();
    }

    pricesStreaming = request({
        "url": pricesUrl,
        "qs": {
            instruments: instruments.join(",")
        },
        "headers": authHeader
    }).on("response", function () {
        eventsStreaming = request({
            "url": eventsUrl,
            "headers": authHeader
        }).on("response", function () {
            callback();
        }).on("data", processChunk);
    }).on("data", processChunk);
}

function processChunk(chunk) {
    var data = chunk.toString();

    if (ws) {
        if (initialSnapshots.length > 0) {
            initialSnapshots.forEach(function () {
                ws.send(initialSnapshots.pop());
            });
        }
        ws.send(data);
        plugin.shoutStreaming(data);
    } else {
        initialSnapshots.push(data);
    }
}

function run(req, socket, body) {
    var url = req.url,
        streamUrl = config.streamUrl;

    if (url === streamUrl && WebSocket.isWebSocket(req)) {
        ws = new WebSocket(req, socket, body);
    }
}

function sendMessage(message) {
    if (ws && message) {
        ws.send(message);
    }
}
