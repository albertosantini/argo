//------------------------------------------------------------------------------
//
// Check if it exists a trend with a linear regression
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
            granularity: "M5",
            candleFormat: "midpoint",
            count: 32
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

            // console.log(candles);
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
    var lr = linearRegression(closes);

    console.log(symbol, "slope:", lr.slope);
}

function linearRegression(y, x) {
    var lr = {},
        n = y.length,
        sum = {};

    x = x || [];

    sum.x = 0;
    sum.y = 0;
    sum.xy = 0;
    sum.xx = 0;
    sum.yy = 0;

    y.forEach(function (el, i) {
        if (x.length === i) {
            x[i] = i + 1;
        }
        sum.x += x[i];
        sum.y += y[i];
        sum.xy += (x[i] * y[i]);
        sum.xx += (x[i] * x[i]);
        sum.yy += (y[i] * y[i]);
    });

    lr.slope = (n * sum.xy - sum.x * sum.y) / (n * sum.xx - sum.x * sum.x);
    lr.intercept = (sum.y - lr.slope * sum.x) / n;
    lr.r2 = Math.pow(
        (n * sum.xy - sum.x * sum.y) /
        Math.sqrt((n * sum.xx - sum.x * sum.x) * (n * sum.yy - sum.y * sum.y)
    ), 2);

    lr.fn = function (x0) {
        return this.slope * x0 + this.intercept;
    };

    return lr;
}
