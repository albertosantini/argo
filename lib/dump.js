//------------------------------------------------------------------------------
//
// Dump time series to a file
//
//------------------------------------------------------------------------------
"use strict";

var fs = require("fs");
var request = require("request");

var CONFIG = {
    // live       stream-fxtrade.oanda.com      api-fxtrade.oanda.com
    // practice   stream-fxpractice.oanda.com   api-fxpractice.oanda.com
    // sandbox    stream-sandbox.oanda.com      api-sandbox.oanda.com
    api: process.env.OANDA_API || "https://api-fxpractice.oanda.com",
    accessToken: process.env.OANDA_TOKEN || "ACCESS_TOKEN",

    lastFX: {
        "EUR_USD": {pip: 0.0001},
        "USD_JPY": {pip: 0.01},
        "GBP_USD": {pip: 0.0001},
        "EUR_GBP": {pip: 0.0001},
        // "USD_CHF": {pip: 0.0001},
        "EUR_JPY": {pip: 0.01},
        // "EUR_CHF": {pip: 0.0001},
        "USD_CAD": {pip: 0.0001},
        "AUD_USD": {pip: 0.0001},
        "GBP_JPY": {pip: 0.01}
    }
};

Object.keys(CONFIG.lastFX).forEach(function (symbol) {
    setTimeout(dumpRates, Math.random() * 1000 * 2, symbol);
});

function dumpRates(symbol) {
    request({
        "url": CONFIG.api + "/v1/candles",
        "qs": {
            instrument: symbol,
            granularity: "M5",
            candleFormat: "midpoint",
            alignmentTimezone: "America/New_York",
            dailyAlignment: "0"
        },
        "headers": {
            "Authorization": "Bearer " + CONFIG.accessToken
        }
    }, function (err, res, body) {
        var candles;

        body = JSON.parse(body);
        if (!err && !body.code) {
            candles = body.candles;


            processData(symbol, candles);
        } else {
            console.log("ERROR", body.code, body.message);
        }
    });
}

function processData(symbol, candles) {
    var filename = "../dump/dump-" + symbol + ".csv",
        lines = "";

    candles.forEach(function (candle) {
        lines += candle.time + "," +
                candle.openMid + "," +
                candle.highMid + "," +
                candle.lowMid + "," +
                candle.closeMid + "," +
                candle.volume + "\n";
    });

    fs.writeFile(filename, lines);
}
