"use strict";

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
exports.getOrderbook = getOrderbook;
exports.putOrder = putOrder;
exports.closeOrder = closeOrder;
exports.closeTrade = closeTrade;
exports.getPlugins = getPlugins;
exports.engagePlugins = engagePlugins;

var util = require("util"),
    request = require("request"),
    RateLimiter = require("limiter").RateLimiter,
    config = require("./config"),
    stream = require("./stream"),
    plugin = require("../plugin/plugin");

var limiter = new RateLimiter(1, 500); // at most 1 request every 500ms

function throttledRequest() {
    var requestArgs = arguments;

    limiter.removeTokens(1, function () {
        request.apply(null, requestArgs);
    });
}

var credentials = {};

function startStream(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    stream.start(req.body, function (err) {
        if (!err) {
            res.sendStatus(200);
        }
    });
}

function getAccounts(req, response) {
    var url;

    if (!req.body) {
        return response.sendStatus(400);
    }

    url = config.getUrl(req.body.environment, "api") + "/v3/accounts";

    throttledRequest({
        "url": url,
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

    credentials.environment = req.body.environment;
    credentials.token = req.body.token;
    credentials.accountId = req.body.accountId;

    throttledRequest({
        "url": config.getUrl(req.body.environment, "api") + "/v3/accounts/" +
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

    throttledRequest({
        "url": config.getUrl(req.body.environment, "api") + "/v3/accounts/" +
              req.body.accountId + "/instruments",
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        processApi("getInstruments", err, body, response, "instruments");
    });
}

function getCandles(req, response) {
    var environment,
        token;

    if (!req.body) {
        return response.sendStatus(400);
    }

    environment = req.body.environment || credentials.environment;
    token = req.body.token || credentials.token;

    throttledRequest({
        "url": config.getUrl(environment, "api") + "/v3/instruments/" +
            req.body.instrument + "/candles",
        "qs": {
            granularity: req.body.granularity,
            count: req.body.count,
            alignmentTimezone: req.body.alignmentTimezone,
            dailyAlignment: req.body.dailyAlignment
        },
        "headers": {
            "Authorization": "Bearer " + token
        }
    }, function (err, res, body) {
        var candles,
            lines = "Date,Open,High,Low,Close,Volume\n";

        body = JSON.parse(body);
        if (!err && !body.code) {
            candles = body.candles;

            candles.forEach(function (candle) {
                lines += candle.time + "," +
                        candle.mid.o + "," +
                        candle.mid.h + "," +
                        candle.mid.l + "," +
                        candle.mid.c + "," +
                        candle.volume + "\n";
            });

            if (req.body.isPlugin) {
                response.json(candles);
            } else {
                response.send(lines);
            }

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

    throttledRequest({
        "url": config.getUrl(req.body.environment, "api") + "/v3/accounts/" +
            req.body.accountId + "/openTrades",
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

    throttledRequest({
        "url": config.getUrl(req.body.environment, "api") + "/v3/accounts/" +
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

    throttledRequest({
        "url": config.getUrl(req.body.environment, "api") + "/v3/accounts/" +
            req.body.accountId + "/openPositions",
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        processApi("getPositions", err, body, response, "positions");
    });
}

function getTransactions(req, response) {
    var id;

    if (!req.body) {
        return response.sendStatus(400);
    }

    id = req.body.lastTransactionID > 32 ? req.body.lastTransactionID - 32 : 0;
    throttledRequest({
        "url": config.getUrl(req.body.environment, "api") + "/v3/accounts/" +
            req.body.accountId + "/transactions/sinceid?id=" + id,
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

    throttledRequest({
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

function getOrderbook(req, response) {
    var environment,
        token;

    if (!req.body) {
        return response.sendStatus(400);
    }

    environment = req.body.environment || credentials.environment;
    token = req.body.token || credentials.token;

    throttledRequest({
        "url": config.getUrl(environment, "api")
            + "/labs/v1/orderbook_data",
        qs: {
            instrument: req.body.instrument || "EUR_USD",
            period: req.body.period || 3600
        },
        "headers": {
            "Authorization": "Bearer " + token
        }
    }, function (err, res, body) {
        processApi("getOrderbook", err, body, response);
    });
}

function putOrder(req, response) {
    var environment,
        token,
        accountId;

    if (!req.body) {
        return response.sendStatus(400);
    }

    environment = req.body.environment || credentials.environment;
    token = req.body.token || credentials.token;
    accountId = req.body.accountId || credentials.accountId;

    throttledRequest({
        "method": "POST",
        "url": config.getUrl(environment, "api") + "/v3/accounts/" +
            accountId + "/orders",
        "json": true,
        "body": {
            order: {
                instrument: req.body.instrument,
                units: req.body.units,
                side: req.body.side,
                type: req.body.type,
                expiry: req.body.expiry,
                price: req.body.price,
                lowerBound: req.body.lowerBound,
                upperBound: req.body.upperBound,
                stopLossOnFill: req.body.stopLossOnFill,
                takeProfitOnFill: req.body.takeProfitOnFill,
                trailingStopLossOnFill: req.body.trailingStopLossOnFill
            }
        },
        "headers": {
            "Authorization": "Bearer " + token
        }
    }, function (err, res, body) {
        processApi("putOrder", err, body, response);
    });
}

function closeOrder(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    throttledRequest({
        "method": "PUT",
        "url": config.getUrl(req.body.environment, "api") + "/v3/accounts/" +
            req.body.accountId + "/orders/" + req.body.id + "/cancel",
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

    throttledRequest({
        "method": "PUT",
        "url": config.getUrl(req.body.environment, "api") + "/v3/accounts/" +
            req.body.accountId + "/trades/" + req.body.id + "/close",
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        processApi("closeTrade", err, body, response, "orderFillTransaction");
    });
}

function getPlugins(req, response) {
    plugin.getPlugins(function (err, plugins) {
        if (!err) {
            response.json(plugins);
        }
    });
}

function engagePlugins(req, response) {
    if (!req.body) {
        return response.sendStatus(400);
    }

    plugin.engagePlugins(req.body.plugins, req.body.config);

    response.sendStatus(200);
}

function processApi(apiName, err, body, response, property) {
    var obj;

    try {
        if (typeof body === "string") {
            body = JSON.parse(body);
        }
        if (!err && !body.errorCode) {
            if (property) {
                obj = body[property];
            } else {
                obj = body;
            }

            response.json(obj);
        } else {
            processApiError(apiName, err, body.errorCode,
                body.errorMessage, response);
        }
    } catch (e) {
        // Discard "incomplete" json
        console.log(e.name + ": " + e.message);
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
