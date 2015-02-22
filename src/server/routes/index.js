"use strict";

var express = require("express"),
    bodyParser = require("body-parser"),
    config = require("./config"),
    stream = require("./stream");

var router = express.Router(),
    jsonParser = bodyParser.json();

exports.apis = router;
exports.config = config;
exports.stream = stream;

router.post("/startstream", jsonParser, startStream);

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
