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

const util = require("util"),
    request = require("request"),
    RateLimiter = require("limiter").RateLimiter,
    config = require("./config"),
    stream = require("./stream"),
    plugin = require("../plugin/plugin");

const limiter = new RateLimiter(1, 500); // at most 1 request every 500ms

function throttledRequest() {
    const requestArgs = arguments;

    limiter.removeTokens(1, () => {
        request.apply(null, requestArgs);
    });
}

const credentials = {};

function startStream(req, res) {
    if (!req.body) {
        res.sendStatus(400);
    } else {
        stream.start(req.body, err => {
            if (!err) {
                res.sendStatus(200);
            }
        });
    }
}

function getAccounts(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        const api = config.getUrl(req.body.environment, "api");
        const url = `${api}/v3/accounts`;

        throttledRequest({
            url,
            headers: {
                Authorization: `Bearer ${req.body.token}`
            }
        }, (err, res, body) => {
            if (res.statusCode !== 200) {
                processApiError("getAccounts", null,
                    res.statusCode, res.statusMessage, response);
            } else {
                processApi("getAccounts", err, body, response, "accounts");
            }
        });
    }
}

function getAccount(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        credentials.environment = req.body.environment;
        credentials.token = req.body.token;
        credentials.accountId = req.body.accountId;

        const api = config.getUrl(req.body.environment, "api");
        const url = `${api}/v3/accounts/${req.body.accountId}`;

        throttledRequest({
            url,
            headers: {
                Authorization: `Bearer ${req.body.token}`
            }
        }, (err, res, body) => {
            processApi("getAccount", err, body, response);
        });
    }
}

function getInstruments(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        const api = config.getUrl(req.body.environment, "api");
        const url = `${api}/v3/accounts/${req.body.accountId}/instruments`;

        throttledRequest({
            url,
            headers: {
                Authorization: `Bearer ${req.body.token}`
            }
        }, (err, res, body) => {
            processApi("getInstruments", err, body, response, "instruments");
        });
    }
}

function getCandles(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        const environment = req.body.environment || credentials.environment;
        const token = req.body.token || credentials.token;
        const api = config.getUrl(environment, "api");
        const url = `${api}/v3/instruments/${req.body.instrument}/candles`;

        throttledRequest({
            url,
            qs: {
                granularity: req.body.granularity,
                count: req.body.count,
                alignmentTimezone: req.body.alignmentTimezone,
                dailyAlignment: req.body.dailyAlignment
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }, (err, res, body) => {
            let lines = "Date,Open,High,Low,Close,Volume\n";

            body = JSON.parse(body);
            if (!err && !body.code) {
                const candles = body.candles;

                candles.forEach(candle => {
                    lines += `${candle.time},` +
                        `${candle.mid.o},` +
                        `${candle.mid.h},` +
                        `${candle.mid.l},` +
                        `${candle.mid.c},` +
                        `${candle.volume}\n`;
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
}

function getTrades(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        const api = config.getUrl(req.body.environment, "api");
        const url = `${api}/v3/accounts/${req.body.accountId}/openTrades`;

        throttledRequest({
            url,
            headers: {
                Authorization: `Bearer ${req.body.token}`
            }
        }, (err, res, body) => {
            processApi("getTrades", err, body, response, "trades");
        });
    }
}

function getOrders(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        const api = config.getUrl(req.body.environment, "api");
        const url = `${api}/v3/accounts/${req.body.accountId}/orders`;

        throttledRequest({
            url,
            headers: {
                Authorization: `Bearer ${req.body.token}`
            }
        }, (err, res, body) => {
            processApi("getOrders", err, body, response, "orders");
        });
    }
}

function getPositions(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        const api = config.getUrl(req.body.environment, "api");
        const url = `${api}/v3/accounts/${req.body.accountId}/openPositions`;

        throttledRequest({
            url,
            headers: {
                Authorization: `Bearer ${req.body.token}`
            }
        }, (err, res, body) => {
            processApi("getPositions", err, body, response, "positions");
        });
    }
}

function getTransactions(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        const lastTransactionID = req.body.lastTransactionID;
        const id = lastTransactionID > 32 ? lastTransactionID - 32 : 0;
        const api = config.getUrl(req.body.environment, "api");
        const url = `${api}/v3/accounts/${req.body.accountId}/transactions` +
            `/sinceid?id=${id}`;

        throttledRequest({
            url,
            headers: {
                Authorization: `Bearer ${req.body.token}`
            }
        }, (err, res, body) => {
            processApi("getTransactions", err, body, response, "transactions");
        });
    }
}

function getCalendar(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        const api = config.getUrl(req.body.environment, "api");
        const url = `${api}/labs/v1/calendar`;

        throttledRequest({
            url,
            qs: {
                instrument: req.body.instrument || "EUR_USD",
                period: req.body.period || 604800
            },
            headers: {
                Authorization: `Bearer ${req.body.token}`
            }
        }, (err, res, body) => {
            processApi("getCalendar", err, body, response);
        });
    }
}

function getOrderbook(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        const environment = req.body.environment || credentials.environment;
        const token = req.body.token || credentials.token;
        const api = config.getUrl(environment, "api");
        const url = `${api}/labs/v1/orderbook_data`;

        throttledRequest({
            url,
            qs: {
                instrument: req.body.instrument || "EUR_USD",
                period: req.body.period || 3600
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }, (err, res, body) => {
            processApi("getOrderbook", err, body, response);
        });
    }
}

function putOrder(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        const environment = req.body.environment || credentials.environment;
        const token = req.body.token || credentials.token;
        const accountId = req.body.accountId || credentials.accountId;
        const api = config.getUrl(environment, "api");
        const url = `${api}/v3/accounts/${accountId}/orders`;

        throttledRequest({
            method: "POST",
            url,
            json: true,
            body: {
                order: {
                    instrument: req.body.instrument,
                    units: req.body.units,
                    side: req.body.side,
                    type: req.body.type,
                    gtdTime: req.body.gtdTime,
                    price: req.body.price,
                    priceBound: req.body.priceBound,
                    stopLossOnFill: req.body.stopLossOnFill,
                    takeProfitOnFill: req.body.takeProfitOnFill,
                    trailingStopLossOnFill: req.body.trailingStopLossOnFill
                }
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }, (err, res, body) => {
            processApi("putOrder", err, body, response);
        });
    }
}

function closeOrder(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        const api = config.getUrl(req.body.environment, "api");
        const url = `${api}/v3/accounts/${req.body.accountId}/orders` +
            `/${req.body.id}/cancel`;

        throttledRequest({
            method: "PUT",
            url,
            headers: {
                Authorization: `Bearer ${req.body.token}`
            }
        }, (err, res, body) => {
            processApi("closeOrder", err, body, response);
        });
    }
}

function closeTrade(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        const api = config.getUrl(req.body.environment, "api");
        const url = `${api}/v3/accounts/${req.body.accountId}/trades` +
            `/${req.body.id}/close`;

        throttledRequest({
            method: "PUT",
            url,
            headers: {
                Authorization: `Bearer ${req.body.token}`
            }
        }, (err, res, body) => {
            processApi("closeTrade", err, body, response, "orderFillTransaction");
        });
    }
}

function getPlugins(req, response) {
    plugin.getPlugins((err, plugins) => {
        if (!err) {
            response.json(plugins);
        }
    });
}

function engagePlugins(req, response) {
    if (!req.body) {
        response.sendStatus(400);
    } else {
        plugin.engagePlugins(req.body.plugins, req.body.config);

        response.sendStatus(200);
    }
}

function processApi(apiName, err, body, response, property) {
    let obj;

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
        util.log(`${e.name}: ${e.message}`);
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
            code,
            message
        });
    }
}
