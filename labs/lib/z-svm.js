//------------------------------------------------------------------------------
//
// Exit pool with Support Vector Machine analysis
//
// while [ true ]; do node z-svm.js; sleep 300; done
//
//------------------------------------------------------------------------------
"use strict";

var request = require("request"),
    svm = require("node-svm");

var CONFIG = {
    // live       stream-fxtrade.oanda.com      api-fxtrade.oanda.com
    // practice   stream-fxpractice.oanda.com   api-fxpractice.oanda.com
    // sandbox    stream-sandbox.oanda.com      api-sandbox.oanda.com
    api: process.env.OANDA_API || "https://api-fxpractice.oanda.com",
    accessToken: process.env.OANDA_TOKEN || "ACCESS_TOKEN",
    accountId: process.env.OANDA_ACCOUNTID || "1234567890",

    units: process.env.OANDA_UNITS || 10
};

process.on("uncaughtException", function (err) {
    console.log("ERROR", err);
    init(fillOrder);
});

init(fillOrder);

function init(next) {
    CONFIG.lastFX = {
        "EUR_USD": {pip: 0.0001},
        "USD_JPY": {pip: 0.01},
        "GBP_USD": {pip: 0.0001},
        "EUR_GBP": {pip: 0.0001},
        // "USD_CHF": {pip: 0.0001},
        "EUR_JPY": {pip: 0.01},
        // "EUR_CHF": {pip: 0.0001},
        "USD_CAD": {pip: 0.0001},
        "AUD_USD": {pip: 0.0001}
        // "GBP_JPY": {pip: 0.01}
    };

    console.log(Date());

    Object.keys(CONFIG.lastFX).forEach(function (symbol, i) {
        setTimeout(fetchCandles, 500 * i, symbol, next);
    });
}

function fetchCandles(symbol, next) {
    request({
        "url": CONFIG.api + "/v1/candles",
        "qs": {
            instrument: symbol,
            granularity: "H1",
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

            processData(symbol, candles, next);
        } else {
            console.log("ERROR", body.code, body.message);
        }
    });
}

function processData(symbol, candles, next) {
    var time,
        samples = [];

    candles.forEach(function (candle) {
        var open = candle.openMid,
            high = candle.highMid,
            low = candle.lowMid,
            close = candle.closeMid,
            input = [open, high, low],
            output = close,
            sample = [input, output];

        time = candle.time;
        samples.push(sample);
    });

    runSVM(time, symbol, samples, next);
}

function runSVM(time, symbol, samples, next) {
    var trainSamples = samples.slice(0, 400),
        testSamples = samples.slice(400, 500),
        fit = new svm.NuSVR({
            kernelType: "LINEAR",
            reduce: false,
            c: 1,
            nu: 0.2,
            epsilon: 0.1,
            gamma: 0.3333333,
            kFold: 1
        });

    fit
        .train(trainSamples)
        .spread(function () {
            var n = testSamples.length - 1,
                inputs = testSamples[n][0],
                close = testSamples[n][1],
                forecast = fit.predictSync(inputs);

            next(time, symbol, inputs, close, forecast);
        });
}

function fillOrder(time, symbol, inputs, close, forecast) {
    var units = CONFIG.units,
        pip = CONFIG.lastFX[symbol].pip,
        diff = close - forecast,
        dist = Math.round(Math.abs(diff) / pip),
        side = (diff < 0) ? "buy" : "sell",
        trailingStop = dist * 3,
        order;

    console.log(time, symbol, dist, inputs, close, forecast, side);

    if (dist < 15) {
        return;
    }

    order = {
        symbol: symbol,
        side: side,
        units: units,
        trailingStop: trailingStop
    };

    sendOrder(time, order);
}

function sendOrder(time, order) {
    request.post({
        "url": CONFIG.api + "/v1/accounts/" + CONFIG.accountId + "/orders",
        "form": {
            instrument: order.symbol,
            side: order.side,
            units: order.units,
            trailingStop: order.trailingStop,
            type: "market"
        },
        "headers": {
            "Authorization": "Bearer " + CONFIG.accessToken
        }
    }, function (err, res, body) {
        var trade = JSON.parse(body);

        if (!err && !trade.code) {
            console.log(trade.time, order.symbol, order.side, trade.price);
        } else {
            console.log(time, order.symbol, order.side, trade.message);
        }
    });
}
