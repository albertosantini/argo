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
        "EUR_USD": {pip: 0.0001}
    }
};

Object.keys(CONFIG.lastFX).forEach(function (symbol) {
    request({
        "url": CONFIG.api + "/v1/candles",
        "qs": {
            instrument: symbol,
            granularity: "S30",
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
});

function processData(symbol, candles) {
    var filename = "dump.csv",
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
