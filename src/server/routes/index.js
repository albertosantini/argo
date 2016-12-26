"use strict";

const express = require("express"),
    bodyParser = require("body-parser"),
    config = require("./config"),
    stream = require("./stream"),
    api = require("./api");

const router = express.Router(), // eslint-disable-line new-cap
    jsonParser = bodyParser.json();

exports.config = config;
exports.apis = router;
exports.stream = stream;

router.post("/startstream", jsonParser, api.startStream);
router.post("/accounts", jsonParser, api.getAccounts);
router.post("/account", jsonParser, api.getAccount);
router.post("/instruments", jsonParser, api.getInstruments);
router.post("/candles", jsonParser, api.getCandles);
router.post("/trades", jsonParser, api.getTrades);
router.post("/orders", jsonParser, api.getOrders);
router.post("/positions", jsonParser, api.getPositions);
router.post("/transactions", jsonParser, api.getTransactions);
router.post("/calendar", jsonParser, api.getCalendar);
router.post("/orderbook", jsonParser, api.getOrderbook);
router.post("/order", jsonParser, api.putOrder);
router.post("/closeorder", jsonParser, api.closeOrder);
router.post("/closetrade", jsonParser, api.closeTrade);
router.post("/plugins", jsonParser, api.getPlugins);
router.post("/engageplugins", jsonParser, api.engagePlugins);
