"use strict";

var path = require("path");

exports.port = process.env.ARGO_PORT || 8000;

exports.staticFiles = path.resolve(__dirname, "../../client/");
exports.apiUrl = "/api";
exports.streamUrl = "/stream";

exports.environment = process.env.OANDA_ENVIRONMENT || "practice";
exports.accessToken = process.env.OANDA_TOKEN || "ACCESS_TOKEN";
exports.accountId = process.env.OANDA_ACCOUNTID || "1234567890";
exports.sessionId = process.env.OANDA_SESSIONID || "1";

exports.instruments = [
    "EUR_USD",
    "USD_JPY",
    "GBP_USD",
    "EUR_GBP",
    "USD_CHF",
    "EUR_JPY",
    "EUR_CHF",
    "USD_CAD",
    "AUD_USD",
    "GBP_JPY"
];

exports.getUrl = getUrl;

function getUrl(environment, type) {
    var endpoints = {
        live: {
            stream: "https://stream-fxtrade.oanda.com",
            api: "https://api-fxtrade.oanda.com"
        },
        practice: {
            stream: "https://stream-fxpractice.oanda.com",
            api: "https://api-fxpractice.oanda.com"
        },
        sandbox: {
            stream: "http://stream-sandbox.oanda.com",
            api: "https://api-sandbox.oanda.com"
        }
    };

    return endpoints[environment][type];
}
