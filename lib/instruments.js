//------------------------------------------------------------------------------
//
// Get OANDA instruments info
// http://developer.oanda.com/rest-live/rates/#getInstrumentList
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
    accountId: process.env.OANDA_ACCOUNTID || "1234567890",

    instruments: [
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
    ]
};

request({
    "url": CONFIG.api + "/v1/instruments",
    "qs": {
        accountId: CONFIG.accountId,
        instruments: CONFIG.instruments.join(",")
    },
    "headers": {
        "Authorization": "Bearer " + CONFIG.accessToken
    }
}, function (err, res, body) {
    var instruments;

    body = JSON.parse(body);
    if (!err && !body.code) {
        instruments = body.instruments;
        instruments.forEach(function (i) {
            console.log(i.instrument, i.pip);
        });
    } else {
        console.log("ERROR", body.code, body.message);
    }
});
