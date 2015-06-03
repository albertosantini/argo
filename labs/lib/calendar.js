//------------------------------------------------------------------------------
//
// Get OANDA calendar
// http://developer.oanda.com/rest-live/forex-labs/#calendar
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
    "url": CONFIG.api + "/labs/v1/calendar",
    "qs": {
        instrument: "EUR_USD",
        period: 2592000
    },
    "headers": {
        "Authorization": "Bearer " + CONFIG.accessToken
    }
}, function (err, res, body) {
    var news;

    body = JSON.parse(body);
    if (!err && !body.code) {
        news = body;
        news.forEach(function (t) {
            console.log(new Date(t.timestamp), t.currency, t.title);
        });
    } else {
        console.log("ERROR", body.code, body.message);
    }
});
