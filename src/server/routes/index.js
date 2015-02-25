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
    request({
        "url": config.getUrl(req.body.environment, "api") + "/v1/candles",
        "qs": {
            instrument: req.body.instrument,
            granularity: req.body.granularity,
            candleFormat: req.body.candleFormat,
            alignmentTimezone: req.body.alignmentTimezone,
            dailyAlignment: req.body.dailyAlignment
        },
        "headers": {
            "Authorization": "Bearer " + req.body.token
        }
    }, function (err, res, body) {
        var candles,
            lines = "";

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
