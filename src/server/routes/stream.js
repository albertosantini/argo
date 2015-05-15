"use strict";

exports.start = start;
exports.run = run;

var util = require("util"),
    WebSocket = require("faye-websocket"),
    request = require("request"),
    StreamingNode = require("flic").node,
    config = require("./config");

var pricesStreaming,
    eventsStreaming,
    ws;

var streamingNode = new StreamingNode(function (err) {
    if (!err) {
        util.log("Argo streaming node online");
    } else {
        util.log(err);
    }
});

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
            streamingNode.shout("argo.streaming", el);
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
