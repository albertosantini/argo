/*eslint-disable */
//------------------------------------------------------------------------------
//
// High Frequency Finance: Using Scaling Laws to Build Trading Models
// https://www.olseninvest.com/customer/pdf/c20.pdf
//
// R&D Strategy Document
// http://arxiv.org/abs/1405.6027
//
// A Directional-Change Event Approach for Studying Financial Time Series
// http://www.economics-ejournal.org/economics/journalarticles/2012-36
//
// Patterns in high-frequency FX data: Discovery of 12 empirical scaling laws
// http://arxiv.org/abs/0809.1040v2
//
// Patterns in FTSE 100 Index: Reexamine directional change scaling laws
// http://www.bracil.net/Guests/Yu.Zhang/Yu%20Zhang-Dissertation.pdf
//
// The hidden treasure of high frequency dynamics: from intrinsic time to scaling laws
// https://fp7.portals.mbs.ac.uk/Portals/59/docs/OLSEN%20conferencemanchester091004.pdf
//
//------------------------------------------------------------------------------
/*eslint-enable */
"use strict";

var request = require("request");

var CONFIG = {
// live     https://stream-fxtrade.oanda.com    https://api-fxtrade.oanda.com
// practice https://stream-fxpractice.oanda.com https://api-fxpractice.oanda.com
// sandbox  http://stream-sandbox.oanda.com     http://api-sandbox.oanda.com
    stream: process.env.OANDA_STREAM || "https://stream-fxpractice.oanda.com",
    api: process.env.OANDA_API || "https://api-fxpractice.oanda.com",
    accessToken: process.env.OANDA_TOKEN || "ACCESS_TOKEN",
    accountId: process.env.OANDA_ACCOUNTID || "1234567890",
    sessionId: process.env.OANDA_SESSIONID || "1",

    delta: process.env.OANDA_DELTA || 0.0004,
    units: process.env.OANDA_UNITS || 10,
    trailingStop: 10,

    lastFX: {
        "EUR_USD": {allow: "sell", pip: 0.0001},
        "USD_JPY": {allow: "none", pip: 0.01},
        "GBP_USD": {allow: "sell", pip: 0.0001},
        "EUR_GBP": {allow: "sell", pip: 0.0001},
        // "USD_CHF": {allow: "buy", pip: 0.0001},
        "EUR_JPY": {allow: "none", pip: 0.01},
        // "EUR_CHF": {allow: "sell", pip: 0.0001},
        "USD_CAD": {allow: "buy", pip: 0.0001},
        "AUD_USD": {allow: "sell", pip: 0.0001},
        "GBP_JPY": {allow: "none", pip: 0.01}
    }
};

request({
    "url": CONFIG.stream + "/v1/prices",
    "qs": {
        accountId: CONFIG.accountId,
        sessionId: CONFIG.sessionId,
        instruments: Object.keys(CONFIG.lastFX).join(",")
    },
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

function processData(fx) {
    if (fx.heartbeat) {
        return;
    }

    var symbol = fx.tick.instrument,
        o = CONFIG.lastFX[symbol],
        mid = (fx.tick.bid + fx.tick.ask) / 2,
        dc;

    o.time = fx.tick.time;
    o.mid = mid;

    if (!o.event) {
        o.event = "UPTURN";
        o.pl = mid;
        o.ph = mid;
        o.status = "NA";
    } else {
        dc = directionalChange(o.mid, o.event, o.pl, o.ph, CONFIG.delta);

        o.event = dc.event;
        o.pl = dc.pl;
        o.ph = dc.ph;
        o.status = dc.status;
    }

    createOrder(o.time, symbol, o.status);
}

function createOrder(time, symbol, status) {
    var allow = CONFIG.lastFX[symbol].allow,
        side;

    if (status === "UP*") {
        side = "sell";
    }
    if (status === "DOWN*") {
        side = "buy";
    }

    if (!side || side !== allow) {
        return;
    }

    request.post({
        "url": CONFIG.api + "/v1/accounts/" + CONFIG.accountId + "/orders",
        "form": {
            instrument: symbol,
            units: CONFIG.units,
            side: side,
            trailingStop: CONFIG.trailingStop,
            type: "market"
        },
        "headers": {
            "Authorization": "Bearer " + CONFIG.accessToken
        }
    }, function (err, res, body) {
        var trade = JSON.parse(body);

        if (!err && !trade.code) {
            console.log(trade.time, symbol, side);
        } else {
            console.log(time, symbol, side, trade.message);
        }
    });
}

function directionalChange(pt, event, pl, ph, l) {
    var status = "NA";

    if (event === "UPTURN") {

        if (pt <= ph * (1 - l)) {
            pl = pt;
            // End time for a Downturn event
            // Start time for a Downward Overshoot Event
            event = "DOWNTURN";
            status = "DOWN*";
        } else {
            if (ph < pt) {
                ph = pt;
                // Start time for a Downturn event
                // End time for an Upward Overshoot Event
                status = "DOWN";
            }
        }

    } else {

        if (pt >= pl * (1 + l)) {
            ph = pt;
            // End time for a Upturn event
            // Start time for an Upward Overshoot Event
            event = "UPTURN";
            status = "UP*";
        } else {
            if (pl > pt) {
                pl = pt;
                // Start time for a Upturn event
                // End time for an Downward Overshoot Event
                status = "UP";
            }
        }
    }

    return {
        "event": event,
        "pl": pl,
        "ph": ph,
        "status": status
    };
}
