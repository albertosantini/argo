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
    ws;

function start(options, callback) {
    var environment = options && options.environment || config.environment,
        accessToken = options && options.accessToken || config.accessToken,
        accountId = options && options.accountId || config.accountId,
        sessionId = options && options.sessionId || config.sessionId,
        instruments = options && options.instruments || config.instruments,
        pricesUrl = config.getUrl(environment, "stream") + "/v1/prices",
        eventsUrl = config.getUrl(environment, "stream") + "/v1/events",
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
            accountId: accountId,
            sessionId: sessionId,
            instruments: instruments.join(",")
        },
        "headers": authHeader
    }).on("response", function () {
        eventsStreaming = request({
            "url": eventsUrl,
            "qs": {
                accountIds: accountId
            },
            "headers": authHeader
        }).on("response", function () {
            callback();
        }).on("data", processChunk);
    }).on("data", processChunk);
}

function processChunk(chunk) {
    var data = chunk.toString().split("\r\n").slice(0, -1);

    if (ws) {
        data.forEach(function (el) {
            ws.send(el);
            plugin.shoutStreaming(el);
        });
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
