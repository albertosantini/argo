"use strict";

exports.start = start;
exports.run = run;
exports.sendMessage = sendMessage;

const WebSocket = require("faye-websocket"),
    request = require("request"),
    config = require("./config"),
    plugin = require("../plugin/plugin");

const initialSnapshots = [];

let pricesStreaming,
    eventsStreaming,
    ws;

function start(options, callback) {
    const environment = options && options.environment || config.environment,
        accessToken = options && options.accessToken || config.accessToken,
        accountId = options && options.accountId || config.accountId,
        instruments = options && options.instruments || config.instruments,
        stream = config.getUrl(environment, "stream"),
        pricesUrl = `${stream}/v3/accounts/${accountId}/pricing/stream`,
        eventsUrl = `${stream}/v3/accounts/${accountId}/transactions/stream`,
        authHeader = {
            Authorization: `Bearer ${accessToken}`
        };

    if (pricesStreaming && eventsStreaming) {
        pricesStreaming.abort();
        eventsStreaming.abort();
    }

    pricesStreaming = request({
        url: pricesUrl,
        qs: {
            instruments: instruments.join(",")
        },
        headers: authHeader
    }).on("response", () => {
        eventsStreaming = request({
            url: eventsUrl,
            headers: authHeader
        }).on("response", () => {
            callback();
        }).on("data", processChunk);
    }).on("data", processChunk);
}

function processChunk(chunk) {
    const data = chunk.toString();

    if (ws) {
        if (initialSnapshots.length > 0) {
            initialSnapshots.forEach(() => {
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
    const url = req.url,
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
