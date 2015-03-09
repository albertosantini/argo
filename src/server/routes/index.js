"use strict";

var express = require("express"),
    request = require("request"),
    bodyParser = require("body-parser"),
    config = require("./config"),
    stream = require("./stream");

var router = express.Router(),
    jsonParser = bodyParser.json();

exports.apis = router;
exports.config = config;
exports.stream = stream;

router.post("/startstream", jsonParser, startStream);
router.post("/candles", jsonParser, getCandles);
router.post("/trades", jsonParser, getTrades);
router.post("/orders", jsonParser, getOrders);
router.post("/positions", jsonParser, getPositions);
router.post("/transactions", jsonParser, getTransactions);
router.post("/calendar", jsonParser, getCalendar);
router.post("/order", jsonParser, putOrder);

function startStream(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    stream.start(req.body, function (err, instruments) {
        if (!err) {
            console.log("Argo streaming prices and events on ws://localhost:" +
                config.port + config.streamUrl);

            return res.json(instruments);
        }
    });

}

function getCandles(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    request({
        "url": config.getUrl(req.body.environment, "api") + "/v1/candles",
        "qs": {
            instrument: req.body.instrument,
            granularity: req.body.granularity,
            count: req.body.count,
            candleFormat: req.body.candleFormat,
            alignmentTimezone: req.body.alignmentTimezone,
            dailyAlignment: req.body.dailyAlignment
        },
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        var candles,
            lines = "Date,Open,High,Low,Close,Volume\n";

        body = JSON.parse(body);
        if (!err && !body.code) {
            candles = body.candles;

            candles.forEach(function (candle) {
                lines += candle.time + "," +
                        candle.openMid + "," +
                        candle.highMid + "," +
                        candle.lowMid + "," +
                        candle.closeMid + "," +
                        candle.volume + "\n";
            });

            return response.send(lines);

        } else {
            console.log("ERROR", body.code, body.message);
        }
    });
}

function getTrades(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    request({
        "url": config.getUrl(req.body.environment, "api") + "/v1/accounts/" +
            req.body.accountId + "/trades",
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        var trades;

        body = JSON.parse(body);
        if (!err && !body.code) {
            trades = body.trades;

            return response.json(trades);
        } else {
            console.log("ERROR", body.code, body.message);
        }
    });
}

function getOrders(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    request({
        "url": config.getUrl(req.body.environment, "api") + "/v1/accounts/" +
            req.body.accountId + "/orders",
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        var orders;

        body = JSON.parse(body);
        if (!err && !body.code) {
            orders = body.orders;

            return response.json(orders);
        } else {
            console.log("ERROR", body.code, body.message);
        }
    });
}

function getPositions(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    request({
        "url": config.getUrl(req.body.environment, "api") + "/v1/accounts/" +
            req.body.accountId + "/positions",
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        var positions;

        body = JSON.parse(body);
        if (!err && !body.code) {
            positions = body.positions;

            return response.json(positions);
        } else {
            console.log("ERROR", body.code, body.message);
        }
    });
}

function getTransactions(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    request({
        "url": config.getUrl(req.body.environment, "api") + "/v1/accounts/" +
            req.body.accountId + "/transactions",
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        var transactions;

        body = JSON.parse(body);
        if (!err && !body.code) {
            transactions = body.transactions;

            return response.json(transactions);
        } else {
            console.log("ERROR", body.code, body.message);
        }
    });
}

function getCalendar(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    request({
        "url": config.getUrl(req.body.environment, "api") + "/labs/v1/calendar",
        qs: {
            instrument: req.body.instrument || "EUR_USD",
            period: req.body.period || 604800
        },
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        var calendar;

        body = JSON.parse(body);
        if (!err && !body.code) {
            calendar = body;

            return response.json(calendar);
        } else {
            console.log("ERROR", body.code, body.message);
        }
    });
}

function putOrder(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    request({
        "method": "POST",
        "url": config.getUrl(req.body.environment, "api") + "/v1/accounts/" +
            req.body.accountId + "/orders",
        "form": {
            instrument: req.body.instrument,
            units: req.body.units,
            side: req.body.side,
            type: req.body.type,
            expiry: req.body.expiry,
            price: req.body.price,
            lowerBound: req.body.lowerBound,
            upperBound: req.body.upperBound,
            stopLoss: req.body.stopLoss,
            takeProfit: req.body.takeProfit,
            trailingStop: req.body.trailingStop
        },
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        var trade;

        body = JSON.parse(body);
        if (!err && !body.code) {
            trade = body;

            return response.json(trade);
        } else {
            console.log("ERROR", body.code, body.message);
        }
    });
}
