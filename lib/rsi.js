//------------------------------------------------------------------------------
//
// Calculate rsi
//
//------------------------------------------------------------------------------
"use strict";

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
    request({
        "url": CONFIG.api + "/v1/candles",
        "qs": {
            instrument: symbol,
            granularity: "D",
            candleFormat: "midpoint",
            count: 14
        },
        "headers": {
            "Authorization": "Bearer " + CONFIG.accessToken
        }
    }, function (err, res, body) {
        var candles,
            closes = [];

        body = JSON.parse(body);
        if (!err && !body.code) {
            candles = body.candles;
            candles.forEach(function (c) {
                closes.push(c.closeMid);
            });

            processData(symbol, closes);
        } else {
            console.log("ERROR", body.code, body.message);
        }
    });
});

function processData(symbol, closes) {
    var res = rsi(closes);

    console.log(symbol, "rsi:", res);
}

function rsi(closes) {
    var n = closes.length,
            gain = 0,
            loss = 0,
            avgGain,
            avgLoss,
            rs;

    closes.forEach(function (close, i) {
        var change;

        if (i === 0) {
            return;
        }

        change = closes[i] - closes[i - 1];
        if (change < 0) {
            loss += change;
        }
        if (change > 0) {
            gain += change;
        }
    });


    avgLoss = -loss / n;
    avgGain = gain / n;
    rs = avgGain / avgLoss;

    return 100 - (100 / (1 + rs));
}
