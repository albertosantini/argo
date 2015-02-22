//------------------------------------------------------------------------------
//
// Get OANDA positions info
// http://developer.oanda.com/rest-live/positions/
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
    accountId: process.env.OANDA_ACCOUNTID || "1234567890"
};

request({
    "url": CONFIG.api + "/v1/accounts/" + CONFIG.accountId + "/positions",
    "headers": {
        "Authorization": "Bearer " + CONFIG.accessToken
    }
}, function (err, res, body) {
    var positions;

    body = JSON.parse(body);
    if (!err && !body.code) {
        positions = body.positions;
        positions.forEach(function (p) {
            console.log(p.instrument, p.side, p.units, p.avgPrice);
        });
    } else {
        console.log("ERROR", body.code, body.message);
    }
});
