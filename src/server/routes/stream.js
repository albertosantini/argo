"use strict";

exports.start = start;
exports.run = run;
exports.sendMessage = sendMessage;

const WebSocket = require("faye-websocket"),
    request = require("../util").request,
    config = require("./config"),
    plugin = require("../plugin/plugin");

const initialSnapshots = [];

let ws;

function start({
    environment = config.environment,
    accessToken = config.accessToken,
    accountId = config.accountId,
    instruments = config.instruments
} = {}, callback) {
    const stream = config.getUrl(environment, "stream"),
        pricesUrl = `${stream}/v3/accounts/${accountId}/pricing/stream`,
        eventsUrl = `${stream}/v3/accounts/${accountId}/transactions/stream`,
        authHeader = {
            Authorization: `Bearer ${accessToken}`
        };

    request({
        url: pricesUrl,
        qs: {
            instruments: instruments.join(",")
        },
        headers: authHeader
    }).on("response", () => {
        request({
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
