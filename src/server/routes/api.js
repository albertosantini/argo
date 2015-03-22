"use strict";

var util = require("util"),
    request = require("request"),
    config = require("./config"),
    stream = require("./stream");

exports.startStream = startStream;
exports.getAccounts = getAccounts;
exports.getAccount = getAccount;
exports.getInstruments = getInstruments;
exports.getCandles = getCandles;
exports.getTrades = getTrades;
exports.getOrders = getOrders;
exports.getPositions = getPositions;
exports.getTransactions = getTransactions;
exports.getCalendar = getCalendar;
exports.putOrder = putOrder;
exports.closeOrder = closeOrder;
exports.closeTrade = closeTrade;

function startStream(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    stream.start(req.body, function (err, instruments) {
        if (!err) {
            util.log("Argo streaming prices and events on ws://localhost:" +
                config.port + config.streamUrl);

            res.json(instruments);
        }
    });
}

function getAccounts(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    request({
        "url": config.getUrl(req.body.environment, "api") + "/v1/accounts",
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        processApi("getAccounts", err, body, response, "accounts");
    });
}

function getAccount(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    request({
        "url": config.getUrl(req.body.environment, "api") + "/v1/accounts/" +
            req.body.accountId,
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        processApi("getAccount", err, body, response);
    });
}

function getInstruments(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    request({
        "url": config.getUrl(req.body.environment, "api") + "/v1/instruments",
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        processApi("getInstruments", err, body, response, "instruments");
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

            response.send(lines);

        } else {
            processApiError("getCandles",
                err, body.code, body.message, response);
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
        processApi("getTrades", err, body, response, "trades");
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
        processApi("getOrders", err, body, response, "orders");
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
        processApi("getPositions", err, body, response, "positions");
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
        processApi("getTransactions", err, body, response, "transactions");
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
        processApi("getCalendar", err, body, response);
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
        processApi("putOrder", err, body, response);
    });
}

function closeOrder(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    request({
        "method": "DELETE",
        "url": config.getUrl(req.body.environment, "api") + "/v1/accounts/" +
            req.body.accountId + "/orders/" + req.body.id,
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        processApi("closeOrder", err, body, response);
    });
}

function closeTrade(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    request({
        "method": "DELETE",
        "url": config.getUrl(req.body.environment, "api") + "/v1/accounts/" +
            req.body.accountId + "/trades/" + req.body.id,
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        processApi("closeTrade", err, body, response);
    });
}

function processApi(apiName, err, body, response, property) {
    var obj;

    body = JSON.parse(body);
    if (!err && !body.code) {
        if (property) {
            obj = body[property];
        } else {
            obj = body;
        }

        response.json(obj);
    } else {
        processApiError(apiName, err, body.code, body.message, response);
    }
}

function processApiError(apiName, err, code, message, res) {
    if (err) {
        util.log("ERROR", apiName, err);
        res.json({
            code: "",
            message: err
        });
    } else {
        util.log("ERROR", apiName, code, message);
        res.json({
            code: code,
            message: message
        });
    }
}
