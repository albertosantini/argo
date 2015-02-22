//------------------------------------------------------------------------------
//
// Impulsive/Corrective Wave Retracement (ICWR)
//
//------------------------------------------------------------------------------
"use strict";

var request = require("request");

var CONFIG = {
    // live       stream-fxtrade.oanda.com      api-fxtrade.oanda.com
    // practice   stream-fxpractice.oanda.com   api-fxpractice.oanda.com
    // sandbox    stream-sandbox.oanda.com      api-sandbox.oanda.com
    stream: process.env.OANDA_STREAM || "https://stream-fxpractice.oanda.com",
    api: process.env.OANDA_API || "https://api-fxpractice.oanda.com",
    accessToken: process.env.OANDA_TOKEN || "ACCESS_TOKEN",
    accountId: process.env.OANDA_ACCOUNTID || "1234567890",
    sessionId: process.env.OANDA_SESSIONID || "1",

    delta: process.env.OANDA_DELTA || 40,
    units: process.env.OANDA_UNITS || 10
};

process.on("uncaughtException", function (err) {
    console.log("ERROR", err);
    init(fetchTick);
});

init(fetchTick);

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
        "AUD_USD": {pip: 0.0001},
        "GBP_JPY": {pip: 0.01}
    };

    Object.keys(CONFIG.lastFX).forEach(function (symbol, i) {
        setTimeout(fetchRSI, 500 * i, symbol);
    });

    setTimeout(next, 10000);
}

function fetchRSI(symbol) {
    var period = 14;

    request({
        "url": CONFIG.api + "/v1/candles",
        "qs": {
            instrument: symbol,
            granularity: "D",
            candleFormat: "midpoint",
            count: period,
            alignmentTimezone: "America/New_York",
            dailyAlignment: "0"
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
            candles.forEach(function (c) {
                closes.push(c.closeMid);
            });

            CONFIG.lastFX[symbol].rsi = calcRSI(closes);
        } else {
            console.log("ERROR", body.code, body.message);
        }
    });
}

function calcRSI(closes) {
    var n = closes.length,
        gain = 0,
        loss = 0,
        avgGain,
        avgLoss,
        rs;

    closes.forEach(function (close, i) {
        var change;

        if (i === 0) {
            return;
        }

        change = closes[i] - closes[i - 1];
        if (change < 0) {
            loss += change;
        }
        if (change > 0) {
            gain += change;
        }
    });


    avgLoss = -loss / n;
    avgGain = gain / n;
    rs = avgGain / avgLoss;

    return 100 - (100 / (1 + rs));
}

function fetchTick() {
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
    }).on("data", processTick);
}

function processTick(chunk) {
    var data = chunk.toString().split("\r\n").slice(0, -1);

    data.forEach(function (el) {
        try {
            processData(JSON.parse(el));
        } catch(e) {
            console.log("ERROR", chunk.toString());
        }
    });
}

function processData(fx) {
    if (fx.heartbeat) {
        return;
    }

    var symbol = fx.tick.instrument,
        o = CONFIG.lastFX[symbol],
        mid = (fx.tick.bid + fx.tick.ask) / 2,
        res;

    o.time = fx.tick.time;
    o.mid = mid;

    res = icwr({
        pt: o.mid,
        event: o.event,
        pl: o.pl,
        ph: o.ph,
        l250: o.l250,
        l750: o.l750,
        pip: o.pip,
        delta: CONFIG.delta
    });

    o.event = res.event;
    o.pl = res.pl;
    o.ph = res.ph;
    o.l250 = res.l250;
    o.l750 = res.l750;

    fillOrder(o.time, symbol, o.event);
}

function fillOrder(time, symbol, side) {
    var rsi = CONFIG.lastFX[symbol].rsi,
        units = CONFIG.units,
        trailingStop = CONFIG.delta,
        order = {
            symbol: symbol,
            side: side,
            units: units,
            trailingStop: trailingStop
        };

    if ((side !== "sell" && side !== "buy") ||
        (rsi > 40 && rsi < 60) ||
        (side === "sell" && rsi > 50) ||
        (side === "buy" && rsi < 50)) {
        return;
    }

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

function icwr(params) {
    var pt = params.pt,
        event = params.event || "INIT",
        pl = params.pl || pt,
        ph = params.ph || pt,
        l250 = params.l250 || pt,
        l400 = pt,
        l750 = params.l750 || pt,
        delta = params.delta,
        pips = (ph - pl) / params.pip;

    if (event === "sell" || event === "buy") {
        event = "INIT";
    }

    if (event === "INIT") {
        if (pt > ph) {
            ph = pt;
        }
        if (pt < pl) {
            pl = pt;
        }

        if (pips >= delta && pt <= pl) {
            event = "DOWN";
        }
        if (pips >= delta && pt >= ph) {
            event = "UP";
        }
    }

    if (event === "DOWN") {
        if (pt <= pl) {
            pl = pt;
        }

        if (pt > pl) {
            l250 = pl + (ph - pl) * 0.250;
            l400 = pl + (ph - pl) * 0.400;
            l750 = pl + (ph - pl) * 0.750;
            if (pt > l400) {
                event = "CHANNELDOWN";
                ph = pt;
            }
            if (pt > l750) {
                event = "INIT";
                ph = pt;
            }
        }
    }

    if (event === "UP") {
        if (pt >= ph) {
            ph = pt;
        }

        if (pt < ph) {
            l250 = ph - (ph - pl) * 0.250;
            l400 = ph - (ph - pl) * 0.400;
            l750 = ph - (ph - pl) * 0.750;
            if (pt < l400) {
                event = "CHANNELUP";
                pl = pt;
            }
            if (pt < l750) {
                event = "INIT";
                pl = pt;
            }
        }
    }

    if (event === "CHANNELDOWN") {
        if (pt > ph) {
            ph = pt;
        }

        if (pt < l250) {
            event = "sell";
        }
        if (pt > l750) {
            event = "INIT";
            ph = pt;
        }
    }

    if (event === "CHANNELUP") {
        if (pt < pl) {
            pl = pt;
        }

        if (pt > l250) {
            event = "buy";
        }
        if (pt < l750) {
            event = "INIT";
            pl = pt;
        }
    }

    return {
        event: event,
        pl: pl,
        ph: ph,
        l250: l250,
        l750: l750
    };
}
