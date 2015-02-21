"use strict";

var express = require("express"),
    config = require("./config"),
    stream = require("./stream");

var router = express.Router();

exports.apis = router;
exports.config = config;
exports.stream = stream;

router.post("/startstream", startStream);

function startStream(req) {
    var options = req;

    stream.start(options);
}
