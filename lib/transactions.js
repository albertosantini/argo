//------------------------------------------------------------------------------
//
// Get OANDA transactions history
// http://developer.oanda.com/rest-live/transaction-history/
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
    "url": CONFIG.api + "/v1/accounts/" + CONFIG.accountId + "/transactions",
    "headers": {
        "Authorization": "Bearer " + CONFIG.accessToken
    }
}, function (err, res, body) {
    var transactions;

    body = JSON.parse(body);
    if (!err && !body.code) {
        transactions = body.transactions;
        transactions.forEach(function (t) {
            console.log(t.time, t.instrument, t.side, t.accountBalance, t.type);
        });
    } else {
        console.log("ERROR", body.code, body.message);
    }
});
