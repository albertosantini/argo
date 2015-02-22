//------------------------------------------------------------------------------
//
// Get OANDA events
// http://developer.oanda.com/rest-live/streaming/#eventsStreaming
//
//------------------------------------------------------------------------------
"use strict";

var request = require("request");

var CONFIG = {
    // live       stream-fxtrade.oanda.com      api-fxtrade.oanda.com
    // practice   stream-fxpractice.oanda.com   api-fxpractice.oanda.com
    // sandbox    stream-sandbox.oanda.com      api-sandbox.oanda.com
    stream: process.env.OANDA_STREAM || "https://stream-fxpractice.oanda.com",
    accessToken: process.env.OANDA_TOKEN || "ACCESS_TOKEN"
};

request({
    "url": CONFIG.stream + "/v1/events",
    "headers": {
        "Authorization": "Bearer " + CONFIG.accessToken
    }
}).on("data", function (chunk) {
    var data = chunk.toString().split("\r\n").slice(0, -1);

    data.forEach(function (el) {
        try {
            processData(JSON.parse(el));
        } catch(e) {
            console.log("ERROR", chunk.toString());
        }
    });
});

function processData(event) {
    if (event.heartbeat) {
        return;
    }

    var transaction = event.transaction,
        time = transaction.time,
        instrument = transaction.instrument,
        side = transaction.side,
        units = transaction.units,
        price = transaction.price,
        type = transaction.type,
        pl = transaction.pl,
        accountBalance = transaction.accountBalance;

    console.log(time, instrument, side, units, price,
        type, pl, accountBalance);
}
