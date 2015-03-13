"use strict";

var express = require("express"),
    bodyParser = require("body-parser"),
    config = require("./config"),
    stream = require("./stream"),
    api = require("./api");

var router = express.Router(),
    jsonParser = bodyParser.json();

exports.config = config;
exports.apis = router;
exports.stream = stream;

router.post("/startstream", jsonParser, api.startStream);
router.post("/candles", jsonParser, api.getCandles);
router.post("/trades", jsonParser, api.getTrades);
router.post("/orders", jsonParser, api.getOrders);
router.post("/positions", jsonParser, api.getPositions);
router.post("/transactions", jsonParser, api.getTransactions);
router.post("/calendar", jsonParser, api.getCalendar);
router.post("/order", jsonParser, api.putOrder);
router.post("/closeorder", jsonParser, api.closeOrder);
router.post("/closetrade", jsonParser, api.closeTrade);
