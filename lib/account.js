//------------------------------------------------------------------------------
//
// Get OANDA accounts info
// http://developer.oanda.com/rest-live/accounts/
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
    "url": CONFIG.api + "/v1/accounts/" + CONFIG.accountId,
    "headers": {
        "Authorization": "Bearer " + CONFIG.accessToken
    }
}, function (err, res, body) {
    var account;

    body = JSON.parse(body);
    if (!err && !body.code) {
        account = body;
        console.log(
            "id:", account.accountId,
            "balance:", account.balance,
            "p/l:", account.unrealizedPl,
            "margin:", account.marginUsed,
            "trades:", account.openTrades
        );
    } else {
        console.log("ERROR", body.code, body.message);
    }
});
