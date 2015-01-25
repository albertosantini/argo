//------------------------------------------------------------------------------
//
// Get OANDA spreads history
// http://developer.oanda.com/rest-live/forex-labs/#spreads
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
        "USD_CHF": {pip: 0.0001},
        "EUR_JPY": {pip: 0.01},
        "EUR_CHF": {pip: 0.0001},
        "USD_CAD": {pip: 0.0001},
        "AUD_USD": {pip: 0.0001},
        "GBP_JPY": {pip: 0.01}
    }
};

Object.keys(CONFIG.lastFX).forEach(function (symbol) {
    request({
        "url": CONFIG.api + "/labs/v1/spreads",
        "qs": {
            instrument: symbol,
            period: 3600
        },
        "headers": {
            "Authorization": "Bearer " + CONFIG.accessToken
        }
    }, function (err, res, body) {
        var spreads;

        body = JSON.parse(body);
        if (!err && !body.code) {
            spreads = body.avg;

            processData(symbol, spreads);
        } else {
            console.log("ERROR", body.code, body.message);
        }
    });
});

function processData(symbol, spreads) {
    var spread = spreads.length && spreads[spreads.length - 1][1];

    console.log(symbol, spread);
}
